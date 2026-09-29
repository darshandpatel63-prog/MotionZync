// MotionZync Design Intelligence — deterministic lexical search index.
// Phase A foundation: reusable index builder for the canonical data core.
// The index stores normalized tokens -> record IDs; semantic search remains future.

const tokenize=value=>String(value||'').toLowerCase().split(/[^a-z0-9+#.-]+/).filter(token=>token.length>1)

const recordText=record=>[
  record?.name,
  record?.description,
  record?.mood,
  record?.category,
  ...(record?.tags||[]),
  ...(record?.suitedFor||[]),
  ...(record?.focus||[]),
  record?.layout,
  record?.navigation,
  ...(record?.ux||[]),
  ...(record?.bestFor||[]),
  ...(record?.avoidFor||[]),
].join(' ')

export function buildSearchIndex(records=[]){
  const byToken=new Map()
  const byId=new Map()
  for(const record of Array.isArray(records)?records:[]){
    if(!record?.id)continue
    byId.set(record.id,record)
    const tokens=new Set(tokenize(recordText(record)))
    for(const token of tokens){
      const ids=byToken.get(token)
      if(ids)ids.add(record.id)
      else byToken.set(token,new Set([record.id]))
    }
  }
  return{byToken,byId,size:byId.size}
}

export function searchIndex(index,query=''){
  const tokens=[...new Set(tokenize(query))]
  if(!index?.byId)return[]
  if(!tokens.length)return[...index.byId.values()]
  const ids=new Set()
  for(const token of tokens)for(const id of index.byToken.get(token)||[])ids.add(id)
  if(!ids.size)return[]
  const ordered=[...ids]
  return ordered.map(id=>index.byId.get(id)).filter(Boolean)
}

export function scoreSearchRecord(record,query=''){
  const tokens=[...new Set(tokenize(query))]
  if(!tokens.length)return 0
  const text=recordText(record).toLowerCase()
  return tokens.reduce((score,token)=>score+(text.includes(token)?1:0),0)
}
