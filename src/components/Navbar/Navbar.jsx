import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MotionZyncLogo from '../Logo/Logo.jsx'
import AuthButton     from '../AuthButton/AuthButton.jsx'
import { useAuth }    from '../../context/AuthContext.jsx'
import './Navbar.css'

const LS_FAVS  = 'mz_favorites'
const LS_LIKES = 'mz_likes'

function getFavCount() {
  try {
    const f = JSON.parse(localStorage.getItem(LS_FAVS)  || '[]')
    const l = JSON.parse(localStorage.getItem(LS_LIKES) || '{}')
    return f.length + Object.keys(l).length
  } catch { return 0 }
}

const navLinks = [
  { path:'/',            label:'Home' },
  { path:'/gallery',     label:'Gallery' },
  { path:'/playground',  label:'⚡ Playground' },
  { path:'/wallpaper',   label:'🖼️ Wallpaper' },
  { path:'/course',      label:'📚 Course' },
  { path:'/how-to-use',  label:'How to Use' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [favCount, setFavCount] = useState(getFavCount)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { isAdmin } = useAuth()
  const taps = useRef(0), timer = useRef(null)

  // Live fav count update
  useEffect(() => {
    function update() { setFavCount(getFavCount()) }
    window.addEventListener('mz-favs-changed', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('mz-favs-changed', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  function handleLogoTap(e) {
    taps.current++
    clearTimeout(timer.current)
    if (taps.current >= 7) {
      taps.current = 0
      e.preventDefault()
      navigate('/admin')
      setOpen(false)
      return
    }
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
              <Link
                to={l.path}
                className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {isAdmin && (
            <li>
              <Link to="/admin" className="nav-link admin-link" onClick={() => setOpen(false)}>
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          {/* ── Favorites icon with live badge ── */}
          <Link
            to="/favorites"
            className={`navbar-fav-btn ${location.pathname === '/favorites' ? 'active' : ''}`}
            onClick={() => setOpen(false)}
            title="My Favorites"
          >
            {favCount > 0
              ? <><span>🔖</span><span className="nav-fav-badge">{favCount > 99 ? '99+' : favCount}</span></>
              : <span>🔖</span>
            }
          </Link>

          {/* Submit CTA */}
          <Link to="/submit" className="navbar-submit-btn" onClick={() => setOpen(false)}>
            + Submit
          </Link>

          <AuthButton/>

          <button
            className={`menu-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  )
}
