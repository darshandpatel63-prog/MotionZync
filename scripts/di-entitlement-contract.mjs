import assert from 'node:assert/strict'
import { resolveServerEntitlement, resolveAdminEntitlement } from '../api/_lib/billing.js'
import {
  ALL_DI_PROTECTED_RECORDS,
} from '../api/_lib/di-protected-catalog.js'
import diKnowledgeHandler, {
  combineCatalogs,
  isTierAccessible,
} from '../api/di-knowledge.js'
import diApiKeyHandler from '../api/di-api-key.js'
import diEffectsHandler from '../api/di-effects.js'
import { DI_DOMAINS, validateCatalog } from '../src/pages/DesignIntelligence/schema.js'
import { buildRecipe, isAccessible, searchCatalog } from '../src/pages/DesignIntelligence/engine.js'
import { hasEntitlement } from '../src/pages/DesignIntelligence/access.js'
import { DI_STYLES, DI_PALETTES, DI_TYPOGRAPHY, DI_CHARTS, DI_STACKS, DI_RECIPES } from '../src/pages/DesignIntelligence/catalog.js'


const tieredStackFixtures = [
  { id: 'stack-react-native', name: 'Test React Native', tier: 'premium', category: 'cross-platform-mobile', focus: ['mobile'] },
  { id: 'stack-flutter', name: 'Test Flutter', tier: 'ultra-premium', category: 'cross-platform-mobile', focus: ['mobile'] },
  { id: 'stack-swiftui', name: 'Test SwiftUI', tier: 'ultra-premium', category: 'native-ios', focus: ['ios'] },
  { id: 'test-free-cross-platform', name: 'Test Free Cross-platform', tier: 'free', category: 'cross-platform-mobile', focus: ['mobile'] },
  { id: 'test-free-web', name: 'Test Free Web', tier: 'free', category: 'frontend', focus: ['web'] },
]
const tieredStackTestCatalog = {
  styles: DI_STYLES,
  palettes: DI_PALETTES,
  typography: DI_TYPOGRAPHY,
  charts: DI_CHARTS,
  stacks: tieredStackFixtures,
  recipes: DI_RECIPES,
}
const freeMobileRecipe = buildRecipe('mobile app', 'free', tieredStackTestCatalog)
assert.equal(freeMobileRecipe.stack.id, 'test-free-cross-platform', 'Free recipe must not force a Premium React Native stack')
assert.equal(freeMobileRecipe.stack.tier, 'free')
const premiumMobileRecipe = buildRecipe('mobile app', 'premium', tieredStackTestCatalog)
assert.equal(premiumMobileRecipe.stack.id, 'stack-react-native', 'Premium should retain its accessible preferred stack')
const ultraFlutterRecipe = buildRecipe('flutter android app', 'ultra-premium', tieredStackTestCatalog)
assert.equal(ultraFlutterRecipe.stack.id, 'stack-flutter', 'Ultra Premium+ should retain its accessible preferred Flutter stack')
const freeIosRecipe = buildRecipe('ios app', 'free', tieredStackTestCatalog)
assert.notEqual(freeIosRecipe.stack.id, 'stack-swiftui', 'Free recipe must not force an Ultra Premium+ SwiftUI stack')
assert.equal(freeIosRecipe.stack.tier, 'free')

const invalidTierRecord = {
  id: 'test-invalid-tier-style',
  name: 'Classified Test Style',
  tier: 'unrecognized-tier',
  tags: ['classified'],
  description: 'Fixture proving invalid tier data does not become public.',
  suitedFor: ['SaaS'],
}
assert.equal(isAccessible(invalidTierRecord, 'free'), false, 'An unknown record tier must never be treated as Free')
assert.equal(
  searchCatalog('classified', 'styles', 'free', { styles: [...DI_STYLES, invalidTierRecord] })
    .some(record => record.id === invalidTierRecord.id),
  false,
  'Free search must exclude records with an unknown tier',
)
assert.equal(hasEntitlement('unrecognized-tier', 'ultra-premium'), false, 'Unknown required tiers must fail closed')
assert.equal(hasEntitlement('premium', 'unrecognized-tier'), false, 'Unknown current tiers must fall back to Free')

const NOW = Date.parse('2026-10-02T12:00:00.000Z')

