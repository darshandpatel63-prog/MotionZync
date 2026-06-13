import { useEffect, useRef, useState, useCallback, useReducer, useMemo } from 'react'
import { useGestures } from '../../hooks/useGestures.js'
import './DrawingStudio.css'

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════
const CANVAS_W = 1920
const CANVAS_H = 1080
let _lid = 0, _fid = 0

const TOOLS = [
  { id:'pen',        icon:'🖊',  label:'Pen',        key:'b' },
  { id:'pencil',     icon:'✏',  label:'Pencil',     key:'v' },
  { id:'marker',     icon:'🖌',  label:'Marker',     key:'m' },
  { id:'airbrush',   icon:'💨', label:'Airbrush',   key:'a' },
  { id:'watercolor', icon:'🎨', label:'Watercolor', key:'w' },
  { id:'ink',        icon:'🖋',  label:'Ink',        key:'n' },
  { id:'chalk',      icon:'🪨', label:'Chalk',      key:'c' },
  { id:'oil',        icon:'🧪', label:'Oil',        key:'o' },
  { id:'pixelbrush', icon:'⬛', label:'Pixel',      key:'p' },
  { id:'pattern',    icon:'🔷', label:'Pattern',    key:'t' },
  { id:'eraser',     icon:'⬜', label:'Eraser',     key:'e' },
  { id:'smudge',     icon:'🌀', label:'Smudge',     key:'u' },
  { id:'fill',       icon:'🪣', label:'Fill',       key:'f' },
  { id:'eyedropper', icon:'💉', label:'Picker',     key:'i' },
  { id:'select_rect',icon:'⬡',  label:'Select',     key:'s' },
  { id:'lasso',      icon:'🪢', label:'Lasso',      key:'l' },
  { id:'move',       icon:'✥',  label:'Move',       key:'' },
  { id:'text',       icon:'T',  label:'Text',       key:'' },
  { id:'shape',      icon:'◼',  label:'Shape',      key:'' },
  { id:'gradient',   icon:'🌈', label:'Gradient',   key:'g' },
  { id:'blur',       icon:'🔵', label:'Blur',       key:'' },
  { id:'sharpen',    icon:'🔺', label:'Sharpen',    key:'' },
]

const BLEND_MODES = [
  'normal','multiply','screen','overlay','darken','lighten',
  'color-dodge','color-burn','hard-light','soft-light',
  'difference','exclusion','hue','saturation','color','luminosity'
]

const DEFAULT_PALETTE = [
  '#7c3aed','#06b6d4','#ef4444','#f59e0b',
  '#22c55e','#ec4899','#3b82f6','#f97316',
  '#ffffff','#d1d5db','#6b7280','#374151',
  '#111827','#000000','#fde68a','#a7f3d0'
]

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
const mkLayer = (name) => ({ id:`L${_lid++}`, name:name||`Layer ${_lid}`, opacity:100, blendMode:'normal', visible:true, locked:false, isGroup:false })
const mkFrame = () => ({ id:`F${_fid++}`, name:`Frame ${_fid}`, duration:1, data:{} })
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#',''),16)
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 }
}

// ═══════════════════════════════════════════════════════
// STROKE STABILIZER (S0–S16 like Ibis Paint X)
// ═══════════════════════════════════════════════════════
class StrokeStabilizer {
  constructor(level=0) {
    this.level = level
    this.buf = []
    this.size = Math.max(1, Math.round(level * 2))
  }
  add(pt) {
    this.buf.push(pt)
    if (this.buf.length > this.size) this.buf.shift()
    if (this.level === 0) return pt
    let tx=0,ty=0,tw=0
    for (let i=0;i<this.buf.length;i++) {
      const w = (i+1)
      tx += this.buf[i].x * w
      ty += this.buf[i].y * w
      tw += w
    }
    return { ...pt, x: tx/tw, y: ty/tw }
  }
  reset() { this.buf = [] }
}

