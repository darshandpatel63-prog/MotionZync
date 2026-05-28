// AnimCreator.jsx — UPDATED (Feature 4)
// Added: TimelinePanel at bottom + resize handle + K shortcut

import { useState, useRef, useEffect } from 'react'
import { useCreator, CreatorProvider } from './store/CreatorContext.jsx'
import TopBar       from './panels/TopBar.jsx'
import LayerPanel   from './panels/LayerPanel.jsx'
import Canvas       from './panels/Canvas.jsx'
import RightPanel   from './panels/RightPanel.jsx'
import TimelinePanel from './panels/TimelinePanel.jsx'
import ExportModal  from './modals/ExportModal.jsx'
import LibraryModal from './modals/LibraryModal.jsx'
import './AnimCreator.css'

const TL_DEFAULT = 220   // default timeline height px
const TL_MIN     = 120
const TL_MAX     = 420

function AnimCreatorInner() {
  const { dispatch, selected } = useCreator()
  const [showExport,  setShowExport]  = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showTimeline, setShowTimeline] = useState(true)
  const [tlHeight,    setTlHeight]    = useState(TL_DEFAULT)
  const resizingRef = useRef(false)

  // ── Resize timeline panel ────────────────────────────────
  function onResizeMouseDown(e) {
    e.preventDefault()
    resizingRef.current = true
    const startY  = e.clientY
    const startH  = tlHeight

    function onMove(ev) {
      if (!resizingRef.current) return
      const delta = startY - ev.clientY   // drag up = bigger
      setTlHeight(Math.max(TL_MIN, Math.min(TL_MAX, startH + delta)))
    }
    function onUp() {
      resizingRef.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }

  // ── K key → Add keyframe shortcut ───────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      if (e.key==='k'||e.key==='K')
        dispatch({ type:'ADD_KF_SHORTCUT' })   // handled in TimelinePanel
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  return (
    <div className="anim-creator">
      {/* Top toolbar */}
      <TopBar onExport={() => setShowExport(true)} onLibrary={() => setShowLibrary(true)}/>

      {/* Main body */}
      <div className="ac-body">
        <LayerPanel/>
        <Canvas/>
        <RightPanel/>
      </div>

      {/* Timeline resize handle */}
      {showTimeline && (
        <div className="tl-resize-handle" onMouseDown={onResizeMouseDown}>
          <div className="tl-resize-grip"/>
          <button className="tl-toggle-btn" onClick={e=>{e.stopPropagation();setShowTimeline(false)}}
            title="Hide Timeline">▾ Timeline</button>
        </div>
      )}

      {/* Timeline panel */}
      {showTimeline && (
        <div style={{ height: tlHeight, flexShrink:0 }}>
          <TimelinePanel/>
        </div>
      )}

      {/* Show timeline button when hidden */}
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
