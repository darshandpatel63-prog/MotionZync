import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './HowToUse.css'
const steps = [
  { num:'01', icon:'🎨', title:'Browse the Gallery', desc:'Go to the Gallery page to explore 100+ ready-made animations. Filter by category (Background, Front, Button, etc.) or search by title and #tags.', link:'/gallery', linkText:'Open Gallery' },
  { num:'02', icon:'⚡', title:'Try in Live Playground', desc:'Click "Try it" on any animation card. The animation opens in the Playground with full CSS and JavaScript code ready to edit.', link:'/playground', linkText:'Open Playground' },
  { num:'03', icon:'✏️', title:'Customize the Code', desc:'Edit the CSS and JavaScript tabs to customize colors, size, speed and style. The preview updates live as you type (after 0.5 second pause).', link:null },
  { num:'04', icon:'📋', title:'Copy the Code', desc:'Click "📋 CSS" or "📋 JS" to copy each part separately. The Preview BG color code is also shown — copy it to match the background in your project.', link:null },
  { num:'05', icon:'🌐', title:'Add to Your Website', desc:'Paste the CSS in your stylesheet, JS in your script file. Use a <div id="container"> where you want the animation to appear.', link:null },
  { num:'06', icon:'📱', title:'Make it Responsive', desc:'Replace fixed pixel sizes with vw/vh units. On canvas animations, use el.offsetWidth and el.offsetHeight instead of fixed numbers.', link:null },
  { num:'07', icon:'🖼️', title:'Download as Wallpaper', desc:'Want it as your phone/desktop wallpaper? Go to the Wallpaper page, select size, watch a short ad, and download the HTML file.', link:'/wallpaper', linkText:'Get Wallpaper' },
  { num:'08', icon:'📚', title:'Learn from Course', desc:'New to CSS animations? Our free course takes you from zero to creating complex canvas animations with full code examples.', link:'/course', linkText:'Start Course' },
]
const faqs = [
  { q:'Can I use these animations in commercial projects?', a:'Yes! All animations on MotionZync can be used in personal and commercial projects. No attribution required, though it\'s appreciated.' },
  { q:'Do I need to install anything?', a:'No installation needed. MotionZync runs entirely in your browser. Just open the website and start coding.' },
  { q:'Why is my animation not showing on mobile?', a:'Canvas animations use el.offsetWidth/Height. Make sure your container div has a defined height (e.g. height: 400px or height: 100vh).' },
  { q:'How do I change animation colors to match my brand?', a:'Find all hex color codes in the CSS (like #7c3aed for purple, #06b6d4 for cyan) and replace them with your brand colors using Find & Replace.' },
  { q:'Can I use animations in React/Vue/Angular?', a:'Yes! Copy the CSS to your component\'s stylesheet and wrap the JS in a useEffect (React) or mounted() (Vue) hook. See Module 4 in the Course for detailed examples.' },
  { q:'How do I make the animation fill my whole screen?', a:'Set the container to position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:-1; and update the canvas size accordingly.' },
  { q:'What is the Preview BG Color shown in Playground?', a:'It\'s the background color the animation was designed for. Use this same color for your container\'s background so the animation looks correct in your project.' },
  { q:'How does the wallpaper download work?', a:'Wallpapers are HTML files. You\'ll need a live wallpaper app (KLWP for Android, Lively for Windows) to set them as your device wallpaper.' },
]
export default function HowToUse() {
  return (
    <div className="how-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>How to <span className="gradient-text">Use</span> MotionZync</h1>
          <p>Everything you need to know — from browsing animations to using them in your project.</p>
        </div>
        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
        <div className="steps-grid">
          {steps.map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <span className="step-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {s.link && <Link to={s.link} className="step-link">{s.linkText} →</Link>}
            </div>
          ))}
        </div>
        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <div className="faq-list">
            {faqs.map((f,i) => (
              <div className="faq-item" key={i}>
                <h4>❓ {f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
      </div>
    </div>
  )
}
