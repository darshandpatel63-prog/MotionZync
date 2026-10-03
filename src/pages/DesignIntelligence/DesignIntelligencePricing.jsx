import {useEffect,useState} from 'react'
import {useAuth} from '../../context/AuthContext.jsx'
import {PLAN_OFFERS,canUseDeveloperApi,accessLabel,ULTRA_PREMIUM_PRICE_INR} from './access.js'
import {fetchDesignIntelligenceKnowledge} from './knowledgeClient.js'
import './DesignIntelligence.css'

let cashfreeSdkPromise=null
function loadCashfree(mode='sandbox'){
  if(typeof window==='undefined')return Promise.reject(new Error('Cashfree checkout is only available in a browser.'))
  if(typeof window.Cashfree==='function')return Promise.resolve(window.Cashfree({mode}))
  if(cashfreeSdkPromise)return cashfreeSdkPromise
  cashfreeSdkPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-motionzync-cashfree]')
    if(existing){
      existing.addEventListener('load',()=>resolve(window.Cashfree({mode})),{once:true})
      existing.addEventListener('error',()=>reject(new Error('Cashfree Checkout SDK could not be loaded.')),{once:true})
      return
    }
    const script=document.createElement('script')
    script.src='https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async=true
    script.dataset.motionzyncCashfree='true'
    script.onload=()=>typeof window.Cashfree==='function'
      ?resolve(window.Cashfree({mode}))
      :reject(new Error('Cashfree Checkout SDK loaded without the expected API.'))
    script.onerror=()=>reject(new Error('Cashfree Checkout SDK could not be loaded.'))
    document.head.appendChild(script)
  })
  return cashfreeSdkPromise
}

export default function DesignIntelligencePricing(){
  const {user,login}=useAuth()
  const [entitlementTier,setEntitlementTier]=useState('free')
  const [identityStatus,setIdentityStatus]=useState(user?'Checking server entitlement…':'Free/public access')
  const [apiState,setApiState]=useState({active:[],entitlement:null})
  const [apiSecret,setApiSecret]=useState('')
  const [apiStatus,setApiStatus]=useState('')
  const [apiBusy,setApiBusy]=useState(false)
  const [phone,setPhone]=useState('')
  const [checkoutBusy,setCheckoutBusy]=useState(false)
  const [checkoutStatus,setCheckoutStatus]=useState('')
  // Public payment launch is intentionally pending. Keep the server-side payment implementation intact.
  const PAYMENT_LAUNCH_PENDING=true

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


  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    const orderId=params.get('order_id')
    if(params.get('payment')!=='returned'||!orderId)return
    setCheckoutStatus('Cashfree returned for order '+orderId+'. Server-side webhook verification remains authoritative; no payment success is assumed from the return URL.')
    if(user){
      fetchDesignIntelligenceKnowledge(user).then(result=>{
        if(result?.entitlementTier==='ultra-premium'){
          setCheckoutStatus('Ultra Premium+ entitlement is now verified server-side for the returned Cashfree order.')
        }
      }).catch(()=>{})
    }
  },[user])

  const runCheckout=async()=>{
    if(!user){setCheckoutStatus('Sign in with Google before starting the ₹'+ULTRA_PREMIUM_PRICE_INR+' checkout.');return}
    const cleanPhone=phone.trim()
    if(!/^\+?[0-9 ()-]{8,20}$/.test(cleanPhone)){
      setCheckoutStatus('Enter a valid customer phone number before continuing.')
      return
    }
    setCheckoutBusy(true)
    setCheckoutStatus('Creating a server-authorized Cashfree order…')
    try{
      const token=await user.getIdToken()
      const response=await fetch('/api/cashfree-create-order',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({phone:cleanPhone})
      })
      const json=await response.json().catch(()=>null)
      if(!response.ok)throw new Error(json?.error||'Cashfree order creation failed')
      if(!json?.paymentSessionId)throw new Error('Cashfree did not return a payment session')
      setCheckoutStatus('Opening Cashfree Checkout…')
      const cashfree=await loadCashfree(json.environment==='production'?'production':'sandbox')
      const result=await cashfree.checkout({paymentSessionId:json.paymentSessionId,redirectTarget:'_self'})
      if(result?.error)setCheckoutStatus(result.error.message||'Cashfree checkout reported an error. Payment status must be checked server-side.')
    }catch(error){
      setCheckoutStatus(error?.message||'Unable to start Cashfree checkout.')
    }finally{
      setCheckoutBusy(false)
    }
  }

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
      <p>Simple/public designs stay available without login. Google login unlocks Premium access for free. A verified payment will upgrade the account to Ultra Premium+ and server-authorize the developer API when the payment launch is enabled.</p>
      <div className="di-note" role="status">{identityStatus} · Current tier: {accessLabel(entitlementTier)}</div>
    </section>

    <section className="di-plan-grid">
      {PLAN_OFFERS.map(plan=><article className={'di-plan '+(plan.id==='ultra-premium-api'?'featured':'')} key={plan.id}>
        <span className="di-kicker">{plan.cadence.toUpperCase()}</span>
        <h2>{plan.name}</h2>
        {plan.id==='ultra-premium-api'&&PAYMENT_LAUNCH_PENDING
          ?<strong>Coming soon</strong>
          :<strong>{plan.price}</strong>}
        <p>{plan.access}</p>
        <p className="di-muted"><b>npm:</b> {plan.npmAccess}</p>
        {plan.specialAccess&&<p className="di-warning"><b>Special effects:</b> {plan.specialAccess}</p>}
        <span className="di-plan-action">{plan.id==='guest-free'?'Available now':plan.id==='member-premium'?(user?'Premium active on this login':'Login to activate'):(PAYMENT_LAUNCH_PENDING?'Payment launch pending':'₹'+ULTRA_PREMIUM_PRICE_INR+' server-authorized one-time checkout')}</span>
      </article>)}
    </section>

    <section className="di-surface">
      <span className="di-kicker">ULTRA PREMIUM+ ACCESS</span>
      <h2>{ultra?'Ultra Premium+ already active':'Payment launch pending'}</h2>
      {ultra
        ?<p>Your existing server-authorized Ultra Premium+ entitlement remains active. No new payment is requested.</p>
        :<div className="di-note" role="status">
          <b>Payment integration is temporarily pending.</b> Ultra Premium+ checkout is not available from the public UI yet. The payment security, server authorization, webhook verification and entitlement infrastructure remain in place for the later launch.
        </div>}
      {checkoutStatus&&<div className="di-note" role="status">{checkoutStatus}</div>}
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
        <div><b>Ultra Premium+ / payment launch pending</b><span>All web-accessible knowledge plus server-authorized API access when the payment launch is enabled.</span></div>
        <div><b>Special animation + effects</b><span>API-only capability; requires Ultra Premium+ and a valid server-issued API key. The bounded special-effects API is implemented; deployed runtime and real-entitlement exercise remain unverified.</span></div>
      </div>
    </section>
  </div>
}
