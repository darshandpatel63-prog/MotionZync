const DOMAINS=['styles','palettes','typography','charts','stacks','recipes']

const emptyCatalog=()=>Object.fromEntries(DOMAINS.map(domain=>[domain,[]]))

export const FREE_KNOWLEDGE_SOURCE=Object.freeze({
  styles:[],
  palettes:[],
  typography:[],
  charts:[],
  stacks:[],
  recipes:[],
})

function mergeById(records){
  const map=new Map()
  for(const record of Array.isArray(records)?records:[]){
    if(record?.id)map.set(record.id,record)
  }
  return [...map.values()]
}

export async function fetchDesignIntelligenceKnowledge(user=null){
  const headers={}
  if(user?.getIdToken){
    const token=await user.getIdToken()
    if(token)headers.Authorization='Bearer '+token
  }

  const response=await fetch('/api/di-knowledge',{headers})
  const json=await response.json().catch(()=>null)
  if(!response.ok){
    throw new Error(json?.error||'Design Intelligence knowledge service is unavailable')
  }

  const records=emptyCatalog()
  for(const record of Array.isArray(json?.records)?json.records:[]){
    if(DOMAINS.includes(record?.domain)&&record?.id)records[record.domain].push(record)
  }

  return {
    catalogs:records,
    entitlementTier:json?.entitlement?.tier||'free',
    protectedIncluded:json?.entitlement?.protectedIncluded===true,
    counts:json?.counts||{},
  }
}

export function mergeKnowledgeCatalog(base,remote){
  const next=Object.fromEntries(DOMAINS.map(domain=>[
    domain,
    mergeById([...(Array.isArray(base?.[domain])?base[domain]:[]),...(Array.isArray(remote?.[domain])?remote[domain]:[])])
  ]))
  return next
}
