import { useRef, useEffect, useState, useCallback } from 'react'
import { useCreator, makeElement } from '../store/CreatorContext.jsx'
import { buildAnimStyle, buildBorderStyle, buildFilterStyle, buildShadowStyle, buildGradient, KEYFRAMES_CSS, BORDER_KEYFRAMES } from '../engine/AnimEngine.js'
import { stepPhysics, resolveCollisions, initRestPositions } from '../engine/PhysicsEngine.js'
import './Canvas.css'

const STAGE_W = 900
const STAGE_H = 580
const SNAP    = 10

// ─── Snap helper ─────────────────────────────────────────────
function snap(v) { return Math.round(v / SNAP) * SNAP }

// ─── Smart guide lines ────────────────────────────────────────
function GuideLines({ elements, draggingId }) {
  if (!draggingId) return null
  const moving = elements.find(e => e.id === draggingId)
  if (!moving) return null
  const guides = []
  const others = elements.filter(e => e.id !== draggingId)
  others.forEach(o => {
    // center align X
    if (Math.abs((moving.x + moving.width/2) - (o.x + o.width/2)) < 6) {
      guides.push(<div key={`cx-${o.id}`} className="guide guide-v" style={{ left: o.x + o.width/2 }}/>)
    }
    // center align Y
    if (Math.abs((moving.y + moving.height/2) - (o.y + o.height/2)) < 6) {
      guides.push(<div key={`cy-${o.id}`} className="guide guide-h" style={{ top: o.y + o.height/2 }}/>)
    }
    // edge align left
    if (Math.abs(moving.x - o.x) < 6) {
      guides.push(<div key={`el-${o.id}`} className="guide guide-v" style={{ left: o.x }}/>)
    }
    // edge align right
    if (Math.abs((moving.x+moving.width) - (o.x+o.width)) < 6) {
      guides.push(<div key={`er-${o.id}`} className="guide guide-v" style={{ left: o.x+o.width }}/>)
    }
  })
  return <>{guides}</>
}

// ─── Grid overlay ─────────────────────────────────────────────
function GridOverlay() {
  return (
    <svg className="stage-grid" width={STAGE_W} height={STAGE_H}>
      <defs>
        <pattern id="smallGrid" width={SNAP} height={SNAP} patternUnits="userSpaceOnUse">
          <path d={`M ${SNAP} 0 L 0 0 0 ${SNAP}`} fill="none" stroke="rgba(124,58,237,0.06)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="bigGrid" width={SNAP*5} height={SNAP*5} patternUnits="userSpaceOnUse">
          <rect width={SNAP*5} height={SNAP*5} fill="url(#smallGrid)"/>
          <path d={`M ${SNAP*5} 0 L 0 0 0 ${SNAP*5}`} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bigGrid)"/>
    </svg>
  )
}

// ─── Ambient animated background ─────────────────────────────
function AmbientBg({ bgColor }) {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = STAGE_W; cv.height = STAGE_H
    let t = 0, id
    function draw() {
      ctx.clearRect(0, 0, STAGE_W, STAGE_H)
      for (let i = 0; i < 3; i++) {
        const x = STAGE_W*(0.2+i*0.3)+Math.sin(t*0.4+i*1.2)*STAGE_W*0.08
        const y = STAGE_H*(0.3+i*0.2)+Math.cos(t*0.3+i)*STAGE_H*0.08
        const g = ctx.createRadialGradient(x,y,0,x,y,160+i*40)
        g.addColorStop(0,`hsla(${260+i*40},70%,55%,0.07)`)
        g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.fillRect(0,0,STAGE_W,STAGE_H)
      }
      t+=0.008; id=requestAnimationFrame(draw)
    }
    draw(); return ()=>cancelAnimationFrame(id)
  },[])
  return <canvas ref={cvRef} className="ambient-bg" style={{background:bgColor}}/>
}

