import { useState, useEffect, useRef, useCallback } from 'react'
import './Tools.css'

// ══════════════════════════════════════════════════════════════
// TOOL 1 — Cubic Bezier Visual Editor
// ══════════════════════════════════════════════════════════════

const PRESETS = [
  { name:'ease',         p:[0.25,0.1,0.25,1.0]  },
  { name:'ease-in',      p:[0.42,0,1.0,1.0]      },
  { name:'ease-out',     p:[0,0,0.58,1.0]         },
  { name:'ease-in-out',  p:[0.42,0,0.58,1.0]      },
  { name:'linear',       p:[0,0,1,1]              },
  { name:'spring',       p:[0.34,1.56,0.64,1]     },
  { name:'snappy',       p:[0.19,1,0.22,1]        },
  { name:'bounce',       p:[0.68,-0.55,0.27,1.55] },
]

function BezierCanvas({ p1, p2, onChange }) {
  const cvRef    = useRef(null)
  const dragging = useRef(null)  // 'p1' | 'p2' | null
  const SIZE     = 260
  const PAD      = 30

  // Convert bezier coords (0–1) to canvas px
  function toCanvas(bx, by) {
    return {
      x: PAD + bx * (SIZE - PAD * 2),
      y: PAD + (1 - by) * (SIZE - PAD * 2),
    }
  }
  function fromCanvas(cx, cy) {
    return {
      x: Math.max(0, Math.min(1, (cx - PAD) / (SIZE - PAD * 2))),
      y: (1 - (cy - PAD) / (SIZE - PAD * 2)),
    }
  }

  // Draw the curve
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = SIZE; cv.height = SIZE
    ctx.clearRect(0, 0, SIZE, SIZE)

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.08)'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const x = PAD + (i/4) * (SIZE - PAD*2)
      const y = PAD + (i/4) * (SIZE - PAD*2)
      ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, SIZE-PAD); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(SIZE-PAD, y); ctx.stroke()
    }

    // Border box
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'
    ctx.lineWidth = 1
    ctx.strokeRect(PAD, PAD, SIZE - PAD*2, SIZE - PAD*2)

    // Fixed start (0,0) and end (1,1)
    const start = toCanvas(0, 0)
    const end   = toCanvas(1, 1)
    const cp1   = toCanvas(p1[0], p1[1])
    const cp2   = toCanvas(p2[0], p2[1])

    // Handle lines
    ctx.strokeStyle = 'rgba(124,58,237,0.4)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(cp1.x, cp1.y); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(end.x, end.y);     ctx.lineTo(cp2.x, cp2.y); ctx.stroke()
    ctx.setLineDash([])

    // Curve
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
    ctx.strokeStyle = '#7c3aed'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    // Glow
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'
    ctx.lineWidth = 8
    ctx.stroke()

    // Anchor points
    ;[start, end].forEach(pt => {
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2)
      ctx.fillStyle = 'rgba(124,58,237,0.4)'; ctx.fill()
    })

    // Control handles
    ;[
      { pt: cp1, color: '#06b6d4', label:'P1' },
      { pt: cp2, color: '#f59e0b', label:'P2' },
    ].forEach(({ pt, color, label }) => {
      // Outer glow
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 11, 0, Math.PI*2)
      ctx.fillStyle = color + '22'; ctx.fill()
      // Dot
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI*2)
      ctx.fillStyle = color; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      // Label
      ctx.font = 'bold 10px sans-serif'; ctx.fillStyle = color
      ctx.textAlign = 'center'; ctx.fillText(label, pt.x, pt.y - 14)
    })
  }, [p1, p2])

  function getPos(e) {
    const cv  = cvRef.current
    const rect = cv.getBoundingClientRect()
    const scaleX = SIZE / rect.width
    const scaleY = SIZE / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    }
  }

  function hitTest(cx, cy, bx, by, r = 14) {
    const pt = toCanvas(bx, by)
    return Math.hypot(cx - pt.x, cy - pt.y) < r
  }

  function onDown(e) {
    e.preventDefault()
    const { x, y } = getPos(e)
    if (hitTest(x, y, p1[0], p1[1])) dragging.current = 'p1'
    else if (hitTest(x, y, p2[0], p2[1])) dragging.current = 'p2'
  }
  function onMove(e) {
    e.preventDefault()
    if (!dragging.current) return
    const { x, y } = getPos(e)
    const { x: bx, y: by } = fromCanvas(x, y)
    if (dragging.current === 'p1') onChange([bx, by], p2)
    else                            onChange(p1, [bx, by])
  }
  function onUp() { dragging.current = null }

  return (
    <canvas
      ref={cvRef}
      className="bezier-canvas"
      style={{ width: SIZE, height: SIZE }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
    />
  )
}

