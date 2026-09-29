import crypto from 'node:crypto'
import { requireAuthenticatedUser } from './_lib/firebase-admin.js'
import { createCashfreeOrder } from './_lib/cashfree.js'
import { recordPendingOrder } from './_lib/billing.js'

function getPublicBaseUrl() {
  const configured = String(process.env.MOTIONZYNC_PUBLIC_URL || '').trim().replace(/\/$/, '')
  if (!configured) {
    const error = new Error('Server is missing MOTIONZYNC_PUBLIC_URL')
    error.status = 503
    throw error
  }
  if (!/^https:\/\//i.test(configured)) {
    const error = new Error('MOTIONZYNC_PUBLIC_URL must use HTTPS')
    error.status = 503
    throw error
  }
  return configured
}

function cleanPhone(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function createOrderId() {
  return 'mz_ultra_' + Date.now() + '_' + crypto.randomBytes(5).toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let user
  try {
    user = await requireAuthenticatedUser(req)
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message || 'Authentication failed' })
  }

  const phone = cleanPhone(req.body?.phone)
  if (!/^\+?[0-9 ()-]{8,20}$/.test(phone)) {
    return res.status(400).json({ error: 'A valid customer phone number is required for Cashfree checkout' })
  }

  let baseUrl
  const orderId = createOrderId()

  try {
    baseUrl = getPublicBaseUrl()
    const order = await createCashfreeOrder({
      orderId,
      amount: 500,
      currency: 'INR',
      customerId: user.uid,
      customerEmail: user.email,
      customerPhone: phone,
      customerName: user.name || user.email?.split('@')[0],
      plan: 'ultra-premium',
      returnUrl: baseUrl + '/design-intelligence/pricing?payment=returned&order_id={order_id}',
      notifyUrl: baseUrl + '/api/cashfree-webhook',
    })

    await recordPendingOrder({
      userId: user.uid,
      email: user.email,
      provider: 'cashfree',
      plan: 'ultra-premium',
      orderId,
      amount: 500,
      currency: 'INR',
    })

    return res.status(200).json({
      ok: true,
      provider: 'cashfree',
      environment: String(process.env.CASHFREE_ENV || 'sandbox').toLowerCase(),
      plan: 'ultra-premium',
      amount: 500,
      currency: 'INR',
      orderId,
      paymentSessionId: order.payment_session_id,
    })
  } catch (error) {
    console.error('[cashfree-create-order]', error.message || 'order creation failed')
    return res.status(error.status || 500).json({ error: error.message || 'Unable to create payment order' })
  }
}
