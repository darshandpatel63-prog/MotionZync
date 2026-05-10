import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AnimatexLogo from '../Logo/Logo.jsx'
import './Navbar.css'

const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/gallery',    label: 'Gallery' },
  { path: '/playground', label: '⚡ Playground' },
  { path: '/about',      label: 'About' },
]

// Secret: Logo par 7 vaar tap karo = Admin panel khulshe
const SECRET_TAPS = 7

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()

  const tapCount  = useRef(0)
  const tapTimer  = useRef(null)

  const closeMenu = () => setMenuOpen(false)

  function handleLogoTap() {
    tapCount.current += 1
    clearTimeout(tapTimer.current)

    if (tapCount.current >= SECRET_TAPS) {
      tapCount.current = 0
      navigate('/admin')
      closeMenu()
      return
    }

    // 2 second andar next tap na aave to reset
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0
    }, 2000)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-logo"
          onClick={(e) => {
            handleLogoTap()
            // Normal home navigation pan thay (jyare taps puray nahi hoi)
          }}
        >
          <AnimatexLogo size={36} className="logo-svg" />
          <span className="logo-text">AnimateX</span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
