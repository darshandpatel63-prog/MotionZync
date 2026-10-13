import {useEffect,useMemo,useState} from 'react'
import {useSearchParams,Link} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext.jsx'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS,DI_RECIPES} from './catalog.js'
import {searchCatalog} from './engine.js'
import {accessLabel} from './access.js'
import {fetchDesignIntelligenceKnowledge,mergeKnowledgeCatalog} from './knowledgeClient.js'
import './DesignIntelligence.css'

const DOMAINS=[['all','All'],['styles','Styles'],['palettes','Palettes'],['typography','Typography'],['charts','Charts'],['stacks','Stacks'],['recipes','Recipes']]
const PUBLIC_CATALOG={styles:DI_STYLES,palettes:DI_PALETTES,typography:DI_TYPOGRAPHY,charts:DI_CHARTS,stacks:DI_STACKS,recipes:DI_RECIPES}

export default function DesignIntelligenceExplorer(){
  const {user}=useAuth()
  const [params]=useSearchParams()
  const [query,setQuery]=useState(params.get('q')||'')
  const [domain,setDomain]=useState(params.get('domain')||'all')
  const [catalog,setCatalog]=useState(PUBLIC_CATALOG)
  const [entitlementTier,setEntitlementTier]=useState('free')
  const [designAccessTier,setDesignAccessTier]=useState('free')
  const [tierFilter,setTierFilter]=useState('all')
  const [contentAccessReason,setContentAccessReason]=useState('public-free')
  const [knowledgeState,setKnowledgeState]=useState('Loading free knowledge…')
  const results=useMemo(()=>searchCatalog(query,domain,designAccessTier,catalog).filter(item=>tierFilter==='all'||item.tier===tierFilter),[query,domain,designAccessTier,tierFilter,catalog])

  useEffect(()=>{
    let active=true
    fetchDesignIntelligenceKnowledge(user)
      .then(result=>{
        if(!active)return
        setCatalog(prev=>mergeKnowledgeCatalog(prev,result.catalogs))
        setEntitlementTier(result.entitlementTier||'free')
        setDesignAccessTier(result.designAccessTier||result.entitlementTier||'free')
        setContentAccessReason(result.contentAccessReason||'public-free')
        setKnowledgeState(result.ultraContentIncluded&&result.entitlementTier==='premium'?'Ultra Premium design content is shared by the current admin policy; developer API access stays Premium-restricted.':result.protectedIncluded?'Verified entitlement knowledge loaded.':'Free knowledge loaded.')
      })
      .catch(error=>{
        if(!active)return
        setKnowledgeState(error?.message||'Free knowledge remains available.')
      })
    return()=>{active=false}
  },[user])

  return <div className="di-page"><section className="di-page-intro"><span className="di-kicker">EXPLORE · DESIGN INGREDIENTS</span><h1>Search design knowledge, then use it</h1><p>Pick a palette, visual style, typography pairing, chart, technology stack or recipe and carry that exact canonical record into Generator. Or start with a complete UI composition in Gallery.</p><div className="di-actions"><Link to="/design-intelligence/ui-gallery" className="di-btn di-btn-primary">Browse 3,600 UI compositions →</Link><Link to="/design-intelligence/generator" className="di-btn di-btn-secondary">Start from a prompt →</Link></div></section><section className="di-surface"><label className="di-label" htmlFor="di-search">Search</label><input id="di-search" className="di-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: dark developer dashboard, healthcare, React"/><div className="di-chip-row" role="group" aria-label="Knowledge domain">{DOMAINS.map(([id,label])=><button key={id} className={'di-chip '+(domain===id?'active':'')} aria-pressed={domain===id} onClick={()=>setDomain(id)}>{label}</button>)}</div><div className="di-tier-filter" role="group" aria-label="Design tier filter"><span>Design tier</span>{[['all','All tiers'],['free','Simple / Free'],['premium','Premium'],['ultra-premium','Ultra Premium+']].map(([id,label])=><button type="button" key={id} className={'di-chip '+(tierFilter===id?'active':'')} aria-pressed={tierFilter===id} onClick={()=>setTierFilter(id)}>{label}</button>)}</div><div className="di-note" role="status">{knowledgeState} · Account tier: {accessLabel(entitlementTier)}{designAccessTier==='ultra-premium'&&entitlementTier!=='ultra-premium'?' · Ultra design content is currently visible by policy or offer.':''}</div></section><div className="di-result-grid">{results.map(item=><article className="di-record" key={item.id}><div className="di-record-head"><span className="di-record-domain">{item.domain||item.category}</span><span className={'di-tier tier-'+item.tier}>{accessLabel(item.tier)}</span></div><h2>{item.name}</h2><p>{item.description||item.purpose||item.layout||item.focus?.join(' · ')||((item.heading||'')+' + '+(item.body||''))}</p><div className="di-tags">{(item.tags||item.focus||[]).slice(0,5).map(tag=><span key={tag}>{tag}</span>)}</div><Link className="di-btn di-btn-secondary di-ingredient-use" to={`/design-intelligence/generator?ingredientDomain=${encodeURIComponent(Object.keys(catalog).find(key=>(catalog[key]||[]).some(record=>record.id===item.id))||domain)}&ingredient=${encodeURIComponent(item.id)}`}>Use this ingredient →</Link></article>)}</div>{!results.length&&<div className="di-empty">No current seed record matched this query. That is a real “no match” state — it does not fabricate an answer.</div>}</div>
}
