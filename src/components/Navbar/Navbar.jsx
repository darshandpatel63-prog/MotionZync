// src/components/Navbar/Navbar.jsx
// Updated Navbar — adds Drawing Studio, 3D Studio, AI Studio
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthButton from '../AuthButton/AuthButton.jsx'
import './Navbar.css'

const NAV_ITEMS = [
  { path:'/', label:'Home', icon:'⚡' },
  { path:'/gallery', label:'Gallery', icon:'🎨' },
  { path:'/playground', label:'Play', icon:'▶' },
  { path:'/compare', label:'Compare', icon:'⊞' },
  { path:'/tools', label:'Tools', icon:'🔧' },
  { path:'/course', label:'Learn', icon:'📚' },
]

// Studio dropdown items
const STUDIOS = [
  { path:'/ai-studio', label:'AI Studio', icon:'🧠', badge:'AI', auth:true },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { user }     = useAuth() || {}
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [studioOpen,setStudioOpen]= useState(false)
  const [tapCount,  setTapCount]  = useState(0)

  // Admin secret tap (7 taps on logo)
  const handleLogoTap = () => {
    const next = tapCount + 1
    setTapCount(next)
    if (next >= 7) { navigate('/admin'); setTapCount(0) }
    setTimeout(() => setTapCount(0), 2000)
  }

  return (
    <nav className="nb-root">
      {/* Logo */}
      <button className="nb-logo" onClick={handleLogoTap}>
        <span className="nb-logo-icon">⚡</span>
        <span className="nb-logo-text">MotionZync</span>
      </button>

      {/* Desktop nav */}
      <div className="nb-links">
        {NAV_ITEMS.map(item => (
          <Link key={item.path} to={item.path}
            className={`nb-link ${pathname===item.path?'active':''}`}>
            {item.label}
          </Link>
        ))}

        {/* Studios dropdown */}
        <div className="nb-dropdown"
          onMouseEnter={()=>setStudioOpen(true)}
          onMouseLeave={()=>setStudioOpen(false)}>
          <button className={`nb-link nb-studios-btn ${STUDIOS.some(s=>pathname===s.path)?'active':''}`}>
            Studios ▾
          </button>
          {studioOpen && (
            <div className="nb-dropdown-menu">
              {STUDIOS.map(s=>(
                <Link key={s.path} to={s.path}
                  className="nb-dd-item"
                  onClick={()=>setStudioOpen(false)}>
                  <span className="nb-dd-icon">{s.icon}</span>
                  <span className="nb-dd-label">{s.label}</span>
                  <div className="nb-dd-right">
                    {s.auth && !user && <span className="nb-dd-lock">🔒</span>}
                    {s.badge && <span className={`nb-badge ${s.badge==='AI'?'ai':''}`}>{s.badge}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="nb-right">
        <AuthButton />
        {/* Mobile hamburger */}
        <button className="nb-hamburger" onClick={()=>setMenuOpen(o=>!o)}>
          <span className={menuOpen?'open':''}/>
          <span className={menuOpen?'open':''}/>
          <span className={menuOpen?'open':''}/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nb-mobile-menu" onClick={()=>setMenuOpen(false)}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path}
              className={`nb-mob-link ${pathname===item.path?'active':''}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          <div className="nb-mob-divider">— Studios —</div>
          {STUDIOS.map(s => (
            <Link key={s.path} to={s.path} className="nb-mob-link">
              <span>{s.icon}</span>{s.label}
              {s.badge && <span className={`nb-badge ${s.badge==='AI'?'ai':''}`}>{s.badge}</span>}
              {s.auth && !user && <span className="nb-dd-lock">🔒</span>}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
              }
                                    
