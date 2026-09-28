import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthButton from '../AuthButton/AuthButton.jsx'
import APIKeyManager from '../../ai/settings/APIKeyManager.jsx'
import './Navbar.css'
const NAV_ITEMS=[{path:'/',label:'Home',icon:'⚡'},{path:'/gallery',label:'Gallery',icon:'🎨'},{path:'/playground',label:'Play',icon:'▶'},{path:'/compare',label:'Compare',icon:'⊞'},{path:'/tools',label:'Tools',icon:'🔧'},{path:'/course',label:'Learn',icon:'📚'}]
export default function Navbar(){const {pathname}=useLocation();const navigate=useNavigate();const [menuOpen,setMenuOpen]=useState(false);const [showKeys,setShowKeys]=useState(false);const [tapCount,setTapCount]=useState(0);const handleLogoTap=()=>{const next=tapCount+1;setTapCount(next);if(next>=7){navigate('/admin');setTapCount(0)}setTimeout(()=>setTapCount(0),2000)};return <>
<nav className="nb-root"><button className="nb-logo" onClick={handleLogoTap}><span className="nb-logo-icon">⚡</span><span className="nb-logo-text">MotionZync</span></button>
<div className="nb-links">{NAV_ITEMS.map(item=><Link key={item.path} to={item.path} className={`nb-link ${pathname===item.path?'active':''}`}>{item.label}</Link>)}</div>
<div className="nb-right"><button className="nb-key-btn" onClick={()=>setShowKeys(true)} title="API Key Settings">🔑 <span>API Keys</span></button><AuthButton/><button className="nb-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Open menu"><span className={menuOpen?'open':''}/><span className={menuOpen?'open':''}/><span className={menuOpen?'open':''}/></button></div>
{menuOpen&&<div className="nb-mobile-menu" onClick={()=>setMenuOpen(false)}>{NAV_ITEMS.map(item=><Link key={item.path} to={item.path} className={`nb-mob-link ${pathname===item.path?'active':''}`}><span>{item.icon}</span>{item.label}</Link>)}<button className="nb-mob-key" onClick={e=>{e.stopPropagation();setShowKeys(true);setMenuOpen(false)}}>🔑 API Keys</button></div>}</nav>
{showKeys&&<APIKeyManager onClose={()=>setShowKeys(false)}/>}</>}
