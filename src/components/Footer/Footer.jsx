import { Link } from 'react-router-dom'
import MotionZyncLogo from '../Logo/Logo.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <MotionZyncLogo size={30}/><span className="footer-logo-text">MotionZync</span>
            </div>
            <p className="footer-tagline">Free live CSS & JavaScript animation playground for everyone.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Pages</h4>
              <Link to="/">Home</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/playground">Playground</Link>
              <Link to="/wallpaper">Wallpaper</Link>
              <Link to="/course">Course</Link>
              <Link to="/how-to-use">How to Use</Link>
              <Link to="/about">About</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/contact">Contact Us</Link>
              {/* ── Changelog link ── */}
              <Link to="/changelog" className="footer-changelog-link">
                📋 What's New
              </Link>
            </div>
            <div className="footer-col">
              <h4>Our Other Sites</h4>
              <a href="https://vaidya-guru.vercel.app" target="_blank" rel="noopener noreferrer">🏥 Vaidya Guru</a>
              <a href="https://wealth-kavach.vercel.app" target="_blank" rel="noopener noreferrer">💰 Wealth Kavach</a>
              <a href="https://shree-hari-mahendi-art.vercel.app" target="_blank" rel="noopener noreferrer">🌸 Shree Hari Mehendi</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MotionZync. All rights reserved.</p>
          <p className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link> · <Link to="/disclaimer">Disclaimer</Link> · <Link to="/contact">Contact</Link> · <Link to="/changelog">What's New</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
