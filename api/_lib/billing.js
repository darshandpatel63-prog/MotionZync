import { getAdminDb } from './firebase-admin.js'
import { getAuth } from 'firebase-admin/auth'

export const BILLING_COLLECTIONS = Object.freeze({
  users: 'users',
  payments: 'payments',
  apiKeys: 'apiKeys',
})

const SUCCESS = new Set(['paid', 'success', 'successful', 'captured', 'completed'])
const REFUNDED = new Set(['refunded', 'partially_refunded'])

const str = value => typeof value === 'string' ? value.trim() : ''
const num = value => Number.isFinite(Number(value)) ? Number(value) : 0
const dateOf = value => {
  if (!value) return null
  if (typeof value?.toDate === 'function') return value.toDate()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
const iso = value => { const date = dateOf(value); return date ? date.toISOString() : null }
const month = value => {
  const date = dateOf(value)
  return date ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}` : null
}

export function normalizePaymentRecord(input = {}) {
  const payment = {
    userId: str(input.userId),
    email: str(input.email).toLowerCase(),
    provider: str(input.provider),
    plan: str(input.plan),
    amount: num(input.amount),
    currency: str(input.currency || 'INR').toUpperCase(),
    orderId: str(input.orderId),
    transactionId: str(input.transactionId || input.paymentId),
    status: str(input.status).toLowerCase(),
    purchasedAt: input.purchasedAt || new Date().toISOString(),
    verifiedAt: input.verifiedAt || new Date().toISOString(),
    refundStatus: str(input.refundStatus || 'none').toLowerCase(),
  }
  const missing = ['userId','email','provider','plan','orderId','transactionId','status'].filter(field => !payment[field])
  if (missing.length) throw new Error(`Payment record missing: ${missing.join(', ')}`)
  if (payment.amount < 0) throw new Error('Payment amount cannot be negative')
  if (!/^[A-Z]{3}$/.test(payment.currency)) throw new Error('Payment currency must be a 3-letter code')
  return payment
}

export async function recordVerifiedPayment(input = {}) {
  const db = getAdminDb()
  const payment = normalizePaymentRecord(input)
  const docId = `${payment.provider}__${payment.transactionId}`.replace(/[^a-zA-Z0-9_.:-]/g, '_').slice(0, 450)
  const now = new Date().toISOString()
  await db.collection(BILLING_COLLECTIONS.payments).doc(docId).set({ ...payment, updatedAt: now }, { merge: true })
  if (SUCCESS.has(payment.status)) {
    await db.collection(BILLING_COLLECTIONS.users).doc(payment.userId).set({
      email: payment.email,
      plan: payment.plan,
      entitlement: payment.plan === 'ultra-premium' ? 'ultra-premium' : 'premium',
      entitlementGrantedAt: payment.verifiedAt || now,
      entitlementSource: 'payment',
      entitlementUpdatedAt: now,
      entitlementExpiresAt: null,
    }, { merge: true })
  }
  return { id: docId, ...payment }
}

export async function grantEntitlementByEmail({ email, tier = 'premium', grantedBy = null } = {}) {
  const cleanEmail = str(email).toLowerCase()
  if (!cleanEmail) throw new Error('Google account email is required')
  if (!['premium','ultra-premium'].includes(tier)) throw new Error('Tier must be premium or ultra-premium')
  const firebaseUser = await getAuth().getUserByEmail(cleanEmail)
  const now = new Date().toISOString()
  await getAdminDb().collection(BILLING_COLLECTIONS.users).doc(firebaseUser.uid).set({
    email: firebaseUser.email || cleanEmail,
    plan: tier,
    entitlement: tier,
    entitlementGrantedAt: now,
    entitlementSource: 'admin-grant',
    entitlementGrantedBy: grantedBy?.uid || null,
    entitlementGrantedByEmail: str(grantedBy?.email).toLowerCase() || null,
    entitlementUpdatedAt: now,
    entitlementExpiresAt: null,
  }, { merge: true })
  return { uid: firebaseUser.uid, email: firebaseUser.email || cleanEmail, tier, grantedAt: now }
}

async function readCollection(db, name, limit = 10000) {
  const snapshot = await db.collection(name).limit(limit).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getBillingAnalytics() {
  const db = getAdminDb()
  const [payments, users, apiKeys] = await Promise.all([
    readCollection(db, BILLING_COLLECTIONS.payments),
    readCollection(db, BILLING_COLLECTIONS.users),
    readCollection(db, BILLING_COLLECTIONS.apiKeys),
  ])
  const successful = payments.filter(p => SUCCESS.has(str(p.status).toLowerCase()))
  const refunded = payments.filter(p => REFUNDED.has(str(p.refundStatus).toLowerCase()))
  const now = Date.now()
  const activeEntitlements = users.filter(user => {
    const tier = str(user.entitlement || user.plan).toLowerCase()
    if (!['premium','ultra-premium'].includes(tier)) return false
    const expiry = dateOf(user.entitlementExpiresAt)
    return !expiry || expiry.getTime() > now
  })
  const activeApiKeys = apiKeys.filter(key => str(key.status || 'active').toLowerCase() === 'active' && !key.revokedAt)
  const manualGrants = users.filter(user => str(user.entitlementSource).toLowerCase() === 'admin-grant')
  const uniquePayers = new Set(successful.map(p => p.userId).filter(Boolean))

  const countMap = (records, field, fallback = 'unknown') => {
    const map = new Map()
    for (const record of records) {
      const key = str(record[field]).toLowerCase() || fallback
      map.set(key, (map.get(key) || 0) + 1)
    }
    return [...map.entries()].map(([name,value]) => ({ name, value })).sort((a,b) => b.value-a.value)
  }

  const monthly = new Map()
  for (const payment of successful) {
    const key = month(payment.purchasedAt || payment.verifiedAt)
    if (!key) continue
    const current = monthly.get(key) || { month:key, payments:0, revenue:0 }
    current.payments += 1
    current.revenue += num(payment.amount)
    monthly.set(key, current)
  }

  const recentTransactions = [...payments]
    .sort((a,b) => (dateOf(b.purchasedAt)?.getTime() || 0) - (dateOf(a.purchasedAt)?.getTime() || 0))
    .slice(0,100)
    .map(p => ({
      id:p.id, userId:str(p.userId), email:str(p.email), provider:str(p.provider),
      plan:str(p.plan), amount:num(p.amount), currency:str(p.currency || 'INR'),
      orderId:str(p.orderId), transactionId:str(p.transactionId || p.paymentId),
      status:str(p.status), purchasedAt:iso(p.purchasedAt), verifiedAt:iso(p.verifiedAt),
      refundStatus:str(p.refundStatus || 'none'),
    }))

  return {
    generatedAt:new Date().toISOString(),
    limits:{collectionsReadLimit:10000,recentTransactions:100},
    summary:{
      uniquePayers:uniquePayers.size, successfulPayments:successful.length,
      grossRevenue:successful.reduce((sum,p) => sum + num(p.amount),0),
      refundedAmount:refunded.reduce((sum,p) => sum + num(p.amount),0),
      activeEntitlements:activeEntitlements.length, activeApiKeys:activeApiKeys.length,
      manualGrants:manualGrants.length, totalPaymentRecords:payments.length,
    },
    paymentStatus:countMap(payments,'status'),
    planDistribution:countMap(successful,'plan'),
    entitlementSources:countMap(users,'entitlementSource','none'),
    apiKeyStatus:countMap(apiKeys,'status'),
    monthly:[...monthly.values()].sort((a,b) => a.month.localeCompare(b.month)),
    recentTransactions,
  }
}
