import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './HowToUse.css'

const steps = [
  { num:'01', icon:'🎨', title:'Browse the Gallery', desc:'Explore 100+ ready-made CSS & JS animations. Filter by category (Background, Front, Button, Text, Canvas, Particles) or search by title and #tags. Use color filter to find animations matching your brand palette.', tips:['Use search bar to find by name or #tag','Filter by background color for brand matching','Click ❤️ to save to Favorites','Click card to open full detail view'], link:'/gallery', linkText:'Open Gallery' },
  { num:'02', icon:'⚡', title:'Live Playground', desc:'Click "Try it" on any animation card. Opens in the Playground with full CSS and JavaScript code. Live preview updates instantly as you type. All 4 tabs: CSS · JS · HTML · Preview.', tips:['Preview BG color shown — copy it for your project','Use "Compare" to view 2 animations side by side','Code editor has syntax highlighting'], link:'/playground', linkText:'Open Playground' },
  { num:'03', icon:'✏️', title:'Customize the Code', desc:'Edit CSS and JS to customize colors, size, speed, style. The preview updates live (0.5s pause after typing). Replace hex color codes with your brand colors instantly.', tips:['Find & Replace: Ctrl+H in code editor','Replace #7c3aed (purple) with your primary color','Replace #06b6d4 (cyan) with secondary color','Replace #0a0a0f (dark bg) with your bg color'], link:null },
  { num:'04', icon:'📋', title:'Copy the Code', desc:'Click "📋 CSS" or "📋 JS" to copy each part separately. The Preview BG color code is also shown — copy it to match the background in your project.', tips:['CSS and JS copied separately','One-click copy — clipboard-ready','BG color shown for container styling'], link:null },
  { num:'05', icon:'🌐', title:'Add to Your Website', desc:'Paste CSS in your stylesheet, JS in your script file. Use a <div id="container"> where you want the animation. Works with HTML, React, Vue, Angular, or any framework.', tips:['React: wrap JS in useEffect() hook','Vue: use mounted() lifecycle hook','Angular: use ngAfterViewInit()'], link:null },
  { num:'06', icon:'📱', title:'Make it Responsive', desc:'Replace fixed pixel sizes with vw/vh units. On canvas animations, use el.offsetWidth and el.offsetHeight. Reduce particle count on mobile for better performance.', tips:['Use window.innerWidth < 768 for mobile detect','isMobile ? 30 : 100 for particle count','Use window resize event on canvas'], link:null },
  { num:'07', icon:'🎬', title:'Use AnimCreator', desc:'Professional visual animation design suite. Draw shapes on canvas, add 20+ animation types, configure physics (gravity/spring/magnetic/bounce/wind/cloth), particles, shaders, gradient builder, layer panel, timeline, and export production-ready CSS+JS.', tips:['Press ? to see all keyboard shortcuts','Simple Mode: quick drag & drop design','Pro Mode: full timeline & physics control','Ctrl+S to save scene anytime'], link:'/anim-creator', linkText:'Open AnimCreator' },
  { num:'08', icon:'💻', title:'Use CodeSpace IDE', desc:'Full browser-based IDE with VS Code-style file explorer, Monaco code editor, live preview, terminal simulation, Git panel, command palette, settings, environment variables, and project templates. Build complete web projects in-browser.', tips:['Ctrl+P: Command Palette','Ctrl+` : Toggle terminal','Projects saved in IndexedDB locally','Export projects as ZIP file'], link:'/codespace', linkText:'Open CodeSpace' },
  { num:'09', icon:'🖼️', title:'Download Wallpaper', desc:'Download any animation as an HTML live wallpaper file. Select your device size (phone/tablet/desktop/custom). Watch a short ad then download. Use with KLWP (Android) or Lively (Windows).', tips:['HTML wallpapers are self-contained files','Android: KLWP or Lively wallpaper app','Windows: Lively Wallpaper app (free)','Test performance on your device first'], link:'/wallpaper', linkText:'Get Wallpaper' },
  { num:'10', icon:'📚', title:'Learn from Course', desc:'Free complete CSS & JS animation course. From zero to advanced canvas animations. 4 modules, 12+ lessons, live code examples — all runnable directly in the Playground.', tips:['Module 1: CSS Animation Basics','Module 2: Advanced CSS Techniques','Module 3: JavaScript Canvas API','Module 4: Frameworks Integration'], link:'/course', linkText:'Start Course' },
  { num:'11', icon:'📤', title:'Submit Your Animation', desc:'Built something amazing in Playground or AnimCreator? Submit for gallery inclusion. Admin reviews within 48 hours. Approved animations get featured for all users.', tips:['Paste your CSS and JS directly','Add descriptive tags for searchability','Include animation title and category','Admin reviews all submissions'], link:'/submit', linkText:'Submit Animation' },
  { num:'12', icon:'⭐', title:'Save Favorites', desc:'Bookmark animations with the ❤️ button on any card. Favorites stored in browser localStorage — no account needed. Access your collection anytime from /favorites.', tips:['No account required','Stored locally in your browser','Works across sessions on same browser','Quick access from Favorites page'], link:'/favorites', linkText:'View Favorites' },
]

