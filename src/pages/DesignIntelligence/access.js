export const PLAN_OFFERS=[
  {id:'free',name:'Free',price:'₹0',cadence:'forever',access:'Free knowledge + free recipes'},
  {id:'premium-intro',name:'Premium — first month',price:'₹50',cadence:'first month',access:'Premium catalog + developer API entitlement'},
  {id:'premium-monthly',name:'Premium — monthly',price:'₹80',cadence:'per month',access:'Premium catalog + developer API entitlement'},
  {id:'premium-2month',name:'Premium — 2 months',price:'₹150',cadence:'2 months',access:'Premium catalog + developer API entitlement'},
  {id:'premium-permanent',name:'Premium — permanent',price:'₹200–₹250',cadence:'one-time',access:'Premium catalog + developer API entitlement'},
]
export const ENTITLEMENT_LEVELS={free:0,premium:1,'ultra-premium':2}
export function hasEntitlement(requiredTier,entitlementTier='free'){return (ENTITLEMENT_LEVELS[entitlementTier]??0)>=(ENTITLEMENT_LEVELS[requiredTier]??0)}
export function accessLabel(tier){if(tier==='ultra-premium')return 'Ultra Premium+';if(tier==='premium')return 'Premium';return 'Free'}
export function canUseDeveloperApi(entitlementTier='free'){return ENTITLEMENT_LEVELS[entitlementTier]>=ENTITLEMENT_LEVELS.premium}
