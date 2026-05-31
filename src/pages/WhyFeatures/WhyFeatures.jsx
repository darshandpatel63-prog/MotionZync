import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'

const WHY_FEATURES = [
  {
    icon:'🎨', title:'Animation Gallery',
    problem:'Building animations from scratch takes hours of CSS/JS knowledge, debugging, and experimentation.',
    solution:'MotionZync\'s gallery gives you 100+ ready-made, tested, production-ready animations. One click → copy code → paste into your project. What took hours now takes 30 seconds.',
    useCases:['Adding a hero background animation to your portfolio','Getting an animated button for a landing page CTA','Finding a particle effect for your app\'s loading screen','Grabbing a text animation for your brand headline'],
    link:'/gallery', linkLabel:'Browse Gallery'
  },
  {
    icon:'⚡', title:'Live Playground',
    problem:'To customize an animation, you need to set up a local dev environment, edit files, refresh browser manually, and guess at what color/speed changes will look like.',
    solution:'Playground gives you a real-time editor with instant visual feedback. Change a color value and see it update instantly. No setup, no terminal, no file system — just code and preview, side by side.',
    useCases:['Testing animation timing before adding to your site','Quickly customizing colors to match your brand','Experimenting with CSS transforms and keyframes live','Learning how canvas animations work by modifying code'],
    link:'/playground', linkLabel:'Open Playground'
  },
  {
    icon:'🎬', title:'AnimCreator',
    problem:'Designing custom animations requires learning GSAP, Framer Motion, or complex CSS keyframe sequences. Even experienced developers spend hours on complex multi-element animations.',
    solution:'AnimCreator lets you design visually — draw shapes, click to assign animations, configure physics — and it generates the CSS+JS code automatically. Designers can create without coding. Developers save hours.',
    useCases:['Creating a custom animated hero section for a client website','Designing an animated logo intro for a startup','Building an animated product showcase for an e-commerce site','Creating interactive background animations for a SaaS landing page'],
    link:'/anim-creator', linkLabel:'Open AnimCreator'
  },
  {
    icon:'💻', title:'CodeSpace IDE',
    problem:'To code a web project, you need: install Node.js, install VS Code, install extensions, configure project, set up a local server, learn Git... before writing a single line of HTML.',
    solution:'CodeSpace is a complete IDE in your browser. Open it, start coding immediately. File explorer, syntax highlighting, autocomplete, live preview, terminal simulation, Git panel — everything a development environment needs, zero setup.',
    useCases:['Prototyping a web app idea instantly without local setup','Learning HTML/CSS/JS without installing anything','Building a quick demo to show a client from any device','Writing and testing JavaScript without leaving the browser'],
    link:'/codespace', linkLabel:'Open CodeSpace'
  },
  {
    icon:'📚', title:'Animation Course',
    problem:'CSS and JavaScript animation tutorials on YouTube are scattered, outdated, or too basic/advanced. Finding a structured path from beginner to production-ready is difficult.',
    solution:'A structured, free, complete course designed specifically for MotionZync\'s context. Module 1 → Module 4, each building on the last. Code examples run directly in the Playground for immediate practice.',
    useCases:['Learning CSS animations from scratch as a beginner','Understanding canvas animation for job interviews','Getting from "I know HTML" to "I can animate anything"','Refreshing animation knowledge for a freelance project'],
    link:'/course', linkLabel:'Start Course'
  },
  {
    icon:'🖼️', title:'Live Wallpapers',
    problem:'Live wallpapers for phones and desktops are complex apps requiring native development. Most live wallpaper creators provide only basic patterns.',
    solution:'MotionZync turns any web animation into a live wallpaper HTML file. Download, load in a wallpaper app, done. Your phone or desktop gets a beautiful, unique, technical live wallpaper in 2 minutes.',
    useCases:['Creating a unique galaxy particle wallpaper for your phone','Setting an animated neon grid as your desktop background','Sharing a beautiful wallpaper with friends','Impressing clients by using your own animated wallpaper during presentations'],
    link:'/wallpaper', linkLabel:'Get Wallpapers'
  },
  {
    icon:'🔍', title:'Animation Compare',
    problem:'When choosing between two similar animations for a project, you have to open them in separate tabs, switch back and forth, and rely on memory to compare.',
    solution:'Compare lets you load two animations side-by-side in a single view with synchronized playback controls. See them together, choose confidently.',
    useCases:['Choosing between a particle burst and a floating orb for a hero section','Comparing a wave animation vs DNA helix for a biotech landing page','Showing two animation options to a client in a single view'],
    link:'/compare', linkLabel:'Try Compare'
  },
  {
    icon:'📤', title:'Submit Animation',
    problem:'Developers and designers build unique animations for projects but have no platform to share, discover, or get credit for their work in the web animation community.',
    solution:'Submit your animation to MotionZync\'s gallery. After admin review, your animation is featured for thousands of users to discover, use, and credit you for.',
    useCases:['Sharing an animation you\'re proud of with the developer community','Building a portfolio by getting animations published on a real platform','Contributing to an open animation resource others can learn from'],
    link:'/submit', linkLabel:'Submit Now'
  },
  {
    icon:'⭐', title:'Favorites',
    problem:'While browsing, you find 5–10 animations you might want to use later. But when you come back tomorrow, you can\'t find them again among 100+ animations.',
    solution:'Click ❤️ to instantly bookmark any animation. All saved locally in your browser — no account required. Access your curated collection from the Favorites page anytime.',
    useCases:['Building a personal collection of animations for different project types','Saving options to show a client later','Quickly finding your go-to loading animation across projects'],
    link:'/favorites', linkLabel:'View Favorites'
  },
  {
    icon:'🛠️', title:'Tools Page',
    problem:'Developers often need quick utilities during animation and web development work — color conversion, easing visualizer, unit converter, and more.',
    solution:'MotionZync\'s Tools page provides utility tools specifically for animation and web development work, all in one place without leaving the platform.',
    useCases:['Converting hex colors to HSL for CSS animations','Visualizing easing curves for animation timing','Converting pixel values to viewport units (vw/vh)'],
    link:'/tools', linkLabel:'Open Tools'
  },
  {
    icon:'📋', title:'Changelog',
    problem:'When using a platform regularly, it\'s important to know what new features, bug fixes, and improvements were added — so you can take advantage of them.',
    solution:'MotionZync\'s Changelog documents every platform update: new animations added, features released, bugs fixed, and improvements made.',
    useCases:['Staying updated on new animation types added to gallery','Learning about new AnimCreator or CodeSpace features','Knowing when bugs you reported are fixed'],
    link:'/changelog', linkLabel:'View Changelog'
  },
]

