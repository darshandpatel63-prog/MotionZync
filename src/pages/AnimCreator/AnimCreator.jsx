// AnimCreator.jsx — UPDATED (Feature 7)
// Added: SceneTabs bar below TopBar
//        Alt+N → add new scene shortcut

import { useState, useRef, useEffect } from 'react'
import { useCreator, CreatorProvider } from './store/CreatorContext.jsx'
import TopBar        from './panels/TopBar.jsx'
import SceneTabs     from './panels/SceneTabs.jsx'
import LayerPanel    from './panels/LayerPanel.jsx'
import Canvas        from './panels/Canvas.jsx'
import RightPanel    from './panels/RightPanel.jsx'
import TimelinePanel from './panels/TimelinePanel.jsx'
import ExportModal   from './modals/ExportModal.jsx'
import LibraryModal  from './modals/LibraryModal.jsx'
import './AnimCreator.css'

const TL_DEFAULT = 220
const TL_MIN     = 120
const TL_MAX     = 420

function AnimCreatorInner() {
  const { dispatch, addScene } = useCreator()
  const [showExport,   setShowExport]   = useState(false)
  const [showLibrary,  setShowLibrary]  = useState(false)
  const [showTimeline, setShowTimeline] = useState(true)
  const [tlHeight,     setTlHeight]     = useState(TL_DEFAULT)
  const resizingRef = useRef(false)

  // ── Timeline resize ──────────────────────────────────────
  function onResizeMouseDown(e) {
    e.preventDefault()
    resizingRef.current = true
    const startY = e.clientY, startH = tlHeight
    function onMove(ev) {
      if (!resizingRef.current) return
      setTlHeight(Math.max(TL_MIN, Math.min(TL_MAX, startH + (startY - ev.clientY))))
    }
    function onUp() {
      resizingRef.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      // K → add keyframe
      if (e.key==='k'||e.key==='K') dispatch({ type:'ADD_KF_SHORTCUT' })
      // Alt+N → new scene
      if (e.altKey && e.key==='n') { e.preventDefault(); addScene() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch, addScene])

  return (
    <div className="anim-creator">
      {/* Top toolbar */}
      <TopBar onExport={() => setShowExport(true)} onLibrary={() => setShowLibrary(true)}/>

      {/* ── Scene tabs bar (NEW) ───────────────────────────── */}
      <SceneTabs/>

      {/* Main editing body */}
      <div className="ac-body">
        <LayerPanel/>
        <Canvas/>
        <RightPanel/>
      </div>

      {/* Timeline resize handle */}
      {showTimeline && (
        <div className="tl-resize-handle" onMouseDown={onResizeMouseDown}>
          <div className="tl-resize-grip"/>
          <button className="tl-toggle-btn"
            onClick={e=>{e.stopPropagation();setShowTimeline(false)}}
            title="Hide Timeline">▾ Timeline</button>
        </div>
      )}

      {/* Timeline panel */}
      {showTimeline && (
        <div style={{ height:tlHeight, flexShrink:0 }}>
          <TimelinePanel/>
        </div>
      )}

      {!showTimeline && (
        <button className="tl-show-btn" onClick={() => setShowTimeline(true)}>
          ▴ Timeline
        </button>
      )}

      {/* Modals */}
      {showExport  && <ExportModal  onClose={() => setShowExport(false)}/>}
      {showLibrary && <LibraryModal onClose={() => setShowLibrary(false)}/>}
    </div>
  )
}

export default function AnimCreator() {
  return (
    <CreatorProvider>
      <AnimCreatorInner/>
    </CreatorProvider>
  )
}