function BallPreview({ p1, p2, playing, onToggle }) {
  const cvRef  = useRef(null)
  const animId = useRef(null)
  const startT = useRef(null)

  const DURATION = 1200 // ms

  function cubicBezier(t, p1x, p1y, p2x, p2y) {
    function B(t, p0, p1_, p2_, p3) {
      return (1-t)**3*p0 + 3*(1-t)**2*t*p1_ + 3*(1-t)*t**2*p2_ + t**3*p3
    }
    // Newton-Raphson to find t for given x
    let s = t
    for (let i = 0; i < 8; i++) {
      const fx = B(s, 0, p1x, p2x, 1) - t
      const dx = 3*(1-s)**2*p1x + 6*(1-s)*s*(p2x-p1x) + 3*s**2*(1-p2x)
      if (Math.abs(dx) < 1e-6) break
      s -= fx / dx
    }
    return B(s, 0, p1y, p2y, 1)
  }

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = 300; cv.height = 80
    if (!playing) {
      // Draw idle
      ctx.clearRect(0, 0, 300, 80)
      ctx.fillStyle = '#7c3aed'
      ctx.beginPath(); ctx.arc(30, 40, 12, 0, Math.PI*2); ctx.fill()
      return
    }
    startT.current = null
    function frame(ts) {
      if (!startT.current) startT.current = ts
      const elapsed = ts - startT.current
      const rawT    = Math.min(elapsed / DURATION, 1)
      const eased   = cubicBezier(rawT, p1[0], p1[1], p2[0], p2[1])
      const x = 30 + eased * 240

      ctx.clearRect(0, 0, 300, 80)
      // Track
      ctx.fillStyle = 'rgba(124,58,237,0.08)'
      ctx.fillRect(18, 36, 264, 8)
      ctx.fillStyle = 'rgba(124,58,237,0.2)'
      ctx.fillRect(18, 36, eased * 264, 8)
      // Ball
      ctx.beginPath(); ctx.arc(x, 40, 14, 0, Math.PI*2)
      const g = ctx.createRadialGradient(x-4, 35, 2, x, 40, 14)
      g.addColorStop(0, '#a78bfa'); g.addColorStop(1, '#5b21b6')
      ctx.fillStyle = g; ctx.fill()

      if (rawT < 1) animId.current = requestAnimationFrame(frame)
      else setTimeout(() => onToggle(), 400)
    }
    animId.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId.current)
  }, [playing, p1, p2])

  return (
    <div className="ball-preview-wrap">
      <canvas ref={cvRef} className="ball-canvas" style={{width:300, height:80}}/>
      <button className="play-btn" onClick={onToggle}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  )
}

