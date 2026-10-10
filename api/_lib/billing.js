import crypto from 'node:crypto'
import { getAdminDb } from './firebase-admin.js'
import { getAuth } from 'firebase-admin/auth'

export const BILLING_COLLECTIONS = Object.freeze({
  users: 'users',
  payments: 'payments',
  apiKeys: 'apiKeys',
  orders: 'orders',
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

export const DI_ACCESS_POLICY_DOCUMENT = 'designIntelligenceAccess'
export const DEFAULT_DI_ACCESS_POLICY = Object.freeze({
  shareUltraWithPremium: true,
  festivalOffer: Object.freeze({
    enabled: false,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'Asia/Kolkata',
  }),
})

function localIndiaDateTimeMs(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null
  const value = Date.parse(date + 'T' + time + ':00+05:30')
  if (!Number.isFinite(value)) return null
  const parsed = new Date(value + (5.5 * 60 * 60 * 1000))
  const parts = date.split('-').map(Number)
  const clock = time.split(':').map(Number)
  return parsed.getUTCFullYear() === parts[0]
    && parsed.getUTCMonth() + 1 === parts[1]
    && parsed.getUTCDate() === parts[2]
    && parsed.getUTCHours() === clock[0]
    && parsed.getUTCMinutes() === clock[1]
    ? value
    : null
}

export function normalizeDesignIntelligenceAccessPolicy(input = {}) {
  const source = input && typeof input === 'object' ? input : {}
  const rawOffer = source.festivalOffer && typeof source.festivalOffer === 'object' ? source.festivalOffer : {}
  const festivalOffer = {
    enabled: rawOffer.enabled === true,
    startDate: str(rawOffer.startDate),
    startTime: str(rawOffer.startTime),
    endDate: str(rawOffer.endDate),
    endTime: str(rawOffer.endTime),
    timezone: 'Asia/Kolkata',
  }
  const scheduleValues = [festivalOffer.startDate, festivalOffer.startTime, festivalOffer.endDate, festivalOffer.endTime]
  const hasSchedule = scheduleValues.some(Boolean)
  if (festivalOffer.enabled || hasSchedule) {
    if (scheduleValues.some(value => !value)) throw new Error('Festival offer needs a start date/time and an end date/time.')
    const startMs = localIndiaDateTimeMs(festivalOffer.startDate, festivalOffer.startTime)
    const endMs = localIndiaDateTimeMs(festivalOffer.endDate, festivalOffer.endTime)
    if (startMs === null || endMs === null) throw new Error('Festival offer date or time is invalid.')
    if (endMs <= startMs) throw new Error('Festival offer end must be later than its start.')
  }
  return { shareUltraWithPremium: source.shareUltraWithPremium === true, festivalOffer }
}

export function getDesignIntelligenceAccessState(input = DEFAULT_DI_ACCESS_POLICY, nowMs = Date.now()) {
  let policy
  try { policy = normalizeDesignIntelligenceAccessPolicy(input) }
  catch { policy = normalizeDesignIntelligenceAccessPolicy(DEFAULT_DI_ACCESS_POLICY) }
  const offer = policy.festivalOffer
  const startMs = offer.enabled ? localIndiaDateTimeMs(offer.startDate, offer.startTime) : null
  const endMs = offer.enabled ? localIndiaDateTimeMs(offer.endDate, offer.endTime) : null
  const festivalOfferActive = startMs !== null && endMs !== null && nowMs >= startMs && nowMs < endMs
  return { policy, festivalOfferActive, premiumCanAccessUltraContent: policy.shareUltraWithPremium || festivalOfferActive, timezone: 'Asia/Kolkata' }
}

export function resolveDesignIntelligenceContentAccess({
  entitlementTier = 'free',
  authenticated = false,
  apiKeyAuthenticated = false,
  accessState = null,
  policyUnavailable = false,
} = {}) {
  if (!authenticated) return { contentTier: 'free', reason: 'public-free' }
  if (apiKeyAuthenticated) return { contentTier: entitlementTier, reason: 'ultra-api-key' }
  if (entitlementTier === 'ultra-premium') return { contentTier: 'ultra-premium', reason: 'ultra-subscription' }
  if (entitlementTier === 'premium' && accessState?.premiumCanAccessUltraContent === true) {
    return {
      contentTier: 'ultra-premium',
      reason: accessState.festivalOfferActive ? 'scheduled-festival-offer' : 'admin-shared-ultra-content',
    }
  }
  if (policyUnavailable && entitlementTier === 'premium') {
    return { contentTier: 'premium', reason: 'policy-unavailable-fail-closed' }
  }
  return { contentTier: entitlementTier, reason: entitlementTier === 'premium' ? 'premium-ultra-restricted' : 'authenticated-entitlement' }
}

export async function getDesignIntelligenceAccessPolicy() {
  const snapshot = await getAdminDb().collection('siteContent').doc(DI_ACCESS_POLICY_DOCUMENT).get()
  return normalizeDesignIntelligenceAccessPolicy(snapshot.exists ? snapshot.data() : DEFAULT_DI_ACCESS_POLICY)
}

export async function saveDesignIntelligenceAccessPolicy(input, savedBy = null) {
  const policy = normalizeDesignIntelligenceAccessPolicy(input)
  const now = new Date().toISOString()
  await getAdminDb().collection('siteContent').doc(DI_ACCESS_POLICY_DOCUMENT).set({
    ...policy,
    updatedAt: now,
    updatedByUid: str(savedBy?.uid) || null,
    updatedByEmail: str(savedBy?.email).toLowerCase() || null,
  }, { merge: false })
  return policy
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


const ENTITLED_TIERS = new Set(['premium', 'ultra-premium'])
const ACTIVE_ENTITLEMENT_STATUSES = new Set(['active', 'granted'])

function keyDigest(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex')
}

function createApiSecret() {
  return 'mz_live_' + crypto.randomBytes(32).toString('base64url')
}

async function getActiveApiKeyDocs(db, userId) {
  const snapshot = await db.collection(BILLING_COLLECTIONS.apiKeys)
    .where('userId', '==', userId)
    .limit(50)
    .get()
  return snapshot.docs
    .map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }))
    .filter(record => str(record.status || 'active').toLowerCase() === 'active' && !record.revokedAt)
}

