import {useAuth} from '../../context/AuthContext.jsx'
import {PLAN_OFFERS,canUseDeveloperApi,accessLabel} from './access.js'
import './DesignIntelligence.css'

export default function DesignIntelligencePricing(){
  const {user,login}=useAuth()
  const developerApiLive=false
  const entitlementTier=user?'premium':'free'
  const hasApi=developerApiLive&&canUseDeveloperApi(entitlementTier)
  const identityText=user
    ? 'Signed in as '+(user.email||user.displayName||'Google user')+'. Your verified login gives you Premium access at ₹0; Ultra Premium+ is the ₹500 paid tier.'
    : 'Without login you can use the Free/public Design Intelligence experience. Google login upgrades the account to Premium at ₹0.'
  return <div className="di-page">
    <section className="di-page-intro">
      <span className="di-kicker">ACCESS MODEL</span>
      <h1>Free · Premium · Ultra Premium+ API</h1>
      <p>Simple/public designs stay available without login. Google login unlocks Premium access for free. A verified ₹500 payment upgrades the account to Ultra Premium+ and server-authorizes the developer API.</p>
    </section>

    <section className="di-plan-grid">
      {PLAN_OFFERS.map(plan=><article className={'di-plan '+(plan.id==='ultra-premium-api'?'featured':'')} key={plan.id}>
        <span className="di-kicker">{plan.cadence.toUpperCase()}</span>
        <h2>{plan.name}</h2>
        <strong>{plan.price}</strong>
        <p>{plan.access}</p>
        <p className="di-muted"><b>npm:</b> {plan.npmAccess}</p>
        {plan.specialAccess&&<p className="di-warning"><b>Special effects:</b> {plan.specialAccess}</p>}
        <span className="di-plan-action">{plan.id==='guest-free'?'Available now':plan.id==='member-premium'?(user?'Premium active on this login':'Login to activate'):'₹500 checkout is server-authorized; live gateway UI remains pending merchant verification'}</span>
      </article>)}
    </section>

    <section className="di-grid-2">
      <article className="di-surface">
        <span className="di-kicker">IDENTITY</span>
        <h2>{user?'Premium active':'Free access'}</h2>
        <p>{identityText}</p>
        {!user&&<button className="di-btn di-btn-primary" onClick={login}>Continue with Google</button>}
        {user&&<div className="di-note" role="status">Current web tier: {accessLabel(entitlementTier)} · API tier: Ultra Premium+ only.</div>}
      </article>

      <article className="di-surface">
        <span className="di-kicker">DEVELOPER API</span>
        <h2>{hasApi?'API key available':'Ultra Premium+ required'}</h2>
        <p>MotionZync API keys are never fabricated in frontend code. API issuance, rotation and revocation remain server-authoritative, and special animation/effects are intentionally not exposed as ordinary web-only features.</p>
        <span className="di-api-state">{developerApiLive?'Backend-connected':'Backend lifecycle foundation implemented; live issuance/paid checkout still pending end-to-end verification.'}</span>
      </article>
    </section>

    <section className="di-surface">
      <span className="di-kicker">IMPORTANT</span>
      <h2>What each tier can do</h2>
      <div className="di-table">
        <div><b>Free / no login</b><span>Simple/public knowledge, recipes and normal web use.</span></div>
        <div><b>Premium / Google login</b><span>Premium protected knowledge and generation for ₹0; npm access uses the same canonical intelligence core.</span></div>
        <div><b>Ultra Premium+ / ₹500</b><span>All web-accessible knowledge plus server-authorized API access.</span></div>
        <div><b>Special animation + effects</b><span>API-only capability; requires Ultra Premium+ and a valid server-issued API key.</span></div>
      </div>
    </section>
  </div>
}
