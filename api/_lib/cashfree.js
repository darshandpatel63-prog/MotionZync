import crypto from 'node:crypto'

export const CASHFREE_API_VERSION = '2025-01-01'
const CASHFREE_BASE_URLS = Object.freeze({
  sandbox: 'https://sandbox.cashfree.com/pg',
  production: 'https://api.cashfree.com/pg',
})

const str = value => typeof value === 'string' ? value.trim() : ''

export function getCashfreeConfig() {
  const environment = str(process.env.CASHFREE_ENV || 'sandbox').toLowerCase()
  const clientId = str(process.env.CASHFREE_CLIENT_ID)
  const clientSecret = str(process.env.CASHFREE_CLIENT_SECRET)

  if (!CASHFREE_BASE_URLS[environment]) {
    throw new Error('CASHFREE_ENV must be sandbox or production')
  }
  if (!clientId || !clientSecret) {
    const error = new Error('Server is missing CASHFREE_CLIENT_ID / CASHFREE_CLIENT_SECRET')
    error.status = 503
    throw error
  }

  return Object.freeze({
    environment,
    clientId,
    clientSecret,
    baseUrl: CASHFREE_BASE_URLS[environment],
  })
}

export function verifyCashfreeWebhookSignature({
  signature,
  timestamp,
  rawBody,
  secret,
  maxSkewMs = 10 * 60 * 1000,
} = {}) {
  const cleanSignature = str(signature)
  const cleanTimestamp = str(timestamp)
  const body = typeof rawBody === 'string' ? rawBody : ''

  if (!cleanSignature || !cleanTimestamp || body === '' || !str(secret)) return false

  const timestampNumber = Number(cleanTimestamp)
  if (!Number.isFinite(timestampNumber)) return false

  const timestampMs = timestampNumber > 1e12 ? timestampNumber : timestampNumber * 1000
  if (Math.abs(Date.now() - timestampMs) > maxSkewMs) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(cleanTimestamp + body, 'utf8')
    .digest('base64')

  const expectedBuffer = Buffer.from(expected, 'utf8')
  const providedBuffer = Buffer.from(cleanSignature, 'utf8')
  if (expectedBuffer.length !== providedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

async function cashfreeRequest(path) {
  const config = getCashfreeConfig()
  const response = await fetch(config.baseUrl + path, {
    method: 'GET',
    headers: {
      'x-client-id': config.clientId,
      'x-client-secret': config.clientSecret,
      accept: 'application/json',
      'x-api-version': CASHFREE_API_VERSION,
    },
  })

  if (!response.ok) {
    const error = new Error('Cashfree API request failed with HTTP ' + response.status)
    error.status = 502
    throw error
  }

  return response.json()
}

export function fetchCashfreeOrder(orderId) {
  const cleanOrderId = str(orderId)
  if (!cleanOrderId) throw new Error('Cashfree order ID is required')
  return cashfreeRequest('/orders/' + encodeURIComponent(cleanOrderId))
}

export function fetchCashfreeOrderPayments(orderId) {
  const cleanOrderId = str(orderId)
  if (!cleanOrderId) throw new Error('Cashfree order ID is required')
  return cashfreeRequest('/orders/' + encodeURIComponent(cleanOrderId) + '/payments')
}

export function normalizeCashfreePlan(value) {
  const plan = str(value).toLowerCase()
  if (plan === 'premium' || plan === 'premium-permanent') return 'premium'
  if (plan === 'ultra-premium' || plan === 'ultra-premium-plus') return 'ultra-premium'
  return ''
}

export function getCashfreeWebhookContext(payload = {}, order = {}) {
  const orderData = payload?.data?.order || {}
  const paymentData = payload?.data?.payment || {}

  const orderId = str(
    order?.order_id ||
    orderData?.order_id ||
    payload?.order_id
  )

  const paymentId = str(
    paymentData?.cf_payment_id ||
    paymentData?.payment_id ||
    payload?.cf_payment_id ||
    payload?.payment_id
  )

  const customerId = str(
    order?.customer_details?.customer_id ||
    orderData?.customer_details?.customer_id ||
    payload?.data?.customer_details?.customer_id
  )

  const email = str(
    order?.customer_details?.customer_email ||
    orderData?.customer_details?.customer_email ||
    payload?.data?.customer_details?.customer_email
  ).toLowerCase()

  const plan = normalizeCashfreePlan(
    order?.order_tags?.motionzync_plan ||
    orderData?.order_tags?.motionzync_plan ||
    order?.order_tags?.plan ||
    orderData?.order_tags?.plan
  )

  return { orderId, paymentId, customerId, email, plan }
}
