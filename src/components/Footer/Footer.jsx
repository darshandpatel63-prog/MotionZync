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
              <Link to="/wallpaper">Wallpaper</Link>
              <Link to="/course">Course</Link>
              <Link to="/how-to-use">How to Use</Link>
              <Link to="/tool-guide">Tool Guide</Link>
              <Link to="/tools" className="footer-tools-link">🔧 CSS Tools</Link>
              <Link to="/favorites">⭐ Favorites</Link>
            </div>

            {/* Create */}
            <div className="footer-col">
              <h4>Create</h4>
              <Link to="/codespace"      className="footer-codespace-link">💻 CodeSpace</Link>
              <Link to="/anim-creator"   className="footer-creator-link">🎨 AnimCreator</Link>
              <Link to="/drawing-studio">✏️ Drawing Studio</Link>
              <Link to="/studio-3d">🌎 3D Studio</Link>
              <Link to="/ai-studio">🧠 AI Studio</Link>
              <Link to="/compare">⚖️ Compare</Link>
              <Link to="/submit">+ Submit Animation</Link>
              <Link to="/changelog"      className="footer-changelog-link">📋 What's New</Link>
              <Link to="/why-features">💡 Why These Features?</Link>
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
              <a href="https://vaidya-guru.vercel.app"           target="_blank" rel="noopener noreferrer">🏥 Vaidya Guru</a>
              <a href="https://wealth-kavach.vercel.app"         target="_blank" rel="noopener noreferrer">💰 Wealth Kavach</a>
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
            <Link to="/changelog">What's New</Link> ·{' '}
            <Link to="/tools">Tools</Link> ·{' '}
            <Link to="/anim-creator">Creator</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
