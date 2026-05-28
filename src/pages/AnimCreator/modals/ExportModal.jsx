// ExportModal.jsx — UPDATED (Feature 6)
// Tabs: HTML/CSS · React · JSON · PNG · 🎥 Record · ZIP
// New: PNG screenshot (html2canvas) · MP4/WEBM MediaRecorder · ZIP bundle

import { useState, useRef, useEffect } from 'react'
import { generateHTMLCSS, generateReact, generateJSON, generateGSAP, generateFramerMotion } from '../utils/codeGen.js'
import { useCreator } from '../store/CreatorContext.jsx'
import { exportPNG, ScreenRecorder, exportZIP, loadHtml2Canvas } from '../utils/ExportEngine.js'
import './ExportModal.css'

// ── Tab definitions ───────────────────────────────────────────
const CODE_TABS = [
  { id:'html',   label:'HTML/CSS',      icon:'🌐' },
  { id:'react',  label:'React',         icon:'⚛️' },
  { id:'gsap',   label:'GSAP',          icon:'💚' },
  { id:'framer', label:'Framer Motion', icon:'🔵' },
  { id:'json',   label:'JSON',          icon:'{}' },
]
const MEDIA_TABS = [
  { id:'png',    label:'PNG Image',     icon:'🖼️' },
  { id:'record', label:'Record Video',  icon:'🎥' },
  { id:'zip',    label:'Export ZIP',    icon:'📦' },
]

