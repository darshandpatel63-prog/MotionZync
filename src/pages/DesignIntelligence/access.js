export const ULTRA_PREMIUM_PRICE_INR=200
export const PLAN_OFFERS=[
  {
    id:'guest-free',
    name:'Free',
    price:'₹0',
    cadence:'forever',
    access:'Simple/public design knowledge, deterministic recipes and free exports without login.',
    npmAccess:'Free/local npm distribution of the public seed catalog via the published package.'
  },
  {
    id:'member-premium',
    name:'Premium (Google login)',
    price:'₹0',
    cadence:'with login',
    access:'Premium protected web knowledge and generation at no payment; Firebase identity is verified server-side.',
    npmAccess:'Premium npm usage is supported by the same canonical core; protected remote knowledge requires authenticated access.'
  },
  {
    id:'ultra-premium-api',
    name:'Ultra Premium+ API',
    price:'₹200',
    cadence:'one-time',
    access:'All web-accessible Design Intelligence knowledge plus the server-authorized developer API.',
    npmAccess:'Ultra npm/API integrations can use the same canonical core with server-authorized API access.',
    specialAccess:'Special animation and effects are API-only and require Ultra Premium+.'
  },
]

export const ENTITLEMENT_LEVELS={free:0,premium:1,'ultra-premium':2}

export function hasEntitlement(requiredTier,entitlementTier='free'){
  const requiredLevel=ENTITLEMENT_LEVELS[requiredTier]
  if(requiredLevel===undefined)return false
  const currentLevel=ENTITLEMENT_LEVELS[entitlementTier]??ENTITLEMENT_LEVELS.free
  return currentLevel>=requiredLevel
}

export function accessLabel(tier){
  if(tier==='ultra-premium')return 'Ultra Premium+'
  if(tier==='premium')return 'Premium'
  return 'Free'
}

export function canUseDeveloperApi(entitlementTier='free'){
  return entitlementTier==='ultra-premium'
}

export function canUseSpecialEffects(entitlementTier='free',channel='web'){
  return channel==='api'&&entitlementTier==='ultra-premium'
}

export const NPM_ACCESS_POLICY=Object.freeze({
  guest:'public-free',
  premium:'authenticated-premium',
  ultra:'ultra-premium-api',
  specialEffects:'api-only-ultra-premium',
})
