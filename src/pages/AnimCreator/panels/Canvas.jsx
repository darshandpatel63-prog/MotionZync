// Canvas.jsx — UPDATED (Feature 2)
// Feature 1: Space+drag pan · Scroll zoom · Marquee · Shift+click · Copy/paste · Image upload
// Feature 2: Right-click context menu · Keyboard shortcut overlay (?key)

import { useRef, useEffect, useState, useCallback } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import { KEYFRAMES_CSS, BORDER_KEYFRAMES } from '../engine/AnimEngine.js'
import { stepPhysics } from '../engine/PhysicsEngine.js'
import CanvasElement   from './CanvasElement.jsx'
import ContextMenu     from './ContextMenu.jsx'
import ShortcutOverlay from '../modals/ShortcutOverlay.jsx'
import ParticleCanvas  from './ParticleCanvas.jsx'
import RopeCanvas      from './RopeCanvas.jsx'
import { resolveElementCollisions } from '../engine/CollisionEngine.js'
import './Canvas.css'

const STAGE_W = 900
const STAGE_H = 580
const SNAP    = 10
const snap = v => Math.round(v / SNAP) * SNAP

// ── Grid overlay ─────────────────────────────────────────────
function GridOverlay() {
  return (
    <svg className="stage-grid" width={STAGE_W} height={STAGE_H}>
      <defs>
        <pattern id="sg" width={SNAP} height={SNAP} patternUnits="userSpaceOnUse">
          <path d={`M ${SNAP} 0 L 0 0 0 ${SNAP}`} fill="none" stroke="rgba(124,58,237,0.06)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="bg" width={SNAP*5} height={SNAP*5} patternUnits="userSpaceOnUse">
          <rect width={SNAP*5} height={SNAP*5} fill="url(#sg)"/>
          <path d={`M ${SNAP*5} 0 L 0 0 0 ${SNAP*5}`} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
    </svg>
  )
}

// ── Ambient animated background ──────────────────────────────
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
  }, [])
  return <canvas ref={cvRef} className="ambient-bg" style={{ background: bgColor }}/>
}

// ── Alignment guides ─────────────────────────────────────────
function GuideLines({ elements, draggingId }) {
  if (!draggingId) return null
  const moving = elements.find(e => e.id === draggingId)
  if (!moving) return null
  const guides = []
  elements.filter(e => e.id !== draggingId).forEach(o => {
    const mc = moving.x+moving.width/2, oc = o.x+o.width/2
    const mr = moving.y+moving.height/2, or2 = o.y+o.height/2
    if (Math.abs(mc-oc)<6)  guides.push(<div key={`cx${o.id}`} className="guide guide-v" style={{left:oc}}/>)
    if (Math.abs(mr-or2)<6) guides.push(<div key={`cy${o.id}`} className="guide guide-h" style={{top:or2}}/>)
    if (Math.abs(moving.x-o.x)<6) guides.push(<div key={`el${o.id}`} className="guide guide-v" style={{left:o.x}}/>)
    if (Math.abs(moving.x+moving.width-(o.x+o.width))<6)
      guides.push(<div key={`er${o.id}`} className="guide guide-v" style={{left:o.x+o.width}}/>)
  })
  return <>{guides}</>
}

