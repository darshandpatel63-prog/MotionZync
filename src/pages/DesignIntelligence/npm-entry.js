export * from './access.js'
export * from './catalog.js'
export * from './engine.js'
export * from './schema.js'
export * from './searchIndex.js'
export * from './relationships.js'

export const DESIGN_INTELLIGENCE_NPM_VERSION='0.1.0'

export function createRemoteKnowledgeClient({
  baseUrl='',
  bearerToken='',
  fetchImpl=globalThis.fetch,
}={}){
  if(typeof fetchImpl!=='function')throw new Error('A fetch implementation is required')
  const root=String(baseUrl||'').replace(/\/$/,'')
  return {
    async fetchKnowledge(domain='all'){
      const query=domain&&domain!=='all'?'?domain='+encodeURIComponent(domain):''
      const headers={}
      if(bearerToken)headers.Authorization='Bearer '+bearerToken
      const response=await fetchImpl(root+'/api/di-knowledge'+query,{headers})
      const body=await response.json().catch(()=>null)
      if(!response.ok)throw new Error(body?.error||'Design Intelligence knowledge service is unavailable')
      return body
    },
  }
}