// The configured server admin receives a permanent Ultra Premium+ override.
// Email matching is case-insensitive; an absent config or a different account
// must never receive the override.
assert.deepEqual(
  resolveAdminEntitlement('Owner@Example.com', 'owner@example.com'),
  {
    tier: 'ultra-premium',
    active: true,
    source: 'admin-email-allowlist',
    expiresAt: null,
  },
  'Configured admin email must always resolve to active Ultra Premium+',
)
assert.equal(resolveAdminEntitlement('member@example.com', 'owner@example.com'), null)
assert.equal(resolveAdminEntitlement('owner@example.com', ''), null)
const future = new Date(NOW + 24 * 60 * 60 * 1000).toISOString()
const past = new Date(NOW - 24 * 60 * 60 * 1000).toISOString()

const freeFromAuthentication = resolveServerEntitlement({}, NOW)
assert.deepEqual(freeFromAuthentication, {
  tier: 'premium',
  active: true,
  source: 'authenticated-free',
  expiresAt: null,
})

const premium = resolveServerEntitlement({
  entitlement: 'premium',
  entitlementSource: 'payment',
  entitlementExpiresAt: future,
}, NOW)
assert.equal(premium.tier, 'premium')
assert.equal(premium.active, true)
assert.equal(premium.source, 'payment')

const ultra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementExpiresAt: future,
}, NOW)
assert.equal(ultra.tier, 'ultra-premium')
assert.equal(ultra.active, true)
assert.equal(ultra.source, 'payment')

const expiredUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementExpiresAt: past,
}, NOW)
assert.deepEqual(expiredUltra, freeFromAuthentication)

const malformedExpiryUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementExpiresAt: 'not-a-real-date',
}, NOW)
assert.deepEqual(
  malformedExpiryUltra,
  freeFromAuthentication,
  'Malformed expiry must fail closed to authenticated Premium web access',
)

const explicitlyInactiveUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementActive: false,
}, NOW)
assert.deepEqual(
  explicitlyInactiveUltra,
  freeFromAuthentication,
  'Explicitly inactive Ultra entitlement must fall back to authenticated Premium web access',
)

const revokedUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementStatus: 'revoked',
}, NOW)
assert.deepEqual(
  revokedUltra,
  freeFromAuthentication,
  'Revoked Ultra entitlement must fall back to authenticated Premium web access',
)

const pendingUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementStatus: 'pending',
}, NOW)
assert.deepEqual(
  pendingUltra,
  freeFromAuthentication,
  'Unknown/non-active entitlement status must fail closed',
)

const activeUltra = resolveServerEntitlement({
  entitlement: 'ultra-premium',
  entitlementSource: 'payment',
  entitlementStatus: 'active',
}, NOW)
assert.equal(activeUltra.tier, 'ultra-premium', 'Explicit active Ultra entitlement should remain eligible')
assert.equal(activeUltra.active, true)

const tiers = ['free', 'premium', 'ultra-premium']
const catalogs = Object.fromEntries(tiers.map(tier => [tier, combineCatalogs(tier)]))

for (const tier of tiers) {
  const catalog = catalogs[tier]
  const report = validateCatalog(catalog)
  assert.equal(report.valid, true, tier + ' catalog failed canonical validation: ' + JSON.stringify(report.errors))

  const allRecords = DI_DOMAINS.flatMap(domain => catalog[domain] || [])
  assert.equal(
    allRecords.every(record => isTierAccessible(record, tier)),
    true,
    tier + ' catalog leaked a record above its entitlement tier',
  )
}

const freeRecords = DI_DOMAINS.flatMap(domain => catalogs.free[domain] || [])
assert.equal(
  freeRecords.some(record => record.tier !== 'free'),
  false,
  'Free catalog contains protected records',
)

const premiumRecords = DI_DOMAINS.flatMap(domain => catalogs.premium[domain] || [])
assert.equal(
  premiumRecords.some(record => record.tier === 'premium'),
  true,
  'Premium catalog did not include premium-protected records',
)
assert.equal(
  premiumRecords.some(record => record.tier === 'ultra-premium'),
  false,
  'Premium catalog leaked Ultra Premium+ records',
)

const ultraRecords = DI_DOMAINS.flatMap(domain => catalogs['ultra-premium'][domain] || [])
assert.equal(
  ultraRecords.some(record => record.tier === 'premium'),
  true,
  'Ultra catalog did not include Premium records',
)
assert.equal(
  ultraRecords.some(record => record.tier === 'ultra-premium'),
  true,
  'Ultra catalog did not include Ultra Premium+ records',
)

const protectedUltraIds = ALL_DI_PROTECTED_RECORDS
  .filter(record => record.tier === 'ultra-premium')
  .map(record => record.id)