const faqs = [
  { q:'Can I use these animations in commercial projects?', a:'Yes! All animations on MotionZync can be used in personal and commercial projects. No attribution required, though appreciated.' },
  { q:'Do I need to install anything?', a:'No installation needed. MotionZync runs entirely in your browser. Just open the website and start creating.' },
  { q:'Why is my animation not showing on mobile?', a:'Canvas animations use el.offsetWidth/Height. Make sure your container div has a defined height (e.g. height:400px or height:100vh).' },
  { q:'How do I change animation colors to match my brand?', a:'Find all hex color codes in the CSS (like #7c3aed for purple) and replace them with your brand colors using Ctrl+H Find & Replace.' },
  { q:'Can I use animations in React/Vue/Angular?', a:'Yes! Copy CSS to your component stylesheet and wrap JS in useEffect (React) or mounted() (Vue). See Module 4 in the Course for full examples.' },
  { q:'How do I make the animation fill my whole screen?', a:'Set container to: position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:-1; and update canvas size accordingly.' },
  { q:'What is AnimCreator?', a:'AnimCreator is a visual animation design tool — like Figma but for web animations. Draw shapes, add motion, configure physics/particles, and export CSS+JS code. No deep coding required.' },
  { q:'What is CodeSpace?', a:'CodeSpace is a browser-based IDE similar to VS Code. It has file explorer, Monaco code editor, live preview, terminal simulation, and Git panel. Build full web projects directly in browser.' },
  { q:'Is CodeSpace project saved to the cloud?', a:'No. CodeSpace projects are saved in browser IndexedDB (local storage). Export your project as ZIP regularly to avoid data loss from browser clearing.' },
  { q:'How does the wallpaper download work?', a:'Wallpapers are HTML files. You need a live wallpaper app (KLWP for Android, Lively for Windows) to set them as device wallpaper.' },
  { q:'What is the Preview BG Color in Playground?', a:"It's the background color the animation was designed for. Use this color for your container's background so the animation looks correct in your project." },
  { q:'How do I compare two animations?', a:'Go to the Compare page and select two animations. They play side-by-side with synchronized controls for easy comparison.' },
]

