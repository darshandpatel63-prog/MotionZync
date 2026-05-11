import { Link } from 'react-router-dom'
import MotionZyncLogo from '../Logo/Logo.jsx'
import './Footer.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo-wrap"><MotionZyncLogo size={28}/><span className="footer-logo-text">MotionZync</span></div>
          <p className="footer-tagline">Live animation playground for everyone</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link><Link to="/gallery">Gallery</Link>
          <Link to="/playground">Playground</Link><Link to="/about">About</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} MotionZync. All rights reserved.</p>
      </div>
    </footer>
  )
}
