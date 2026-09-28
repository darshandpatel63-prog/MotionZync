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
              <MotionZyncLogo size={30}/>
              <span className="footer-logo-text">MotionZync</span>
            </div>
            <p className="footer-tagline">
              Free live CSS & JavaScript animation playground for everyone.
            </p>
          </div>

          <div className="footer-cols">
            {/* Pages */}
            <div className="footer-col">
              <h4>Pages</h4>
              <Link to="/">Home</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/playground">Playground</Link>
            </div>

            {/* Create */}
            <div className="footer-col">
              <h4>Create</h4>
            </div>

            {/* Legal — all point to public .html files, NOT React routes */}
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="/privacy.html"    target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="/terms.html"      target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <a href="/disclaimer.html" target="_blank" rel="noopener noreferrer">Disclaimer</a>
              <a href="/about.html"      target="_blank" rel="noopener noreferrer">About Us</a>
              <a href="/contact.html"    target="_blank" rel="noopener noreferrer">Contact Us</a>
            </div>

            {/* Other Sites */}
            <div className="footer-col">
              <h4>Our Other Sites</h4>
              <a href="https://dd-tech-labs-hub.vercel.app" target="_blank" rel="noopener noreferrer">🧰 DD Tech Labs</a>
              <a href="https://shree-hari-mahendi-art.vercel.app" target="_blank" rel="noopener noreferrer">🌸 Shree Hari Mehendi</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MotionZync. All rights reserved.</p>
          <p className="footer-bottom-links">
            <a href="/privacy.html"    target="_blank" rel="noopener noreferrer">Privacy</a> ·{' '}
            <a href="/terms.html"      target="_blank" rel="noopener noreferrer">Terms</a> ·{' '}
            <a href="/disclaimer.html" target="_blank" rel="noopener noreferrer">Disclaimer</a> ·{' '}
            <a href="/contact.html"    target="_blank" rel="noopener noreferrer">Contact</a> ·{' '}
            <Link to="/tools">Tools</Link> ·{' '}

          </p>
        </div>
      </div>
    </footer>
  )
}