export default function WhyFeatures() {
  return (
    <div className="page-section">
      <div className="container" style={{maxWidth:'900px'}}>

        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>Why These <span className="gradient-text">Features?</span></h1>
          <p>Every tool on MotionZync solves a real problem in web and app development. Here's exactly how each feature helps you build better, faster.</p>
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          {WHY_FEATURES.map((f,i)=>(
            <div key={f.title} style={{background:'rgba(20,20,35,.7)',border:'1px solid rgba(124,58,237,.18)',borderRadius:'16px',padding:'1.8rem 2rem',backdropFilter:'blur(12px)',transition:'border-color .2s'}} className="why-card">

              <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem'}}>
                <span style={{fontSize:'2rem'}}>{f.icon}</span>
                <h2 style={{fontSize:'1.15rem',fontWeight:800,letterSpacing:'-.3px'}}>{f.title}</h2>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.15)',borderRadius:'10px',padding:'1rem'}}>
                  <div style={{fontSize:'.73rem',fontWeight:700,color:'#f87171',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'.5rem'}}>❌ The Problem</div>
                  <p style={{fontSize:'.87rem',color:'#cbd5e1',lineHeight:1.6}}>{f.problem}</p>
                </div>
                <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'1rem'}}>
                  <div style={{fontSize:'.73rem',fontWeight:700,color:'#34d399',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'.5rem'}}>✅ The Solution</div>
                  <p style={{fontSize:'.87rem',color:'#cbd5e1',lineHeight:1.6}}>{f.solution}</p>
                </div>
              </div>

              <div style={{marginBottom:'1rem'}}>
                <div style={{fontSize:'.73rem',fontWeight:700,color:'#a78bfa',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'.6rem'}}>🎯 Real Use Cases</div>
                <ul style={{listStyle:'none',padding:0,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'.3rem'}}>
                  {f.useCases.map((uc,j)=>(
                    <li key={j} style={{fontSize:'.84rem',color:'#94a3b8',display:'flex',gap:'.4rem',alignItems:'flex-start'}}>
                      <span style={{color:'#7c3aed',flexShrink:0}}>→</span> {uc}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={f.link} className="btn-primary" style={{fontSize:'.82rem',padding:'.45rem 1rem',display:'inline-flex',alignItems:'center',gap:'.4rem'}}>
                {f.icon} {f.linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        <div style={{marginTop:'2rem',padding:'2rem',background:'rgba(124,58,237,.07)',border:'1px solid rgba(124,58,237,.2)',borderRadius:'14px',textAlign:'center'}}>
          <h3 style={{fontSize:'1.2rem',fontWeight:800,marginBottom:'.5rem'}}>Everything you need to <span className="gradient-text">animate the web</span></h3>
          <p style={{color:'#94a3b8',fontSize:'.9rem',marginBottom:'1.2rem'}}>All tools, all animations, all courses — completely free. Start building today.</p>
          <div style={{display:'flex',gap:'.7rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/" className="btn-primary">🏠 Go to Home</Link>
            <Link to="/how-to-use" className="btn-secondary">📖 How to Use →</Link>
            <Link to="/tool-guide" className="btn-secondary">🔧 Tool Guide →</Link>
          </div>
        </div>

      </div>
    </div>
  )
    }
                
