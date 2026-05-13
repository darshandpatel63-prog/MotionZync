import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content container">
          <span className="hero-badge">✦ Free Live Animation Platform</span>
          <h1 className="hero-title">Create & Explore<br/><span className="gradient-text">Beautiful Animations</span></h1>
          <p className="hero-desc">Free live CSS & JavaScript animation playground. Browse 100+ background animations, button effects, canvas animations and more. Perfect for beginners to professional developers.</p>
          <div className="hero-actions">
            <Link to="/playground" className="btn-primary hero-cta">⚡ Try Live Playground</Link>
            <Link to="/gallery"    className="btn-secondary hero-cta">Browse Gallery →</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span>100+</span><small>Animations</small></div>
            <div className="stat"><span>Free</span><small>Forever</small></div>
            <div className="stat"><span>Live</span><small>Preview</small></div>
            <div className="stat"><span>Copy</span><small>Ready Code</small></div>
          </div>
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      <section className="features-section container">
        <h2 className="section-title">Why Choose <span className="gradient-text">MotionZync?</span></h2>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              {f.link && <Link to={f.link} className="feature-link">{f.linkText} →</Link>}
            </div>
          ))}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      <section className="other-sites-section container">
        <h2 className="section-title">Our Other <span className="gradient-text">Websites</span></h2>
        <div className="other-sites-grid">
          <a href="https://vaidya-guru.vercel.app" target="_blank" rel="noopener noreferrer" className="other-site-card">
            <span>🏥</span><h3>Vaidya Guru</h3><p>Health & Ayurveda guidance platform</p>
          </a>
          <a href="https://wealth-kavach.vercel.app" target="_blank" rel="noopener noreferrer" className="other-site-card">
            <span>💰</span><h3>Wealth Kavach</h3><p>Personal finance & investment insights</p>
          </a>
          <a href="https://shree-hari-mahendi-art.vercel.app" target="_blank" rel="noopener noreferrer" className="other-site-card">
            <span>🌸</span><h3>Shree Hari Mehendi Art</h3><p>Beautiful traditional mehendi designs</p>
          </a>
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
    </div>
  )
}

const features = [
  { icon:'⚡', title:'Live Playground',    desc:'Type CSS or JavaScript and see the animation run instantly. No setup required!',             link:'/playground', linkText:'Open Playground' },
  { icon:'🎨', title:'100+ Animations',    desc:'Browse background animations, button effects, particle systems, canvas animations and more.', link:'/gallery',    linkText:'View Gallery' },
  { icon:'📚', title:'Animation Course',   desc:'Learn CSS and JavaScript animation from scratch — complete free course with live demos.',      link:'/course',     linkText:'Start Learning' },
  { icon:'🖼️', title:'Live Wallpaper',     desc:'Download any animation as a live HTML wallpaper. Watch a short ad to support the service.',   link:'/wallpaper',  linkText:'Get Wallpapers' },
  { icon:'🔍', title:'Smart Search',       desc:'Search by title, #tag, or filter by background color. Find exactly what you need fast.',       link:null },
  { icon:'📋', title:'Copy-Ready Code',    desc:'One-click copy CSS and JavaScript code. Preview BG color also shown for perfect integration.', link:null },
  { icon:'🔒', title:'100% Secure',        desc:'All code runs in sandboxed iframes — completely isolated. Your device is always safe.',        link:null },
  { icon:'📱', title:'Mobile Friendly',    desc:'Works perfectly on phones and tablets. Code, preview, and download anywhere, anytime.',        link:null },
]
