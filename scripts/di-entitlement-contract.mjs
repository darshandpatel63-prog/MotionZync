import assert from 'node:assert/strict'
import { resolveServerEntitlement } from '../api/_lib/billing.js'
import {
  ALL_DI_PROTECTED_RECORDS,
} from '../api/_lib/di-protected-catalog.js'
import {
  combineCatalogs,
  isTierAccessible,
} from '../api/di-knowledge.js'
import { DI_DOMAINS, validateCatalog } from '../src/pages/DesignIntelligence/schema.js'

const NOW = Date.parse('2026-10-02T12:00:00.000Z')
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

console.log('Firebase entitlement semantics + DI protected catalog boundary contract passed')
