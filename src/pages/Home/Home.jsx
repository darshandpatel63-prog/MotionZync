import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Home.css'

// ─── UTILITY ──────────────────────────────────────────────────────────────────
function lerp(a,b,t){ return a+(b-a)*t }
function ease(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2 }
function clamp(v,mn,mx){ return Math.max(mn,Math.min(mx,v)) }

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
function Reveal({ children, className='', delay=0, from='bottom' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('revealed'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal reveal-${from} ${className}`}
         style={{ '--reveal-delay': `${delay}s` }}>
      {children}
    </div>
  )
}

// ─── 1. GLITCH TITLE ──────────────────────────────────────────────────────────
function GlitchText({ text }) {
  return (
    <span className="glitch-wrap" data-text={text}>
      {text}
    </span>
  )
}

// ─── 2. TYPEWRITER ───────────────────────────────────────────────────────────
function Typewriter({ texts, speed=60, pause=1800 }) {
  const [display, setDisplay] = useState('')
  const [ti, setTi]           = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const cur = texts[ti]
    let timeout
    if (!deleting && display === cur) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && display === '') {
      setDeleting(false)
      setTi(p => (p+1)%texts.length)
    } else {
      timeout = setTimeout(() => {
        setDisplay(p => deleting ? p.slice(0,-1) : cur.slice(0,p.length+1))
      }, deleting ? speed/2 : speed)
    }
    return () => clearTimeout(timeout)
  }, [display, deleting, ti, texts, speed, pause])

  return (
    <span className="typewriter">
      {display}<span className="cursor">|</span>
    </span>
  )
}

// ─── 3. WAVE TEXT ─────────────────────────────────────────────────────────────
function WaveText({ text, className='' }) {
  return (
    <span className={`wave-text ${className}`}>
      {text.split('').map((ch,i)=>(
        <span key={i} className="wave-char"
              style={{ animationDelay:`${i*0.07}s` }}>
          {ch===' '?'\u00A0':ch}
        </span>
      ))}
    </span>
  )
}

// ─── 4. SCRAMBLE TEXT ────────────────────────────────────────────────────────
function ScrambleText({ text, trigger }) {
  const [display, setDisplay] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
  useEffect(() => {
    if (!trigger) return
    let iter = 0, id
    id = setInterval(() => {
      setDisplay(() =>
        text.split('').map((ch,i) => {
          if (i < iter) return ch
          return chars[Math.floor(Math.random()*chars.length)]
        }).join('')
      )
      if (iter >= text.length) clearInterval(id)
      iter += 0.5
    }, 30)
    return () => clearInterval(id)
  }, [trigger, text])
  return <span className="scramble-text">{display}</span>
}

// ─── 5. PARTICLE MORPHING CANVAS (Hero BG) ───────────────────────────────────
function ParticleMorphHero() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let animId, t=0, W, H

    function resize(){
      W = cv.width  = cv.offsetWidth
      H = cv.height = cv.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const N = window.innerWidth < 600 ? 100 : 200
    const particles = Array.from({length:N}, (_,i) => ({
      px: Math.random()*800, py: Math.random()*600,
      hue: 240+Math.random()*60, size: 0.8+Math.random()*2
    }))

    function getTarget(shape, i, total){
      const cx=W/2, cy=H/2, R=Math.min(W,H)*0.28
      switch(shape%4){
        case 0:{ // circle
          const a=(i/total)*Math.PI*2
          return {x:cx+Math.cos(a)*R, y:cy+Math.sin(a)*R}
        }
        case 1:{ // square
          const s4=4, seg=Math.floor(i/(total/s4)), fr=(i%(total/s4))/(total/s4), d=R*1.35
          if(seg===0) return {x:cx-d+fr*2*d, y:cy-d}
          if(seg===1) return {x:cx+d,         y:cy-d+fr*2*d}
          if(seg===2) return {x:cx+d-fr*2*d,  y:cy+d}
          return           {x:cx-d,           y:cy+d-fr*2*d}
        }
        case 2:{ // triangle
          const s3=3, seg=Math.floor(i/(total/s3)), fr=(i%(total/s3))/(total/s3)
          const pts=[{x:cx,y:cy-R*1.3},{x:cx+R*1.2,y:cy+R*0.8},{x:cx-R*1.2,y:cy+R*0.8}]
          const a=pts[seg], b=pts[(seg+1)%3]
          return {x:a.x+(b.x-a.x)*fr, y:a.y+(b.y-a.y)*fr}
        }
        default:{ // star
          const a=(i/total)*Math.PI*10, outer=(Math.floor(i/total*10)%2===0)
          return {x:cx+Math.cos(a-Math.PI/2)*R*(outer?1:0.45), y:cy+Math.sin(a-Math.PI/2)*R*(outer?1:0.45)}
        }
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H)
      t+=0.005
      const cyclePos=t%4
      const shapeA=Math.floor(cyclePos), shapeB=(shapeA+1)%4
      const frac=ease(cyclePos%1)

      for(let i=0;i<N;i++){
        const p=particles[i]
        const a=getTarget(shapeA,i,N), b=getTarget(shapeB,i,N)
        const tx=lerp(a.x,b.x,frac), ty=lerp(a.y,b.y,frac)
        p.px=lerp(p.px,tx,0.045); p.py=lerp(p.py,ty,0.045)
        ctx.beginPath()
        ctx.arc(p.px,p.py,p.size,0,Math.PI*2)
        ctx.fillStyle=`hsla(${(p.hue+t*20)%360},80%,65%,0.65)`
        ctx.fill()
      }
      animId=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(animId); ro.disconnect() }
  },[])
  return <canvas ref={cvRef} className="particle-canvas"/>
}

// ─── 6. FLOATING ORBS ────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="orbs-wrap" aria-hidden>
      {[0,1,2,3].map(i => <div key={i} className={`orb orb-${i}`}/>)}
    </div>
  )
}

// ─── 7. SPOTLIGHT CURSOR ─────────────────────────────────────────────────────
function Spotlight() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const move = e => {
      el.style.setProperty('--mx', e.clientX+'px')
      el.style.setProperty('--my', e.clientY+'px')
    }
    window.addEventListener('mousemove', move, {passive:true})
    return () => window.removeEventListener('mousemove', move)
  },[])
  return <div ref={ref} className="spotlight" aria-hidden/>
}

// ─── 8. SCROLLYTELLING (FIXED with scroll math) ──────────────────────────────
const STORY = [
  { icon:'🎨', title:'Choose an Animation',
    desc:'100+ ready-made CSS & JS animations — backgrounds, particles, buttons, text effects. Browse and find your vibe.',
    visual:'gallery' },
  { icon:'⚡', title:'Customize Live',
    desc:'Change colors, sizes, speed, text — everything updates in real time inside the preview panel.',
    visual:'code' },
  { icon:'📋', title:'Copy the Code',
    desc:'One click — CSS and JS copied to clipboard. Paste anywhere: React, Vue, plain HTML.',
    visual:'copy' },
  { icon:'🚀', title:'Ship It',
    desc:'Your site now has stunning animations. Built in minutes, not days.',
    visual:'launch' },
]

function StoryCanvas({ type, active }) {
  const cvRef = useRef(null)
  const animRef = useRef(null)
  const tRef = useRef(0)

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width  = cv.offsetWidth  || 360
    cv.height = cv.offsetHeight || 280

    function drawGallery(){
      const W=cv.width, H=cv.height
      ctx.clearRect(0,0,W,H)
      for(let i=0;i<6;i++){
        const col=i%3, row=Math.floor(i/3)
        const x=16+col*(W/3), y=16+row*(H/2-12)
        const w=W/3-24, h=H/2-28, r=10
        const hue=240+i*25
        ctx.fillStyle=`hsla(${hue},65%,55%,0.18)`
        ctx.strokeStyle=`hsla(${hue},75%,65%,${active?0.7:0.25})`
        ctx.lineWidth=1.5
        ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill(); ctx.stroke()
        const dot=5+Math.sin(tRef.current*2+i)*3
        ctx.beginPath(); ctx.arc(x+22,y+18,dot,0,Math.PI*2)
        ctx.fillStyle=`hsl(${hue},80%,${active?72:45}%)`; ctx.fill()
      }
    }
    function drawCode(){
      const W=cv.width, H=cv.height
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='rgba(8,8,18,0.9)'; ctx.fillRect(0,0,W,H)
      const lines=[
        {c:'#06b6d4', t:'  .element {'},
        {c:'#a78bfa', t:`    color: #7c3aed;`},
        {c:'#fbbf24', t:`    transform: scale(`},
        {c:'#f9fafb', t:`      ${(1+Math.sin(tRef.current)*0.25).toFixed(2)}`},
        {c:'#fbbf24', t:'    );'},
        {c:'#06b6d4', t:'  }'},
      ]
      lines.forEach((l,i)=>{
        const prog=clamp((tRef.current*0.35-i*0.12),0,1)
        ctx.font=`${W<300?11:12}px monospace`
        ctx.fillStyle=active?l.c:l.c+'55'
        ctx.fillText(l.t.slice(0,Math.floor(l.t.length*prog)),20,44+i*30)
      })
    }
    function drawCopy(){
      const W=cv.width, H=cv.height, cx=W/2, cy=H/2
      ctx.clearRect(0,0,W,H)
      const pulse=active?(0.5+Math.sin(tRef.current*3)*0.5):0.2
      ctx.fillStyle=`rgba(124,58,237,${0.08+pulse*0.06})`
      ctx.strokeStyle=`rgba(124,58,237,${0.3+pulse*0.3})`
      ctx.lineWidth=1.5
      ctx.beginPath(); ctx.roundRect(cx-95,cy-55,190,110,12); ctx.fill(); ctx.stroke()
      ctx.fillStyle=`rgba(124,58,237,${0.5+pulse*0.5})`
      ctx.beginPath(); ctx.roundRect(cx-18,cy-18,36,36,6); ctx.fill()
      ctx.fillStyle='#fff'; ctx.font='bold 18px sans-serif'
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('⎘',cx,cy)
      for(let i=0;i<8;i++){
        const a=(i/8)*Math.PI*2+tRef.current*2, r=36+pulse*14
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2+pulse*2,0,Math.PI*2)
        ctx.fillStyle=`hsla(${260+i*12},80%,75%,${pulse})`; ctx.fill()
      }
    }
    function drawLaunch(){
      const W=cv.width, H=cv.height, cx=W/2, cy=H/2+10
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle=`rgba(124,58,237,${active?0.08:0.03})`
      ctx.beginPath(); ctx.arc(cx,cy-20,65,0,Math.PI*2); ctx.fill()
      ctx.save()
      ctx.translate(cx, cy-20-Math.sin(tRef.current*2)*(active?10:3))
      ctx.font='44px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('🚀',0,0); ctx.restore()
      for(let i=0;i<14;i++){
        const a=(tRef.current*0.4+i/14)*Math.PI*2
        const r=60+i*4
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy-20+Math.sin(a)*r*0.45, 1.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(200,180,255,${active?(0.3+Math.sin(tRef.current*2+i)*0.35):0.1})`
        ctx.fill()
      }
    }

    const drawFns = {gallery:drawGallery, code:drawCode, copy:drawCopy, launch:drawLaunch}

    function tick(){
      tRef.current += 0.04
      drawFns[type]?.()
      animRef.current = requestAnimationFrame(tick)
    }
    tick()
    return ()=> cancelAnimationFrame(animRef.current)
  }, [type, active])

  return <canvas ref={cvRef} className="story-canvas"/>
}

function ScrollySection() {
  const wrapRef  = useRef(null)
  const stepsRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    function onScroll(){
      const wrap = wrapRef.current
      if (!wrap) return
      const rect  = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0) return
      // How far we've scrolled into this section (0..1)
      const progress = clamp(-rect.top / total, 0, 1)
      setActive(Math.min(STORY.length-1, Math.floor(progress * STORY.length + 0.15)))
    }
    window.addEventListener('scroll', onScroll, {passive:true})
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <section className="scrolly-section" ref={wrapRef}>
      <div className="scrolly-inner container">
        {/* Sticky left panel */}
        <div className="scrolly-sticky-col">
          <Reveal>
            <h2 className="section-title">From Zero to <span className="gradient-text">Stunning</span></h2>
            <p className="section-sub">How MotionZync works — 4 simple steps</p>
          </Reveal>
          <div className="scrolly-visual-card">
            {STORY.map((s,i) => (
              <div key={i} className={`story-canvas-layer ${i===active?'visible':''}`}>
                <StoryCanvas type={s.visual} active={i===active}/>
              </div>
            ))}
            <div className="story-dots">
              {STORY.map((_,i)=>(
                <div key={i} className={`story-dot ${i===active?'active':''} ${i<active?'done':''}`}/>
              ))}
            </div>
            <div className="story-active-label">{String(active+1).padStart(2,'0')} / 04</div>
          </div>
        </div>

        {/* Scrollable right steps */}
        <div className="scrolly-steps-col" ref={stepsRef}>
          {STORY.map((s,i) => (
            <div key={i} className={`story-step ${i===active?'active':''}`}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-num">Step {String(i+1).padStart(2,'0')}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 9. MINI ANIMATION SHOWCASE ──────────────────────────────────────────────
function MiniAnim({ type }) {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = cv.offsetWidth || 200
    cv.height = cv.offsetHeight || 160
    let t=0, id
    const W=cv.width, H=cv.height, cx=W/2, cy=H/2

    const fns = {
      neon: () => {
        ctx.clearRect(0,0,W,H)
        ctx.fillStyle='#080818'; ctx.fillRect(0,0,W,H)
        for(let r=3;r>=1;r--){
          ctx.beginPath()
          ctx.arc(cx,cy,30+Math.sin(t*2)*10,0,Math.PI*2)
          ctx.strokeStyle=`rgba(124,58,237,${r===1?0.9:r===2?0.4:0.15})`
          ctx.lineWidth=r===1?2:r*4; ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2)
        ctx.fillStyle='#a78bfa'; ctx.fill()
      },
      orbit: () => {
        ctx.clearRect(0,0,W,H)
        ctx.fillStyle='#04040e'; ctx.fillRect(0,0,W,H)
        const rings=[{r:28,speed:1.2,col:'#06b6d4'},{r:44,speed:0.7,col:'#7c3aed'},{r:58,speed:0.4,col:'#ec4899'}]
        rings.forEach(ring=>{
          ctx.beginPath(); ctx.arc(cx,cy,ring.r,0,Math.PI*2)
          ctx.strokeStyle=ring.col+'33'; ctx.lineWidth=1; ctx.stroke()
          const a=t*ring.speed
          ctx.beginPath(); ctx.arc(cx+Math.cos(a)*ring.r, cy+Math.sin(a)*ring.r, 5,0,Math.PI*2)
          ctx.fillStyle=ring.col; ctx.fill()
          ctx.shadowBlur=12; ctx.shadowColor=ring.col; ctx.fill(); ctx.shadowBlur=0
        })
        ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2)
        ctx.fillStyle='#fff'; ctx.fill()
      },
      wave: () => {
        ctx.clearRect(0,0,W,H)
        ctx.fillStyle='#050510'; ctx.fillRect(0,0,W,H)
        for(let w=3;w>=1;w--){
          ctx.beginPath()
          for(let x=0;x<=W;x+=2){
            const y=cy+Math.sin(x*0.04+t*2)*20*(4-w)+Math.sin(x*0.08+t*3)*8
            x===0?ctx.moveTo(x,y):ctx.lineTo(x,y)
          }
          ctx.strokeStyle=`hsla(${220+w*20},80%,65%,${1/w})`
          ctx.lineWidth=3-w*0.5; ctx.stroke()
        }
      },
      matrix: () => {
        ctx.fillStyle='rgba(4,4,14,0.15)'; ctx.fillRect(0,0,W,H)
        ctx.fillStyle='#0f0'; ctx.font='10px monospace'
        for(let x=0;x<W;x+=12){
          const ch=String.fromCharCode(33+Math.floor(Math.random()*90))
          const y=(t*40+x*7)%H
          ctx.fillStyle=`rgba(0,${180+Math.random()*75},0,${0.5+Math.random()*0.5})`
          ctx.fillText(ch,x,y)
        }
      },
      dna: () => {
        ctx.clearRect(0,0,W,H)
        ctx.fillStyle='#030310'; ctx.fillRect(0,0,W,H)
        for(let y=0;y<H;y+=4){
          const prog=y/H, angle=prog*Math.PI*4+t
          const x1=cx+Math.cos(angle)*30, x2=cx-Math.cos(angle)*30
          if(y%20<4){
            ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y)
            ctx.strokeStyle=`rgba(99,102,241,${0.3+Math.sin(angle)*0.3})`
            ctx.lineWidth=1; ctx.stroke()
          }
          ctx.beginPath(); ctx.arc(x1,y,2,0,Math.PI*2)
          ctx.fillStyle=`hsl(${260+y},80%,65%)`; ctx.fill()
          ctx.beginPath(); ctx.arc(x2,y,2,0,Math.PI*2)
          ctx.fillStyle=`hsl(${200+y},80%,65%)`; ctx.fill()
        }
      },
      fireworks: () => {
        ctx.fillStyle='rgba(4,4,14,0.18)'; ctx.fillRect(0,0,W,H)
        const burst=Math.floor(t/3)%3
        const bx=[cx-30,cx+20,cx-10][burst], by=[cy-10,cy+15,cy-20][burst]
        const phase=(t*3)%3
        if(phase<1) {
          for(let i=0;i<16;i++){
            const a=(i/16)*Math.PI*2, r=phase*50
            ctx.beginPath(); ctx.arc(bx+Math.cos(a)*r, by+Math.sin(a)*r, 2,0,Math.PI*2)
            ctx.fillStyle=`hsla(${burst*60+i*15},90%,70%,${1-phase})`; ctx.fill()
          }
        }
      },
    }

    function tick(){ t+=0.035; fns[type]?.(); id=requestAnimationFrame(tick) }
    tick()
    return ()=> cancelAnimationFrame(id)
  },[type])
  return <canvas ref={cvRef} className="mini-anim-canvas"/>
}

const MINI_ANIMS = [
  { type:'neon',      label:'Neon Pulse',  color:'#7c3aed' },
  { type:'orbit',     label:'Orbit Ring',  color:'#06b6d4' },
  { type:'wave',      label:'Wave Flow',   color:'#3b82f6' },
  { type:'matrix',    label:'Matrix Rain', color:'#22c55e' },
  { type:'dna',       label:'DNA Helix',   color:'#8b5cf6' },
  { type:'fireworks', label:'Fireworks',   color:'#f59e0b' },
]

function AnimShowcase() {
  return (
    <section className="showcase-section container">
      <Reveal>
        <h2 className="section-title">Live Animations <span className="gradient-text">Preview</span></h2>
        <p className="section-sub">Rendered live — right here on the home page</p>
      </Reveal>
      <div className="showcase-grid">
        {MINI_ANIMS.map((a,i) => (
          <Reveal key={a.type} delay={i*0.07}>
            <Link to="/gallery" className="showcase-card">
              <MiniAnim type={a.type}/>
              <div className="showcase-label" style={{'--col':a.color}}>
                {a.label}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── 10. TEXT ANIMATIONS SHOWCASE ────────────────────────────────────────────
function TextAnimSection() {
  const [scramble1, setScramble1] = useState(false)
  const [scramble2, setScramble2] = useState(false)
  const ref = useRef(null)

  useEffect(()=>{
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ setScramble1(true); setTimeout(()=>setScramble2(true),400) }
    },{threshold:0.3})
    if(ref.current) io.observe(ref.current)
    return ()=>io.disconnect()
  },[])

  return (
    <section ref={ref} className="text-anim-section">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Text <span className="gradient-text">Animations</span></h2>
          <p className="section-sub">Typography that moves, breathes, and tells stories</p>
        </Reveal>

        <div className="text-anim-grid">
          {/* Wave text */}
          <div className="text-anim-card">
            <div className="text-anim-label">Wave Text</div>
            <div className="text-anim-demo">
              <WaveText text="MotionZync" className="demo-wave"/>
            </div>
          </div>

          {/* Gradient slide */}
          <div className="text-anim-card">
            <div className="text-anim-label">Gradient Slide</div>
            <div className="text-anim-demo">
              <span className="demo-gradient-slide">ANIMATE</span>
            </div>
          </div>

          {/* Scramble */}
          <div className="text-anim-card">
            <div className="text-anim-label">Scramble</div>
            <div className="text-anim-demo">
              <ScrambleText text="MOTION" trigger={scramble1}/>
            </div>
          </div>

          {/* Typewriter */}
          <div className="text-anim-card">
            <div className="text-anim-label">Typewriter</div>
            <div className="text-anim-demo">
              <Typewriter texts={['CSS Animations','JS Effects','Live Preview','Copy Ready']} speed={70}/>
            </div>
          </div>

          {/* Neon flicker */}
          <div className="text-anim-card">
            <div className="text-anim-label">Neon Flicker</div>
            <div className="text-anim-demo">
              <span className="demo-neon-flicker">NEON</span>
            </div>
          </div>

          {/* Glitch */}
          <div className="text-anim-card">
            <div className="text-anim-label">Glitch</div>
            <div className="text-anim-demo">
              <GlitchText text="GLITCH"/>
            </div>
          </div>

          {/* Blur in */}
          <div className="text-anim-card">
            <div className="text-anim-label">Blur Reveal</div>
            <div className="text-anim-demo">
              <span className="demo-blur-in">REVEAL</span>
            </div>
          </div>

          {/* Stamp */}
          <div className="text-anim-card">
            <div className="text-anim-label">Stamp In</div>
            <div className="text-anim-demo">
              <span className="demo-stamp">STAMP!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 11. VIDEO SCRUB (FIXED) ──────────────────────────────────────────────────
function VideoScrubSection() {
  const sectionRef = useRef(null)
  const cvRef      = useRef(null)
  const progRef    = useRef(0)
  const curRef     = useRef(0)
  const rafRef     = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const cv      = cvRef.current
    if (!section || !cv) return
    const ctx = cv.getContext('2d')

    function resize() {
      cv.width  = cv.parentElement ? cv.parentElement.offsetWidth  : window.innerWidth
      cv.height = cv.parentElement ? cv.parentElement.offsetHeight : window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    function drawFrame(p) {
      const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2
      ctx.clearRect(0, 0, W, H)

      const h1 = 200 + p * 120, h2 = 260 + p * 80
      const grd = ctx.createLinearGradient(0, 0, W, H)
      grd.addColorStop(0, `hsl(${h1},75%,5%)`)
      grd.addColorStop(1, `hsl(${h2},60%,9%)`)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(150,100,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 55) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y = 0; y < H; y += 55) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

      // Orbital rings
      for (let i = 0; i < 7; i++) {
        const R     = 60 + i * 55 + p * 40
        const angle = p * Math.PI * 3 * (i % 2 === 0 ? 1 : -0.8) + i * 0.7
        const hue   = h1 + i * 18
        const alpha = Math.max(0, 0.45 - i * 0.045)
        ctx.strokeStyle = `hsla(${hue},80%,65%,${alpha})`
        ctx.lineWidth   = 2.5 - i * 0.2
        ctx.beginPath()
        ctx.ellipse(cx, cy, R, R * (0.28 + i * 0.04), angle, 0, Math.PI * 2)
        ctx.stroke()
        const dx = Math.cos(angle) * R
        const dy = Math.sin(angle) * R * (0.28 + i * 0.04)
        ctx.beginPath()
        ctx.arc(cx + dx, cy + dy, 4.5 - i * 0.3, 0, Math.PI * 2)
        ctx.fillStyle   = `hsl(${hue},90%,72%)`
        ctx.shadowBlur  = 12
        ctx.shadowColor = `hsl(${hue},90%,72%)`
        ctx.fill(); ctx.shadowBlur = 0
      }

      // Center morphing polygon
      const sides = Math.floor(3 + p * 7), R0 = 36 + p * 18
      ctx.beginPath()
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * Math.PI * 2 - Math.PI / 2
        const r = R0 + Math.sin(p * Math.PI * 4 + i) * 7
        i === 0 ? ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
                : ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
      }
      ctx.closePath()
      ctx.fillStyle   = `hsla(${h1},80%,65%,0.18)`
      ctx.strokeStyle = `hsl(${h1},90%,75%)`
      ctx.lineWidth = 2; ctx.fill(); ctx.stroke()

      // Floating particles
      const particleCount = Math.floor(p * 60)
      for (let i = 0; i < particleCount; i++) {
        const px = cx + Math.cos(i * 2.4) * (80 + i * 4.5)
        const py = cy + Math.sin(i * 1.8) * (50 + i * 3)
        ctx.beginPath()
        ctx.arc(px, py, 1.5 + Math.sin(i), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${h1 + i * 6},80%,70%,${0.15 + p * 0.5})`
        ctx.fill()
      }

      // Text — fade in at 20%, fade out at 80%
      const ta = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1
      ctx.save(); ctx.globalAlpha = ta
      const fs = Math.round(clamp(W * 0.045, 22, 52))
      ctx.font = `900 ${fs}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(0,0,0,0.8)'
      const tg = ctx.createLinearGradient(cx - 200, 0, cx + 200, 0)
      tg.addColorStop(0, '#a78bfa'); tg.addColorStop(0.5, '#06b6d4'); tg.addColorStop(1, '#a78bfa')
      ctx.fillStyle = tg
      ctx.fillText('Animation is Motion', cx, cy - fs * 0.8)
      ctx.shadowBlur = 0
      ctx.font = `500 ${Math.round(fs * 0.42)}px sans-serif`
      ctx.fillStyle = 'rgba(200,200,255,0.75)'
      ctx.fillText('Every frame tells a story — scroll to feel it', cx, cy + fs * 0.55)
      ctx.restore()

      // Progress bar
      const bw = Math.min(480, W * 0.55), bh = 3, bx = (W - bw) / 2, by = H - 36
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 2); ctx.fill()
      ctx.fillStyle = `hsl(${h1},80%,65%)`
      ctx.beginPath(); ctx.roundRect(bx, by, bw * p, bh, 2); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(p < 0.02 ? '↓  scroll to begin' : p > 0.97 ? '✓  complete' : `${Math.round(p * 100)}%`, W / 2, H - 14)
    }

    function onScroll() {
      const rect  = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      progRef.current = Math.max(0, Math.min(1, -rect.top / Math.max(total, 1)))
    }

    function animate() {
      curRef.current += (progRef.current - curRef.current) * 0.06
      drawFrame(curRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll(); animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="scrub-section">
      <div className="scrub-sticky">
        <canvas ref={cvRef} className="scrub-canvas"/>
      </div>
    </section>
  )
}

// ─── 12. MORPHING STATS ───────────────────────────────────────────────────────
function MorphStat({ value, label, idx }) {
  const ref    = useRef(null)
  const [vis,  setVis]   = useState(false)
  const [num,  setNum]   = useState(0)

  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setVis(true);io.disconnect()}
    },{threshold:0.4})
    if(ref.current) io.observe(ref.current)
    return ()=>io.disconnect()
  },[])

  useEffect(()=>{
    if(!vis) return
    const n=parseInt(value)||0; if(!n) return
    let start=null
    const step=ts=>{
      if(!start) start=ts
      const p=clamp((ts-start)/1400,0,1)
      setNum(Math.floor((1-Math.pow(1-p,3))*n))
      if(p<1) setTimeout(()=>requestAnimationFrame(step),idx*180)
    }
    setTimeout(()=>requestAnimationFrame(step),idx*180)
  },[vis])

  const svgPaths=[
    "M50,8 A42,42 0 1,1 49.9,8",
    "M8,8 L92,8 L92,92 L8,92 Z",
    "M50,4 L96,88 L4,88 Z",
    "M50,4 L62,36 L96,36 L69,58 L80,92 L50,70 L20,92 L31,58 L4,36 L38,36 Z"
  ]
  const colors=['#7c3aed','#06b6d4','#10b981','#f59e0b']
  const display=parseInt(value)?`${num}${value.replace(/[0-9]/g,'')}`:value

  return (
    <div ref={ref} className={`morph-stat ${vis?'vis':''}`}
         style={{'--sd':`${idx*0.15}s`,'--col':colors[idx%4]}}>
      <div className="morph-svg-wrap">
        <svg viewBox="0 0 100 100" className="morph-svg">
          <path d={svgPaths[idx%4]} fill="none" stroke={colors[idx%4]} strokeWidth="3"
                className={`morph-path ${vis?'drawn':''}`}/>
          <circle cx="50" cy="50" r="44" fill={colors[idx%4]} opacity="0.06"/>
        </svg>
        <div className="morph-num">{display}</div>
      </div>
      <div className="morph-lbl">{label}</div>
    </div>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
const TAGS=['CSS Animations','JavaScript','Canvas API','Particle FX','Scroll FX','Kinetic Text','SVG Morph','WebGL','GSAP-style','React','Vue','Vanilla JS','Framer Motion','Keyframes']
function Marquee() {
  const doubled = [...TAGS,...TAGS]
  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee-track">
        {doubled.map((t,i)=>(
          <span key={i} className="marquee-tag">#{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN HOME ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="home-page">
      <Spotlight/>

      {/* HERO */}
      <section className="hero-section">
        <ParticleMorphHero/>
        <FloatingOrbs/>
        <div className="hero-content container">
          <Reveal delay={0.05}>
            <span className="hero-badge">✦ Free Live Animation Platform</span>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className="hero-title">
              <GlitchText text="MotionZync"/><br/>
              <span className="hero-sub-line">
                <Typewriter texts={['CSS Animations','JS Effects','Canvas Art','Scroll Magic','Particle FX']} speed={65}/>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="hero-desc">
              Free live CSS & JavaScript animation playground. Browse 100+ animations,
              customize live, copy code — and now submit your own.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="hero-actions">
              <Link to="/playground" className="btn-primary hero-cta glow-btn magnetic">⚡ Try Playground</Link>
              <Link to="/gallery"    className="btn-secondary hero-cta magnetic">Browse Gallery →</Link>
            </div>
          </Reveal>
        </div>
        <div className="hero-scroll-hint">
          <span>scroll to explore</span>
          <div className="scroll-chevrons"><div/><div/><div/></div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee/>

      {/* SCROLLYTELLING */}
      <ScrollySection/>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* LIVE ANIMATION SHOWCASE */}
      <AnimShowcase/>

      {/* TEXT ANIMATIONS */}
      <TextAnimSection/>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* VIDEO SCRUB */}
      <VideoScrubSection/>

      {/* STATS */}
      <section className="stats-section container">
        <Reveal>
          <h2 className="section-title">By the <span className="gradient-text">Numbers</span></h2>
        </Reveal>
        <div className="morph-stats-row">
          {[
            {v:'100+',l:'Animations',    i:0},
            {v:'Free', l:'Forever',      i:1},
            {v:'4',    l:'Tab Customize', i:2},
            {v:'1',    l:'Click Copy',    i:3},
          ].map(s=><MorphStat key={s.l} value={s.v} label={s.l} idx={s.i}/>)}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* FEATURES */}
      <section className="features-section container">
        <Reveal>
          <h2 className="section-title">Why Choose <span className="gradient-text">MotionZync?</span></h2>
        </Reveal>
        <div className="features-grid">
          {features.map((f,i)=>(
            <Reveal key={f.title} delay={i*0.06}>
              <div className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3><p>{f.desc}</p>
                {f.link&&<Link to={f.link} className="feature-link">{f.linkText} →</Link>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>

      {/* OTHER SITES */}
      <section className="other-sites-section container">
        <Reveal>
          <h2 className="section-title">Our Other <span className="gradient-text">Websites</span></h2>
        </Reveal>
        <div className="other-sites-grid">
          {[
            {href:'https://dd-tech-labs-hub.vercel.app',icon:'🧰',title:'DD Tech Labs',desc:'Apps and tools by DD Tech Labs'},
            {href:'https://shree-hari-mahendi-art.vercel.app',icon:'🌸',title:'Shree Hari Mehendi',desc:'Beautiful traditional mehendi designs'},
          ].map((s,i)=>(
            <Reveal key={s.href} delay={i*0.1}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="other-site-card">
                <span>{s.icon}</span><h3>{s.title}</h3><p>{s.desc}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/></div>
    </div>
  )
}

const features=[
  {icon:'⚡',title:'Live Playground',  desc:'Type CSS or JavaScript and see animation run instantly. No setup required!',           link:'/playground',linkText:'Open Playground'},
  {icon:'🎨',title:'100+ Animations',  desc:'Backgrounds, buttons, particles, canvas, text effects — all free.',                    link:'/gallery',   linkText:'View Gallery'},
  {icon:'📚',title:'Animation Course', desc:'Learn CSS & JS animation from scratch with live demos.',                               link:'/course',    linkText:'Start Learning'},
  {icon:'🔍',title:'Smart Search',     desc:'Search by title, tag, or category. Find exactly what you need fast.',                  link:null},
  {icon:'📋',title:'Copy-Ready Code',  desc:'One-click copy CSS and JavaScript code. Ready to paste anywhere.',                     link:null},
  {icon:'🔒',title:'100% Secure',      desc:'All code runs in sandboxed iframes. Your device is always safe.',                      link:null},
]