// ─── Single canvas element ────────────────────────────────────
function CanvasEl({ el, isSelected, onMouseDown }) {
  const animStyle = buildAnimStyle(el)
  const borderStyle = buildBorderStyle(el)
  const filterStr = buildFilterStyle(el)
  const shadowStr = buildShadowStyle(el)
  const bg = buildGradient(el)

  const physDelta = el.physics?.enabled ? el.physics : null
  const rx = physDelta?._rotDelta || 0

  const style = {
    position: 'absolute',
    left: Math.round(el.x),
    top:  Math.round(el.y),
    width:  el.width,
    height: el.height,
    opacity: el.opacity,
    transform: `rotate(${(el.rotation||0)+rx}deg)`,
    zIndex: el.zIndex || 0,
    visibility: el.visible === false ? 'hidden' : 'visible',
    cursor: el.locked ? 'not-allowed' : 'move',
    willChange: 'transform',
  }

  if (el.type !== 'text') {
    style.background      = bg
    style.borderRadius    = el.type === 'circle' ? '50%' : `${el.borderRadius||8}%`
  }
  if (shadowStr)  style.boxShadow = shadowStr
  if (filterStr)  style.filter    = filterStr
  if (animStyle && !el.physics?.enabled) style.animation = animStyle

  // Border anim overrides
  if (el.borderAnim?.enabled) {
    Object.assign(style, borderStyle)
  }

  const textStyle = el.type === 'text' ? {
    color:      el.fontColor || '#ffffff',
    fontSize:   el.fontSize || 20,
    fontWeight: el.fontWeight || 700,
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    userSelect: 'none',
    padding: '0 8px',
    width: '100%',
    height: '100%',
  } : {}

  return (
    <div
      data-id={el.id}
      className={`canvas-el ${isSelected ? 'sel' : ''} ${el.type}`}
      style={style}
      onMouseDown={e => onMouseDown(e, el)}
    >
      {el.type === 'text' && <span style={textStyle}>{el.label}</span>}

      {/* Resize handles (show when selected) */}
      {isSelected && !el.locked && (
        <>
          <div className="rh rh-nw" data-handle="nw"/>
          <div className="rh rh-n"  data-handle="n"/>
          <div className="rh rh-ne" data-handle="ne"/>
          <div className="rh rh-e"  data-handle="e"/>
          <div className="rh rh-se" data-handle="se"/>
          <div className="rh rh-s"  data-handle="s"/>
          <div className="rh rh-sw" data-handle="sw"/>
          <div className="rh rh-w"  data-handle="w"/>
          {/* Rotation handle */}
          <div className="rot-handle" data-handle="rot"/>
        </>
      )}
    </div>
  )
}