export function resolveServerEntitlement(data = {}, nowMs = Date.now()) {
  const record = data && typeof data === 'object' ? data : {}
  const tier = str(record.entitlement || record.plan).toLowerCase()
  const rawExpiry = record.entitlementExpiresAt
  const hasConfiguredExpiry = rawExpiry !== undefined && rawExpiry !== null && rawExpiry !== ''
  const expiry = hasConfiguredExpiry ? dateOf(rawExpiry) : null
  const expiryIsValid = !hasConfiguredExpiry || (expiry instanceof Date && Number.isFinite(expiry.getTime()))
  const entitlementStatus = str(record.entitlementStatus).toLowerCase()
  const hasConfiguredStatus = entitlementStatus !== ''
  const statusIsActive = !hasConfiguredStatus || ACTIVE_ENTITLEMENT_STATUSES.has(entitlementStatus)
  const entitlementIsActive = record.entitlementActive !== false && statusIsActive
  const paidOrGrantedActive = ENTITLED_TIERS.has(tier)
    && entitlementIsActive
    && expiryIsValid
    && (!hasConfiguredExpiry || expiry.getTime() > nowMs)

  // Every Firebase-authenticated user receives Premium web access at ₹0.
  // Only an active Ultra Premium+ entitlement unlocks the developer API.
  if (paidOrGrantedActive) {
    return {
      tier,
      active: true,
      source: str(record.entitlementSource).toLowerCase() || 'server',
      expiresAt: iso(record.entitlementExpiresAt),
    }
  }

  return {
    tier: 'premium',
    active: true,
    source: 'authenticated-free',
    expiresAt: null,
  }
}