function downloadText(content, filename) {
  const blob = new Blob([content], { type:'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href=url; a.download=filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── PNG Tab ───────────────────────────────────────────────────
function PNGTab({ elements, bgColor }) {
  const [status,   setStatus]   = useState('idle')  // idle | loading | done | error
  const [msg,      setMsg]      = useState('')
  const [h2cReady, setH2cReady] = useState(!!window.html2canvas)

  useEffect(() => {
    if (!window.html2canvas) {
      loadHtml2Canvas().then(ok => setH2cReady(ok))
    }
  }, [])

  async function handleExport() {
    setStatus('loading'); setMsg('Capturing screenshot…')
    try {
      const stageEl = document.querySelector('.stage')
      if (!stageEl) throw new Error('Canvas stage not found')
      await exportPNG(stageEl, 'mz-scene.png')
      setStatus('done'); setMsg('✓ PNG downloaded!')
    } catch(e) {
      setStatus('error'); setMsg('✗ ' + e.message)
    }
    setTimeout(() => { setStatus('idle'); setMsg('') }, 3000)
  }

  return (
    <div className="em-media-tab">
      <div className="em-media-icon">🖼️</div>
      <div className="em-media-title">PNG Screenshot</div>
      <div className="em-media-desc">
        Exports your canvas as a high-resolution PNG (2× retina).<br/>
        Uses <code>html2canvas</code> for accurate rendering.
      </div>

      <div className={`em-lib-status ${h2cReady?'ready':'loading'}`}>
        {h2cReady ? '✓ html2canvas ready' : '⏳ Loading html2canvas…'}
      </div>

      <div className="em-media-specs">
        <span>Resolution: 900 × 580 px (×2 = 1800×1160)</span>
        <span>Format: PNG, transparent background</span>
        <span>Quality: Lossless</span>
      </div>

      <button
        className={`em-media-btn ${status==='loading'?'loading':''} ${status==='done'?'done':status==='error'?'error':''}`}
        onClick={handleExport}
        disabled={status==='loading'}
      >
        {status==='loading' ? '⏳ Capturing…'
         : status==='done'   ? '✅ Downloaded!'
         : status==='error'  ? `✗ ${msg}`
         : '📸 Export PNG'}
      </button>
      {msg && status!=='error' && <div className="em-media-msg">{msg}</div>}
    </div>
  )
}

// ── Record Tab ────────────────────────────────────────────────
function RecordTab() {
  const [recState, setRecState] = useState('idle')  // idle | recording | stopping | done | error
  const [elapsed,  setElapsed]  = useState(0)
  const [msg,      setMsg]      = useState('')
  const [mimeType, setMimeType] = useState('')
  const recorderRef = useRef(new ScreenRecorder())
  const timerRef    = useRef(null)

  function fmtTime(s) {
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  }

  async function startRecord(mode) {
    setMsg(''); setElapsed(0); setRecState('recording')
    try {
      let mime
      if (mode === 'canvas') {
        const canvasEl = document.querySelector('.stage canvas.ambient-bg')
        if (!canvasEl) throw new Error('Canvas element not found — use Screen mode')
        mime = await recorderRef.current.startFromCanvas(canvasEl, 30)
      } else {
        mime = await recorderRef.current.startFromScreen()
      }
      setMimeType(mime)
      timerRef.current = setInterval(() => setElapsed(e => e+1), 1000)
    } catch(e) {
      setRecState('error'); setMsg(e.message)
      setTimeout(() => { setRecState('idle'); setMsg('') }, 3500)
    }
  }

  async function stopRecord() {
    clearInterval(timerRef.current)
    setRecState('stopping'); setMsg('Processing video…')
    try {
      const { ext } = await recorderRef.current.stop('mz-animation')
      setRecState('done')
      setMsg(`✓ ${ext.toUpperCase()} downloaded!`)
    } catch(e) {
      setRecState('error'); setMsg('✗ ' + e.message)
    }
    setTimeout(() => { setRecState('idle'); setMsg(''); setElapsed(0) }, 3500)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const isRec = recState === 'recording'

  return (
    <div className="em-media-tab">
      <div className="em-media-icon">🎥</div>
      <div className="em-media-title">Record Animation</div>
      <div className="em-media-desc">
        Record your animated canvas directly as MP4/WEBM video.<br/>
        <strong>Canvas mode</strong> records the WebGL canvas element.<br/>
        <strong>Screen mode</strong> lets you select any area on screen.
      </div>

      {isRec && (
        <div className="em-rec-indicator">
          <div className="em-rec-dot"/>
          <span>Recording — {fmtTime(elapsed)}</span>
          {mimeType && <span className="em-rec-mime">{mimeType.split(';')[0]}</span>}
        </div>
      )}

      <div className="em-rec-btns">
        {!isRec && recState !== 'stopping' ? (
          <>
            <button className="em-media-btn canvas-rec" onClick={() => startRecord('canvas')}
              disabled={recState==='stopping'}>
              🎬 Record Canvas
            </button>
            <button className="em-media-btn screen-rec" onClick={() => startRecord('screen')}
              disabled={recState==='stopping'}>
              🖥 Record Screen
            </button>
          </>
        ) : (
          <button className={`em-media-btn stop-btn ${recState==='stopping'?'loading':''}`}
            onClick={stopRecord} disabled={recState==='stopping'}>
            {recState==='stopping' ? '⏳ Processing…' : '⏹ Stop & Save'}
          </button>
        )}
      </div>

      {(recState==='done'||recState==='error') && (
        <div className={`em-media-msg ${recState}`}>{msg}</div>
      )}

      <div className="em-media-specs">
        <span>Format: MP4 (H.264) or WEBM (VP9) — browser dependent</span>
        <span>FPS: 30 · Bitrate: 4 Mbps</span>
        <span>Tip: Play your animation before recording</span>
      </div>
    </div>
  )
}

// ── ZIP Tab ───────────────────────────────────────────────────
function ZIPTab({ elements, bgColor }) {
  const [status, setStatus] = useState('idle')
  const [jszip,  setJszip]  = useState(!!window.JSZip)

  useEffect(() => {
    if (!window.JSZip) {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
      s.onload = () => setJszip(true)
      document.head.appendChild(s)
    }
  }, [])

  async function handleZIP() {
    setStatus('loading')
    try {
      const { html } = generateHTMLCSS(elements, bgColor || '#0a0a0f')
      const react    = generateReact(elements,    bgColor || '#0a0a0f')
      const json     = generateJSON(elements,     { bgColor })
      const gsap     = generateGSAP(elements,     bgColor || '#0a0a0f')
      const readme   = _makeReadme()

      await exportZIP([
        { name:'index.html',        content: html  },
        { name:'AnimScene.jsx',     content: react },
        { name:'scene.json',        content: json  },
        { name:'gsap-animation.js', content: gsap  },
        { name:'README.txt',        content: readme},
      ], 'mz-scene-export.zip')

      setStatus('done')
    } catch(e) {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <div className="em-media-tab">
      <div className="em-media-icon">📦</div>
      <div className="em-media-title">Export ZIP Bundle</div>
      <div className="em-media-desc">
        Downloads a complete ZIP with all export formats bundled together.
      </div>

      <div className={`em-lib-status ${jszip?'ready':'loading'}`}>
        {jszip ? '✓ JSZip ready' : '⏳ Loading JSZip…'}
      </div>

      <div className="em-zip-contents">
        <div className="em-zip-title">ZIP contains:</div>
        {[
          ['index.html',        '🌐 Complete standalone HTML animation'],
          ['AnimScene.jsx',     '⚛️ React component'],
          ['gsap-animation.js', '💚 GSAP animation script'],
          ['scene.json',        '{}  Scene data for reimport'],
          ['README.txt',        '📄 Usage instructions'],
        ].map(([f,d]) => (
          <div key={f} className="em-zip-file">
            <span className="em-zip-fname">{f}</span>
            <span className="em-zip-fdesc">{d}</span>
          </div>
        ))}
      </div>

      <button
        className={`em-media-btn ${status==='loading'?'loading':''} ${status==='done'?'done':status==='error'?'error':''}`}
        onClick={handleZIP}
        disabled={status==='loading' || !jszip}
      >
        {status==='loading' ? '⏳ Bundling…'
         : status==='done'   ? '✅ ZIP Downloaded!'
         : status==='error'  ? '✗ Failed'
         : '📦 Download ZIP'}
      </button>
    </div>
  )
}

function _makeReadme() {
  return `MotionZync — Animation Export
==============================

Files in this bundle:

  index.html         → Open in any browser to see your animation
  AnimScene.jsx      → Drop into a React project
  gsap-animation.js  → Pure GSAP version (requires GSAP CDN)
  scene.json         → Reimport into MotionZync Creator

Credits: MotionZync (https://motion-zync.vercel.app)
`
}

// ── Main ExportModal ──────────────────────────────────────────
export default function ExportModal({ onClose }) {
  const { elements, bgColor } = useCreator()
  const [activeTab, setActiveTab] = useState('html')
  const [copied,    setCopied]    = useState(false)
  const [downloaded,setDownloaded]= useState(false)

  const { html: fullHTML } = generateHTMLCSS(elements, bgColor || '#0a0a0f')
  const reactCode    = generateReact(elements,       bgColor || '#0a0a0f')
  const gsapCode     = generateGSAP(elements,        bgColor || '#0a0a0f')
  const framerCode   = generateFramerMotion(elements, bgColor || '#0a0a0f')
  const jsonCode     = generateJSON(elements,        { bgColor })

  const CODE_CONTENT = { html:fullHTML, react:reactCode, gsap:gsapCode, framer:framerCode, json:jsonCode }
  const CODE_FILES   = { html:'animation.html', react:'AnimScene.jsx', gsap:'gsap-anim.js', framer:'AnimScene.jsx', json:'scene.json' }

  const isCodeTab  = CODE_TABS.some(t => t.id === activeTab)
  const isMediaTab = MEDIA_TABS.some(t => t.id === activeTab)
  const content    = CODE_CONTENT[activeTab] || ''
  const filename   = CODE_FILES[activeTab]   || 'export.txt'

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }
  function handleDownload() {
    downloadText(content, filename)
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2200)
  }

  return (
    <div className="em-overlay" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="em-modal">

        {/* Header */}
        <div className="em-header">
          <div className="em-title">
            <span className="em-title-icon">⬇</span>
            Export Your Creation
          </div>
          <div className="em-stats">
            <span className="em-stat">{elements.length} elements</span>
            <span className="em-stat">{bgColor}</span>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>

        {/* Tab groups */}
        <div className="em-tab-groups">
          <div className="em-tab-group-label">CODE</div>
          <div className="em-tabs code-tabs">
            {CODE_TABS.map(t => (
              <button key={t.id} className={`em-tab ${activeTab===t.id?'active':''}`}
                onClick={() => setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="em-tab-group-label media-label">MEDIA</div>
          <div className="em-tabs media-tabs">
            {MEDIA_TABS.map(t => (
              <button key={t.id} className={`em-tab media-tab ${activeTab===t.id?'active':''}`}
                onClick={() => setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        {isCodeTab && (
          <>
            <div className="em-desc">
              {activeTab==='html'   && '🌐 Complete standalone HTML file — open directly in any browser'}
              {activeTab==='react'  && '⚛️ React component with inline styles — paste into your project'}
              {activeTab==='gsap'   && '💚 GSAP timeline-based animation — requires GSAP CDN'}
              {activeTab==='framer' && '🔵 Framer Motion component with motion variants'}
              {activeTab==='json'   && '📦 Scene JSON — reimport or share your creation'}
            </div>
            <pre className="em-code">{content || '// No elements on canvas yet'}</pre>
            <div className="em-actions">
              <button className={`em-btn em-copy ${copied?'done':''}`} onClick={handleCopy}>
                {copied ? '✅ Copied!' : '📋 Copy Code'}
              </button>
              <button className={`em-btn em-download ${downloaded?'done':''}`} onClick={handleDownload}>
                {downloaded ? '✅ Downloaded!' : `⬇ Download ${filename}`}
              </button>
              <button className="em-btn em-close-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {isMediaTab && (
          <div className="em-media-content">
            {activeTab==='png'    && <PNGTab    elements={elements} bgColor={bgColor}/>}
            {activeTab==='record' && <RecordTab/>}
            {activeTab==='zip'    && <ZIPTab    elements={elements} bgColor={bgColor}/>}
            <div className="em-media-close">
              <button className="em-btn em-close-btn" onClick={onClose} style={{maxWidth:120}}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
        }
        
