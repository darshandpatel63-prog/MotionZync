import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { buildSandboxHTML } from '../../components/LivePreview/LivePreview.jsx'
import { getAnimationById, getAnimations } from '../../hooks/useAnimations.js'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Wallpaper.css'

const SIZES = [
  { label: 'Mobile (390×844)',   w: 390,  h: 844  },
  { label: 'Mobile HD (1080×1920)', w: 1080, h: 1920 },
  { label: 'Tablet (768×1024)', w: 768,  h: 1024 },
  { label: 'Desktop (1920×1080)', w: 1920, h: 1080 },
  { label: 'Desktop 4K (3840×2160)', w: 3840, h: 2160 },
  { label: 'Custom', w: 0, h: 0 },
]

export default function Wallpaper() {
  const [searchParams] = useSearchParams()
  const [animations,  setAnimations]  = useState([])
  const [selected,    setSelected]    = useState(null)
  const [size,        setSize]        = useState(SIZES[0])
  const [customW,     setCustomW]     = useState(390)
  const [customH,     setCustomH]     = useState(844)
  const [adWatched,   setAdWatched]   = useState(false)
  const [adTimer,     setAdTimer]     = useState(0)
  const [adRunning,   setAdRunning]   = useState(false)
  const [downloaded,  setDownloaded]  = useState(false)
  const iframeRef = useRef(null)
  const timerRef  = useRef(null)

  useEffect(() => {
    getAnimations().then(list => {
      setAnimations(list)
      const id = searchParams.get('id')
      if (id) { const a = list.find(x => x.docId === id); if (a) setSelected(a) }
      else if (list.length > 0) setSelected(list[0])
    })
  }, [])

  useEffect(() => {
    if (selected && iframeRef.current) {
      const w = size.w || customW
      const h = size.h || customH
      iframeRef.current.srcdoc = buildSandboxHTML(selected.cssCode, selected.jsCode, selected.previewBg)
    }
  }, [selected, size, customW, customH])

  function startAdTimer() {
    setAdRunning(true); setAdTimer(5)
    timerRef.current = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setAdWatched(true); setAdRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function downloadWallpaper() {
    if (!selected) return
    const w = size.w || customW
    const h = size.h || customH
    const html = buildSandboxHTML(selected.cssCode, selected.jsCode, selected.previewBg)
    const fullHtml = html.replace(
      '<body>',
      `<body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;">`
    )
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `motionzync-${selected.title.replace(/\s+/g,'-').toLowerCase()}-${w}x${h}.html`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }

  const finalW = size.w || customW
  const finalH = size.h || customH

  return (
    <div className="wallpaper-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>Live <span className="gradient-text">Wallpaper</span> Download</h1>
          <p>Choose any animation, set your screen size, and download as a live HTML wallpaper. Free with a short ad.</p>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_WALLPAPER}/></div>

        <div className="wallpaper-grid">
          {/* Left: Animation selector + preview */}
          <div className="wallpaper-left">
            <div className="section-card">
              <h3>🎨 Select Animation</h3>
              <select className="wall-select" value={selected?.docId||''} onChange={e => setSelected(animations.find(a => a.docId === e.target.value))}>
                {animations.map(a => <option key={a.docId} value={a.docId}>{a.title}</option>)}
              </select>
            </div>

            <div className="section-card">
              <h3>📐 Screen Size</h3>
              <div className="size-grid">
                {SIZES.map(s => (
                  <button key={s.label} className={`size-btn ${size.label===s.label?'active':''}`} onClick={() => setSize(s)}>
                    {s.label}
                  </button>
                ))}
              </div>
              {size.label === 'Custom' && (
                <div className="custom-size">
                  <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))} placeholder="Width"/>
                  <span>×</span>
                  <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))} placeholder="Height"/>
                  <span className="size-unit">px</span>
                </div>
              )}
              <p className="size-display">Selected: <strong>{finalW} × {finalH} px</strong></p>
            </div>

            {/* Download section */}
            <div className="section-card download-card">
              <h3>⬇️ Download</h3>
              {!adWatched ? (
                <>
                  <p className="ad-info">Watch a short 5-second ad to unlock download and support free service.</p>
                  {adRunning ? (
                    <div className="ad-timer-box">
                      <div className="ad-timer-count">{adTimer}</div>
                      <p>Ad playing... please wait</p>
                      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_WALLPAPER}/>
                    </div>
                  ) : (
                    <button className="btn-primary watch-ad-btn" onClick={startAdTimer}>▶️ Watch Short Ad (5 sec)</button>
                  )}
                </>
              ) : (
                <div className="download-ready">
                  <p className="download-ready-text">✅ Ad watched! Download is unlocked.</p>
                  <button className="btn-primary download-btn" onClick={downloadWallpaper}>⬇️ Download HTML Wallpaper</button>
                  {downloaded && (
                    <div className="download-instructions">
                      <h4>📱 How to set as wallpaper:</h4>
                      <ol>
                        <li>Download a live wallpaper app (e.g. <strong>KLWP</strong> or <strong>Wallpaper Engine</strong>)</li>
                        <li>Open the app and select "Web/HTML" wallpaper type</li>
                        <li>Import the downloaded .html file</li>
                        <li>Set it as your wallpaper!</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="wallpaper-right">
            <div className="section-card preview-card">
              <h3>👁️ Preview</h3>
              <div className="wall-preview-frame" style={{aspectRatio: `${finalW}/${finalH}`}}>
                <iframe ref={iframeRef} sandbox="allow-scripts" title="wallpaper preview" className="wall-iframe"/>
              </div>
              <p className="preview-note">Preview is scaled — actual download will be {finalW}×{finalH}px</p>
            </div>
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_WALLPAPER}/></div>

        <div className="wallpaper-info prose">
          <h2>What is a Live HTML Wallpaper?</h2>
          <p>A live HTML wallpaper is an animated background that runs as a web page on your device. Unlike static image wallpapers, it plays real animations — particles, waves, glows — making your screen come alive.</p>
          <h2>How to Use</h2>
          <ol>
            <li>Choose any animation from the selector above</li>
            <li>Select your device's screen resolution</li>
            <li>Watch the short ad to support our free service</li>
            <li>Download the HTML file</li>
            <li>Use a live wallpaper app to set it on your device</li>
          </ol>
          <h2>Recommended Apps</h2>
          <ul>
            <li><strong>Android:</strong> KLWP Live Wallpaper Maker, Wallpaper Engine (if available)</li>
            <li><strong>Windows:</strong> Lively Wallpaper (free), Wallpaper Engine (Steam)</li>
            <li><strong>Mac:</strong> HiDock, or set as browser homepage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

