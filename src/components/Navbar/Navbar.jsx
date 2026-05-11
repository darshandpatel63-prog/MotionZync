import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MotionZyncLogo from '../Logo/Logo.jsx'
import AuthButton    from '../AuthButton/AuthButton.jsx'
import { useAuth }   from '../../context/AuthContext.jsx'
import './Navbar.css'

const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/gallery',    label: 'Gallery' },
  { path: '/playground', label: '⚡ Playground' },
  { path: '/about',      label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { isAdmin } = useAuth()
  const taps = useRef(0), timer = useRef(null)

  function handleLogoTap() {
    taps.current++
    clearTimeout(timer.current)
    if (taps.current >= 7) { taps.current = 0; navigate('/admin'); setOpen(false); return }
    timer.current = setTimeout(() => { taps.current = 0 }, 2000)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={handleLogoTap}>
          <MotionZyncLogo size={36} className="logo-svg"/>
          <span className="logo-text">MotionZync</span>
        </Link>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.path}>
              <Link to={l.path}
                className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {/* Admin link - sirf admin user ne dikhshe */}
          {isAdmin && (
            <li>
              <Link to="/admin" className="nav-link admin-nav-link" onClick={() => setOpen(false)}>
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          <AuthButton />
          <button className={`menu-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen(p => !p)} aria-label="Toggle menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  )
}