// ═══════════════════════════════════════════════════════
// BRUSH ENGINE — 22 brush types
// ═══════════════════════════════════════════════════════
function drawStroke(ctx, pts, cfg) {
  if (!pts.length) return
  const { type, color, size, opacity, hardness=80 } = cfg
  const alpha = opacity / 100
  const { r,g,b } = hexToRgb(color)
  ctx.save()

  switch(type) {
    case 'eraser': {
      ctx.globalCompositeOperation = 'destination-out'
      _smoothLine(ctx, pts, size, 'rgba(0,0,0,1)', alpha, p => p.pressure??0.5)
      break
    }
    case 'airbrush': {
      ctx.globalCompositeOperation = 'source-over'
      for (const p of pts) {
        const s = size * (0.5 + (p.pressure??0.5)*0.5)
        const a = alpha * (p.pressure??0.5) * 0.25
        const gr = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,s)
        gr.addColorStop(0, `rgba(${r},${g},${b},${a})`)
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = gr
        ctx.beginPath(); ctx.arc(p.x,p.y,s,0,Math.PI*2); ctx.fill()
      }
      break
    }
    case 'watercolor': {
      ctx.globalCompositeOperation = 'source-over'
      for (const p of pts) {
        const spread = size * 0.6
        for (let i=0;i<6;i++) {
          const rx = p.x+(Math.random()-.5)*spread
          const ry = p.y+(Math.random()-.5)*spread
          const rs = size*(0.2+Math.random()*0.8)*(p.pressure??0.5)
          ctx.globalAlpha = alpha*0.06
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.beginPath(); ctx.arc(rx,ry,rs,0,Math.PI*2); ctx.fill()
        }
      }
      break
    }
    case 'chalk': {
      ctx.globalCompositeOperation = 'source-over'
      for (const p of pts) {
        const s = size*(p.pressure??0.7)
        for (let i=0;i<8;i++) {
          ctx.globalAlpha = alpha*(0.03+Math.random()*0.09)
          ctx.fillStyle = `rgb(${r},${g},${b})`
          const rx=p.x+(Math.random()-.5)*s*0.9
          const ry=p.y+(Math.random()-.5)*s*0.5
          ctx.fillRect(rx,ry,Math.random()*4+1,Math.random()*2+0.5)
        }
      }
      break
    }
    case 'pixelbrush': {
      ctx.globalCompositeOperation = 'source-over'
      ctx.imageSmoothingEnabled = false
      for (const p of pts) {
        const s = Math.max(1, Math.round(size*(p.pressure??0.8)))
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.fillRect(Math.round(p.x-s/2), Math.round(p.y-s/2), s, s)
      }
      break
    }
    case 'pattern': {
      ctx.globalCompositeOperation = 'source-over'
      for (const p of pts) {
        ctx.globalAlpha = alpha*(p.pressure??0.8)
        ctx.fillStyle = color
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        const s = size*(p.pressure??0.8)*0.4
        ctx.beginPath(); ctx.arc(p.x,p.y,s,0,Math.PI*2); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(p.x-s,p.y); ctx.lineTo(p.x+s,p.y)
        ctx.moveTo(p.x,p.y-s); ctx.lineTo(p.x,p.y+s)
        ctx.stroke()
      }
      break
    }
    case 'oil': {
      ctx.globalCompositeOperation = 'source-over'
      const pressFn = p => Math.pow(p.pressure??0.6, 0.5)
      _smoothLine(ctx, pts, size, color, alpha*0.9, pressFn)
      // thick impasto edges
      for (const p of pts) {
        ctx.globalAlpha = alpha*0.2*(p.pressure??0.5)
        ctx.fillStyle = `rgba(255,255,255,0.3)`
        ctx.beginPath(); ctx.arc(p.x+1,p.y-1, size*(p.pressure??0.5)*0.5, 0, Math.PI*2); ctx.fill()
      }
      break
    }
    case 'ink': {
      ctx.globalCompositeOperation = 'source-over'
      const inkFn = p => Math.pow(p.pressure??0.5, 2) * 1.2
      _smoothLine(ctx, pts, size, color, Math.min(alpha*1.5,1), inkFn)
      break
    }
    case 'pencil': {
      ctx.globalCompositeOperation = 'source-over'
      const pencilFn = p => (p.pressure??0.5)*0.7
      _smoothLine(ctx, pts, size, color, alpha*0.65, pencilFn)
      break
    }
    case 'marker': {
      ctx.globalCompositeOperation = 'source-over'
      _smoothLine(ctx, pts, size, color, alpha*0.82, _=>1.0)
      break
    }
    case 'blur': {
      // blur effect: sample and spread nearby pixels
      for (const p of pts) {
        const s = Math.round(size*(p.pressure??0.5))
        const imgD = ctx.getImageData(Math.max(0,p.x-s), Math.max(0,p.y-s), s*2, s*2)
        _gaussianBlurImageData(imgD, 2)
        ctx.putImageData(imgD, Math.max(0,p.x-s), Math.max(0,p.y-s))
      }
      break
    }
    default: { // pen (default)
      ctx.globalCompositeOperation = 'source-over'
      const penFn = p => p.pressure ?? 0.5
      _smoothLine(ctx, pts, size, color, alpha, penFn)
    }
  }
  ctx.restore()
}

function _smoothLine(ctx, pts, size, color, alpha, pressureFn) {
  if (pts.length === 0) return
  if (pts.length === 1) {
    const p = pts[0]
    ctx.globalAlpha = alpha * pressureFn(p)
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(p.x,p.y, Math.max(0.5, size*pressureFn(p)/2), 0, Math.PI*2); ctx.fill()
    return
  }
  ctx.strokeStyle = color
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  for (let i=1; i<pts.length; i++) {
    const prev = pts[i-1], curr = pts[i]
    ctx.globalAlpha = alpha * pressureFn(curr)
    ctx.lineWidth = Math.max(0.5, size * pressureFn(curr))
    ctx.beginPath()
    if (i === 1) { ctx.moveTo(prev.x, prev.y) }
    else {
      const mp = { x:(pts[i-2].x+prev.x)/2, y:(pts[i-2].y+prev.y)/2 }
      ctx.moveTo(mp.x, mp.y)
    }
    const mx=(prev.x+curr.x)/2, my=(prev.y+curr.y)/2
    ctx.quadraticCurveTo(prev.x,prev.y,mx,my)
    ctx.stroke()
  }
}

function _gaussianBlurImageData(imgData, radius) {
  const d = imgData.data, w = imgData.width, h = imgData.height
  for (let y=radius; y<h-radius; y++) {
    for (let x=radius; x<w-radius; x++) {
      let sr=0,sg=0,sb=0,count=0
      for (let dy=-radius;dy<=radius;dy++) {
        for (let dx=-radius;dx<=radius;dx++) {
          const i=((y+dy)*w+(x+dx))*4
          sr+=d[i]; sg+=d[i+1]; sb+=d[i+2]; count++
        }
      }
      const i=(y*w+x)*4
      d[i]=sr/count; d[i+1]=sg/count; d[i+2]=sb/count
    }
  }
}