export function resolveAdminEntitlement(userEmail, configuredAdminEmail) {
  const actualEmail = str(userEmail).toLowerCase()
  const expectedEmail = str(configuredAdminEmail).toLowerCase()
  if (!actualEmail || !expectedEmail || actualEmail !== expectedEmail) return null

  return {
    tier: 'ultra-premium',
    active: true,
    source: 'admin-email-allowlist',
    expiresAt: null,
  }
}

export async function getServerEntitlement(userId) {
  const cleanUserId = str(userId)
  if (!cleanUserId) throw new Error('Firebase user ID is required')

  // Keep the configured admin at Ultra Premium+ independently of editable
  // Firestore entitlement fields. Resolve the email from Firebase Admin, never
  // from a browser-provided email or tier claim.
  const db = getAdminDb()
  const configuredAdminEmail = str(process.env.ADMIN_EMAIL).toLowerCase()
  if (configuredAdminEmail) {
    const firebaseUser = await getAuth().getUser(cleanUserId)
    const adminEntitlement = resolveAdminEntitlement(firebaseUser.email, configuredAdminEmail)
    if (adminEntitlement) return adminEntitlement
  }

  const snapshot = await db.collection(BILLING_COLLECTIONS.users).doc(cleanUserId).get()
  const data = snapshot.exists ? (snapshot.data() || {}) : {}
  return resolveServerEntitlement(data)
}

async function issueApiKeyForUser({ userId, plan, rotationOf = null } = {}) {
  const cleanUserId = str(userId)
  const cleanPlan = str(plan).toLowerCase()
  if (!cleanUserId || cleanPlan !== 'ultra-premium') {
    throw new Error('An active Ultra Premium+ entitlement is required')
  }

  const secret = createApiSecret()
  const now = new Date().toISOString()
  const prefix = secret.slice(0, 16)
  const id = 'key_' + crypto.randomBytes(16).toString('hex')

  await getAdminDb().collection(BILLING_COLLECTIONS.apiKeys).doc(id).set({
    userId: cleanUserId,
    plan: cleanPlan,
    provider: 'motionzync',
    keyHash: keyDigest(secret),
    keyPrefix: prefix,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    lastUsedAt: null,
    revokedAt: null,
    rotationOf: str(rotationOf) || null,
  })

  return {
    id,
    secret,
    prefix,
    plan: cleanPlan,
    createdAt: now,
  }
}

export async function authenticateMotionZyncApiKey(secret) {
  const cleanSecret = str(secret)
  if (!cleanSecret.startsWith('mz_live_')) {
    const error = new Error('Invalid MotionZync API key')
    error.status = 401
    throw error
  }

  const keyHash = keyDigest(cleanSecret)
  const snapshot = await getAdminDb().collection(BILLING_COLLECTIONS.apiKeys)
    .where('keyHash', '==', keyHash)
    .limit(1)
    .get()

  if (snapshot.empty) {
    const error = new Error('Invalid MotionZync API key')
    error.status = 401
    throw error
  }

  const document = snapshot.docs[0]
  const record = { id: document.id, ...document.data() }
  if (str(record.status || '').toLowerCase() !== 'active' || record.revokedAt) {
    const error = new Error('MotionZync API key is revoked or inactive')
    error.status = 401
    throw error
  }

  const entitlement = await getServerEntitlement(record.userId)
  if (entitlement.tier !== 'ultra-premium') {
    const error = new Error('Ultra Premium+ entitlement is required for API access')
    error.status = 403
    throw error
  }

  const now = new Date().toISOString()
  await document.ref.set({lastUsedAt: now, updatedAt: now}, {merge: true})

  return {
    userId: str(record.userId),
    keyId: document.id,
    plan: 'ultra-premium',
    entitlement,
  }
}

export async function getApiKeyStatusForUser(userId) {
  const db = getAdminDb()
  const entitlement = await getServerEntitlement(userId)
  const keys = entitlement.tier === 'ultra-premium'
    ? await getActiveApiKeyDocs(db, userId)
    : []

  return {
    entitlement,
    apiEligible: entitlement.tier === 'ultra-premium',
    activeKeyCount: keys.length,
    active: keys.map(key => ({
      id: key.id,
      prefix: str(key.keyPrefix),
      plan: str(key.plan).toLowerCase(),
      createdAt: iso(key.createdAt),
      updatedAt: iso(key.updatedAt),
      lastUsedAt: iso(key.lastUsedAt),
    })),
  }
}

