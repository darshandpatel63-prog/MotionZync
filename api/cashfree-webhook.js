import {
  fetchCashfreeOrder,
  fetchCashfreeOrderPayments,
  getCashfreeConfig,
  getCashfreeWebhookContext,
  ULTRA_PREMIUM_PRICE_INR,
  verifyCashfreeWebhookSignature,
} from './_lib/cashfree.js'
import { recordVerifiedPayment } from './_lib/billing.js'

export const config = {
  api: { bodyParser: false },
}

const str = value => typeof value === 'string' ? value.trim() : ''
const num = value => Number.isFinite(Number(value)) ? Number(value) : 0

async function getRawBody(req) {
  if (typeof req.rawBody === 'string') return req.rawBody
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8')
  if (typeof req.body === 'string') return req.body

  if (req.readable && req[Symbol.asyncIterator]) {
    const chunks = []
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    return Buffer.concat(chunks).toString('utf8')
  }

  throw new Error('Cashfree webhook raw body is unavailable')
}

function getPaymentId(payment = {}) {
  return str(payment.cf_payment_id || payment.payment_id || payment.paymentId)
}

function getPaymentStatus(payment = {}) {
  return str(payment.payment_status || payment.status).toUpperCase()
}

function getPaymentAmount(payment = {}) {
  return num(payment.payment_amount || payment.amount)
}

function getPaymentCurrency(payment = {}) {
  return str(payment.payment_currency || payment.currency || 'INR').toUpperCase()
}

function getPaymentTime(payment = {}) {
  return payment.payment_time || payment.paymentTime || new Date().toISOString()
}

function getOrderAmount(order = {}) {
  return num(order.order_amount || order.amount)
}

function getOrderCurrency(order = {}) {
  return str(order.order_currency || order.currency || 'INR').toUpperCase()
}

function isPaymentWebhook(payload = {}) {
  return str(payload.type).toUpperCase().includes('PAYMENT')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const signature = req.headers['x-webhook-signature'] || req.headers['X-Webhook-Signature']
  const timestamp = req.headers['x-webhook-timestamp'] || req.headers['X-Webhook-Timestamp']

  if (!signature || !timestamp) {
    return res.status(400).json({ error: 'Missing Cashfree webhook signature headers' })
  }

  let rawBody
  try {
    rawBody = await getRawBody(req)
  } catch (error) {
    console.error('[cashfree-webhook] raw body unavailable')
    return res.status(400).json({ error: error.message || 'Invalid webhook body' })
  }

  let configValues
  try {
    configValues = getCashfreeConfig()
  } catch (error) {
    return res.status(error.status || 503).json({ error: error.message || 'Cashfree server configuration is unavailable' })
  }

  const validSignature = verifyCashfreeWebhookSignature({
    signature,
    timestamp,
    rawBody,
    secret: configValues.clientSecret,
  })

  if (!validSignature) {
    return res.status(401).json({ error: 'Invalid Cashfree webhook signature' })
  }

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ error: 'Cashfree webhook body must be valid JSON' })
  }

  if (!isPaymentWebhook(payload)) {
    return res.status(200).json({ ok: true, processed: false, reason: 'event-not-payment-webhook' })
  }

  let context
  try {
    context = getCashfreeWebhookContext(payload)
    if (!context.orderId || !context.paymentId) {
      return res.status(400).json({ error: 'Cashfree webhook is missing order_id or payment id' })
    }

    const [order, paymentsResponse] = await Promise.all([
      fetchCashfreeOrder(context.orderId),
      fetchCashfreeOrderPayments(context.orderId),
    ])

    const payments = Array.isArray(paymentsResponse) ? paymentsResponse :
      Array.isArray(paymentsResponse?.data) ? paymentsResponse.data :
        Array.isArray(paymentsResponse?.payments) ? paymentsResponse.payments : []

    const verifiedPayment = payments.find(payment => getPaymentId(payment) === context.paymentId)
    if (!verifiedPayment) {
      return res.status(502).json({ error: 'Cashfree payment could not be reconciled server-side' })
    }

    const orderAmount = getOrderAmount(order)
    const orderCurrency = getOrderCurrency(order)
    const paymentAmount = getPaymentAmount(verifiedPayment)
    const paymentCurrency = getPaymentCurrency(verifiedPayment)

    if (orderAmount <= 0 || paymentAmount <= 0 || orderCurrency !== paymentCurrency || orderAmount !== paymentAmount) {
      return res.status(422).json({ error: 'Cashfree order/payment amount reconciliation failed' })
    }

    const refreshedContext = getCashfreeWebhookContext(payload, order)
    if (!refreshedContext.customerId || !refreshedContext.email) {
      return res.status(500).json({ error: 'Server-created Cashfree order is missing MotionZync customer identity' })
    }
    if (!refreshedContext.plan) {
      return res.status(500).json({ error: 'Server-created Cashfree order is missing MotionZync plan metadata' })
    }

    // The paid product contract is fixed to Ultra Premium+ at the shared INR price.
    if (refreshedContext.plan !== 'ultra-premium' || orderCurrency !== 'INR' || orderAmount !== ULTRA_PREMIUM_PRICE_INR) {
      return res.status(422).json({ error: 'Cashfree order does not match the server-authorized Ultra Premium+ configured INR price' })
    }

    const status = getPaymentStatus(verifiedPayment)
    const result = await recordVerifiedPayment({
      userId: refreshedContext.customerId,
      email: refreshedContext.email,
      provider: 'cashfree',
      plan: refreshedContext.plan,
      amount: paymentAmount,
      currency: paymentCurrency,
      orderId: context.orderId,
      transactionId: context.paymentId,
      status: status.toLowerCase(),
      purchasedAt: getPaymentTime(verifiedPayment),
      verifiedAt: new Date().toISOString(),
      refundStatus: 'none',
    })

    return res.status(200).json({
      ok: true,
      processed: true,
      status,
      paymentRecordId: result.id,
    })
  } catch (error) {
    console.error('[cashfree-webhook]', error.message || 'processing failed')
    return res.status(error.status || 500).json({ error: error.message || 'Cashfree webhook processing failed' })
  }
}
