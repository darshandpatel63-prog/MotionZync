import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './DesignIntelligenceAdminBilling.css'

const EMPTY = {
  summary:{uniquePayers:0,successfulPayments:0,grossRevenue:0,refundedAmount:0,activeEntitlements:0,activeApiKeys:0,apiKeyHolders:0,activeApiKeyHolders:0,manualGrants:0,totalPaymentRecords:0},
  paymentStatus:[],planDistribution:[],entitlementSources:[],apiKeyStatus:[],monthly:[],recentTransactions:[]
}

const money = (value,currency='INR') => new Intl.NumberFormat('en-IN',{style:'currency',currency,maximumFractionDigits:2}).format(Number(value)||0)
const label = value => String(value || 'unknown').replace(/[-_]/g,' ').replace(/\b\w/g,char=>char.toUpperCase())

function BarChart({title,description,data}) {
  const max=Math.max(1,...data.map(item=>Number(item.value)||0))
  return <section className="di-admin-chart" aria-label={title}>
    <div className="di-admin-chart-head"><div><h3>{title}</h3><p>{description}</p></div></div>
    {!data.length ? <div className="di-admin-empty-chart">No real records yet.</div> :
      <div className="di-admin-bars">{data.map(item=><div className="di-admin-bar-row" key={item.name}>
        <div className="di-admin-bar-label" title={item.name}>{label(item.name)}</div>
        <div className="di-admin-bar-track"><span style={{width:`${Math.max(2,(Number(item.value)||0)/max*100)}%`}}/></div>
        <strong>{item.value}</strong>
      </div>)}</div>}
  </section>
}

function LineChart({data}) {
  const width=720,height=240,pad=34
  const max=Math.max(1,...data.map(item=>Number(item.revenue)||0))
  const points=data.map((item,index)=>{
    const x=data.length===1?width/2:pad+(index/(data.length-1))*(width-pad*2)
    const y=height-pad-((Number(item.revenue)||0)/max)*(height-pad*2)
    return {x,y,item}
  })
  const polyline=points.map(point=>`${point.x},${point.y}`).join(' ')
  return <section className="di-admin-chart" aria-label="Monthly revenue trend">
    <div className="di-admin-chart-head"><div><h3>Monthly revenue</h3><p>Successful payment revenue by purchase month.</p></div></div>
    {!data.length ? <div className="di-admin-empty-chart">No successful payments yet.</div> :
      <div className="di-admin-line-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Monthly successful payment revenue line chart">
          <polyline points={polyline} fill="none" stroke="url(#diRevenue)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <defs><linearGradient id="diRevenue" x1="0" x2="1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
          {points.map(point=><g key={point.item.month}>
            <circle cx={point.x} cy={point.y} r="5" fill="#0b1020" stroke="#67e8f9" strokeWidth="3"/>
            <text x={point.x} y={height-8} textAnchor="middle" className="di-admin-axis">{point.item.month}</text>
          </g>)}
        </svg>
        <div className="di-admin-line-values">{data.map(item=><span key={item.month}>{item.month}: {money(item.revenue)}</span>)}</div>
      </div>}
  </section>
}

function DonutChart({title,description,data}) {
  const total=data.reduce((sum,item)=>sum+(Number(item.value)||0),0)
  let cursor=0
  const stops=data.map((item,index)=>{
    const start=total?cursor/total*360:0
    cursor+=Number(item.value)||0
    const end=total?cursor/total*360:start
    const colors=['#7c3aed','#06b6d4','#22c55e','#f59e0b','#ef4444','#ec4899']
    return `${colors[index%colors.length]} ${start}deg ${end}deg`
  }).join(', ')
  return <section className="di-admin-chart" aria-label={title}>
    <div className="di-admin-chart-head"><div><h3>{title}</h3><p>{description}</p></div></div>
    {!data.length ? <div className="di-admin-empty-chart">No real records yet.</div> :
      <div className="di-admin-donut-layout">
        <div className="di-admin-donut" style={{background:`conic-gradient(${stops})`}} aria-label={`${total} total records`}><div>{total}<small>Total</small></div></div>
        <div className="di-admin-legend">{data.map((item,index)=><div key={item.name}><i className="di-admin-legend-dot" style={{background:['#7c3aed','#06b6d4','#22c55e','#f59e0b','#ef4444','#ec4899'][index%6]}}/><span>{label(item.name)}</span><strong>{item.value}</strong></div>)}</div>
      </div>}
  </section>
}