for (const id of protectedUltraIds) {
  assert.equal(
    premiumRecords.some(record => record.id === id),
    false,
    'Premium catalog exposed Ultra record: ' + id,
  )
  assert.equal(
    ultraRecords.some(record => record.id === id),
    true,
    'Ultra catalog omitted Ultra record: ' + id,
  )
}


function createResponseStub() {
  const state = { statusCode: 200, headers: {}, body: null, ended: false }
  const response = {
    setHeader(name, value) { state.headers[String(name).toLowerCase()] = value; return this },
    status(code) { state.statusCode = code; return this },
    json(body) { state.body = body; return this },
    end() { state.ended = true; return this },
  }
  return { response, state }
}

async function callHandler(handler, request = {}) {
  const { response, state } = createResponseStub()
  await handler({
    method: request.method || 'GET',
    headers: request.headers || {},
    query: request.query || {},
    body: request.body || {},
  }, response)
  return state
}

// Credential-free endpoint contract: public knowledge stays Free, while
// key/effects routes reject guests before any Firebase/Firestore lookup.
const guestResponse = await callHandler(diKnowledgeHandler)
assert.equal(guestResponse.statusCode, 200, 'Guest knowledge request should remain public')
assert.deepEqual(guestResponse.body.entitlement, {
  tier: 'free',
  authenticated: false,
  protectedIncluded: false,
})
assert.equal(guestResponse.body.protectedRecordCount, 0, 'Guest response exposed protected records')
assert.equal(guestResponse.body.records.every(record => record.tier === 'free'), true, 'Guest response contains a non-Free record')
assert.equal(guestResponse.headers['cache-control'], 'private, no-store, max-age=0')

// A caller cannot self-grant Premium/Ultra access with query/body/header claims.
const spoofedTierGuest = await callHandler(diKnowledgeHandler, {
  query: { tier: 'ultra-premium' },
  headers: { 'x-motionzync-tier': 'ultra-premium' },
  body: { tier: 'ultra-premium', entitlement: 'ultra-premium' },
})
assert.equal(spoofedTierGuest.statusCode, 200)
assert.deepEqual(spoofedTierGuest.body.entitlement, {
  tier: 'free',
  authenticated: false,
  protectedIncluded: false,
})
assert.equal(spoofedTierGuest.body.records.every(record => record.tier === 'free'), true)
assert.equal(spoofedTierGuest.body.protectedRecordCount, 0)

// A claimed Ultra tier is not enough to issue a developer key without Firebase auth.
const spoofedKeyIssue = await callHandler(diApiKeyHandler, {
  method: 'POST',
  body: { action: 'issue', tier: 'ultra-premium', entitlement: 'ultra-premium' },
})
assert.equal(spoofedKeyIssue.statusCode, 401, 'Client-supplied Ultra claims must not bypass Firebase authentication')

const unknownDomain = await callHandler(diKnowledgeHandler, {
  query: { domain: 'not-a-real-domain' },
})
assert.equal(unknownDomain.statusCode, 400, 'Unknown knowledge domain should be rejected')

const guestKeyStatus = await callHandler(diApiKeyHandler, { method: 'GET' })
assert.equal(guestKeyStatus.statusCode, 401, 'Guest API-key status must require Firebase authentication')

const guestEffects = await callHandler(diEffectsHandler, { method: 'GET' })
assert.equal(guestEffects.statusCode, 401, 'Guest Effects API request must require a server-issued key')

const originalAllowedOrigins = process.env.MOTIONZYNC_API_ALLOWED_ORIGINS
process.env.MOTIONZYNC_API_ALLOWED_ORIGINS = 'https://allowed.example'
const blockedOrigin = await callHandler(diEffectsHandler, {
  method: 'OPTIONS',
  headers: { origin: 'https://untrusted.example' },
})
assert.equal(blockedOrigin.statusCode, 403, 'Unallowlisted Effects API origin must be rejected')

const allowedPreflight = await callHandler(diEffectsHandler, {
  method: 'OPTIONS',
  headers: { origin: 'https://allowed.example' },
})
assert.equal(allowedPreflight.statusCode, 204, 'Allowlisted CORS preflight should succeed')
assert.equal(allowedPreflight.headers['access-control-allow-origin'], 'https://allowed.example')
assert.match(allowedPreflight.headers['access-control-allow-methods'], /GET, POST, OPTIONS/)

if (originalAllowedOrigins === undefined) delete process.env.MOTIONZYNC_API_ALLOWED_ORIGINS
else process.env.MOTIONZYNC_API_ALLOWED_ORIGINS = originalAllowedOrigins

console.log('Firebase entitlement, protected catalog, guest API-key and Effects API CORS boundary contracts passed')