// Flood fill (BFS)
function floodFill(ctx, sx, sy, fillHex, W, H, tolerance=30) {
  sx=Math.round(sx); sy=Math.round(sy)
  if (sx<0||sx>=W||sy<0||sy>=H) return
  const imgD = ctx.getImageData(0,0,W,H)
  const d = imgD.data
  const idx = (x,y) => (y*W+x)*4
  const i0 = idx(sx,sy)
  const tR=d[i0],tG=d[i0+1],tB=d[i0+2],tA=d[i0+3]
  const {r:fr,g:fg,b:fb} = hexToRgb(fillHex)
  if (fr===tR&&fg===tG&&fb===tB&&tA===255) return
  const stack=[[sx,sy]]
  const vis=new Uint8Array(W*H)
  const matches = (x,y) => {
    const i=idx(x,y)
    return Math.abs(d[i]-tR)+Math.abs(d[i+1]-tG)+Math.abs(d[i+2]-tB) < tolerance*3
  }
  while (stack.length) {
    const [x,y]=stack.pop()
    if (x<0||x>=W||y<0||y>=H||vis[y*W+x]) continue
    if (!matches(x,y)) continue
    vis[y*W+x]=1
    const i=idx(x,y)
    d[i]=fr; d[i+1]=fg; d[i+2]=fb; d[i+3]=255
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])
  }
  ctx.putImageData(imgD,0,0)
}

// ═══════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════
const initBgLayer = mkLayer('Background')
const initLayer   = mkLayer('Layer 1')
const initFrame   = mkFrame()

const INIT = {
  // Tool
  tool:'pen', symmetry:'none',
  // Brush
  brushSize:20, brushOpacity:100, brushHardness:80, stabilizer:3,
  // Color
  color:'#7c3aed', bgColor:'#1a1a2e',
  palette:[...DEFAULT_PALETTE], colorHistory:[],
  // Canvas transform
  zoom:1, rotation:0, panX:0, panY:0,
  // Layers
  layers:[initBgLayer, initLayer], activeLayerId:initLayer.id,
  // Frames
  frames:[initFrame], activeFrameIdx:0, fps:12, isPlaying:false,
  // Onion skin
  onionSkin:{ enabled:true, prev:2, next:0, opacity:0.3 },
  // Text tool
  textInput:'', fontSize:32, fontFamily:'sans-serif',
  // Shape tool
  shapeType:'rect',
  // Selection
  selection:null,
  // Panels
  showLayers:false, showBrush:false, showColor:false,
  showSymmetry:false, showFrames:true,
  // History
  undoStack:[], redoStack:[],
}

