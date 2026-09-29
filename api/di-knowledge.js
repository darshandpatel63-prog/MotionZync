import { requireAuthenticatedUser } from './_lib/firebase-admin.js'
import { authenticateMotionZyncApiKey, getServerEntitlement } from './_lib/billing.js'
import {
  ALL_DI_PROTECTED_RECORDS,
  DI_PROTECTED_STYLES,
  DI_PROTECTED_PALETTES,
  DI_PROTECTED_TYPOGRAPHY,
  DI_PROTECTED_CHARTS,
  DI_PROTECTED_STACKS,
  DI_PROTECTED_RECIPES,
} from './_lib/di-protected-catalog.js'
import {
  DI_STYLES,
  DI_PALETTES,
  DI_TYPOGRAPHY,
  DI_CHARTS,
  DI_STACKS,
  DI_RECIPES,
} from '../src/pages/DesignIntelligence/catalog.js'
import { DI_DOMAINS, validateCatalog } from '../src/pages/DesignIntelligence/schema.js'

const FREE_CATALOG = Object.freeze({
  styles: DI_STYLES,
  palettes: DI_PALETTES,
  typography: DI_TYPOGRAPHY,
  charts: DI_CHARTS,
  stacks: DI_STACKS,
  recipes: DI_RECIPES,
})

const PROTECTED_CATALOG = Object.freeze({
  styles: DI_PROTECTED_STYLES,
  palettes: DI_PROTECTED_PALETTES,
  typography: DI_PROTECTED_TYPOGRAPHY,
  charts: DI_PROTECTED_CHARTS,
  stacks: DI_PROTECTED_STACKS,
  recipes: DI_PROTECTED_RECIPES,
})

const TIER_LEVELS = Object.freeze({ free: 0, premium: 1, 'ultra-premium': 2 })

function setPrivateJsonHeaders(res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Vary', 'Authorization')
  res.setHeader('X-Content-Type-Options', 'nosniff')
}

function isTierAccessible(record, entitlementTier='free') {
  return (TIER_LEVELS[String(record?.tier || 'free')] ?? 0) <= (TIER_LEVELS[entitlementTier] ?? 0)
}

function combineCatalogs(entitlementTier='free') {
  return Object.fromEntries(DI_DOMAINS.map(domain => [
    domain,
    [
      ...FREE_CATALOG[domain],
      ...PROTECTED_CATALOG[domain].filter(record => isTierAccessible(record, entitlementTier)),
    ],
  ]))
}

function hasBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  return header.startsWith('Bearer ') && header.slice(7).trim()
}

export default async function handler(req, res) {
  setPrivateJsonHeaders(res)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const requestedDomain = String(req.query?.domain || 'all').trim().toLowerCase()
  if (requestedDomain !== 'all' && !DI_DOMAINS.includes(requestedDomain)) {
    return res.status(400).json({ error: 'Unknown Design Intelligence domain' })
  }

  let tier = 'free'
  let authenticated = false

  const bearerToken = hasBearerToken(req)
  if (bearerToken) {
    try {
      if (bearerToken.startsWith('mz_live_')) {
        const apiAccess = await authenticateMotionZyncApiKey(bearerToken)
        tier = apiAccess.entitlement.tier
        authenticated = true
      } else {
        const user = await requireAuthenticatedUser(req)
        const entitlement = await getServerEntitlement(user.uid)
        tier = entitlement.active ? entitlement.tier : 'free'
        authenticated = true
      }
    } catch (error) {
      return res.status(error.status || 401).json({ error: error.message || 'Authentication failed' })
    }
  }

  const catalog = combineCatalogs(tier)
  const protectedIncludedRecords = ALL_DI_PROTECTED_RECORDS.filter(record => isTierAccessible(record, tier))
  const report = validateCatalog(catalog)

  if (!report.valid) {
    console.error('[di-knowledge] canonical catalog validation failed')
    return res.status(500).json({ error: 'Design Intelligence catalog validation failed' })
  }

  const domains = requestedDomain === 'all' ? DI_DOMAINS : [requestedDomain]
  const records = domains.flatMap(domain => catalog[domain] || [])

  return res.status(200).json({
    ok: true,
    schemaVersion: report.schemaVersion,
    entitlement: {
      tier,
      authenticated,
      protectedIncluded: protectedIncludedRecords.length > 0,
    },
    records,
    counts: Object.fromEntries(domains.map(domain => [domain, catalog[domain]?.length || 0])),
    protectedRecordCount: protectedIncludedRecords.length,
  })
}
