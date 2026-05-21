import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import AdSense     from '../../components/AdSense/AdSense.jsx'
import { getAnimationById, getAnimations } from '../../hooks/useAnimations.js'
import './Playground.css'

const DEFAULT_CSS = `.box {
  width: 120px; height: 120px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 20px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`

const DEFAULT_JS = `const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const box = document.createElement('div');
box.className = 'box';
c.appendChild(box);`

// ─── Animated BG Canvas ───────────────────────────────────────────────────────
function PlaygroundBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let id, t = 0
    function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(cv)

    const N = 28
    const dots = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: 240 + Math.random() * 60, r: 1.5 + Math.random() * 1.5,
    }))

    function draw() {
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)
      t += 0.008

      // Slow moving gradient blob
      const bx = W * 0.5 + Math.sin(t * 0.7) * W * 0.25
      const by = H * 0.5 + Math.cos(t * 0.5) * H * 0.25
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, W * 0.55)
      g.addColorStop(0, 'rgba(124,58,237,0.07)')
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      dots.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })

      // Connect dots
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${0.1 * (1 - d / 130)})`
            ctx.lineWidth = 0.7; ctx.stroke()
          }
        }
        ctx.beginPath(); ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${dots[i].hue},70%,65%,0.35)`; ctx.fill()
      }
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); ro.disconnect() }
  }, [])
  return <canvas ref={cvRef} className="pg-bg-canvas"/>
}

// ─── Animated Header ──────────────────────────────────────────────────────────
function PlaygroundHeader({ loadedTitle }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    setTimeout(() => el.classList.add('pg-header-in'), 60)
  }, [])

  return (
    <div ref={ref} className="playground-header pg-header-anim">
      <div className="pg-header-badge">
        <span className="pg-header-dot"/>
        <span className="pg-header-dot"/>
        <span className="pg-header-dot"/>
      </div>
      <h1 className="playground-title">
        <span className="pg-lightning">⚡</span>
        <span className="pg-title-word">Live</span>{' '}
        <span className="pg-title-word pg-title-gradient">Playground</span>
      </h1>
      <p className="pg-title-sub">
        Type CSS & JS — preview updates <span className="pg-live-badge">● LIVE</span>
      </p>
      {loadedTitle && (
        <div className="pg-loaded-pill">
          <span>📌</span> {loadedTitle}
        </div>
      )}
    </div>
  )
}

// ─── Animated Toolbar ─────────────────────────────────────────────────────────
function Toolbar({ allAnims, selectedId, onLoad, bgColor, copyMsg, onCopyAll, onReset }) {
  return (
    <div className="playground-toolbar">
      <div className="pg-select-wrap">
        <span className="pg-select-icon">📦</span>
        <select className="anim-select" value={selectedId} onChange={onLoad}>
          <option value="">— Gallery thi load karo —</option>
          {allAnims.map(a => <option key={a.docId} value={a.docId}>{a.title}</option>)}
        </select>
      </div>

      <div className="toolbar-right">
        <div className="bg-display">
          <div className="bg-dot-glow" style={{ background: bgColor }}/>
          <code className="bg-display-code">{bgColor}</code>
        </div>

        <button
          className={`pg-tool-btn copy-btn ${copyMsg ? 'copied' : ''}`}
          onClick={onCopyAll}
        >
          {copyMsg ? <><span className="btn-check">✓</span> Copied!</> : <>📋 Copy All</>}
        </button>

        <button className="pg-tool-btn reset-btn" onClick={onReset}>
          <span className="reset-icon">↺</span> Reset
        </button>
      </div>
    </div>
  )
}

// ─── Typing indicator for editor pane ────────────────────────────────────────
function EditorLabel({ typing }) {
  return (
    <div className="pane-label">
      <span className="pane-label-dot css-dot"/>
      <span>Code Editor</span>
      {typing && <span className="typing-indicator"><span/><span/><span/></span>}
    </div>
  )
}

// ─── Preview pane label ───────────────────────────────────────────────────────
function PreviewLabel({ active }) {
  return (
    <div className="pane-label preview-label">
      <span className={`pane-label-dot live-dot ${active ? 'live' : ''}`}/>
      <span>Live Preview</span>
      {active && <span className="live-text">● rendering</span>}
    </div>
  )
}