export async function issueApiKeyForEntitlement(userId) {
  const entitlement = await getServerEntitlement(userId)
  if (entitlement.tier !== 'ultra-premium') {
    const error = new Error('Ultra Premium+ entitlement is required before an API key can be issued')
    error.status = 403
    throw error
  }

  const existing = await getActiveApiKeyDocs(getAdminDb(), userId)
  if (existing.length) {
    const error = new Error('An active MotionZync API key already exists. Rotate it to create a new secret.')
    error.status = 409
    throw error
  }

  return issueApiKeyForUser({
    userId,
    plan: entitlement.tier,
  })
}

export async function rotateApiKeyForEntitlement(userId) {
  const entitlement = await getServerEntitlement(userId)
  if (entitlement.tier !== 'ultra-premium') {
    const error = new Error('Ultra Premium+ entitlement is required before an API key can be rotated')
    error.status = 403
    throw error
  }

  const db = getAdminDb()
  const existing = await getActiveApiKeyDocs(db, userId)
  const now = new Date().toISOString()

  for (const key of existing) {
    await key.ref.set({
      status: 'revoked',
      revokedAt: now,
      updatedAt: now,
    }, { merge: true })
  }

  return issueApiKeyForUser({
    userId,
    plan: entitlement.tier,
    rotationOf: existing[0]?.id || null,
  })
}

export async function revokeApiKeysForUser(userId) {
  const db = getAdminDb()
  const existing = await getActiveApiKeyDocs(db, userId)
  const now = new Date().toISOString()

  for (const key of existing) {
    await key.ref.set({
      status: 'revoked',
      revokedAt: now,
      updatedAt: now,
    }, { merge: true })
  }

  return {
    revokedCount: existing.length,
    revokedAt: now,
  }
}

export function hashMotionZyncApiKey(secret) {
  const cleanSecret = str(secret)
  if (!cleanSecret) return ''
  return keyDigest(cleanSecret)
}
export async function recordPendingOrder({
  userId,
  email,
  provider,
  plan,
  orderId,
  amount,
  currency = 'INR',
} = {}) {
  const cleanUserId = str(userId)
  const cleanEmail = str(email).toLowerCase()
  const cleanProvider = str(provider).toLowerCase()
  const cleanPlan = str(plan).toLowerCase()
  const cleanOrderId = str(orderId)
  const numericAmount = num(amount)
  const cleanCurrency = str(currency).toUpperCase()

  if (!cleanUserId || !cleanEmail || !cleanProvider || !cleanPlan || !cleanOrderId) {
    throw new Error('Pending order is missing required fields')
  }
  if (numericAmount <= 0) throw new Error('Pending order amount must be positive')
  if (!/^[A-Z]{3}$/.test(cleanCurrency)) throw new Error('Pending order currency must be a 3-letter code')

  const now = new Date().toISOString()
  await getAdminDb().collection(BILLING_COLLECTIONS.orders).doc(cleanOrderId).set({
    userId: cleanUserId,
    email: cleanEmail,
    provider: cleanProvider,
    plan: cleanPlan,
    orderId: cleanOrderId,
    amount: numericAmount,
    currency: cleanCurrency,
    status: 'created',
    createdAt: now,
    updatedAt: now,
  }, { merge: true })

  return {
    orderId: cleanOrderId,
    status: 'created',
    createdAt: now,
  }
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
  const apiKeyHolders = new Set(apiKeys.map(key => str(key.userId)).filter(Boolean))
  const activeApiKeyHolders = new Set(activeApiKeys.map(key => str(key.userId)).filter(Boolean))
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
      apiKeyHolders:apiKeyHolders.size, activeApiKeyHolders:activeApiKeyHolders.size,
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
