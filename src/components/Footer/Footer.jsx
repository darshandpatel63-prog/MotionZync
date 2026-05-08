import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">✦ AnimateX</span>
          <p className="footer-tagline">Live animation playground for everyone</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/playground">Playground</Link>
          <Link to="/about">About</Link>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} AnimateX. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