// ── Draw preview ─────────────────────────────────────────────
function DrawPreview({ points }) {
  if (!points || points.length < 2) return null
  const d = points.reduce((a,p,i)=>a+(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`),'')
  return (
    <svg className="draw-preview-svg" width={STAGE_W} height={STAGE_H}>
      <path d={d} stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ── Marquee selection box ────────────────────────────────────
function MarqueeBox({ box }) {
  if (!box || (box.w < 4 && box.h < 4)) return null
  return <div className="marquee-box" style={{ left:box.x, top:box.y, width:box.w, height:box.h }}/>
}

// ════════════════════════════════════════════════════════════
// Main Canvas
// ════════════════════════════════════════════════════════════
export default function Canvas() {
  const {
    elements, selected, select, addElement, updateEl,
    activeTool, zoom, panX, panY, dispatch, showGrid, bgColor,
  } = useCreator()

  // ── Refs (no stale closure issues) ───────────────────────
  const stageRef       = useRef(null)
  const canvasAreaRef  = useRef(null)
  const elementsRef    = useRef(elements)
  const cursorRef      = useRef({ x: 0, y: 0 })
  const dragRef        = useRef(null)
  const physLoopRef    = useRef(null)
  const drawPointsRef  = useRef([])
  const clipboardRef   = useRef([])
  const imgInputRef    = useRef(null)
  const spaceRef       = useRef(false)
  const panDragRef     = useRef(null)
  const marqueeRef     = useRef(null)   // { startX, startY, endX, endY }
  const zoomRef        = useRef(zoom)
  const panRef         = useRef({ x: panX, y: panY })

  // Keep refs in sync
  useEffect(() => { elementsRef.current = elements }, [elements])
  useEffect(() => { zoomRef.current = zoom },          [zoom])
  useEffect(() => { panRef.current = { x: panX, y: panY } }, [panX, panY])

  // ── UI state ─────────────────────────────────────────────
  const [drawPreview, setDrawPreview] = useState(null)
  const [draggingId,  setDraggingId]  = useState(null)
  const [marqueeBox,  setMarqueeBox]  = useState(null)
  const [spaceDown,   setSpaceDown]   = useState(false)
  const [panning,     setPanning]     = useState(false)
  // Feature 2
  const [ctxMenu,     setCtxMenu]     = useState(null)  // { x, y, el }
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [ropes,         setRopes]         = useState([])

  // Sync ropes from window (set by RightPanel)
  useEffect(() => {
    function syncRopes() { setRopes([...(window._mzRopes||[])]) }
    const id = setInterval(syncRopes, 500)
    return () => clearInterval(id)
  }, [])

  // ── Inject keyframes once ─────────────────────────────────
  useEffect(() => {
    if (document.getElementById('mz-kf')) return
    const s = document.createElement('style')
    s.id = 'mz-kf'
    s.textContent = KEYFRAMES_CSS + BORDER_KEYFRAMES
    document.head.appendChild(s)
  }, [])

  // ── Physics loop ──────────────────────────────────────────
  useEffect(() => {
    let last = performance.now()
    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      const els = elementsRef.current
      if (!els.some(e => e.physics?.enabled && !e.physics?.sleeping)) {
        physLoopRef.current = requestAnimationFrame(loop); return
      }
      const cx = cursorRef.current.x, cy = cursorRef.current.y
      const updates = {}
      els.forEach(el => {
        if (!el.physics?.enabled || el.locked) return
        const pu = stepPhysics(el, cx, cy, dt)
        if (pu) updates[el.id] = pu
      })
      if (!Object.keys(updates).length) { physLoopRef.current = requestAnimationFrame(loop); return }
      const newEls = els.map(el => {
        const pu = updates[el.id]; if (!pu) return el
        const m = el.physics.mode
        let nx = el.x, ny = el.y
        if (m==='gravity'||m==='bounce') {
          nx=el.x+(pu.vx||0); ny=el.y+(pu.vy||0)
          if(ny+el.height>=STAGE_H)ny=STAGE_H-el.height
          if(ny<0)ny=0; if(nx<0)nx=0; if(nx+el.width>=STAGE_W)nx=STAGE_W-el.width
        } else if (m==='spring'||m==='magnetic') {
          nx=el.x+(pu.vx||0); ny=el.y+(pu.vy||0)
        } else if (m==='float') {
          const rx=pu.restX??el.x, ry=pu.restY??el.y
          nx=rx+Math.sin((pu._floatT||0)*0.7+(pu._seed||0))*5
          ny=ry+Math.sin((pu._floatT||0)+(pu._seed||0))*14
        } else if (m==='wind') {
          nx=(pu.restX??el.x)+(pu.vx||0)*8; ny=(pu.restY??el.y)+(pu.vy||0)*4
        } else if (m==='cloth') {
          nx=(pu.restX??el.x)+(pu.vx||0); ny=el.y
        }
        return { ...el, x: isNaN(nx)||!isFinite(nx)?el.x:nx, y: isNaN(ny)||!isFinite(ny)?el.y:ny, physics:{...el.physics,...pu} }
      })

      // ── Collision resolution pass ──────────────────────────
      const colPatches = resolveElementCollisions(newEls)
      const finalEls   = newEls.map(el => {
        const cp = colPatches[el.id]; if (!cp) return el
        return {
          ...el,
          x: cp.x ?? el.x,
          y: cp.y ?? el.y,
          physics: { ...el.physics, vx: cp.vx ?? el.physics?.vx ?? 0, vy: cp.vy ?? el.physics?.vy ?? 0 }
        }
      })

      dispatch({ type:'LOAD_ELEMENTS', elements:finalEls })
      physLoopRef.current = requestAnimationFrame(loop)
    }
    physLoopRef.current = requestAnimationFrame(loop)
    return ()=>cancelAnimationFrame(physLoopRef.current)
  }, [dispatch])

  // ── Cursor tracking ───────────────────────────────────────
  const trackCursor = useCallback((e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    cursorRef.current = {
      x: (e.clientX-rect.left) / zoomRef.current,
      y: (e.clientY-rect.top)  / zoomRef.current,
    }
  }, [])

  // ── Space key (pan mode) ──────────────────────────────────
  useEffect(() => {
    const down = e => {
      if (e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      e.preventDefault(); spaceRef.current=true; setSpaceDown(true)
    }
    const up = e => {
      if (e.code!=='Space') return
      spaceRef.current=false; setSpaceDown(false); setPanning(false)
    }
    // ? key opens shortcut overlay
    const onQ = e => {
      if (e.key==='?' && e.target.tagName!=='INPUT' && e.target.tagName!=='TEXTAREA')
        setShowShortcuts(v => !v)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    window.addEventListener('keydown', onQ)
    return()=>{
      window.removeEventListener('keydown',down)
      window.removeEventListener('keyup',  up)
      window.removeEventListener('keydown',onQ)
    }
  }, [])

  // ── Scroll wheel zoom ─────────────────────────────────────
  useEffect(() => {
    const area = canvasAreaRef.current; if (!area) return
    const onWheel = e => {
      e.preventDefault()
      dispatch({ type:'SET_ZOOM', zoom: zoomRef.current + (e.deltaY>0 ? -0.06 : 0.06) })
    }
    area.addEventListener('wheel', onWheel, { passive:false })
    return ()=>area.removeEventListener('wheel', onWheel)
  }, [dispatch])

  // ── Global mouse move + up ────────────────────────────────
  useEffect(() => {
    function onMove(e) {
      trackCursor(e)

      // Pan drag
      if (panDragRef.current) {
        const pd = panDragRef.current
        const z  = zoomRef.current
        dispatch({ type:'SET_PAN', x: pd.initPanX+(e.clientX-pd.mouseX)/z, y: pd.initPanY+(e.clientY-pd.mouseY)/z })
        return
      }

      // Marquee update
      if (marqueeRef.current) {
        const rect = stageRef.current?.getBoundingClientRect(); if(!rect) return
        const z = zoomRef.current
        const cx = (e.clientX-rect.left)/z, cy = (e.clientY-rect.top)/z
        marqueeRef.current.endX = cx; marqueeRef.current.endY = cy
        const {startX:sx,startY:sy} = marqueeRef.current
        setMarqueeBox({ x:Math.min(sx,cx), y:Math.min(sy,cy), w:Math.abs(cx-sx), h:Math.abs(cy-sy) })
        return
      }

      // Element drag
      if (!dragRef.current) return
      const d  = dragRef.current
      const z  = zoomRef.current
      const dx = (e.clientX-d.startMouseX)/z
      const dy = (e.clientY-d.startMouseY)/z

      if (d.handle==='move') {
        // Multi-element drag
        if (d.multiStarts) {
          d.multiStarts.forEach(({id,sx,sy})=>
            dispatch({type:'UPDATE_ELEMENT', id, patch:{x:snap(sx+dx),y:snap(sy+dy)}}))
        } else {
          dispatch({type:'UPDATE_ELEMENT', id:d.id, patch:{x:snap(d.sx+dx),y:snap(d.sy+dy)}})
        }
      } else if (d.handle==='rot') {
        const el = elementsRef.current.find(x=>x.id===d.id); if(!el) return
        const cx=el.x+el.width/2, cy=el.y+el.height/2
        const ang = Math.atan2(cursorRef.current.y-cy, cursorRef.current.x-cx)*(180/Math.PI)
        dispatch({type:'UPDATE_ELEMENT', id:d.id, patch:{rotation:Math.round(ang+90)}})
      } else {
        let {sx:nx,sy:ny,sw:nw,sh:nh} = d
        const h = d.handle
        if(h.includes('e')) nw=Math.max(20,d.sw+dx)
        if(h.includes('s')) nh=Math.max(20,d.sh+dy)
        if(h.includes('w')){nx=d.sx+dx; nw=Math.max(20,d.sw-dx)}
        if(h.includes('n')){ny=d.sy+dy; nh=Math.max(20,d.sh-dy)}
        dispatch({type:'UPDATE_ELEMENT', id:d.id, patch:{x:snap(nx),y:snap(ny),width:Math.round(nw),height:Math.round(nh)}})
      }
    }

    function onUp() {
      // Pan end
      if (panDragRef.current) {
        panDragRef.current = null; setPanning(false); return
      }
      // Marquee end — hit-test elements
      if (marqueeRef.current) {
        const {startX:sx,startY:sy,endX:ex,endY:ey} = marqueeRef.current
        const x1=Math.min(sx,ex),y1=Math.min(sy,ey),x2=Math.max(sx,ex),y2=Math.max(sy,ey)
        if (x2-x1>6||y2-y1>6) {
          const hits = elementsRef.current
            .filter(el=>el.visible!==false&&!el.locked)
            .filter(el=>el.x<x2&&el.x+el.width>x1&&el.y<y2&&el.y+el.height>y1)
            .map(el=>el.id)
          select(hits)
        }
        marqueeRef.current=null; setMarqueeBox(null); return
      }
      // Drag end
      if (dragRef.current) {
        const d   = dragRef.current
        const el  = elementsRef.current.find(x=>x.id===d.id)
        if (el?.physics?.enabled) {
          dispatch({type:'UPDATE_ELEMENT', id:d.id,
            patch:{physics:{...el.physics,restX:el.x,restY:el.y,sleeping:false}}})
        }
        dragRef.current = null; setDraggingId(null)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return()=>{window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp)}
  }, [dispatch, select, trackCursor])

  // ── Context menu — stage background ─────────────────────────
  function handleStageContextMenu(e) {
    e.preventDefault()
    setCtxMenu({ x: e.clientX, y: e.clientY, el: null })
  }

  // ── Context menu — element ────────────────────────────────
  function handleElContextMenu(e, el) {
    e.preventDefault()
    e.stopPropagation()
    if (!selected.includes(el.id)) select([el.id])
    setCtxMenu({ x: e.clientX, y: e.clientY, el })
  }

  // ── Context menu action handler ──────────────────────────
  function handleCtxAction(action) {
    const el     = ctxMenu?.el
    const ids    = selected.length > 0 ? selected : (el ? [el.id] : [])
    const mainId = el?.id || ids[0]
    const rect   = stageRef.current?.getBoundingClientRect()
    const z      = zoomRef.current

    switch (action) {
      case 'copy':
        clipboardRef.current = elementsRef.current.filter(e => ids.includes(e.id))
        break
      case 'cut':
        clipboardRef.current = elementsRef.current.filter(e => ids.includes(e.id))
        dispatch({ type:'DELETE_ELEMENTS', ids })
        break
      case 'paste':
        if (clipboardRef.current?.length)
          dispatch({ type:'PASTE_ELEMENTS', els: clipboardRef.current })
        break
      case 'duplicate':
        if (mainId) dispatch({ type:'DUPLICATE_ELEMENT', id: mainId })
        break
      case 'delete':
        dispatch({ type:'DELETE_ELEMENTS', ids })
        break
      case 'toggle-lock':
        if (el) dispatch({ type:'UPDATE_ELEMENT', id:el.id, patch:{ locked:!el.locked } })
        break
      case 'toggle-vis':
        if (el) dispatch({ type:'UPDATE_ELEMENT', id:el.id, patch:{ visible:el.visible===false } })
        break
      case 'to-front': {
        const max = Math.max(...elementsRef.current.map(e=>e.zIndex||0))
        if (mainId) dispatch({ type:'UPDATE_ELEMENT', id:mainId, patch:{ zIndex:max+1 } })
        break
      }
      case 'to-back':
        if (mainId) dispatch({ type:'UPDATE_ELEMENT', id:mainId, patch:{ zIndex:-1 } })
        break
      case 'forward': {
        const cur = el?.zIndex||0
        if (mainId) dispatch({ type:'UPDATE_ELEMENT', id:mainId, patch:{ zIndex:cur+1 } })
        break
      }
      case 'backward': {
        const cur2 = el?.zIndex||0
        if (mainId) dispatch({ type:'UPDATE_ELEMENT', id:mainId, patch:{ zIndex:Math.max(0,cur2-1) } })
        break
      }
      case 'align-cx': {
        ids.forEach(id => {
          const e = elementsRef.current.find(x=>x.id===id)
          if(e) dispatch({ type:'UPDATE_ELEMENT', id, patch:{ x: Math.round((STAGE_W-e.width)/2) } })
        })
        break
      }
      case 'align-cy': {
        ids.forEach(id => {
          const e = elementsRef.current.find(x=>x.id===id)
          if(e) dispatch({ type:'UPDATE_ELEMENT', id, patch:{ y: Math.round((STAGE_H-e.height)/2) } })
        })
        break
      }
      case 'toggle-grid':
        dispatch({ type:'SET_SHOW_GRID', value:!showGrid })
        break
      case 'toggle-guides':
        dispatch({ type:'SET_SHOW_GUIDES', value:!showGuides })
        break
      case 'clear':
        if (window.confirm('Clear all elements?')) dispatch({ type:'CLEAR_SCENE' })
        break
      case 'add-rect':   addElement('rect',   100, 100); break
      case 'add-circle': addElement('circle', 100, 100); break
      case 'add-text':   addElement('text',   100, 100); break
      default: break
    }
  }

  // ── Stage mouse down ──────────────────────────────────────
  function handleStageMouseDown(e) {
    const isBg = e.target===stageRef.current
      ||e.target.classList.contains('ambient-bg')
      ||e.target.classList.contains('stage-grid')
    if (!isBg) return

    // Space pan
    if (spaceRef.current) {
      panDragRef.current = { mouseX:e.clientX, mouseY:e.clientY, initPanX:panX, initPanY:panY }
      setPanning(true); return
    }

    const rect = stageRef.current.getBoundingClientRect()
    const rawX = (e.clientX-rect.left)/zoom
    const rawY = (e.clientY-rect.top) /zoom

    // Draw tool
    if (activeTool==='draw') { startDraw(e); return }

    // Image tool — open file picker
    if (activeTool==='image') { imgInputRef.current?.click(); return }

    // Add shape
    if (activeTool!=='select') {
      const typeMap={rect:'rect',circle:'circle',text:'text',triangle:'triangle',star:'star',line:'line'}
      const type = typeMap[activeTool]
      if (type) { addElement(type,snap(rawX-50),snap(rawY-50)); dispatch({type:'SET_TOOL',tool:'select'}) }
      return
    }

    // Select tool on empty space → start marquee
    select([])
    marqueeRef.current = { startX:rawX, startY:rawY, endX:rawX, endY:rawY }
    setMarqueeBox({ x:rawX, y:rawY, w:0, h:0 })
  }

  // ── Element mouse down ────────────────────────────────────
  function handleElMouseDown(e, el) {
    e.preventDefault()

    // Space held → pan even on element
    if (spaceRef.current) {
      panDragRef.current = { mouseX:e.clientX, mouseY:e.clientY, initPanX:panX, initPanY:panY }
      setPanning(true); return
    }

    e.stopPropagation()
    if (el.locked) return

    const handle = e.target.dataset?.handle

    // Shift+click → toggle in multi-select
    if (e.shiftKey && !handle) {
      select(selected.includes(el.id)
        ? selected.filter(id=>id!==el.id)
        : [...selected, el.id])
      return
    }

    if (!selected.includes(el.id)) select([el.id])

    // Build drag state
    const multiStarts = selected.length > 1 && !handle
      ? elementsRef.current
          .filter(x=>selected.includes(x.id))
          .map(x=>({id:x.id,sx:x.x,sy:x.y}))
      : null

    dragRef.current = {
      id: el.id, handle: handle||'move',
      startMouseX:e.clientX, startMouseY:e.clientY,
      sx:el.x, sy:el.y, sw:el.width, sh:el.height,
      multiStarts,
    }
    setDraggingId(el.id)

    if (el.physics?.enabled) {
      dispatch({type:'UPDATE_ELEMENT',id:el.id,patch:{physics:{...el.physics,sleeping:false,vx:0,vy:0}}})
    }
  }

  // ── Draw tool helpers ─────────────────────────────────────
  function startDraw(e) {
    if (activeTool!=='draw') return
    const rect = stageRef.current.getBoundingClientRect()
    const p = {x:(e.clientX-rect.left)/zoom, y:(e.clientY-rect.top)/zoom}
    drawPointsRef.current=[p]; setDrawPreview([p])
  }
  function onDrawMove(e) {
    if (activeTool!=='draw'||!drawPointsRef.current.length) return
    const rect = stageRef.current.getBoundingClientRect()
    const p = {x:(e.clientX-rect.left)/zoom, y:(e.clientY-rect.top)/zoom}
    drawPointsRef.current.push(p); setDrawPreview([...drawPointsRef.current])
  }
  function onDrawEnd() {
    if (activeTool!=='draw'||drawPointsRef.current.length<2) return
    const pts=drawPointsRef.current
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y)
    addElement('draw',Math.min(...xs),Math.min(...ys),{
      width:Math.max(...xs)-Math.min(...xs)||20,
      height:Math.max(...ys)-Math.min(...ys)||20,
      _points:pts, label:'Drawing',
    })
    drawPointsRef.current=[]; setDrawPreview(null)
    dispatch({type:'SET_TOOL',tool:'select'})
  }

  // ── Image upload ──────────────────────────────────────────
  function handleImageFile(e) {
    const file = e.target.files?.[0]; if(!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      addElement('image',100,100,{
        width:200, height:150,
        label:file.name.replace(/\.[^.]+$/,''),
        _src:ev.target.result, fill:'transparent', borderRadius:0,
      })
      dispatch({type:'SET_TOOL',tool:'select'})
    }
    reader.readAsDataURL(file)
    e.target.value=''
  }

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      const ctrl = e.ctrlKey||e.metaKey

      if (e.key==='Delete'||e.key==='Backspace') {
        const sel = elementsRef.current.filter(x=>x._selected||false)
        // use context selected via closure is fine here — selected is stable ref
        dispatch({type:'DELETE_ELEMENTS',ids:e._selectedIds||[]})
      }
      if (e.key==='Escape') select([])
      if (ctrl&&e.key==='z'){e.preventDefault();dispatch({type:'UNDO'})}
      if (ctrl&&e.key==='y'){e.preventDefault();dispatch({type:'REDO'})}
      if (ctrl&&e.key==='d'){e.preventDefault()
        const sel=elementsRef.current.filter(x=>true)// handled below via selectedRef
        dispatch({type:'DUPLICATE_ELEMENT',id:clipboardRef._lastSel})}
      if (ctrl&&e.key==='c') {
        // Copy selected elements
        const copied = elementsRef.current.filter(el=>clipboardRef._selectedIds?.includes(el.id))
        if(copied.length) clipboardRef.current=copied
      }
      if (ctrl&&e.key==='v') {
        if(clipboardRef.current?.length)
          dispatch({type:'PASTE_ELEMENTS',els:clipboardRef.current})
      }
      if (!ctrl) {
        const map={v:'select',r:'rect',c:'circle',t:'text',x:'text',l:'line',d:'draw',i:'image'}
        if(map[e.key]) dispatch({type:'SET_TOOL',tool:map[e.key]})
      }
    }
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  }, [dispatch, select])

  // Keep selected IDs accessible in keyboard handler via ref
  useEffect(() => { clipboardRef._selectedIds = selected }, [selected])
  useEffect(() => { clipboardRef._lastSel = selected[0] },  [selected])

  // Delete shortcut needs selected — patch onKey
  useEffect(() => {
    function onDel(e) {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      if ((e.key==='Delete'||e.key==='Backspace')&&selected.length)
        dispatch({type:'DELETE_ELEMENTS',ids:selected})
      if ((e.ctrlKey||e.metaKey)&&e.key==='d'&&selected[0])
        dispatch({type:'DUPLICATE_ELEMENT',id:selected[0]})
    }
    window.addEventListener('keydown',onDel)
    return()=>window.removeEventListener('keydown',onDel)
  }, [selected, dispatch])

  // ── Cursor style ──────────────────────────────────────────
  const activeCursor = spaceDown
    ? (panning ? 'grabbing' : 'grab')
    : activeTool!=='select' ? 'crosshair' : 'default'

  return (
    <div ref={canvasAreaRef} className="canvas-area" style={{ cursor: activeCursor }}>
      <div
        className="canvas-zoom-wrap"
        style={{ transform:`scale(${zoom}) translate(${panX}px,${panY}px)`, transformOrigin:'center center' }}
      >
        <div
          ref={stageRef}
          className="stage"
          style={{ width:STAGE_W, height:STAGE_H, background:bgColor||'#0a0a0f' }}
          onMouseDown={handleStageMouseDown}
          onMouseMove={e=>{onDrawMove(e);trackCursor(e)}}
          onMouseUp={onDrawEnd}
          onContextMenu={handleStageContextMenu}
        >
          <AmbientBg bgColor={bgColor||'#0a0a0f'}/>
          {showGrid && <GridOverlay/>}

          {elements.map(el=>(
            <CanvasElement
              key={el.id}
              el={el}
              isSelected={selected.includes(el.id)}
              onMouseDown={handleElMouseDown}
              onContextMenu={handleElContextMenu}
            />
          ))}

          <GuideLines elements={elements} draggingId={draggingId}/>
          {drawPreview && <DrawPreview points={drawPreview}/>}
          <MarqueeBox box={marqueeBox}/>
          <ParticleCanvas elements={elements}/>
          <RopeCanvas
            elements={elements}
            ropes={ropes}
            onUpdateRopes={setRopes}
          />

          {elements.length===0 && (
            <div className="stage-hint">
              <div className="sh-icon">🎨</div>
              <div className="sh-text">Click to add shape</div>
              <div className="sh-sub">Select a tool → click anywhere on canvas</div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden image file input */}
      <input ref={imgInputRef} type="file" accept="image/*,image/gif,image/webp"
        style={{display:'none'}} onChange={handleImageFile}/>

      {/* Zoom badge */}
      <div className="canvas-zoom-badge">{Math.round(zoom*100)}%</div>

      {/* Tool badge */}
      {activeTool!=='select' && (
        <div className="canvas-tool-badge">
          {activeTool.toUpperCase()} — {activeTool==='image'?'Click to upload image':'Click to place'}
        </div>
      )}

      {/* Space pan hint */}
      {spaceDown && (
        <div className="canvas-pan-hint">✋ Pan Mode — drag to pan</div>
      )}

      {/* Context Menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          el={ctxMenu.el}
          selected={selected}
          hasClipboard={!!(clipboardRef.current?.length)}
          onAction={handleCtxAction}
          onClose={() => setCtxMenu(null)}
        />
      )}

      {/* Shortcut overlay */}
      {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)}/>}

      {/* Shortcut hint badge */}
      <div className="canvas-shortcut-hint" onClick={() => setShowShortcuts(true)} title="Keyboard shortcuts">
        <kbd>?</kbd>
      </div>

      {/* Status bar */}
      <div className="canvas-statusbar">
        <div className="csb-group">
          <span className="csb-label">BG</span>
          <input type="color" className="csb-color" value={bgColor||'#0a0a0f'}
            onChange={e=>dispatch({type:'SET_BG_COLOR',color:e.target.value})}/>
          <input className="csb-hex" value={bgColor||'#0a0a0f'}
            onChange={e=>dispatch({type:'SET_BG_COLOR',color:e.target.value})} maxLength={7}/>
        </div>
        <div className="csb-group">
          <span className="csb-label">Elements:</span>
          <span className="csb-val">{elements.length}</span>
        </div>
        <div className="csb-group">
          <span className="csb-label">Zoom:</span>
          <span className="csb-val">{Math.round(zoom*100)}%</span>
        </div>
        <div className="csb-group">
          <span className="csb-label">Stage:</span>
          <span className="csb-val">900×580</span>
        </div>
        {selected.length>0&&(
          <div className="csb-group csb-selected">✓ {selected.length} selected</div>
        )}
        <div className="csb-group csb-hint">
          <span className="csb-val">Scroll=Zoom · Space+Drag=Pan · Shift+Click=Multi · Ctrl+C/V=Copy</span>
        </div>
      </div>
    </div>
  )
          }

          
