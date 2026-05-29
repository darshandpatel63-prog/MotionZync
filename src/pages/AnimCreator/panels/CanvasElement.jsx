// CanvasElement.jsx — UPDATED (Feature 8)
// Added: animation trigger system (hover / click / scroll / once / auto)

import { useEffect, useRef, useState } from 'react'
import {
  buildAnimStyle, buildBorderStyle,
  buildFilterStyle, buildShadowStyle, buildGradient,
} from '../engine/AnimEngine.js'
import { buildShaderStyle, getShaderOverlay } from '../engine/ShaderEngine.js'
import { getTriggerStyle, observeScroll, unobserveScroll } from '../engine/TriggerEngine.js'
import { buildMaskStyle } from '../engine/MaskSystem.js'

// ── Shader overlay ────────────────────────────────────────────
function ShaderOverlay({ type, opacity }) {
  if (!type || type==='none') return null
  const base = { position:'absolute', inset:0, pointerEvents:'none', zIndex:5 }
  if (type==='scanlines') return <div style={{ ...base, opacity, background:'repeating-linear-gradient(0deg,rgba(0,0,0,0.35) 0px,rgba(0,0,0,0.35) 1px,transparent 1px,transparent 3px)' }}/>
  if (type==='hologram')  return <div style={{ ...base, opacity, background:'linear-gradient(180deg,transparent 0%,rgba(0,255,255,0.08) 50%,transparent 100%)', animation:'sh-holo-scan 2s linear infinite' }}/>
  if (type==='glitch')    return <div style={{ ...base, opacity, background:'linear-gradient(90deg,rgba(255,0,80,0.15) 0%,transparent 40%,rgba(0,255,255,0.15) 100%)' }}/>
  if (type==='chromatic') return <div style={{ ...base, opacity, background:'linear-gradient(90deg,rgba(255,0,80,0.2) 0%,transparent 50%,rgba(0,255,255,0.2) 100%)', mixBlendMode:'screen' }}/>
  if (type==='vhs')       return <div style={{ ...base, opacity, background:'repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(255,255,255,0.02) 2px,rgba(255,255,255,0.02) 4px)' }}/>
  return null
}

