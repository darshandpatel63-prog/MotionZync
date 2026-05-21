import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Home.css'

// ─── 1. CANVAS PARTICLE MORPHING (Hero BG) ────────────────────────────────────
function ParticleMorphCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0, W, H, particles = []

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Shapes: circle, square, triangle, star
    function shapePoint(shape, i, total) {
      const cx = W/2, cy = H/2
      const R  = Math.min(W, H) * 0.28
      let angle, x, y
      switch(shape) {
        case 0: // circle
          angle = (i/total)*Math.PI*2
          return { x: cx + Math.cos(angle)*R, y: cy + Math.sin(angle)*R }
        case 1: // square
          const side = 4, seg = Math.floor(i/(total/side)), frac = (i%(total/side))/(total/side)
          const d = R*1.4
          if (seg===0) return { x: cx-d+frac*2*d, y: cy-d }
          if (seg===1) return { x: cx+d,          y: cy-d+frac*2*d }
          if (seg===2) return { x: cx+d-frac*2*d, y: cy+d }
          return           { x: cx-d,             y: cy+d-frac*2*d }
        case 2: // triangle
          const side3 = 3, seg3 = Math.floor(i/(total/side3)), frac3 = (i%(total/side3))/(total/side3)
          const pts = [
            {x:cx,     y:cy-R*1.3},
            {x:cx+R*1.2, y:cy+R*0.8},
            {x:cx-R*1.2, y:cy+R*0.8},
          ]
          const from3 = pts[seg3], to3 = pts[(seg3+1)%3]
          return { x:from3.x+(to3.x-from3.x)*frac3, y:from3.y+(to3.y-from3.y)*frac3 }
        default: // star
          const k = i/total, starAngle = k*Math.PI*10, isOuter = Math.floor(k*10)%2===0
          const sr = isOuter ? R : R*0.45
          return { x: cx + Math.cos(starAngle-Math.PI/2)*sr, y: cy + Math.sin(starAngle-Math.PI/2)*sr }
      }
    }

    const N = window.innerWidth < 600 ? 120 : 220
    for (let i=0; i<N; i++) {
      particles.push({
        px: Math.random()*W, py: Math.random()*H,
        color: `hsl(${Math.random()*60+240},80%,${Math.random()*30+55}%)`,
        size: Math.random()*2+0.6, speed: 0.012+Math.random()*0.006,
        shapeIdx: 0, progress: Math.random()
      })
    }

    const SHAPES = 4
    function lerp(a,b,t){ return a+(b-a)*t }
    function ease(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2 }

    function draw() {
      ctx.clearRect(0,0,W,H)
      t += 0.004
      const cycleLen = 3 // seconds worth of frames roughly
      const globalT = (t%(SHAPES)) 
      const shapeA = Math.floor(globalT)%SHAPES
      const shapeB = (shapeA+1)%SHAPES
      const shapeFrac = ease(globalT%1)

      for (let i=0; i<N; i++) {
        const p = particles[i]
        const a = shapePoint(shapeA, i, N)
        const b = shapePoint(shapeB, i, N)
        const tx = lerp(a.x, b.x, shapeFrac)
        const ty = lerp(a.y, b.y, shapeFrac)
        p.px = lerp(p.px, tx, 0.04)
        p.py = lerp(p.py, ty, 0.04)

        ctx.beginPath()
        ctx.arc(p.px, p.py, p.size, 0, Math.PI*2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.7
        ctx.fill()
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particle-canvas"/>
}

// ─── 2. KINETIC TYPOGRAPHY ─────────────────────────────────────────────────────
function KineticTitle({ text, className='' }) {
  return (
    <span className={`kinetic-title ${className}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="kinetic-char"
          style={{
            animationDelay: `${i*0.055}s`,
            '--i': i,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

// ─── 3. TEXT REVEAL on scroll ──────────────────────────────────────────────────
function RevealText({ children, className='', delay=0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('revealed'); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal-text ${className}`} style={{ '--delay': `${delay}s` }}>
      {children}
    </div>
  )
}

// ─── 4. SCROLLYTELLING ────────────────────────────────────────────────────────
const storySteps = [
  {
    icon: '🎨',
    title: 'Choose an Animation',
    desc:  '100+ ready-made CSS & JS animations — backgrounds, particles, buttons, text effects. Browse and find your vibe.',
    visual: 'gallery',
  },
  {
    icon: '⚡',
    title: 'Customize It Live',
    desc:  'Change colors, sizes, speed — everything updates in real time. No reload. No re-compile.',
    visual: 'code',
  },
  {
    icon: '📋',
    title: 'Copy the Code',
    desc:  'One click — CSS and JS code copied to clipboard. Paste it anywhere: React, Vue, plain HTML.',
    visual: 'copy',
  },
  {
    icon: '🚀',
    title: 'Ship It',
    desc:  'Your website now has stunning animations that users remember. Built in minutes, not days.',
    visual: 'launch',
  },
]

function StoryVisual({ type }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth || 300
    const H = canvas.height = canvas.offsetHeight || 220
    let animId, t=0

    const draws = {
      gallery: () => {
        ctx.clearRect(0,0,W,H)
        for (let i=0;i<6;i++) {
          const x=(i%3)*(W/3)+16, y=Math.floor(i/2)*(H/2)+14
          const hue=240+i*25
          ctx.fillStyle=`hsla(${hue},70%,60%,0.18)`
          ctx.strokeStyle=`hsla(${hue},80%,65%,0.5)`
          ctx.lineWidth=1.5
          const r=10
          ctx.beginPath()
          ctx.roundRect(x,y,W/3-32,H/2-28,r)
          ctx.fill(); ctx.stroke()
          // animated dot
          ctx.beginPath()
          ctx.arc(x+20, y+16, 5+Math.sin(t*2+i)*3, 0, Math.PI*2)
          ctx.fillStyle=`hsl(${hue},80%,70%)`
          ctx.fill()
        }
      },
      code: () => {
        ctx.clearRect(0,0,W,H)
        ctx.fillStyle='rgba(10,10,20,0.8)'
        ctx.fillRect(0,0,W,H)
        const lines=['  .element {','    color: #7c3aed;','    transform: scale(',`      ${(1+Math.sin(t)*0.3).toFixed(2)}`,`    );`,'  }']
        lines.forEach((l,i)=>{
          const prog = Math.min(1,(t*0.4-i*0.15))
          if(prog<=0) return
          const chars = Math.floor(l.length*prog)
          ctx.font=`${W<300?11:13}px monospace`
          ctx.fillStyle=i===0||i===5?'#06b6d4':i===3?'#f59e0b':'#a78bfa'
          ctx.fillText(l.slice(0,chars), 24, 38+i*28)
        })
      },
      copy: () => {
        ctx.clearRect(0,0,W,H)
        const cx=W/2, cy=H/2
        const pulse = 0.5+Math.sin(t*3)*0.5
        // code block
        ctx.fillStyle='rgba(124,58,237,0.1)'
        ctx.strokeStyle='rgba(124,58,237,0.4)'
        ctx.lineWidth=1
        ctx.beginPath(); ctx.roundRect(cx-90,cy-50,180,100,8); ctx.fill(); ctx.stroke()
        // copy icon
        ctx.fillStyle=`rgba(124,58,237,${0.6+pulse*0.4})`
        ctx.beginPath(); ctx.roundRect(cx-16,cy-16,28,28,4); ctx.fill()
        ctx.fillStyle='#fff'
        ctx.font='bold 16px sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText('⎘',cx,cy)
        // particles on copy
        for(let i=0;i<8;i++){
          const a=(i/8)*Math.PI*2+(t*2), r=30+pulse*15
          ctx.beginPath()
          ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 2+pulse*2,0,Math.PI*2)
          ctx.fillStyle=`hsla(${260+i*10},80%,75%,${pulse})`
          ctx.fill()
        }
      },
      launch: () => {
        ctx.clearRect(0,0,W,H)
        const cx=W/2, cy=H/2+20
        // rocket
        ctx.save()
        ctx.translate(cx, cy - Math.sin(t*2)*8)
        ctx.font='40px sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText('🚀',0,0)
        ctx.restore()
        // stars
        for(let i=0;i<12;i++){
          const a=(t*0.3+i/12)*Math.PI*2, r=55+i*5
          const alpha=0.3+Math.sin(t*3+i)*0.4
          ctx.beginPath()
          ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r*0.5-20, 1.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(200,180,255,${alpha})`
          ctx.fill()
        }
        ctx.fillStyle='rgba(124,58,237,0.08)'
        ctx.beginPath(); ctx.arc(cx,cy-20,60,0,Math.PI*2); ctx.fill()
      }
    }

    function tick() {
      t += 0.03
      draws[type]?.()
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(animId)
  }, [type])
  return <canvas ref={canvasRef} className="story-visual-canvas"/>
}

function ScrollySection() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current; if (!section) return
    const steps = section.querySelectorAll('.story-step')
    const ios = []
    steps.forEach((el, i) => {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setActive(i)
      }, { threshold: 0.55, rootMargin:'-10% 0px -10% 0px' })
      io.observe(el); ios.push(io)
    })
    return () => ios.forEach(io => io.disconnect())
  }, [])

  return (
    <section className="scrolly-section" ref={sectionRef}>
      <div className="container">
        <RevealText>
          <h2 className="section-title">From Zero to <span className="gradient-text">Stunning</span></h2>
          <p className="section-sub">How MotionZync works — in 4 simple steps</p>
        </RevealText>
        <div className="scrolly-body">
          {/* Sticky visual */}
          <div className="scrolly-sticky">
            <div className="scrolly-visual-wrap">
              <StoryVisual type={storySteps[active].visual}/>
              <div className="scrolly-step-indicator">
                {storySteps.map((_, i) => (
                  <div key={i} className={`step-dot ${i===active?'active':''} ${i<active?'done':''}`}/>
                ))}
              </div>
            </div>
          </div>
          {/* Steps */}
          <div className="scrolly-steps">
            {storySteps.map((s, i) => (
              <div key={i} className={`story-step ${i===active?'active':''}`}>
                <div className="story-step-inner">
                  <div className="story-num">{String(i+1).padStart(2,'0')}</div>
                  <div className="story-icon">{s.icon}</div>
                  <h3 className="story-title">{s.title}</h3>
                  <p className="story-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 5. STATE-MACHINE SCROLL MORPHING (Stats) ─────────────────────────────────
function MorphStat({ value, label, index }) {
  const ref   = useRef(null)
  const svgRef= useRef(null)
  const [visible, setVisible] = useState(false)
  const [count,   setCount]   = useState(0)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(el); return () => io.disconnect()
  }, [])

  // Count-up
  useEffect(() => {
    if (!visible) return
    const num = parseInt(value) || 0
    if (!num) return
    let start = 0, dur = 1400, startTime = null
    function step(ts) {
      if (!startTime) startTime = ts
      const prog = Math.min((ts-startTime)/dur, 1)
      const eased = 1 - Math.pow(1-prog, 3)
      setCount(Math.floor(eased*num))
      if (prog < 1) requestAnimationFrame(step)
    }
    setTimeout(() => requestAnimationFrame(step), index*200)
  }, [visible])

  // SVG Morph
  const paths = [
    "M50,10 A40,40 0 1,1 49.9,10",                          // circle
    "M10,10 L90,10 L90,90 L10,90 Z",                         // square
    "M50,5 L95,85 L5,85 Z",                                  // triangle
    "M50,5 L61,35 L95,35 L68,57 L79,91 L50,70 L21,91 L32,57 L5,35 L39,35 Z" // star
  ]
  const morphPath = paths[index % paths.length]
  const morphColor = [`#7c3aed`,`#06b6d4`,`#10b981`,`#f59e0b`][index%4]

  const numDisplay = parseInt(value) ? `${count}${value.replace(/[0-9]/g,'')}` : value

  return (
    <div ref={ref} className={`morph-stat ${visible?'visible':''}`} style={{'--delay':`${index*0.15}s`}}>
      <div className="morph-svg-wrap">
        <svg viewBox="0 0 100 100" className="morph-svg">
          <path
            d={morphPath}
            fill="none"
            stroke={morphColor}
            strokeWidth="3"
            className={`morph-path ${visible?'morphed':''}`}
            style={{'--color': morphColor}}
          />
          <circle cx="50" cy="50" r="42" fill={morphColor} opacity="0.07"/>
        </svg>
        <div className="morph-value">{numDisplay}</div>
      </div>
      <div className="morph-label">{label}</div>
    </div>
  )
}

// ─── 6. VIDEO SCRUBBING (Simulated with Canvas) ────────────────────────────────
function VideoScrubSection() {
  const ref    = useRef(null)
  const canvas = useRef(null)
  const prog   = useRef(0)
  const animId = useRef(null)

  useEffect(() => {
    const section = ref.current
    const cv      = canvas.current
    if (!section || !cv) return
    const ctx = cv.getContext('2d')
    const W = cv.width  = cv.offsetWidth  || 600
    const H = cv.height = cv.offsetHeight || 300

    function drawFrame(p) {
      // p = 0..1 — simulate scrubbing through an "animation sequence"
      ctx.clearRect(0,0,W,H)

      // Background gradient shifts
      const hue1 = 220 + p*100
      const hue2 = 260 + p*80
      const grd = ctx.createLinearGradient(0,0,W,H)
      grd.addColorStop(0, `hsl(${hue1},70%,8%)`)
      grd.addColorStop(1, `hsl(${hue2},60%,12%)`)
      ctx.fillStyle = grd
      ctx.fillRect(0,0,W,H)

      // Grid lines
      ctx.strokeStyle='rgba(150,100,255,0.06)'
      ctx.lineWidth=1
      for(let i=0;i<W;i+=40){ ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke() }
      for(let j=0;j<H;j+=40){ ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke() }

      // Orbiting rings
      const cx=W/2, cy=H/2
      for (let ring=0;ring<5;ring++) {
        const r  = 40 + ring*30
        const rot= p*Math.PI*2*(ring%2===0?1:-1) + ring*0.5
        const col= `hsla(${hue1+ring*20},80%,${60+ring*5}%,${0.4-ring*0.06})`
        ctx.strokeStyle=col
        ctx.lineWidth=2-ring*0.2
        ctx.beginPath()
        ctx.ellipse(cx, cy, r, r*0.35, rot, 0, Math.PI*2)
        ctx.stroke()
        // dot on ring
        ctx.beginPath()
        ctx.arc(cx+Math.cos(rot)*r, cy+Math.sin(rot)*r*0.35, 4-ring*0.3, 0, Math.PI*2)
        ctx.fillStyle=col; ctx.fill()
      }

      // Center morphing shape
      const sides = Math.floor(3 + p*5)
      ctx.beginPath()
      for(let i=0;i<=sides;i++){
        const a = (i/sides)*Math.PI*2 - Math.PI/2
        const r2 = 25 + Math.sin(p*Math.PI*4+i)*8
        const x  = cx + Math.cos(a)*r2
        const y  = cy + Math.sin(a)*r2
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      }
      ctx.closePath()
      ctx.fillStyle=`hsla(${hue1},80%,65%,0.3)`
      ctx.strokeStyle=`hsl(${hue1},90%,75%)`
      ctx.lineWidth=2; ctx.fill(); ctx.stroke()

      // Progress bar
      const bw=W*0.6, bh=4, bx=(W-bw)/2, by=H-28
      ctx.fillStyle='rgba(255,255,255,0.1)'
      ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,bh/2); ctx.fill()
      ctx.fillStyle=`hsl(${hue1},80%,65%)`
      ctx.beginPath(); ctx.roundRect(bx,by,bw*p,bh,bh/2); ctx.fill()

      // Label
      ctx.fillStyle='rgba(255,255,255,0.6)'
      ctx.font=`11px sans-serif`
      ctx.textAlign='center'
      ctx.fillText(`scroll to scrub — ${Math.floor(p*100)}%`, W/2, H-8)
    }

    function onScroll() {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const total = section.offsetHeight - vh
      const scrolled = -rect.top
      const p = Math.max(0, Math.min(1, scrolled / (total > 0 ? total : 1)))
      prog.current = p
    }

    let targetP = 0, currentP = 0
    function animate() {
      targetP = prog.current
      currentP += (targetP - currentP) * 0.08
      drawFrame(currentP)
      animId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', onScroll, { passive:true })
    animate()

    return () => {
      cancelAnimationFrame(animId.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={ref} className="video-scrub-section">
      <div className="scrub-sticky">
        <canvas ref={canvas} className="scrub-canvas"/>
        <div className="scrub-overlay">
          <RevealText>
            <h2 className="scrub-title">Animation is <span className="gradient-text">Motion</span></h2>
            <p className="scrub-sub">Every frame tells a story. Scroll to feel it.</p>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN HOME ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <ParticleMorphCanvas/>
        <div className="hero-content container">
          <RevealText delay={0}>
            <span className="hero-badge">✦ Free Live Animation Platform</span>
          </RevealText>
          <RevealText delay={0.1}>
            <h1 className="hero-title">
              <KineticTitle text="Create & Explore" className="gradient-text"/>
              <br/>
              <KineticTitle text="Beautiful Animations"/>
            </h1>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="hero-desc">
              Free live CSS & JavaScript animation playground. Browse 100+ background animations,
              button effects, canvas animations and more.
            </p>
          </RevealText>
          <RevealText delay={0.3}>
            <div className="hero-actions">
              <Link to="/playground" className="btn-primary hero-cta glow-btn">⚡ Try Live Playground</Link>
              <Link to="/gallery"    className="btn-secondary hero-cta">Browse Gallery →</Link>
            </div>
          </RevealText>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"/>
        </div>
      </section>

      {/* ── SCROLLYTELLING ── */}
      <ScrollySection/>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* ── STATE-MACHINE MORPHING STATS ── */}
      <section className="stats-section container">
        <RevealText>
          <h2 className="section-title">By the <span className="gradient-text">Numbers</span></h2>
        </RevealText>
        <div className="morph-stats-grid">
          <MorphStat value="100+" label="Animations"       index={0}/>
          <MorphStat value="Free" label="Forever"          index={1}/>
          <MorphStat value="4"    label="Customizable"     index={2}/>
          <MorphStat value="1"    label="Click to Copy"    index={3}/>
        </div>
      </section>

      {/* ── VIDEO SCRUB SECTION ── */}
      <VideoScrubSection/>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* ── FEATURES ── */}
      <section className="features-section container">
        <RevealText>
          <h2 className="section-title">Why Choose <span className="gradient-text">MotionZync?</span></h2>
        </RevealText>
        <div className="features-grid">
          {features.map((f, i) => (
            <RevealText key={f.title} delay={i*0.06}>
              <div className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                {f.link && <Link to={f.link} className="feature-link">{f.linkText} →</Link>}
              </div>
            </RevealText>
          ))}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* ── OTHER SITES ── */}
      <section className="other-sites-section container">
        <RevealText>
          <h2 className="section-title">Our Other <span className="gradient-text">Websites</span></h2>
        </RevealText>
        <div className="other-sites-grid">
          {[
            { href:'https://vaidya-guru.vercel.app',           icon:'🏥', title:'Vaidya Guru',        desc:'Health & Ayurveda guidance' },
            { href:'https://wealth-kavach.vercel.app',         icon:'💰', title:'Wealth Kavach',       desc:'Finance & investment insights' },
            { href:'https://shree-hari-mahendi-art.vercel.app',icon:'🌸', title:'Shree Hari Mehendi',  desc:'Traditional mehendi designs' },
          ].map((s,i) => (
            <RevealText key={s.href} delay={i*0.1}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="other-site-card">
                <span>{s.icon}</span><h3>{s.title}</h3><p>{s.desc}</p>
              </a>
            </RevealText>
          ))}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

    </div>
  )
}

const features = [
  { icon:'⚡', title:'Live Playground',  desc:'Type CSS or JavaScript and see animation run instantly. No setup required!',            link:'/playground', linkText:'Open Playground' },
  { icon:'🎨', title:'100+ Animations',  desc:'Browse backgrounds, button effects, particle systems, canvas animations and more.',     link:'/gallery',    linkText:'View Gallery' },
  { icon:'📚', title:'Animation Course', desc:'Learn CSS and JavaScript animation from scratch — complete free course with live demos.',link:'/course',     linkText:'Start Learning' },
  { icon:'🖼️', title:'Live Wallpaper',   desc:'Download any animation as a live HTML wallpaper. Watch a short ad to support us.',      link:'/wallpaper',  linkText:'Get Wallpapers' },
  { icon:'🔍', title:'Smart Search',     desc:'Search by title, #tag, or filter by category. Find exactly what you need fast.',        link:null },
  { icon:'📋', title:'Copy-Ready Code',  desc:'One-click copy CSS and JavaScript code. Preview BG color also shown.',                  link:null },
  { icon:'🔒', title:'100% Secure',      desc:'All code runs in sandboxed iframes — completely isolated. Your device is safe.',        link:null },
  { icon:'📱', title:'Mobile Friendly',  desc:'Works perfectly on phones and tablets. Code, preview, and download anywhere.',          link:null },
]