// ─── Draw preview (for draw/line tool) ───────────────────────
function DrawPreview({ points, color }) {
  if (!points || points.length < 2) return null
  const pathD = points.reduce((acc,p,i) => acc + (i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`),'')
  return (
    <svg className="draw-preview-svg" width={STAGE_W} height={STAGE_H}>
      <path d={pathD} stroke={color||'#7c3aed'} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Main Canvas ──────────────────────────────────────────────
export default function Canvas() {
  const {
    elements, selected, select, addElement, updateEl, updateElHist,
    activeTool, zoom, panX, panY, dispatch, showGrid, bgColor,
    mode,
  } = useCreator()

  const stageRef    = useRef(null)
  const cursorRef   = useRef({ x: null, y: null })
  const dragRef     = useRef(null)   // { id, startMouseX, startMouseY, startElX, startElY, handle }
  const physLoopRef = useRef(null)
  const drawPointsRef = useRef([])
  const [drawPreview, setDrawPreview] = useState(null)
  const [draggingId, setDraggingId]   = useState(null)

  // ── Inject keyframes once ────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('mz-kf')) {
      const s = document.createElement('style')
      s.id = 'mz-kf'
      s.textContent = KEYFRAMES_CSS + BORDER_KEYFRAMES
      document.head.appendChild(s)
    }
  }, [])

  // Keep elements ref for physics loop
  const elementsRef = useRef(elements)
  useEffect(() => { elementsRef.current = elements }, [elements])

  // ── Physics loop ─────────────────────────────────────────────
  useEffect(() => {
    let last = performance.now()
    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const cx = cursorRef.current.x
      const cy = cursorRef.current.y
      const els = elementsRef.current

      const hasPhysics = els.some(e => e.physics?.enabled && !e.physics?.sleeping)
      if (!hasPhysics) { physLoopRef.current = requestAnimationFrame(loop); return }

      const physUpdates = {}
      els.forEach(el => {
        if (!el.physics?.enabled || el.locked) return
        const pu = stepPhysics(el, cx, cy, dt)
        if (!pu) return
        physUpdates[el.id] = pu
      })

      if (!Object.keys(physUpdates).length) { physLoopRef.current = requestAnimationFrame(loop); return }

      const newEls = els.map(el => {
        const pu = physUpdates[el.id]
        if (!pu) return el
        const mode = el.physics.mode
        let newX = el.x, newY = el.y
        if (mode === 'gravity' || mode === 'bounce') {
          newX = el.x + (pu.vx||0); newY = el.y + (pu.vy||0)
          if (newY + el.height >= 580) newY = 580 - el.height
          if (newY < 0) newY = 0; if (newX < 0) newX = 0
          if (newX + el.width >= 900) newX = 900 - el.width
        } else if (mode === 'spring' || mode === 'magnetic') {
          newX = el.x + (pu.vx||0); newY = el.y + (pu.vy||0)
        } else if (mode === 'float') {
          const restX = pu.restX ?? el.x; const restY = pu.restY ?? el.y
          newX = restX + Math.sin((pu._floatT||0)*0.7+(pu._seed||0))*5
          newY = restY + Math.sin((pu._floatT||0)+(pu._seed||0))*14
        } else if (mode === 'wind') {
          const restX = pu.restX ?? el.x; const restY = pu.restY ?? el.y
          newX = restX + (pu.vx||0)*8; newY = restY + (pu.vy||0)*4
        } else if (mode === 'cloth') {
          const restX = pu.restX ?? el.x
          newX = restX + (pu.vx||0); newY = el.y
        }
        return { ...el, x: newX, y: newY, physics: { ...el.physics, ...pu } }
      })

      dispatch({ type: 'LOAD_ELEMENTS', elements: newEls })
      physLoopRef.current = requestAnimationFrame(loop)
    }
    physLoopRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(physLoopRef.current)
  }, [dispatch])

  // ── Cursor tracking ───────────────────────────────────────────
  const trackCursor = useCallback((e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    cursorRef.current = {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top)  / zoom,
    }
  }, [zoom])

  // ── Stage click — add element ─────────────────────────────────
  function handleStageClick(e) {
    if (e.target !== stageRef.current && !e.target.classList.contains('ambient-bg') && !e.target.classList.contains('stage-grid')) return
    if (activeTool === 'select') { select([]); return }
    const rect  = stageRef.current.getBoundingClientRect()
    const rawX  = (e.clientX - rect.left) / zoom
    const rawY  = (e.clientY - rect.top)  / zoom
    const x     = snap(rawX - 50)
    const y     = snap(rawY - 50)
    const typeMap = { rect:'rect', circle:'circle', text:'text', triangle:'triangle', star:'star', line:'line' }
    const type = typeMap[activeTool]
    if (type) {
      addElement(type, x, y)
      dispatch({ type:'SET_TOOL', tool:'select' })
    }
  }

  // ── Mouse down on element ─────────────────────────────────────
  function handleElMouseDown(e, el) {
    e.preventDefault()
    e.stopPropagation()
    if (el.locked) return

    // Handle click
    const handle = e.target.dataset?.handle
    select([el.id])

    const rect = stageRef.current.getBoundingClientRect()
    dragRef.current = {
      id: el.id,
      handle: handle || 'move',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElX: el.x,
      startElY: el.y,
      startW:   el.width,
      startH:   el.height,
      startRot: el.rotation || 0,
      centerX:  el.x + el.width/2,
      centerY:  el.y + el.height/2,
    }
    setDraggingId(el.id)

    // Wake physics
    if (el.physics?.enabled) {
      updateEl(el.id, { physics: { ...el.physics, sleeping: false, vx:0, vy:0 } })
    }
  }

  // ── Mouse move ────────────────────────────────────────────────
  useEffect(() => {
    function onMove(e) {
      trackCursor(e)
      if (!dragRef.current) return
      const d   = dragRef.current
      const dx  = (e.clientX - d.startMouseX) / zoom
      const dy  = (e.clientY - d.startMouseY) / zoom
      const el  = elements.find(x => x.id === d.id)
      if (!el) return

      if (d.handle === 'move') {
        updateEl(d.id, { x: snap(d.startElX + dx), y: snap(d.startElY + dy) })
      } else if (d.handle === 'rot') {
        const cx = el.x + el.width/2
        const cy = el.y + el.height/2
        const angle = Math.atan2(cursorRef.current.y - cy, cursorRef.current.x - cx) * (180/Math.PI)
        updateEl(d.id, { rotation: Math.round(angle + 90) })
      } else {
        // Resize
        let { startElX:nx, startElY:ny, startW:nw, startH:nh } = d
        const h = d.handle
        if (h.includes('e')) nw = Math.max(20, d.startW + dx)
        if (h.includes('s')) nh = Math.max(20, d.startH + dy)
        if (h.includes('w')) { nx = d.startElX + dx; nw = Math.max(20, d.startW - dx) }
        if (h.includes('n')) { ny = d.startElY + dy; nh = Math.max(20, d.startH - dy) }
        updateEl(d.id, { x:snap(nx), y:snap(ny), width:Math.round(nw), height:Math.round(nh) })
      }
    }
    function onUp() {
      if (dragRef.current) {
        // Commit to history on drag end
        const d = dragRef.current
        const el = elements.find(x => x.id === d.id)
        if (el) {
          // Set rest position for physics
          if (el.physics?.enabled) {
            updateEl(d.id, { physics: { ...el.physics, restX: el.x, restY: el.y, sleeping: false } })
          }
        }
        dragRef.current = null
        setDraggingId(null)
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [elements, zoom, updateEl, trackCursor])

  // ── Draw tool ─────────────────────────────────────────────────
  function handleDrawStart(e) {
    if (activeTool !== 'draw') return
    const rect = stageRef.current.getBoundingClientRect()
    const p = { x: (e.clientX-rect.left)/zoom, y: (e.clientY-rect.top)/zoom }
    drawPointsRef.current = [p]
    setDrawPreview([p])
  }
  function handleDrawMove(e) {
    if (activeTool !== 'draw' || !drawPointsRef.current.length) return
    const rect = stageRef.current.getBoundingClientRect()
    const p = { x:(e.clientX-rect.left)/zoom, y:(e.clientY-rect.top)/zoom }
    drawPointsRef.current.push(p)
    setDrawPreview([...drawPointsRef.current])
  }
  function handleDrawEnd() {
    if (activeTool !== 'draw' || drawPointsRef.current.length < 2) return
    const pts = drawPointsRef.current
    const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y)
    const minX = Math.min(...xs), minY = Math.min(...ys)
    const maxX = Math.max(...xs), maxY = Math.max(...ys)
    addElement('draw', minX, minY, {
      width: maxX-minX||20, height: maxY-minY||20,
      _points: pts,
      label: 'Drawing',
    })
    drawPointsRef.current = []
    setDrawPreview(null)
    dispatch({ type:'SET_TOOL', tool:'select' })
  }

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selected.length) dispatch({ type:'DELETE_ELEMENTS', ids:selected })
      }
      if (e.key === 'Escape') select([])
      if ((e.ctrlKey||e.metaKey) && e.key==='z') { e.preventDefault(); dispatch({type:'UNDO'}) }
      if ((e.ctrlKey||e.metaKey) && e.key==='y') { e.preventDefault(); dispatch({type:'REDO'}) }
      if ((e.ctrlKey||e.metaKey) && e.key==='d') { e.preventDefault(); if(selected[0]) dispatch({type:'DUPLICATE_ELEMENT',id:selected[0]}) }
      // Tool shortcuts
      const shortcuts = {v:'select',r:'rect',c:'circle',t:'text',x:'text',l:'line',d:'draw',i:'image'}
      if (!e.ctrlKey && !e.metaKey && shortcuts[e.key]) dispatch({type:'SET_TOOL',tool:shortcuts[e.key]})
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, dispatch, select])

  return (
    <div
      className="canvas-area"
      style={{ cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}
    >
      <div
        className="canvas-zoom-wrap"
        style={{ transform: `scale(${zoom}) translate(${panX}px,${panY}px)`, transformOrigin: 'center center' }}
      >
        <div
          ref={stageRef}
          className="stage"
          style={{ width: STAGE_W, height: STAGE_H, background: bgColor || '#0a0a0f' }}
          onClick={handleStageClick}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseMoveCapture={trackCursor}
        >
          <AmbientBg bgColor={bgColor || '#0a0a0f'}/>
          {showGrid && <GridOverlay/>}

          {/* Render elements */}
          {elements.map(el => (
            <CanvasEl
              key={el.id}
              el={el}
              isSelected={selected.includes(el.id)}
              onMouseDown={handleElMouseDown}
            />
          ))}

          {/* Smart guides */}
          <GuideLines elements={elements} draggingId={draggingId}/>

          {/* Draw preview */}
          {drawPreview && <DrawPreview points={drawPreview} color="#7c3aed"/>}

          {/* Stage hint */}
          {elements.length === 0 && (
            <div className="stage-hint">
              <div className="sh-icon">🎨</div>
              <div className="sh-text">Click to add shape</div>
              <div className="sh-sub">Select a tool from toolbar → click anywhere</div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="canvas-zoom-badge">{Math.round(zoom*100)}%</div>

      {/* Cursor tool indicator */}
      {activeTool !== 'select' && (
        <div className="canvas-tool-badge">
          {activeTool.toUpperCase()} — Click to place
        </div>
      )}

      {/* Bottom status bar */}
      <div className="canvas-statusbar">
        <div className="csb-group">
          <span className="csb-label">BG</span>
          <input type="color" className="csb-color" value={bgColor||'#0a0a0f'}
            onChange={e => dispatch({type:'SET_BG_COLOR', color:e.target.value})}/>
          <input className="csb-hex" value={bgColor||'#0a0a0f'}
            onChange={e => dispatch({type:'SET_BG_COLOR', color:e.target.value})}
            maxLength={7}/>
        </div>
        <div className="csb-group">
          <span className="csb-label">Elements:</span>
          <span className="csb-val">{elements.length}</span>
        </div>
        <div className="csb-group">
          <span className="csb-label">Stage:</span>
          <span className="csb-val">900 × 580</span>
        </div>
        {selected.length > 0 && (
          <div className="csb-group csb-selected">
            <span>✓ {selected.length} selected</span>
          </div>
        )}
      </div>
    </div>
  )
                  }
      