// ── Shape renderers ───────────────────────────────────────────
function TriangleShape({ el, fill }) {
  const { width:w, height:h } = el
  return <svg width={w} height={h} className="shape-svg" style={{overflow:'visible'}}><polygon points={`${w/2},0 ${w},${h} 0,${h}`} fill={fill} stroke={el.stroke||'transparent'} strokeWidth={el.strokeWidth||0}/></svg>
}
function StarShape({ el, fill }) {
  const { width:w, height:h } = el
  const cx=w/2, cy=h/2, outer=Math.min(w,h)/2-1, inner=outer*0.42
  const pts=Array.from({length:10},(_,i)=>{const a=(i*Math.PI)/5-Math.PI/2; const r=i%2===0?outer:inner; return `${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`}).join(' ')
  return <svg width={w} height={h} className="shape-svg" style={{overflow:'visible'}}><polygon points={pts} fill={fill} stroke={el.stroke||'transparent'} strokeWidth={el.strokeWidth||0}/></svg>
}
function LineShape({ el }) {
  const w=Math.max(el.width||100,10), h=Math.max(el.height||6,6)
  return <svg width={w} height={h} className="shape-svg" style={{overflow:'visible'}}><line x1={0} y1={h/2} x2={w} y2={h/2} stroke={el.fill||'#7c3aed'} strokeWidth={el.strokeWidth||3} strokeLinecap="round"/></svg>
}
function DrawShape({ el }) {
  const pts=el._points; if(!pts||pts.length<2) return <div style={{width:'100%',height:'100%',border:'2px dashed rgba(124,58,237,0.4)',borderRadius:4}}/>
  const minX=Math.min(...pts.map(p=>p.x)), minY=Math.min(...pts.map(p=>p.y))
  const d=pts.reduce((a,p,i)=>a+(i===0?`M${(p.x-minX).toFixed(1)},${(p.y-minY).toFixed(1)}`:`L${(p.x-minX).toFixed(1)},${(p.y-minY).toFixed(1)}`),'')
  return <svg width={el.width||100} height={el.height||100} className="shape-svg" style={{overflow:'visible'}}><path d={d} stroke={el.fill||'#7c3aed'} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ImageShape({ el }) {
  if (!el._src) return <div className="canvas-img-placeholder"><span className="cip-icon">🖼️</span><span className="cip-label">{el.label||'Image'}</span></div>
  return <img src={el._src} alt={el.label||'image'} className="canvas-img" style={{borderRadius:el.type==='circle'?'50%':`${el.borderRadius||0}%`}} draggable={false}/>
}
function SelectionHandles() {
  return (<>
    <div className="rh rh-nw" data-handle="nw"/><div className="rh rh-n" data-handle="n"/>
    <div className="rh rh-ne" data-handle="ne"/><div className="rh rh-e" data-handle="e"/>
    <div className="rh rh-se" data-handle="se"/><div className="rh rh-s" data-handle="s"/>
    <div className="rh rh-sw" data-handle="sw"/><div className="rh rh-w" data-handle="w"/>
    <div className="rot-handle" data-handle="rot"/>
  </>)
}

// ─── Main element renderer ────────────────────────────────────
export default function CanvasElement({ el, isSelected, onMouseDown, onContextMenu }) {
  const [triggered, setTriggered] = useState(
    !el.trigger || el.trigger === 'auto' || el.trigger === 'once'
  )
  const elRef     = useRef(null)
  const timerRef  = useRef(null)

  const trigger = el.trigger || 'auto'

  // ── Trigger wiring ─────────────────────────────────────
  useEffect(() => {
    const dom = elRef.current; if (!dom) return

    // Auto / once — always triggered
    if (trigger === 'auto' || trigger === 'once') {
      setTriggered(true); return
    }

    // Hover
    if (trigger === 'hover') {
      const onEnter = () => setTriggered(true)
      const onLeave = () => { if (el.trigger_resetOnLeave !== false) setTriggered(false) }
      dom.addEventListener('mouseenter', onEnter)
      dom.addEventListener('mouseleave', onLeave)
      return () => { dom.removeEventListener('mouseenter',onEnter); dom.removeEventListener('mouseleave',onLeave) }
    }

    // Click
    if (trigger === 'click') {
      setTriggered(false)
      const onClick = () => {
        setTriggered(true)
        clearTimeout(timerRef.current)
        // Reset after animation duration so it can re-trigger
        timerRef.current = setTimeout(() => setTriggered(false), ((el.anim?.duration||1)*1000)+200)
      }
      dom.addEventListener('click', onClick)
      return () => { dom.removeEventListener('click',onClick); clearTimeout(timerRef.current) }
    }

    // Scroll
    if (trigger === 'scroll') {
      setTriggered(false)
      observeScroll(dom, el.id, () => setTriggered(true))
      return () => unobserveScroll(dom, el.id)
    }
  }, [trigger, el.id, el.anim?.duration, el.trigger_resetOnLeave])

  // ── Style building ─────────────────────────────────────
  const baseAnimStyle  = buildAnimStyle(el)
  const borderStyle    = buildBorderStyle(el)
  const filterStr      = buildFilterStyle(el)
  const shadowStr      = buildShadowStyle(el)
  const bg             = buildGradient(el)
  const shaderCss      = buildShaderStyle(el)
  const shaderOvl      = getShaderOverlay(el)
  const triggerStyle   = getTriggerStyle(el, triggered)
  const maskStyle      = buildMaskStyle(el)
  const rx             = el.physics?._rotDelta || 0
  const svgFill        = el.gradient ? el.gradient.stops?.[0]?.color||'#7c3aed' : (el.fill || '#7c3aed')

  const style = {
    position:   'absolute',
    left:       Math.round(el.x),
    top:        Math.round(el.y),
    width:      el.width,
    height:     el.height,
    opacity:    triggerStyle.opacity ?? el.opacity,
    transform:  `rotate(${(el.rotation||0)+rx}deg)`,
    zIndex:     el.zIndex || 0,
    visibility: el.visible === false ? 'hidden' : 'visible',
    cursor:     el.locked ? 'not-allowed'
              : trigger === 'click'  ? 'pointer'
              : trigger === 'hover'  ? 'pointer'
              : 'move',
    willChange: 'transform',
  }

  if (el.type==='rect')   { style.background=bg; style.borderRadius=`${el.borderRadius||8}%` }
  if (el.type==='circle') { style.background=bg; style.borderRadius='50%' }

  const boxTypes = new Set(['rect','circle','text','image'])
  if (shadowStr && boxTypes.has(el.type)) style.boxShadow = shadowStr

  // Filter: merge CSS filters + shader
  const filterParts = []
  if (filterStr) filterParts.push(filterStr)
  if (shaderCss?.includes('filter:')) {
    const sf = shaderCss.split('filter:')[1]?.split(';')[0]?.trim()
    if (sf) filterParts.push(sf)
  }
  if (filterParts.length) style.filter = filterParts.join(' ')

  // Animation: trigger-based overrides auto
  if (triggerStyle.animation) {
    style.animation = triggerStyle.animation
  } else if (trigger === 'auto' && baseAnimStyle && !el.physics?.enabled) {
    if (shaderCss?.includes('animation:')) {
      const sa = shaderCss.split('animation:')[1]?.split(';')[0]?.trim()
      style.animation = sa ? `${baseAnimStyle}, ${sa}` : baseAnimStyle
    } else {
      style.animation = baseAnimStyle
    }
  } else if (!el.physics?.enabled && trigger !== 'auto') {
    // Non-auto trigger — no idle animation
    style.animation = 'none'
  }

  if (el.borderAnim?.enabled) Object.assign(style, borderStyle)
  if (maskStyle.clipPath)     style.clipPath = maskStyle.clipPath

  // Trigger cursor hint badge
  const triggerBadge = (trigger !== 'auto') ? trigger : null

  return (
    <div
      ref={elRef}
      data-id={el.id}
      className={`canvas-el ${isSelected?'sel':''} ${el.type}`}
      style={style}
      onMouseDown={e => onMouseDown(e, el)}
      onContextMenu={e => onContextMenu?.(e, el)}
    >
      {shaderOvl && <ShaderOverlay type={shaderOvl.type} opacity={shaderOvl.opacity}/>}

      {el.type==='text' && (
        <span style={{ color:el.fontColor||'#fff', fontSize:el.fontSize||20, fontWeight:el.fontWeight||700,
          display:'flex', alignItems:'center', justifyContent:'center',
          textAlign:'center', userSelect:'none', padding:'0 8px', width:'100%', height:'100%' }}>
          {el.label}
        </span>
      )}
      {el.type==='triangle' && <TriangleShape el={el} fill={svgFill}/>}
      {el.type==='star'     && <StarShape     el={el} fill={svgFill}/>}
      {el.type==='line'     && <LineShape     el={el}/>}
      {el.type==='draw'     && <DrawShape     el={el}/>}
      {el.type==='image'    && <ImageShape    el={el}/>}

      {/* Trigger badge (editor only) */}
      {isSelected && triggerBadge && (
        <div className="trigger-badge">{triggerBadge}</div>
      )}

      {isSelected && !el.locked && <SelectionHandles/>}
    </div>
  )
  }
        
