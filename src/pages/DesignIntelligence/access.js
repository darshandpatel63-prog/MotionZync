export const PLAN_OFFERS=[
  {id:'free',name:'Free',price:'₹0',cadence:'forever',access:'Free knowledge + free deterministic generation'},
  {id:'premium-permanent',name:'Premium — permanent',price:'₹500',cadence:'one-time',access:'Entitled Premium/Ultra Premium+ knowledge + personal authorized API capability'},
]
// ₹250 / maximum 10 projects is intentionally not exposed until reliable server-side
// project-count enforcement is implemented and verified.
export const ENTITLEMENT_LEVELS={free:0,premium:1,'ultra-premium':2}
export function hasEntitlement(requiredTier,entitlementTier='free'){return (ENTITLEMENT_LEVELS[entitlementTier]??0)>=(ENTITLEMENT_LEVELS[requiredTier]??0)}
export function accessLabel(tier){if(tier==='ultra-premium')return 'Ultra Premium+';if(tier==='premium')return 'Premium';return 'Free'}
export function canUseDeveloperApi(entitlementTier='free'){return ENTITLEMENT_LEVELS[entitlementTier]>=ENTITLEMENT_LEVELS.premium}