// ═══════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════
function reducer(s, a) {
  switch(a.type) {
    case 'SET': return {...s,[a.k]:a.v}
    case 'TOGGLE': return {...s,[a.k]:!s[a.k]}
    case 'SET_TOOL': return {...s,tool:a.tool}
    case 'SET_COLOR': {
      const hist=[a.c,...s.colorHistory.filter(x=>x!==a.c)].slice(0,16)
      return {...s,color:a.c,colorHistory:hist}
    }
    case 'ADD_LAYER': {
      const l=mkLayer(); return {...s,layers:[...s.layers,l],activeLayerId:l.id}
    }
    case 'DEL_LAYER': {
      if(s.layers.length<=1) return s
      const layers=s.layers.filter(l=>l.id!==a.id)
      return {...s,layers,activeLayerId:s.activeLayerId===a.id?layers[layers.length-1].id:s.activeLayerId}
    }
    case 'UPD_LAYER': {
      return {...s,layers:s.layers.map(l=>l.id===a.id?{...l,...a.upd}:l)}
    }
    case 'MOVE_LAYER': {
      const ls=[...s.layers]
      const i=ls.findIndex(l=>l.id===a.id)
      const j=i+a.dir
      if(j<0||j>=ls.length) return s
      ;[ls[i],ls[j]]=[ls[j],ls[i]]
      return {...s,layers:ls}
    }
    case 'DUP_LAYER': {
      const src=s.layers.find(l=>l.id===a.id)
      if(!src) return s
      const nl={...src,id:`L${_lid++}`,name:src.name+' copy'}
      const idx=s.layers.findIndex(l=>l.id===a.id)
      const layers=[...s.layers.slice(0,idx+1),nl,...s.layers.slice(idx+1)]
      return {...s,layers,activeLayerId:nl.id}
    }
    case 'ADD_FRAME': {
      const f=mkFrame()
      const frames=[...s.frames,f]
      return {...s,frames,activeFrameIdx:frames.length-1}
    }
    case 'DUP_FRAME': {
      const src=s.frames[a.idx]
      const f={...mkFrame(),data:{...src.data}}
      const frames=[...s.frames.slice(0,a.idx+1),f,...s.frames.slice(a.idx+1)]
      return {...s,frames,activeFrameIdx:a.idx+1}
    }
    case 'DEL_FRAME': {
      if(s.frames.length<=1) return s
      const frames=s.frames.filter((_,i)=>i!==a.idx)
      return {...s,frames,activeFrameIdx:Math.min(s.activeFrameIdx,frames.length-1)}
    }
    case 'SET_FRAME': return {...s,activeFrameIdx:a.idx}
    case 'TOGGLE_PLAY': return {...s,isPlaying:!s.isPlaying}
    case 'SET_ONION': return {...s,onionSkin:{...s.onionSkin,...a.upd}}
    case 'PUSH_UNDO': {
      const undoStack=[...s.undoStack,a.entry].slice(-30)
      return {...s,undoStack,redoStack:[]}
    }
    default: return s
  }
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function DrawingStudio() {
  const [s, d] = useReducer(reducer, INIT)
  const rootRef    = useRef(null)
  const displayRef = useRef(null)   // composited view
  const workRef    = useRef(null)   // active stroke overlay
  const onionRef   = useRef(null)   // onion skin overlay
  const guidRef    = useRef(null)   // guidelines / symmetry axis
  const layerBufs  = useRef({})     // layerId → OffscreenCanvas or HTMLCanvasElement
  const stabRef    = useRef(new StrokeStabilizer(3))
  const drawing    = useRef(false)
  const ptsRef     = useRef([])
  const playTimer  = useRef(null)
  const shapeDrag  = useRef(null)   // shape drag start point

  // ─── init layer buffers ─────────────────────────────
  const ensureBuffer = useCallback((layerId) => {
    if (!layerBufs.current[layerId]) {
      const c = document.createElement('canvas')
      c.width = CANVAS_W; c.height = CANVAS_H
      layerBufs.current[layerId] = c
    }
    return layerBufs.current[layerId]
  }, [])

  useEffect(() => {
    s.layers.forEach(l => {
      const c = ensureBuffer(l.id)
      if (l.name === 'Background' && !c._initialized) {
        c._initialized = true
        c.getContext('2d').fillStyle = '#1a1a2e'
        c.getContext('2d').fillRect(0,0,CANVAS_W,CANVAS_H)
      }
    })
  }, [s.layers, ensureBuffer])

  // ─── composite → display ────────────────────────────
  const composite = useCallback(() => {
    const dc = displayRef.current
    if (!dc) return
    const ctx = dc.getContext('2d')
    ctx.clearRect(0,0,CANVAS_W,CANVAS_H)
    for (const layer of s.layers) {
      if (!layer.visible) continue
      const buf = layerBufs.current[layer.id]
      if (!buf) continue
      ctx.save()
      ctx.globalAlpha = layer.opacity/100
      ctx.globalCompositeOperation = layer.blendMode
      ctx.drawImage(buf,0,0)
      ctx.restore()
    }
  }, [s.layers])

  useEffect(() => { composite() }, [composite])

  // ─── onion skin ─────────────────────────────────────
  const drawOnion = useCallback(() => {
    const oc = onionRef.current
    if (!oc) return
    const ctx = oc.getContext('2d')
    ctx.clearRect(0,0,CANVAS_W,CANVAS_H)
    if (!s.onionSkin.enabled) return
    const { prev, next, opacity } = s.onionSkin
    for (let i=1;i<=prev;i++) {
      const fi = s.activeFrameIdx - i
      if (fi < 0) continue
      const frame = s.frames[fi]
      ctx.save(); ctx.globalAlpha = opacity / i
      // tint blue (previous)
      ctx.fillStyle = `rgba(0,100,255,${opacity/(i*3)})`
      for (const [lid, imgData] of Object.entries(frame.data||{})) {
        const tmp = document.createElement('canvas')
        tmp.width=CANVAS_W; tmp.height=CANVAS_H
        tmp.getContext('2d').putImageData(imgData,0,0)
        ctx.drawImage(tmp,0,0)
      }
      ctx.restore()
    }
    for (let i=1;i<=next;i++) {
      const fi = s.activeFrameIdx + i
      if (fi >= s.frames.length) continue
      const frame = s.frames[fi]
      ctx.save(); ctx.globalAlpha = opacity / i
      // tint orange (next)
      for (const [lid, imgData] of Object.entries(frame.data||{})) {
        const tmp = document.createElement('canvas')
        tmp.width=CANVAS_W; tmp.height=CANVAS_H
        tmp.getContext('2d').putImageData(imgData,0,0)
        ctx.drawImage(tmp,0,0)
      }
      ctx.restore()
    }
  }, [s.activeFrameIdx, s.frames, s.onionSkin])

  useEffect(() => { drawOnion() }, [drawOnion])

  // ─── canvas coordinate transform ────────────────────
  const canvasCoord = useCallback((e) => {
    const dc = displayRef.current
    if (!dc) return null
    const rect = dc.getBoundingClientRect()
    const scX = CANVAS_W / rect.width
    const scY = CANVAS_H / rect.height
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (cx - rect.left) * scX,
      y: (cy - rect.top)  * scY,
      pressure: e.pressure ?? 0.5,
    }
  }, [])

  // ─── save undo snapshot ──────────────────────────────
  const saveUndo = useCallback(() => {
    const buf = layerBufs.current[s.activeLayerId]
    if (!buf) return
    const imgData = buf.getContext('2d').getImageData(0,0,CANVAS_W,CANVAS_H)
    d({ type:'PUSH_UNDO', entry:{ layerId:s.activeLayerId, imgData } })
  }, [s.activeLayerId])

  // ─── pointer down ────────────────────────────────────
  const onPtrDown = useCallback((e) => {
    const layer = s.layers.find(l=>l.id===s.activeLayerId)
    if (!layer || layer.locked) return
    e.preventDefault()
    drawing.current = true
    stabRef.current = new StrokeStabilizer(s.stabilizer)
    const pt = canvasCoord(e)
    if (!pt) return
    ptsRef.current = [pt]
    saveUndo()

    if (s.tool === 'fill') {
      const buf = ensureBuffer(s.activeLayerId)
      floodFill(buf.getContext('2d'), pt.x, pt.y, s.color, CANVAS_W, CANVAS_H)
      composite(); return
    }
    if (s.tool === 'eyedropper') {
      const ctx = displayRef.current?.getContext('2d')
      if (!ctx) return
      const px = ctx.getImageData(Math.round(pt.x),Math.round(pt.y),1,1).data
      const hex = '#'+[px[0],px[1],px[2]].map(v=>v.toString(16).padStart(2,'0')).join('')
      d({ type:'SET_COLOR', c:hex }); return
    }
    if (s.tool === 'shape' || s.tool === 'gradient') {
      shapeDrag.current = pt; return
    }
  }, [s, canvasCoord, saveUndo, ensureBuffer, composite])

  // ─── pointer move ────────────────────────────────────
  const onPtrMove = useCallback((e) => {
    if (!drawing.current) return
    e.preventDefault()
    const raw = canvasCoord(e)
    if (!raw) return
    const pt = stabRef.current.add(raw)
    ptsRef.current.push(pt)

    const wc = workRef.current
    if (!wc) return
    const wctx = wc.getContext('2d')
    wctx.clearRect(0,0,CANVAS_W,CANVAS_H)

    if (s.tool === 'shape') {
      if (!shapeDrag.current) return
      const sx=shapeDrag.current.x, sy=shapeDrag.current.y
      wctx.strokeStyle = s.color
      wctx.lineWidth = s.brushSize
      wctx.globalAlpha = s.brushOpacity/100
      wctx.beginPath()
      if (s.shapeType==='rect') {
        wctx.strokeRect(sx,sy,pt.x-sx,pt.y-sy)
      } else if (s.shapeType==='ellipse') {
        wctx.ellipse(sx+(pt.x-sx)/2, sy+(pt.y-sy)/2, Math.abs(pt.x-sx)/2, Math.abs(pt.y-sy)/2, 0, 0, Math.PI*2)
        wctx.stroke()
      } else {
        wctx.moveTo(sx,sy); wctx.lineTo(pt.x,pt.y); wctx.stroke()
      }
      return
    }
    if (s.tool === 'gradient') {
      if (!shapeDrag.current) return
      const grd = wctx.createLinearGradient(shapeDrag.current.x,shapeDrag.current.y,pt.x,pt.y)
      grd.addColorStop(0, s.color)
      grd.addColorStop(1, s.bgColor)
      wctx.fillStyle = grd
      wctx.globalAlpha = s.brushOpacity/100
      wctx.fillRect(0,0,CANVAS_W,CANVAS_H)
      return
    }

    const cfg = { type:s.tool==='eraser'?'eraser':s.tool, color:s.color, size:s.brushSize, opacity:s.brushOpacity, hardness:s.brushHardness }
    drawStroke(wctx, ptsRef.current, cfg)

    // Symmetry
    if (s.symmetry !== 'none') {
      if (s.symmetry === 'horizontal' || s.symmetry === 'both') {
        drawStroke(wctx, ptsRef.current.map(p=>({...p,x:CANVAS_W-p.x})), cfg)
      }
      if (s.symmetry === 'vertical' || s.symmetry === 'both') {
        drawStroke(wctx, ptsRef.current.map(p=>({...p,y:CANVAS_H-p.y})), cfg)
      }
      if (s.symmetry === 'radial') {
        const cx=CANVAS_W/2, cy=CANVAS_H/2
        for (let a=1;a<4;a++) {
          const angle = (Math.PI/2)*a
          const rot = ptsRef.current.map(p => {
            const dx=p.x-cx, dy=p.y-cy
            return {...p, x:cx+dx*Math.cos(angle)-dy*Math.sin(angle), y:cy+dx*Math.sin(angle)+dy*Math.cos(angle)}
          })
          drawStroke(wctx, rot, cfg)
        }
      }
    }
  }, [s, canvasCoord])

  // ─── pointer up ──────────────────────────────────────
  const onPtrUp = useCallback((e) => {
    if (!drawing.current) return
    drawing.current = false

    if (s.tool === 'shape' || s.tool === 'gradient') {
      // commit working to layer
      const buf = ensureBuffer(s.activeLayerId)
      const wc = workRef.current
      if (buf && wc) {
        buf.getContext('2d').drawImage(wc,0,0)
        wc.getContext('2d').clearRect(0,0,CANVAS_W,CANVAS_H)
      }
      shapeDrag.current = null
      composite(); return
    }

    const buf = ensureBuffer(s.activeLayerId)
    const wc  = workRef.current
    if (buf && wc) {
      buf.getContext('2d').drawImage(wc,0,0)
      wc.getContext('2d').clearRect(0,0,CANVAS_W,CANVAS_H)
    }
    ptsRef.current = []
    stabRef.current.reset()
    composite()
  }, [s.tool, s.activeLayerId, ensureBuffer, composite])

  // ─── undo ────────────────────────────────────────────
  const undo = useCallback(() => {
    const entry = s.undoStack[s.undoStack.length-1]
    if (!entry) return
    const buf = layerBufs.current[entry.layerId]
    if (buf) buf.getContext('2d').putImageData(entry.imgData,0,0)
    d({ type:'SET', k:'undoStack', v:s.undoStack.slice(0,-1) })
    composite()
  }, [s.undoStack, composite])

  // ─── animation playback ──────────────────────────────
  useEffect(() => {
    if (s.isPlaying) {
      let idx = s.activeFrameIdx
      playTimer.current = setInterval(() => {
        idx = (idx+1) % s.frames.length
        d({ type:'SET_FRAME', idx })
      }, 1000/s.fps)
    } else clearInterval(playTimer.current)
    return () => clearInterval(playTimer.current)
  }, [s.isPlaying, s.fps, s.frames.length])

  // ─── keyboard shortcuts ──────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return
      const k=e.key.toLowerCase()
      if ((k==='z'||k==='Z') && (e.ctrlKey||e.metaKey)) { e.preventDefault(); undo(); return }
      TOOLS.forEach(t => { if(t.key===k) d({type:'SET_TOOL',tool:t.id}) })
      if (k==='[') d({type:'SET',k:'brushSize',v:Math.max(1,s.brushSize-5)})
      if (k===']') d({type:'SET',k:'brushSize',v:Math.min(400,s.brushSize+5)})
    }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  }, [s.brushSize, undo])

  // ─── gestures (mobile) ───────────────────────────────
  useGestures(rootRef, {
    onPinchZoom:      (delta) => d({type:'SET',k:'zoom',   v:Math.max(0.1,Math.min(16,s.zoom*delta))}),
    onTwoFingerRotate:(angle) => d({type:'SET',k:'rotation',v:s.rotation+angle*(180/Math.PI)}),
    onPan: (dx,dy) => {
      if (drawing.current) return
      d({type:'SET',k:'panX',v:s.panX+dx})
      d({type:'SET',k:'panY',v:s.panY+dy})
    },
    onThreeFingerUndo: undo,
    onThreeFingerRedo: ()=>{},
  })

  // ─── export ──────────────────────────────────────────
  const exportPNG = () => {
    const c=displayRef.current; if(!c) return
    const a=document.createElement('a'); a.href=c.toDataURL('image/png')
    a.download=`motionzync-art-${Date.now()}.png`; a.click()
  }
  const exportAllFrames = () => {
    s.frames.forEach((fr,i) => {
      const tmp=document.createElement('canvas'); tmp.width=CANVAS_W; tmp.height=CANVAS_H
      const ctx=tmp.getContext('2d')
      for(const [lid,imgData] of Object.entries(fr.data||{})){
        const tc=document.createElement('canvas'); tc.width=CANVAS_W; tc.height=CANVAS_H
        tc.getContext('2d').putImageData(imgData,0,0); ctx.drawImage(tc,0,0)
      }
      const a=document.createElement('a'); a.href=tmp.toDataURL('image/png')
      a.download=`frame-${String(i+1).padStart(3,'0')}.png`; a.click()
    })
  }

  const canvasTransform = useMemo(()=>
    `translate(${s.panX}px,${s.panY}px) scale(${s.zoom}) rotate(${s.rotation}deg)`
  ,[s.panX,s.panY,s.zoom,s.rotation])

  // ─── RENDER ──────────────────────────────────────────
  return (
    <div className="ds-root" ref={rootRef}>

      {/* ═══ TOP BAR ════════════════════════════════ */}
      <header className="ds-topbar">
        <button className="ds-back" onClick={()=>window.history.back()}>‹</button>
        <span className="ds-title">✦ Drawing Studio</span>
        <div className="ds-top-actions">
          <button className="ds-btn" onClick={undo} title="Undo (Ctrl+Z)">↩</button>
          <button className={`ds-btn ${s.onionSkin.enabled?'ds-btn-active':''}`}
            onClick={()=>d({type:'SET_ONION',upd:{enabled:!s.onionSkin.enabled}})} title="Onion Skin">👁</button>
          <select className="ds-fps-sel" value={s.fps}
            onChange={e=>d({type:'SET',k:'fps',v:+e.target.value})}>
            {[6,8,12,24,30].map(f=><option key={f} value={f}>{f}fps</option>)}
          </select>
          <button className={`ds-btn ds-play ${s.isPlaying?'playing':''}`}
            onClick={()=>d({type:'TOGGLE_PLAY'})}>
            {s.isPlaying?'⏸':'▶'}
          </button>
          <div className="ds-export-group">
            <button className="ds-btn ds-btn-export" onClick={exportPNG}>↓ PNG</button>
            <button className="ds-btn ds-btn-export" onClick={exportAllFrames}>↓ Frames</button>
          </div>
        </div>
      </header>

      {/* ═══ WORKSPACE ══════════════════════════════ */}
      <div className="ds-workspace">

        {/* ── LEFT TOOLBAR ─────────────────────────── */}
        <nav className="ds-toolbar">
          {TOOLS.map(t=>(
            <button key={t.id}
              className={`ds-tool ${s.tool===t.id?'active':''}`}
              onClick={()=>d({type:'SET_TOOL',tool:t.id})}
              title={`${t.label}${t.key?` (${t.key})`:''}`}>
              {t.icon}
            </button>
          ))}
          <div className="ds-tool-sep"/>
          <div className="ds-color-swatch" style={{background:s.color}}
            onClick={()=>d({type:'TOGGLE',k:'showColor'})} title="Color"/>
          <div className="ds-color-swatch ds-color-bg" style={{background:s.bgColor}} title="BG"/>
        </nav>

        {/* ── CANVAS AREA ──────────────────────────── */}
        <div className="ds-canvas-wrap">
          <div className="ds-canvas-inner" style={{transform:canvasTransform}}>
            <canvas ref={onionRef} width={CANVAS_W} height={CANVAS_H} className="ds-cv ds-cv-onion"/>
            <canvas ref={displayRef} width={CANVAS_W} height={CANVAS_H} className="ds-cv ds-cv-display"
              onPointerDown={onPtrDown} onPointerMove={onPtrMove}
              onPointerUp={onPtrUp} onPointerLeave={onPtrUp}
              onTouchStart={onPtrDown} onTouchMove={onPtrMove} onTouchEnd={onPtrUp}
            />
            <canvas ref={workRef} width={CANVAS_W} height={CANVAS_H} className="ds-cv ds-cv-work"
              style={{pointerEvents:'none'}}/>
            {/* Symmetry guide */}
            {s.symmetry!=='none'&&<div className={`ds-sym-guide ds-sym-${s.symmetry}`}/>}
          </div>
          {/* Zoom indicator */}
          <div className="ds-zoom-badge">{Math.round(s.zoom*100)}%</div>
          {/* Tool indicator on mobile */}
          <div className="ds-tool-badge">{TOOLS.find(t=>t.id===s.tool)?.icon} {TOOLS.find(t=>t.id===s.tool)?.label}</div>
        </div>

        {/* ── RIGHT: Brush Panel ───────────────────── */}
        {s.showBrush && (
          <aside className="ds-panel">
            <div className="ds-panel-head">
              <span>Brush</span>
              <button onClick={()=>d({type:'TOGGLE',k:'showBrush'})}>✕</button>
            </div>
            <div className="ds-brush-grid">
              {TOOLS.slice(0,10).map(t=>(
                <button key={t.id}
                  className={`ds-btype ${s.tool===t.id?'active':''}`}
                  onClick={()=>d({type:'SET_TOOL',tool:t.id})}>
                  {t.icon}<span>{t.label}</span>
                </button>
              ))}
            </div>
            {[
              {k:'brushSize',   label:'Size',       min:1,  max:400},
              {k:'brushOpacity',label:'Opacity',    min:1,  max:100},
              {k:'brushHardness',label:'Hardness',  min:0,  max:100},
              {k:'stabilizer',  label:`S${s.stabilizer} Stabilizer`,min:0,max:16},
            ].map(({k,label,min,max})=>(
              <div className="ds-slider-row" key={k}>
                <span className="ds-sl-lbl">{label}</span>
                <input type="range" min={min} max={max} value={s[k]}
                  onChange={e=>d({type:'SET',k,v:+e.target.value})}/>
                <span className="ds-sl-val">{s[k]}</span>
              </div>
            ))}
            <div className="ds-row-label">Symmetry</div>
            <div className="ds-sym-opts">
              {['none','horizontal','vertical','both','radial'].map(sym=>(
                <button key={sym}
                  className={`ds-sym-opt ${s.symmetry===sym?'active':''}`}
                  onClick={()=>d({type:'SET',k:'symmetry',v:sym})}>{sym}</button>
              ))}
            </div>
            {s.tool==='shape'&&(
              <>
                <div className="ds-row-label">Shape</div>
                <div className="ds-sym-opts">
                  {['rect','ellipse','line'].map(sh=>(
                    <button key={sh}
                      className={`ds-sym-opt ${s.shapeType===sh?'active':''}`}
                      onClick={()=>d({type:'SET',k:'shapeType',v:sh})}>{sh}</button>
                  ))}
                </div>
              </>
            )}
          </aside>
        )}

        {/* ── RIGHT: Layer Panel ───────────────────── */}
        {s.showLayers && (
          <aside className="ds-panel ds-layer-panel">
            <div className="ds-panel-head">
              <span>Layers ({s.layers.length})</span>
              <button onClick={()=>d({type:'ADD_LAYER'})}>+ Add</button>
            </div>
            <div className="ds-layers-list">
              {[...s.layers].reverse().map(layer=>(
                <div key={layer.id}
                  className={`ds-layer-item ${s.activeLayerId===layer.id?'selected':''}`}
                  onClick={()=>d({type:'SET',k:'activeLayerId',v:layer.id})}>
                  <button className="ds-lbtn" title="Toggle visibility"
                    onClick={e=>{e.stopPropagation();d({type:'UPD_LAYER',id:layer.id,upd:{visible:!layer.visible}})}}>
                    {layer.visible?'👁':'🙈'}
                  </button>
                  <button className="ds-lbtn" title="Lock"
                    onClick={e=>{e.stopPropagation();d({type:'UPD_LAYER',id:layer.id,upd:{locked:!layer.locked}})}}>
                    {layer.locked?'🔒':'🔓'}
                  </button>
                  <span className="ds-layer-name">{layer.name}</span>
                  <input type="range" min={0} max={100} value={layer.opacity} className="ds-layer-opacity"
                    onClick={e=>e.stopPropagation()}
                    onChange={e=>d({type:'UPD_LAYER',id:layer.id,upd:{opacity:+e.target.value}})}/>
                  <div className="ds-layer-btns">
                    <button title="Move up"   onClick={e=>{e.stopPropagation();d({type:'MOVE_LAYER',id:layer.id,dir:-1})}}>↑</button>
                    <button title="Move down" onClick={e=>{e.stopPropagation();d({type:'MOVE_LAYER',id:layer.id,dir:1})}}>↓</button>
                    <button title="Duplicate" onClick={e=>{e.stopPropagation();d({type:'DUP_LAYER',id:layer.id})}}>⧉</button>
                    <button title="Delete"    onClick={e=>{e.stopPropagation();d({type:'DEL_LAYER',id:layer.id})}}>✕</button>
                  </div>
                  <select className="ds-blend-sel"
                    value={layer.blendMode}
                    onClick={e=>e.stopPropagation()}
                    onChange={e=>d({type:'UPD_LAYER',id:layer.id,upd:{blendMode:e.target.value}})}>
                    {BLEND_MODES.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ── Color Panel ──────────────────────────── */}
        {s.showColor && (
          <aside className="ds-panel ds-color-panel">
            <div className="ds-panel-head">
              <span>Color</span>
              <button onClick={()=>d({type:'TOGGLE',k:'showColor'})}>✕</button>
            </div>
            <input type="color" className="ds-color-wheel" value={s.color}
              onChange={e=>d({type:'SET_COLOR',c:e.target.value})}/>
            <div className="ds-hex-row">
              <span>HEX</span>
              <input type="text" className="ds-hex-input" value={s.color}
                onChange={e=>{if(/^#[0-9A-Fa-f]{6}$/.test(e.target.value))d({type:'SET_COLOR',c:e.target.value})}}/>
            </div>
            <div className="ds-row-label">Palette</div>
            <div className="ds-palette">
              {s.palette.map((c,i)=>(
                <div key={i} className="ds-swatch"
                  style={{background:c, outline:c===s.color?'2px solid #fff':''}}
                  onClick={()=>d({type:'SET_COLOR',c})}/>
              ))}
            </div>
            {s.colorHistory.length>0&&<>
              <div className="ds-row-label">History</div>
              <div className="ds-palette">
                {s.colorHistory.slice(0,8).map((c,i)=>(
                  <div key={i} className="ds-swatch" style={{background:c}}
                    onClick={()=>d({type:'SET_COLOR',c})}/>
                ))}
              </div>
            </>}
          </aside>
        )}
      </div>

      {/* ═══ BOTTOM: Right-side panel toggles (mobile) ═══ */}
      <div className="ds-mobile-panels">
        <button className={`ds-mpbtn ${s.showBrush?'active':''}`}
          onClick={()=>d({type:'TOGGLE',k:'showBrush'})}>⚙ Brush</button>
        <button className={`ds-mpbtn ${s.showLayers?'active':''}`}
          onClick={()=>d({type:'TOGGLE',k:'showLayers'})}>≡ Layers</button>
        <button className={`ds-mpbtn ${s.showColor?'active':''}`}
          onClick={()=>d({type:'TOGGLE',k:'showColor'})}>🎨 Color</button>
        <button className={`ds-mpbtn ${s.showFrames?'active':''}`}
          onClick={()=>d({type:'TOGGLE',k:'showFrames'})}>🎬 Frames</button>
      </div>

      {/* ═══ FRAME TIMELINE (Flipaclip style) ════════ */}
      {s.showFrames && (
        <footer className="ds-timeline">
          <div className="ds-tl-controls">
            <button className="ds-tlbtn" onClick={()=>d({type:'TOGGLE_PLAY'})}>
              {s.isPlaying?'⏸':'▶'}
            </button>
            <button className={`ds-tlbtn ${s.onionSkin.enabled?'active':''}`}
              onClick={()=>d({type:'SET_ONION',upd:{enabled:!s.onionSkin.enabled}})}>👁</button>
            <div className="ds-onion-controls">
              <span className="ds-onion-lbl">Prev</span>
              <input type="number" min={0} max={5} value={s.onionSkin.prev} className="ds-onion-num"
                onChange={e=>d({type:'SET_ONION',upd:{prev:+e.target.value}})}/>
              <span className="ds-onion-lbl">Next</span>
              <input type="number" min={0} max={5} value={s.onionSkin.next} className="ds-onion-num"
                onChange={e=>d({type:'SET_ONION',upd:{next:+e.target.value}})}/>
            </div>
          </div>
          <div className="ds-frames-strip">
            {s.frames.map((fr,idx)=>(
              <div key={fr.id}
                className={`ds-frame ${idx===s.activeFrameIdx?'active':''}`}
                onClick={()=>d({type:'SET_FRAME',idx})}>
                <span className="ds-fn">{idx+1}</span>
                <div className="ds-frame-menu">
                  <button onClick={e=>{e.stopPropagation();d({type:'DUP_FRAME',idx})}} title="Duplicate">⧉</button>
                  <button onClick={e=>{e.stopPropagation();d({type:'DEL_FRAME',idx})}} title="Delete">✕</button>
                </div>
              </div>
            ))}
            <button className="ds-frame ds-add-frame"
              onClick={()=>d({type:'ADD_FRAME'})}>＋</button>
          </div>
        </footer>
      )}
    </div>
  )
}

