import { Link } from 'react-router-dom'
import AdSense   from '../../components/AdSense/AdSense.jsx'
import './Home.css'
export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-bg-glow"/>
        <div className="hero-content container">
          <span className="hero-badge">✦ Live Animation Platform</span>
          <h1 className="hero-title">Create & Explore<br/><span className="gradient-text">Beautiful Animations</span></h1>
          <p className="hero-desc">Ready-made animations browse karo ya live code editor ma khud na animations banavo. CSS + JavaScript — real-time preview saathe.</p>
          <div className="hero-actions">
            <Link to="/playground" className="btn-primary hero-cta">⚡ Try Playground</Link>
            <Link to="/gallery"    className="btn-secondary hero-cta">Browse Gallery →</Link>
          </div>
        </div>
      </section>
      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
      <section className="features-section container">
        <h2 className="section-title">Why MotionZync?</h2>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3><p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
    </div>
  )
}
const features = [
  { icon:'⚡', title:'Live Playground', desc:'CSS aur JS likho, real-time preview juo. Instant feedback, koi setup nahi.' },
  { icon:'🎨', title:'Animation Gallery', desc:'Ready-made background aur front animations browse karo, try karo.' },
  { icon:'🔍', title:'Smart Search', desc:'Title, description ya #tag thi koi pan animation quickly shodhav.' },
  { icon:'📱', title:'Mobile Friendly', desc:'Phone par pan perfectly use thay — coding to preview sab kuch.' },
]