export default function HowToUse() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="how-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>How to <span className="gradient-text">Use</span> MotionZync</h1>
          <p>Complete guide — browsing animations, using every tool, keyboard shortcuts, and FAQ.</p>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

        <div className="how-quick-links" style={{display:'flex',flexWrap:'wrap',gap:'.5rem',marginBottom:'2rem'}}>
          {[['⚡','Playground','/playground'],['🎨','Gallery','/gallery'],['🎬','AnimCreator','/anim-creator'],['💻','CodeSpace','/codespace'],['📚','Course','/course'],['🖼️','Wallpaper','/wallpaper'],['📖','Full Tool Guide','/tool-guide']].map(([ic,lbl,to])=>(
            <Link key={to} to={to} style={{display:'inline-flex',alignItems:'center',gap:'.35rem',background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.25)',color:'#a78bfa',padding:'.35rem .8rem',borderRadius:'8px',textDecoration:'none',fontSize:'.82rem',fontWeight:600,transition:'all .2s'}}>{ic} {lbl}</Link>
          ))}
        </div>

        <div className="steps-grid">
          {steps.map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <span className="step-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {s.tips && (
                <ul style={{listStyle:'none',padding:0,margin:'.6rem 0',display:'flex',flexDirection:'column',gap:'.3rem'}}>
                  {s.tips.map((t,i)=><li key={i} style={{fontSize:'.8rem',color:'#94a3b8'}}>💡 {t}</li>)}
                </ul>
              )}
              {s.link && <Link to={s.link} className="step-link">{s.linkText} →</Link>}
            </div>
          ))}
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

        {/* KEYBOARD SHORTCUTS */}
        <div style={{marginBottom:'3rem'}}>
          <h2 className="section-title" style={{marginBottom:'1.5rem'}}>⌨️ Keyboard <span className="gradient-text">Shortcuts</span></h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
            {[
              { title:'🎬 AnimCreator', rows:[['V','Select tool'],['R','Rectangle'],['C','Circle'],['T','Triangle'],['X','Text tool'],['L','Line'],['D','Draw freehand'],['I','Image upload'],['G','Toggle grid'],['Ctrl+Z','Undo'],['Ctrl+Y','Redo'],['Ctrl+C','Copy element'],['Ctrl+V','Paste element'],['Ctrl+D','Duplicate'],['Delete','Delete selected'],['Ctrl+S','Save scene'],['Ctrl+]','Bring to front'],['Ctrl+[','Send to back'],['?','Shortcut help overlay'],['Esc','Deselect / close'],['+ / −','Zoom in / out'],['Scroll wheel','Zoom canvas'],['Space+drag','Pan canvas'],['Shift+click','Multi-select'],['Drag empty area','Marquee select']] },
              { title:'💻 CodeSpace IDE', rows:[['Ctrl+P','Command Palette'],['Ctrl+S','Save file'],['Ctrl+`','Toggle terminal'],['Ctrl+/','Toggle comment'],['Ctrl+D','Select next match'],['Ctrl+F','Find in file'],['Ctrl+H','Find & Replace'],['Ctrl+Z','Undo'],['Ctrl+Shift+Z','Redo'],['Alt+↑/↓','Move line up/down'],['Ctrl+G','Go to line'],['Tab','Indent'],['Shift+Tab','Unindent'],['F1','Editor commands'],['F11','Fullscreen']] },
              { title:'⚡ General Platform', rows:[['Ctrl+C','Copy code to clipboard'],['Ctrl+Enter','Run / preview code'],['Esc','Close modal / overlay'],['Click card','Open animation detail'],['❤️ icon','Add to favorites'],['"Try it" button','Open in Playground']] },
            ].map(group=>(
              <div key={group.title} style={{background:'rgba(20,20,35,.7)',border:'1px solid rgba(124,58,237,.18)',borderRadius:'12px',padding:'1.2rem',backdropFilter:'blur(12px)'}}>
                <h4 style={{marginBottom:'.8rem',fontSize:'.9rem',fontWeight:700}}>{group.title}</h4>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <tbody>
                    {group.rows.map(([key,desc])=>(
                      <tr key={key} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                        <td style={{padding:'.25rem .5rem .25rem 0',whiteSpace:'nowrap'}}>
                          {key.split('+').map((k,i)=>(
                            <span key={i}>{i>0&&<span style={{color:'#64748b',fontSize:'.7rem',margin:'0 .15rem'}}>+</span>}<kbd style={{background:'rgba(124,58,237,.2)',border:'1px solid rgba(124,58,237,.4)',borderRadius:'4px',padding:'.1rem .4rem',fontSize:'.75rem',fontFamily:'monospace',color:'#a78bfa'}}>{k.trim()}</kbd></span>
                          ))}
                        </td>
                        <td style={{padding:'.25rem 0',fontSize:'.82rem',color:'#94a3b8'}}>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

        {/* FAQ */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <div className="faq-list">
            {faqs.map((f,i)=>(
              <div className={`faq-item ${openFaq===i?'open':''}`} key={i} onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{cursor:'pointer'}}>
                <h4>❓ {f.q} <span style={{float:'right',opacity:.5,fontSize:'.75rem'}}>{openFaq===i?'▲':'▼'}</span></h4>
                {openFaq===i && <p style={{marginTop:'.5rem',paddingTop:'.5rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

        {/* CTA CARDS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem',marginTop:'1rem'}}>
          {[
            { icon:'🎬', title:'AnimCreator Full Guide', desc:'Complete A–Z guide: all tools, panels, physics, particles, shaders, export and every feature explained.', to:'/tool-guide' },
            { icon:'💻', title:'CodeSpace Full Guide', desc:'Complete IDE documentation: file system, editor, terminal, Git panel, templates, all shortcuts.', to:'/tool-guide' },
            { icon:'🤔', title:'Why These Features?', desc:'Understand exactly how each MotionZync tool helps you build better websites and apps.', to:'/why-features' },
          ].map(c=>(
            <div key={c.to} style={{background:'rgba(20,20,35,.7)',border:'1px solid rgba(124,58,237,.18)',borderRadius:'14px',padding:'1.5rem',backdropFilter:'blur(12px)'}}>
              <span style={{fontSize:'1.8rem',display:'block',marginBottom:'.6rem'}}>{c.icon}</span>
              <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'.4rem'}}>{c.title}</h3>
              <p style={{fontSize:'.85rem',color:'#94a3b8',marginBottom:'.8rem'}}>{c.desc}</p>
              <Link to={c.to} className="btn-primary" style={{fontSize:'.82rem',padding:'.45rem .9rem'}}>Read Guide →</Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
              }
                            
