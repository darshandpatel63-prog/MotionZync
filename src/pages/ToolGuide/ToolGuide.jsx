import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'

const sections = [
  { icon:'🎨', title:'Gallery', desc:'Browse the animation library, search by title/category, open a detail page, and copy ready-to-use CSS and JavaScript.', link:'/gallery', label:'Open Gallery' },
  { icon:'▶️', title:'Playground', desc:'Experiment with animation code in the browser, preview changes instantly, and use the playground for rapid prototyping.', link:'/playground', label:'Open Playground' },
  { icon:'⚖️', title:'Compare', desc:'View two animations together with synchronized controls so you can inspect their visual and code differences.', link:'/compare', label:'Open Compare' },
  { icon:'📚', title:'Animation Course', desc:'Learn CSS and JavaScript animation from fundamentals through advanced browser animation techniques.', link:'/course', label:'Start Course' },
  { icon:'🔧', title:'Animation Tools', desc:'Use the built-in utility collection for common animation and CSS workflow tasks.', link:'/tools', label:'Open Tools' },
  { icon:'⭐', title:'Favorites', desc:'Save animations locally in your browser and return to them later without requiring an account.', link:'/favorites', label:'Open Favorites' },
]

export default function ToolGuide() {
  return (
    <div className="page-section">
      <div className="container" style={{maxWidth:'1000px'}}>
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1><span className="gradient-text">Animation Platform Guide</span></h1>
          <p>Everything currently available in MotionZync, organized around discovering, learning, comparing, and building web animations.</p>
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem'}}>
          {sections.map(s=>(
            <div key={s.title} style={{background:'rgba(20,20,35,.7)',border:'1px solid rgba(124,58,237,.15)',borderRadius:'14px',padding:'1.25rem'}}>
              <div style={{fontSize:'1.6rem',marginBottom:'.6rem'}}>{s.icon}</div>
              <h2 style={{fontSize:'1rem',marginBottom:'.45rem'}}>{s.title}</h2>
              <p style={{color:'#94a3b8',fontSize:'.86rem',lineHeight:1.6,minHeight:'4.2rem'}}>{s.desc}</p>
              <Link to={s.link} className="btn-secondary">{s.label} →</Link>
            </div>
          ))}
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        <div style={{display:'flex',gap:'.8rem',justifyContent:'center',flexWrap:'wrap',marginTop:'2rem'}}>
          <Link to="/playground" className="btn-primary">⚡ Start Creating</Link>
          <Link to="/gallery" className="btn-secondary">🎨 Browse Animations</Link>
          <Link to="/how-to-use" className="btn-secondary">← How to Use</Link>
        </div>
      </div>
    </div>
  )
}