// ─── Main Playground ──────────────────────────────────────────────────────────
export default function Playground() {
  const [searchParams] = useSearchParams()
  const [cssCode,    setCssCode]    = useState(DEFAULT_CSS)
  const [jsCode,     setJsCode]     = useState(DEFAULT_JS)
  const [bgColor,    setBgColor]    = useState('#0a0a0f')
  const [allAnims,   setAllAnims]   = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [copyMsg,    setCopyMsg]    = useState('')
  const [loadedTitle,setLoadedTitle]= useState('')
  const [typing,     setTyping]     = useState(false)
  const [rendering,  setRendering]  = useState(false)
  const typingTimer = useRef(null)

  useEffect(() => { getAnimations().then(setAllAnims) }, [])

  useEffect(() => {
    const id = searchParams.get('id'); if (!id) return
    getAnimationById(id).then(anim => {
      if (!anim) return
      setCssCode(anim.cssCode || ''); setJsCode(anim.jsCode || '')
      setBgColor(anim.previewBg || '#0a0a0f')
      setSelectedId(id); setLoadedTitle(anim.title)
    })
  }, [searchParams])

  function handleLoad(e) {
    const id = e.target.value; setSelectedId(id)
    if (!id) { reset(); return }
    const anim = allAnims.find(a => a.docId === id)
    if (anim) {
      setCssCode(anim.cssCode || ''); setJsCode(anim.jsCode || '')
      setBgColor(anim.previewBg || '#0a0a0f'); setLoadedTitle(anim.title)
      setRendering(true); setTimeout(() => setRendering(false), 800)
    }
  }

  function reset() {
    setCssCode(DEFAULT_CSS); setJsCode(DEFAULT_JS)
    setBgColor('#0a0a0f'); setSelectedId(''); setLoadedTitle('')
    setRendering(true); setTimeout(() => setRendering(false), 600)
  }

  async function copyAll() {
    const text = `/* CSS */\n${cssCode}\n\n/* JS */\n${jsCode}\n\n/* Preview BG: ${bgColor} */`
    await navigator.clipboard.writeText(text)
    setCopyMsg('✅ Copied!'); setTimeout(() => setCopyMsg(''), 2000)
  }

  function handleCssChange(v) {
    setCssCode(v)
    setTyping(true); clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setTyping(false); setRendering(true)
      setTimeout(() => setRendering(false), 400)
    }, 600)
  }

  function handleJsChange(v) {
    setJsCode(v)
    setTyping(true); clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setTyping(false); setRendering(true)
      setTimeout(() => setRendering(false), 400)
    }, 600)
  }

  return (
    <div className="playground-page page-section">
      <PlaygroundBg/>

      <div className="container pg-container">
        <PlaygroundHeader loadedTitle={loadedTitle}/>

        <Toolbar
          allAnims={allAnims} selectedId={selectedId} onLoad={handleLoad}
          bgColor={bgColor} copyMsg={copyMsg} onCopyAll={copyAll} onReset={reset}
        />

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/></div>

        <div className="playground-split">
          {/* Editor Pane */}
          <div className="editor-pane pg-pane">
            <EditorLabel typing={typing}/>
            <div className="pane-body">
              <CodeEditor
                cssCode={cssCode} jsCode={jsCode}
                onCssChange={handleCssChange} onJsChange={handleJsChange}
                showCopyButtons={true}
              />
            </div>
          </div>

          {/* Preview Pane */}
          <div className="preview-pane pg-pane">
            <PreviewLabel active={rendering}/>
            <div className={`pane-body preview-body ${rendering ? 'preview-flash' : ''}`}>
              <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={bgColor}/>
            </div>
          </div>
        </div>

        {/* Shortcut hints */}
        <div className="pg-hints">
          <span>💡 Tips:</span>
          <span className="pg-hint-chip">CSS + JS saath live preview</span>
          <span className="pg-hint-chip">Gallery thi load → modify</span>
          <span className="pg-hint-chip">Copy All → paste anywhere</span>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/></div>
      </div>
    </div>
  )
      }
  
