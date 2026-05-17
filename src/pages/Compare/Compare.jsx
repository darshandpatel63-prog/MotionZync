import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import { getAnimationById, getAnimations } from '../../hooks/useAnimations.js'
import './Compare.css'

const SPEEDS = [
  { label:'0.5x', value:0.5 },
  { label:'1x',   value:1   },
  { label:'2x',   value:2   },
]

export default function Compare() {
  const [searchParams] = useSearchParams()
  const [animations, setAnimations] = useState([])
  const [animA, setAnimA] = useState(null)
  const [animB, setAnimB] = useState(null)
  const [selA,  setSelA]  = useState('')
  const [selB,  setSelB]  = useState('')
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    getAnimations().then(list => {
      setAnimations(list)
      const a = searchParams.get('a')
      const b = searchParams.get('b')
      if (a) { const found = list.find(x=>x.docId===a); if(found){setAnimA(found);setSelA(a)} }
      if (b) { const found = list.find(x=>x.docId===b); if(found){setAnimB(found);setSelB(b)} }
      else if (list.length>1) { setAnimB(list[1]); setSelB(list[1].docId) }
    })
  }, [])

  function pickA(e) {
    const id = e.target.value; setSelA(id)
    const f = animations.find(x=>x.docId===id); setAnimA(f||null)
  }
  function pickB(e) {
    const id = e.target.value; setSelB(id)
    const f = animations.find(x=>x.docId===id); setAnimB(f||null)
  }

  return (
    <div className="compare-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>⚖️ Compare <span className="gradient-text">Animations</span></h1>
          <p>Side by side two animations compare karo</p>
        </div>

        {/* Speed + selectors */}
        <div className="compare-controls">
          <div className="compare-selectors">
            <select className="comp-select" value={selA} onChange={pickA}>
              <option value="">— Animation A —</option>
              {animations.map(a=><option key={a.docId} value={a.docId}>{a.title}</option>)}
            </select>
            <span className="vs-badge">VS</span>
            <select className="comp-select" value={selB} onChange={pickB}>
              <option value="">— Animation B —</option>
              {animations.map(a=><option key={a.docId} value={a.docId}>{a.title}</option>)}
            </select>
          </div>
          <div className="speed-control">
            <span className="speed-label">⚡ Speed:</span>
            {SPEEDS.map(s=>(
              <button key={s.value} className={`speed-btn ${speed===s.value?'active':''}`} onClick={()=>setSpeed(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compare grid */}
        <div className="compare-grid">
          {/* A */}
          <div className="compare-pane">
            {animA ? (
              <>
                <div className="compare-pane-header">
                  <span className="compare-pane-title">{animA.title}</span>
                  <Link to={`/animation/${animA.docId}`} className="btn-primary comp-try-btn">Try it ⚡</Link>
                </div>
                <div className="compare-preview">
                  <LivePreview cssCode={animA.cssCode} jsCode={animA.jsCode} bgColor={animA.previewBg} speed={speed}/>
                </div>
                <div className="compare-info">
                  <span className="detail-cat">{animA.category}</span>
                  <span className="detail-views">👁️ {animA.views||0}</span>
                  {animA.tags?.slice(0,3).map(t=><span key={t} className="detail-tag">#{t}</span>)}
                </div>
              </>
            ) : (
              <div className="compare-empty">
                <span>🎨</span>
                <p>Animation A select karo</p>
              </div>
            )}
          </div>

          {/* B */}
          <div className="compare-pane">
            {animB ? (
              <>
                <div className="compare-pane-header">
                  <span className="compare-pane-title">{animB.title}</span>
                  <Link to={`/animation/${animB.docId}`} className="btn-primary comp-try-btn">Try it ⚡</Link>
                </div>
                <div className="compare-preview">
                  <LivePreview cssCode={animB.cssCode} jsCode={animB.jsCode} bgColor={animB.previewBg} speed={speed}/>
                </div>
                <div className="compare-info">
                  <span className="detail-cat">{animB.category}</span>
                  <span className="detail-views">👁️ {animB.views||0}</span>
                  {animB.tags?.slice(0,3).map(t=><span key={t} className="detail-tag">#{t}</span>)}
                </div>
              </>
            ) : (
              <div className="compare-empty">
                <span>🎨</span>
                <p>Animation B select karo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

