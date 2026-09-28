import {NavLink,Outlet,useLocation,Link} from 'react-router-dom'
import './DesignIntelligence.css'
const NAV=[{to:'/design-intelligence',label:'Overview',end:true},{to:'/design-intelligence/explorer',label:'Explore'},{to:'/design-intelligence/generator',label:'Generate'},{to:'/design-intelligence/knowledge',label:'Knowledge'},{to:'/design-intelligence/stacks',label:'Tech Stacks'},{to:'/design-intelligence/docs',label:'How to Use'},{to:'/design-intelligence/pricing',label:'Access & API'}]
export default function DesignIntelligenceLayout(){
  const {pathname}=useLocation()
  const current=NAV.find(item=>item.end?pathname===item.to:pathname.startsWith(item.to))
  return <div className="di-shell">
    <header className="di-topbar"><Link className="di-brand" to="/design-intelligence"><span className="di-brand-mark">✦</span><span>MotionZync <b>Design Intelligence</b></span></Link><div className="di-breadcrumb" aria-label="Current section">{current?.label||'Design Intelligence'}</div></header>
    <nav className="di-nav" aria-label="Design Intelligence navigation">{NAV.map(item=><NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=>'di-nav-link '+(isActive?'active':'')}>{item.label}</NavLink>)}</nav>
    <main className="di-main"><Outlet/></main>
  </div>
}