export default function DesignIntelligenceAdminBilling() {
  const { user } = useAuth()
  const [data,setData]=useState(EMPTY)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [grantEmail,setGrantEmail]=useState('')
  const [grantTier,setGrantTier]=useState('premium')
  const [grantStatus,setGrantStatus]=useState('')
  const [granting,setGranting]=useState(false)

  const load=async()=>{
    setLoading(true);setError('')
    try{
      const token=await user.getIdToken()
      const response=await fetch('/api/admin-billing',{headers:{Authorization:`Bearer ${token}`}})
      const json=await response.json()
      if(!response.ok)throw new Error(json.error||'Could not load billing analytics')
      setData({...EMPTY,...json,summary:{...EMPTY.summary,...json.summary}})
    }catch(error){setError(error.message||'Could not load billing analytics')}
    finally{setLoading(false)}
  }

  useEffect(()=>{if(user)load()},[user])

  const recent=useMemo(()=>data.recentTransactions||[],[data.recentTransactions])

  const grant=async event=>{
    event.preventDefault();setGrantStatus('')
    if(!grantEmail.trim())return
    setGranting(true)
    try{
      const token=await user.getIdToken()
      const response=await fetch('/api/admin-billing',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({action:'grantEntitlement',email:grantEmail,tier:grantTier})
      })
      const json=await response.json()
      if(!response.ok)throw new Error(json.error||'Grant failed')
      setGrantStatus(`Granted ${label(grantTier)} to ${json.result.email}. No payment was created.`)
      setGrantEmail('')
      await load()
    }catch(error){setGrantStatus(error.message||'Grant failed')}
    finally{setGranting(false)}
  }

  if(loading)return <div className="di-admin-billing"><div className="di-admin-loading">Loading server billing data…</div></div>
  if(error)return <div className="di-admin-billing"><div className="di-admin-error"><strong>Billing analytics unavailable.</strong><span>{error}</span><button onClick={load}>Retry</button></div></div>

  const s=data.summary
  return <div className="di-admin-billing">
    <div className="di-admin-billing-header">
      <div><span className="di-admin-kicker">DESIGN INTELLIGENCE</span><h2>Billing & entitlement analytics</h2><p>Server-derived data only. Payment records and entitlements are read from the canonical backend collections; no frontend counters are trusted.</p></div>
      <button className="di-admin-refresh" onClick={load}>↻ Refresh</button>
    </div>

    <div className="di-admin-kpis">
      {[
        ['Unique payers',s.uniquePayers],
        ['Successful payments',s.successfulPayments],
        ['Gross revenue',money(s.grossRevenue)],
        ['Active entitlements',s.activeEntitlements],
        ['Active API keys',s.activeApiKeys],
        ['API key holders',s.apiKeyHolders],
        ['Active API key holders',s.activeApiKeyHolders],
        ['Manual grants',s.manualGrants],
        ['Refunded amount',money(s.refundedAmount)],
        ['Payment records',s.totalPaymentRecords],
      ].map(([name,value])=><div className="di-admin-kpi" key={name}><span>{name}</span><strong>{value}</strong></div>)}
    </div>

    <div className="di-admin-chart-grid">
      <BarChart title="Payment status" description="Every stored payment record grouped by server-recorded status." data={data.paymentStatus}/>
      <BarChart title="Paid plan distribution" description="Successful payments grouped by purchased plan." data={data.planDistribution}/>
      <DonutChart title="Entitlement sources" description="Where current user entitlement records came from." data={data.entitlementSources}/>
      <BarChart title="API key status" description="Stored MotionZync API-key records by status." data={data.apiKeyStatus}/>
      <div className="di-admin-chart-wide"><LineChart data={data.monthly}/></div>
    </div>

    <section className="di-admin-grant">
      <div><span className="di-admin-kicker">OWNER ACCESS</span><h3>Grant Premium without payment</h3><p>This changes MotionZync entitlement for a Firebase/Google account. It does not modify the user's Gmail account and it does not create a fake transaction.</p></div>
      <form onSubmit={grant}>
        <input aria-label="Google account email" type="email" placeholder="Google account email" value={grantEmail} onChange={event=>setGrantEmail(event.target.value)} required/>
        <select aria-label="Entitlement tier" value={grantTier} onChange={event=>setGrantTier(event.target.value)}><option value="premium">Premium</option><option value="ultra-premium">Ultra Premium+</option></select>
        <button disabled={granting}>{granting?'Granting…':'Grant entitlement'}</button>
      </form>
      {grantStatus&&<div className="di-admin-grant-status" role="status">{grantStatus}</div>}
    </section>

    <section className="di-admin-transactions">
      <div className="di-admin-chart-head"><div><h3>Payment / transaction records</h3><p>Transaction IDs are shown here for reconciliation. Sensitive payment credentials are intentionally not stored.</p></div></div>
      {!recent.length?<div className="di-admin-empty-chart">No payment records exist yet. This is not seeded/fake data.</div>:
        <div className="di-admin-table-wrap"><table><thead><tr><th>Date</th><th>Email</th><th>Plan</th><th>Provider</th><th>Order ID</th><th>Transaction ID</th><th>Amount</th><th>Status</th><th>Refund</th></tr></thead>
          <tbody>{recent.map(row=><tr key={row.id}><td>{row.purchasedAt?new Date(row.purchasedAt).toLocaleString('en-IN'): '—'}</td><td>{row.email||'—'}</td><td>{row.plan||'—'}</td><td>{row.provider||'—'}</td><td>{row.orderId||'—'}</td><td><code>{row.transactionId||'—'}</code></td><td>{money(row.amount,row.currency||'INR')}</td><td><span className={`di-admin-status status-${row.status||'unknown'}`}>{row.status||'unknown'}</span></td><td>{row.refundStatus||'none'}</td></tr>)}</tbody>
        </table></div>}
    </section>

    <p className="di-admin-footnote">Last server refresh: {data.generatedAt?new Date(data.generatedAt).toLocaleString('en-IN'):'—'} · Read limit: {data.limits?.collectionsReadLimit||10000} records per collection · Recent transaction table: {data.limits?.recentTransactions||100} records.</p>
  </div>
}
