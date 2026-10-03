import {useEffect,useMemo,useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext.jsx'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_RECIPES} from './catalog.js'
import {accessLabel} from './access.js'
import {fetchDesignIntelligenceKnowledge,mergeKnowledgeCatalog} from './knowledgeClient.js'
import './DesignIntelligence.css'

const DOMAINS=[
  ['styles','Styles','/design-intelligence/explorer?domain=styles'],
  ['palettes','Palettes','/design-intelligence/explorer?domain=palettes'],
  ['typography','Typography','/design-intelligence/explorer?domain=typography'],
  ['charts','Charts','/design-intelligence/explorer?domain=charts'],
  ['recipes','Recipes','/design-intelligence/explorer?domain=recipes'],
]
const PUBLIC_CATALOG={styles:DI_STYLES,palettes:DI_PALETTES,typography:DI_TYPOGRAPHY,charts:DI_CHARTS,recipes:DI_RECIPES,stacks:[]}

export default function DesignIntelligenceKnowledge(){
  const {user}=useAuth()
  const [catalog,setCatalog]=useState(PUBLIC_CATALOG)
  const [entitlementTier,setEntitlementTier]=useState('free')
  const [status,setStatus]=useState('Loading free knowledge…')

  useEffect(()=>{
    let active=true
    fetchDesignIntelligenceKnowledge(user).then(result=>{
      if(!active)return
      setCatalog(prev=>mergeKnowledgeCatalog(prev,result.catalogs))
      setEntitlementTier(result.entitlementTier||'free')
      setStatus(result.protectedIncluded?'Protected entitlement knowledge loaded.':'Free knowledge loaded.')
    }).catch(error=>{
      if(!active)return
      setStatus(error?.message||'Free knowledge remains available.')
    })
    return()=>{active=false}
  },[user])

  const cards=useMemo(()=>DOMAINS.map(([id,name,to])=>({
    id,name,to,data:catalog[id]||[],
  })),[catalog])

  return <div className="di-page">
    <section className="di-page-intro">
      <span className="di-kicker">KNOWLEDGE DOMAINS</span>
      <h1>What the intelligence knows</h1>
      <p>Each domain is structured data, not a visual list. Protected knowledge is delivered from the same canonical server source according to the current access tier.</p>
      <div className="di-note" role="status">{status} · Access tier: {accessLabel(entitlementTier)}</div>
    </section>

    <div className="di-grid-2">
      {cards.map(({id,name,to,data})=><article className="di-surface" key={id}>
        <div className="di-record-head">
          <span className="di-record-domain">DOMAIN</span>
          <span className="di-count">{data.length} accessible records</span>
        </div>
        <h2>{name}</h2>
        <p>{data.slice(0,6).map(x=>x.name).join(' · ')||'No accessible records yet.'}</p>
        <Link to={to}>Explore {name} →</Link>
      </article>)}
    </div>

    <section className="di-surface">
      <span className="di-kicker">SCALABILITY</span>
      <h2>Designed for 1,000+ and later 10,000+</h2>
      <p>Records are separated by domain and referenced by stable IDs. A future indexing pipeline can validate IDs, relationships, duplicates, color values, font names, accessibility metadata and provenance before publication.</p>
      <p className="di-muted">No Style001 / Style002 / … filler strategy is used.</p>
    </section>
  </div>
}