function BezierTool() {
  const [p1,      setP1]      = useState([0.42, 0])
  const [p2,      setP2]      = useState([0.58, 1])
  const [playing, setPlaying] = useState(false)
  const [copied,  setCopied]  = useState(false)

  function fmt(n) { return parseFloat(n.toFixed(3)) }
  const cssValue = `cubic-bezier(${fmt(p1[0])}, ${fmt(p1[1])}, ${fmt(p2[0])}, ${fmt(p2[1])})`

  function applyPreset(p) { setP1([p[0],p[1]]); setP2([p[2],p[3]]); setPlaying(false) }

  async function copyCSS() {
    await navigator.clipboard.writeText(cssValue)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span className="tool-icon">〰️</span>
        <div>
          <h2 className="tool-title">Cubic Bezier Editor</h2>
          <p className="tool-desc">Handles drag karo — animation curve visually design karo</p>
        </div>
      </div>

      <div className="bezier-layout">
        {/* Canvas */}
        <div className="bezier-canvas-wrap">
          <BezierCanvas p1={p1} p2={p2} onChange={(np1,np2) => { setP1(np1); setP2(np2) }}/>
        </div>

        {/* Right side — controls */}
        <div className="bezier-controls">
          {/* Presets */}
          <div className="bezier-presets">
            <span className="ctrl-label">Presets</span>
            <div className="preset-grid">
              {PRESETS.map(pr => (
                <button key={pr.name} className="preset-btn" onClick={() => applyPreset(pr.p)}>
                  {pr.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bezier-sliders">
            <span className="ctrl-label">P1 <span style={{color:'#06b6d4'}}>●</span></span>
            <div className="slider-row">
              <span className="slider-lbl">X</span>
              <input type="range" min="0" max="1" step="0.01" value={p1[0]}
                onChange={e => setP1([+e.target.value, p1[1]])} className="bz-slider"/>
              <span className="slider-val">{fmt(p1[0])}</span>
            </div>
            <div className="slider-row">
              <span className="slider-lbl">Y</span>
              <input type="range" min="-2" max="2" step="0.01" value={p1[1]}
                onChange={e => setP1([p1[0], +e.target.value])} className="bz-slider"/>
              <span className="slider-val">{fmt(p1[1])}</span>
            </div>

            <span className="ctrl-label" style={{marginTop:'0.75rem'}}>P2 <span style={{color:'#f59e0b'}}>●</span></span>
            <div className="slider-row">
              <span className="slider-lbl">X</span>
              <input type="range" min="0" max="1" step="0.01" value={p2[0]}
                onChange={e => setP2([+e.target.value, p2[1]])} className="bz-slider"/>
              <span className="slider-val">{fmt(p2[0])}</span>
            </div>
            <div className="slider-row">
              <span className="slider-lbl">Y</span>
              <input type="range" min="-2" max="2" step="0.01" value={p2[1]}
                onChange={e => setP2([p2[0], +e.target.value])} className="bz-slider"/>
              <span className="slider-val">{fmt(p2[1])}</span>
            </div>
          </div>

          {/* Output */}
          <div className="bezier-output">
            <code className="css-output">{cssValue}</code>
            <button className={`copy-output-btn ${copied?'copied':''}`} onClick={copyCSS}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Preview */}
          <BallPreview p1={p1} p2={p2} playing={playing} onToggle={() => setPlaying(p => !p)}/>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TOOL 2 — Animation Stagger Calculator
// ══════════════════════════════════════════════════════════════

function StaggerTool() {
  const [count,    setCount]    = useState(6)
  const [delay,    setDelay]    = useState(80)
  const [duration, setDuration] = useState(400)
  const [unit,     setUnit]     = useState('ms')
  const [copied,   setCopied]   = useState(false)
  const cvRef = useRef(null)

  const mult = unit === 's' ? 0.001 : 1
  const items = Array.from({length: count}, (_, i) => ({
    i,
    delayVal: +(i * delay * mult).toFixed(unit==='s'?3:0),
  }))

  // Bar animation preview
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width  = cv.offsetWidth || 340
    cv.height = count * 28 + 20
    let t = 0, id
    const PERIOD = (delay * count + duration) * 1.5

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      const now = (t * 16) % PERIOD
      for (let i = 0; i < count; i++) {
        const start = i * delay
        const end   = start + duration
        const prog  = Math.max(0, Math.min(1, (now - start) / duration))
        const eased = prog < 0.5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2,2)/2
        const w = eased * (cv.width - 60)
        const y = i * 28 + 10

        // Track
        ctx.fillStyle = 'rgba(124,58,237,0.08)'
        ctx.fillRect(50, y+4, cv.width-60, 16)
        // Fill
        const g = ctx.createLinearGradient(50,0,50+w,0)
        g.addColorStop(0,'rgba(124,58,237,0.8)')
        g.addColorStop(1,'rgba(6,182,212,0.8)')
        ctx.fillStyle = g
        ctx.fillRect(50, y+4, w, 16)
        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.font = '11px monospace'; ctx.textAlign = 'right'
        ctx.fillText(`${i+1}`, 44, y+16)
      }
      t++; id = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(id)
  }, [count, delay, duration])

  const cssOutput = items.map(it =>
    `.item:nth-child(${it.i+1}) { animation-delay: ${it.delayVal}${unit}; }`
  ).join('\n')

  async function copy() {
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span className="tool-icon">🎞️</span>
        <div>
          <h2 className="tool-title">Stagger Delay Calculator</h2>
          <p className="tool-desc">List animations mate har item nu delay auto-calculate karo</p>
        </div>
      </div>

      <div className="stagger-layout">
        <div className="stagger-controls">
          <div className="stagger-row">
            <label className="ctrl-label">Items</label>
            <input type="range" min="2" max="12" value={count} onChange={e=>setCount(+e.target.value)} className="bz-slider"/>
            <span className="slider-val">{count}</span>
          </div>
          <div className="stagger-row">
            <label className="ctrl-label">Delay per item</label>
            <input type="range" min="20" max="300" step="10" value={delay} onChange={e=>setDelay(+e.target.value)} className="bz-slider"/>
            <span className="slider-val">{delay}ms</span>
          </div>
          <div className="stagger-row">
            <label className="ctrl-label">Duration</label>
            <input type="range" min="100" max="1500" step="50" value={duration} onChange={e=>setDuration(+e.target.value)} className="bz-slider"/>
            <span className="slider-val">{duration}ms</span>
          </div>
          <div className="stagger-row">
            <label className="ctrl-label">Unit</label>
            <div className="unit-btns">
              {['ms','s'].map(u=>(
                <button key={u} className={`unit-btn ${unit===u?'active':''}`} onClick={()=>setUnit(u)}>{u}</button>
              ))}
            </div>
          </div>
        </div>

        <canvas ref={cvRef} className="stagger-canvas"/>

        <div className="stagger-output">
          <div className="output-header">
            <span className="ctrl-label">CSS Output</span>
            <button className={`copy-output-btn ${copied?'copied':''}`} onClick={copy}>
              {copied?'✅ Copied!':'📋 Copy'}
            </button>
          </div>
          <pre className="stagger-code">{cssOutput}</pre>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TOOL 3 — CSS Unit Converter
// ══════════════════════════════════════════════════════════════

function UnitTool() {
  const [px,       setPx]       = useState(16)
  const [basePx,   setBasePx]   = useState(16)
  const [vwWidth,  setVwWidth]  = useState(1440)
  const [copied,   setCopied]   = useState('')

  const rem = (px / basePx).toFixed(4)
  const em  = (px / basePx).toFixed(4)
  const vw  = ((px / vwWidth) * 100).toFixed(4)
  const pct = ((px / basePx) * 100).toFixed(2)
  const pt  = (px * 0.75).toFixed(2)

  async function copy(val, key) {
    await navigator.clipboard.writeText(val)
    setCopied(key); setTimeout(()=>setCopied(''),2000)
  }

  const units = [
    { key:'rem', label:'rem', val:rem+'rem', raw:rem },
    { key:'em',  label:'em',  val:em+'em',  raw:em  },
    { key:'vw',  label:'vw',  val:vw+'vw',  raw:vw  },
    { key:'%',   label:'%',   val:pct+'%',  raw:pct },
    { key:'pt',  label:'pt',  val:pt+'pt',  raw:pt  },
  ]

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span className="tool-icon">📐</span>
        <div>
          <h2 className="tool-title">CSS Unit Converter</h2>
          <p className="tool-desc">px thi rem, em, vw, % — instant convert</p>
        </div>
      </div>

      <div className="unit-layout">
        <div className="unit-inputs">
          <div className="unit-input-group">
            <label className="ctrl-label">px value</label>
            <div className="unit-input-row">
              <input type="number" className="unit-input" value={px} min="0" step="1"
                onChange={e=>setPx(+e.target.value||0)}/>
              <span className="unit-suffix">px</span>
            </div>
          </div>
          <div className="unit-input-group">
            <label className="ctrl-label">Base font size</label>
            <div className="unit-input-row">
              <input type="number" className="unit-input" value={basePx} min="8" max="32" step="1"
                onChange={e=>setBasePx(+e.target.value||16)}/>
              <span className="unit-suffix">px</span>
            </div>
          </div>
          <div className="unit-input-group">
            <label className="ctrl-label">Viewport width (for vw)</label>
            <div className="unit-input-row">
              <input type="number" className="unit-input" value={vwWidth} min="320" max="3840" step="1"
                onChange={e=>setVwWidth(+e.target.value||1440)}/>
              <span className="unit-suffix">px</span>
            </div>
          </div>
        </div>

        <div className="unit-results">
          <div className="unit-result-big">
            <span className="unit-px-big">{px}</span>
            <span className="unit-px-label">px</span>
          </div>
          {units.map(u=>(
            <div key={u.key} className="unit-row">
              <span className="unit-key">{u.label}</span>
              <span className="unit-val">{u.val}</span>
              <button className={`copy-output-btn ${copied===u.key?'copied':''}`}
                onClick={()=>copy(u.val, u.key)}>
                {copied===u.key?'✅':'📋'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// TOOL 4 — Shadow Generator
// ══════════════════════════════════════════════════════════════

function ShadowTool() {
  const [x,       setX]       = useState(0)
  const [y,       setY]       = useState(8)
  const [blur,    setBlur]    = useState(24)
  const [spread,  setSpread]  = useState(0)
  const [color,   setColor]   = useState('#7c3aed')
  const [alpha,   setAlpha]   = useState(0.35)
  const [inset,   setInset]   = useState(false)
  const [copied,  setCopied]  = useState(false)

  function hexToRgb(hex) {
    const r=parseInt(hex.slice(1,3),16)
    const g=parseInt(hex.slice(3,5),16)
    const b=parseInt(hex.slice(5,7),16)
    return `${r},${g},${b}`
  }

  const shadowVal = `${inset?'inset ':''}${x}px ${y}px ${blur}px ${spread}px rgba(${hexToRgb(color)},${alpha})`
  const cssOutput = `box-shadow: ${shadowVal};`

  async function copy() {
    await navigator.clipboard.writeText(cssOutput)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span className="tool-icon">🌑</span>
        <div>
          <h2 className="tool-title">Box Shadow Generator</h2>
          <p className="tool-desc">Visual shadow design karo — CSS instantly copy karo</p>
        </div>
      </div>

      <div className="shadow-layout">
        <div className="shadow-controls">
          {[
            {label:'Offset X',  val:x,      set:setX,      min:-50, max:50,  step:1},
            {label:'Offset Y',  val:y,      set:setY,      min:-50, max:100, step:1},
            {label:'Blur',      val:blur,   set:setBlur,   min:0,   max:100, step:1},
            {label:'Spread',    val:spread, set:setSpread, min:-30, max:50,  step:1},
            {label:'Alpha',     val:alpha,  set:setAlpha,  min:0,   max:1,   step:0.01},
          ].map(s=>(
            <div key={s.label} className="stagger-row">
              <label className="ctrl-label">{s.label}</label>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e=>s.set(+e.target.value)} className="bz-slider"/>
              <span className="slider-val">{s.val}</span>
            </div>
          ))}
          <div className="stagger-row">
            <label className="ctrl-label">Color</label>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="shadow-color-pick"/>
            <span className="slider-val">{color}</span>
          </div>
          <div className="stagger-row">
            <label className="ctrl-label">Inset</label>
            <label className="toggle-label">
              <input type="checkbox" checked={inset} onChange={e=>setInset(e.target.checked)}/> inset
            </label>
          </div>
        </div>

        {/* Preview box */}
        <div className="shadow-preview-area">
          <div
            className="shadow-preview-box"
            style={{ boxShadow: shadowVal }}
          />
        </div>

        {/* Output */}
        <div className="shadow-output">
          <code className="css-output">{cssOutput}</code>
          <button className={`copy-output-btn ${copied?'copied':''}`} onClick={copy}>
            {copied?'✅ Copied!':'📋 Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════

const TOOLS = [
  { id:'bezier',  label:'〰️ Bezier' },
  { id:'stagger', label:'🎞️ Stagger' },
  { id:'unit',    label:'📐 Units' },
  { id:'shadow',  label:'🌑 Shadow' },
]

function ToolsBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let t = 0, id
    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize, { passive:true })
    function draw() {
      ctx.clearRect(0,0,cv.width,cv.height)
      // Floating bezier-like curves
      for (let i = 0; i < 4; i++) {
        const ox = Math.sin(t*0.3+i*1.2)*cv.width*0.15
        const oy = Math.cos(t*0.25+i)*cv.height*0.12
        ctx.beginPath()
        ctx.moveTo(cv.width*0.1+ox, cv.height*0.5+oy)
        ctx.bezierCurveTo(
          cv.width*0.3+oy, cv.height*0.1+ox,
          cv.width*0.7-oy, cv.height*0.9-ox,
          cv.width*0.9-ox, cv.height*0.5-oy
        )
        ctx.strokeStyle=`rgba(124,58,237,${0.04+i*0.015})`
        ctx.lineWidth=1.5; ctx.stroke()
      }
      t+=0.006; id=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener('resize',resize) }
  },[])
  return <canvas ref={cvRef} className="tools-bg-canvas"/>
}

export default function Tools() {
  const [active, setActive] = useState('bezier')

  return (
    <div className="tools-page page-section">
      <ToolsBg/>
      <div className="container tools-container">

        {/* Header */}
        <div className="tools-header">
          <div className="tools-badge">🔧 CSS Toolkit</div>
          <h1 className="tools-title">
            Developer <span className="tools-title-gradient">Tools</span>
          </h1>
          <p className="tools-subtitle">
            Animation ane CSS design karvana tools — zero login, zero Firebase
          </p>
        </div>

        {/* Tab bar */}
        <div className="tools-tabs">
          {TOOLS.map(t=>(
            <button
              key={t.id}
              className={`tools-tab ${active===t.id?'active':''}`}
              onClick={()=>setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active tool */}
        <div className="tools-body">
          {active==='bezier'  && <BezierTool/>}
          {active==='stagger' && <StaggerTool/>}
          {active==='unit'    && <UnitTool/>}
          {active==='shadow'  && <ShadowTool/>}
        </div>

        <p className="tools-note">
          💾 Badhu localStorage ma save nathi thatu — page refresh karo to reset thay
        </p>
      </div>
    </div>
  )
}
