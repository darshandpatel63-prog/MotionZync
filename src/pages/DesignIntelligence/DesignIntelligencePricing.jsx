import {useEffect,useState} from 'react'
import {useAuth} from '../../context/AuthContext.jsx'
import {PLAN_OFFERS,canUseDeveloperApi,accessLabel,ULTRA_PREMIUM_PRICE_INR} from './access.js'
import {fetchDesignIntelligenceKnowledge} from './knowledgeClient.js'
import './DesignIntelligence.css'

export default function DesignIntelligencePricing(){
  const {user,login}=useAuth()
  const [entitlementTier,setEntitlementTier]=useState('free')
  const [identityStatus,setIdentityStatus]=useState(user?'Checking server entitlement…':'Free/public access')
  const [apiState,setApiState]=useState({active:[],entitlement:null})
  const [apiSecret,setApiSecret]=useState('')
  const [apiStatus,setApiStatus]=useState('')
  const [apiBusy,setApiBusy]=useState(false)

  useEffect(()=>{
    let active=true
    if(!user){
      setEntitlementTier('free')
      setIdentityStatus('Free/public access')
      setApiState({active:[],entitlement:null})
      return()=>{}
    }

    setIdentityStatus('Checking server entitlement…')
    fetchDesignIntelligenceKnowledge(user).then(result=>{
      if(!active)return
      setEntitlementTier(result.entitlementTier||'premium')
      setIdentityStatus('Server entitlement verified: '+accessLabel(result.entitlementTier||'premium')+'.')
    }).catch(error=>{
      if(!active)return
      setEntitlementTier('premium')
      setIdentityStatus(error?.message||'Authenticated Premium access; server entitlement could not be refreshed.')
    })

    return()=>{active=false}
  },[user])

  useEffect(()=>{
    let active=true
    if(!user)return()=>{}
    user.getIdToken().then(token=>fetch('/api/di-api-key',{headers:{Authorization:'Bearer '+token}}))
      .then(async response=>{
        const json=await response.json().catch(()=>null)
        if(!response.ok)throw new Error(json?.error||'API-key status unavailable')
        if(active)setApiState(json.result||{active:[],entitlement:null})
      })
      .catch(error=>{if(active)setApiStatus(error?.message||'API-key status unavailable')})
    return()=>{active=false}
  },[user,entitlementTier])

  const runApiAction=async(action)=>{
    if(!user)return
    setApiBusy(true)
    setApiStatus('')
    setApiSecret('')
    try{
      const token=await user.getIdToken()
      const response=await fetch('/api/di-api-key',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({action})
      })
      const json=await response.json().catch(()=>null)
      if(!response.ok)throw new Error(json?.error||'API-key operation failed')
      if(json?.key)setApiSecret(json.key)
      if(json?.result)setApiState(prev=>({...prev,...json.result}))
      setApiStatus(action==='revoke'?'All active API keys were revoked.':action==='rotate'?'API key rotated successfully.':'API key issued successfully.')
    }catch(error){setApiStatus(error?.message||'API-key operation failed')}
    finally{setApiBusy(false)}
  }

  const currentKey=apiState.active?.[0]||null
  const ultra=canUseDeveloperApi(entitlementTier)

  return <div className="di-page">
    <section className="di-page-intro">
      <span className="di-kicker">ACCESS MODEL</span>
      <h1>Free · Premium · Ultra Premium+ API</h1>
      <p>Simple/public designs stay available without login. Google login unlocks Premium access for free. A verified ₹{ULTRA_PREMIUM_PRICE_INR} payment upgrades the account to Ultra Premium+ and server-authorizes the developer API.</p>
      <div className="di-note" role="status">{identityStatus} · Current tier: {accessLabel(entitlementTier)}</div>
    </section>

    <section className="di-plan-grid">
      {PLAN_OFFERS.map(plan=><article className={'di-plan '+(plan.id==='ultra-premium-api'?'featured':'')} key={plan.id}>
        <span className="di-kicker">{plan.cadence.toUpperCase()}</span>
        <h2>{plan.name}</h2>
        <strong>{plan.price}</strong>
        <p>{plan.access}</p>
        <p className="di-muted"><b>npm:</b> {plan.npmAccess}</p>
        {plan.specialAccess&&<p className="di-warning"><b>Special effects:</b> {plan.specialAccess}</p>}
        <span className="di-plan-action">{plan.id==='guest-free'?'Available now':plan.id==='member-premium'?(user?'Premium active on this login':'Login to activate'):`₹${ULTRA_PREMIUM_PRICE_INR} checkout is server-authorized; live gateway UI remains pending merchant verification`}</span>
      </article>)}
    </section>

    <section className="di-grid-2">
      <article className="di-surface">
        <span className="di-kicker">IDENTITY</span>
        <h2>{user?'Premium / entitled account':'Free access'}</h2>
        <p>{user?'Signed in as '+(user.email||user.displayName||'Google user')+'. Login itself grants Premium at ₹0; paid Ultra Premium+ is a separate server-authorized entitlement.':'Without login you can use the Free/public Design Intelligence experience. Google login upgrades the account to Premium at ₹0.'}</p>
        {!user&&<button className="di-btn di-btn-primary" onClick={login}>Continue with Google</button>}
      </article>

      <article className="di-surface">
        <span className="di-kicker">DEVELOPER API</span>
        <h2>{ultra?'Ultra Premium+ API':'Ultra Premium+ required'}</h2>
        <p>Only Ultra Premium+ can issue MotionZync API keys. Keys are server-generated, stored only as hashes, and shown in plaintext only once after issue/rotation.</p>
        {!ultra&&<div className="di-api-state">Premium login does not include developer API access.</div>}
        {ultra&&<div className="di-actions">
          {!currentKey&&<button className="di-btn di-btn-primary" disabled={apiBusy} onClick={()=>runApiAction('issue')}>{apiBusy?'Working…':'Issue API key'}</button>}
          {currentKey&&<button className="di-btn di-btn-secondary" disabled={apiBusy} onClick={()=>runApiAction('rotate')}>{apiBusy?'Working…':'Rotate API key'}</button>}
          {currentKey&&<button className="di-btn di-btn-secondary" disabled={apiBusy} onClick={()=>runApiAction('revoke')}>{apiBusy?'Working…':'Revoke API key'}</button>}
        </div>}
        {currentKey&&<div className="di-note" role="status">Active key: <code>{currentKey.prefix}</code> · Last used: {currentKey.lastUsedAt||'not used yet'}</div>}
        {apiSecret&&<div className="di-warning"><b>Save this secret now:</b><pre className="di-code">{apiSecret}</pre><button className="di-btn di-btn-secondary" onClick={()=>navigator.clipboard?.writeText(apiSecret)}>Copy API key</button><p className="di-muted">The plaintext secret is not stored and cannot be shown again after leaving this state.</p></div>}
        {apiStatus&&<div className="di-note" role="status">{apiStatus}</div>}
      </article>
    </section>

    <section className="di-surface">
      <span className="di-kicker">IMPORTANT</span>
      <h2>What each tier can do</h2>
      <div className="di-table">
        <div><b>Free / no login</b><span>Simple/public knowledge, recipes and normal web use.</span></div>
        <div><b>Premium / Google login</b><span>Premium protected knowledge and generation for ₹0; npm access uses the same canonical intelligence core.</span></div>
        <div><b>Ultra Premium+ / ₹{ULTRA_PREMIUM_PRICE_INR}</b><span>All web-accessible knowledge plus server-authorized API access.</span></div>
        <div><b>Special animation + effects</b><span>API-only capability; requires Ultra Premium+ and a valid server-issued API key. The bounded special-effects API is implemented; deployed runtime and real-entitlement exercise remain unverified.</span></div>
      </div>
    </section>
  </div>
}
