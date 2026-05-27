// CanvasElement.jsx — renders each element type on the canvas
// NEW FILE — split from Canvas.jsx for modularity (< 500 lines rule)

import {
  buildAnimStyle, buildBorderStyle,
  buildFilterStyle, buildShadowStyle, buildGradient,
} from '../engine/AnimEngine.js'

// ── Triangle ─────────────────────────────────────────────────
function TriangleShape({ el, fill }) {
  const { width: w, height: h } = el
  return (
    <svg width={w} height={h} className="shape-svg" style={{ overflow: 'visible' }}>
      <polygon
        points={`${w / 2},0 ${w},${h} 0,${h}`}
        fill={fill}
        stroke={el.stroke || 'transparent'}
        strokeWidth={el.strokeWidth || 0}
      />
    </svg>
  )
}

// ── Star (5-point) ───────────────────────────────────────────
function StarShape({ el, fill }) {
  const { width: w, height: h } = el
  const cx = w / 2
  const cy = h / 2
  const outer = Math.min(w, h) / 2 - 1
  const inner = outer * 0.42
  const pts = Array.from({ length: 10 }, (_, i) => {
    const ang = (i * Math.PI) / 5 - Math.PI / 2
    const r   = i % 2 === 0 ? outer : inner
    return `${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="shape-svg" style={{ overflow: 'visible' }}>
      <polygon
        points={pts}
        fill={fill}
        stroke={el.stroke || 'transparent'}
        strokeWidth={el.strokeWidth || 0}
      />
    </svg>
  )
}

// ── Line ─────────────────────────────────────────────────────
function LineShape({ el }) {
  const w = Math.max(el.width  || 100, 10)
  const h = Math.max(el.height || 6,   6)
  return (
    <svg width={w} height={h} className="shape-svg" style={{ overflow: 'visible' }}>
      <line
        x1={0} y1={h / 2}
        x2={w} y2={h / 2}
        stroke={el.fill || '#7c3aed'}
        strokeWidth={el.strokeWidth || 3}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Freehand Draw ─────────────────────────────────────────────
function DrawShape({ el }) {
  const pts = el._points
  if (!pts || pts.length < 2) {
    return (
      <div style={{
        width: '100%', height: '100%',
        border: '2px dashed rgba(124,58,237,0.4)',
        borderRadius: 4,
      }} />
    )
  }
  const minX = Math.min(...pts.map(p => p.x))
  const minY = Math.min(...pts.map(p => p.y))
  const d = pts.reduce((acc, p, i) =>
    acc + (i === 0
      ? `M${(p.x - minX).toFixed(1)},${(p.y - minY).toFixed(1)}`
      : `L${(p.x - minX).toFixed(1)},${(p.y - minY).toFixed(1)}`
    ), '')
  return (
    <svg
      width={el.width  || 100}
      height={el.height || 100}
      className="shape-svg"
      style={{ overflow: 'visible' }}
    >
      <path
        d={d}
        stroke={el.fill || '#7c3aed'}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Image ─────────────────────────────────────────────────────
function ImageShape({ el }) {
  if (!el._src) {
    return (
      <div className="canvas-img-placeholder">
        <span className="cip-icon">🖼️</span>
        <span className="cip-label">{el.label || 'Image'}</span>
      </div>
    )
  }
  return (
    <img
      src={el._src}
      alt={el.label || 'image'}
      className="canvas-img"
      style={{
        borderRadius: el.type === 'circle' ? '50%' : `${el.borderRadius || 0}%`,
      }}
      draggable={false}
    />
  )
}

// ── Selection handles ─────────────────────────────────────────
function SelectionHandles() {
  return (
    <>
      <div className="rh rh-nw" data-handle="nw" />
      <div className="rh rh-n"  data-handle="n"  />
      <div className="rh rh-ne" data-handle="ne" />
      <div className="rh rh-e"  data-handle="e"  />
      <div className="rh rh-se" data-handle="se" />
      <div className="rh rh-s"  data-handle="s"  />
      <div className="rh rh-sw" data-handle="sw" />
      <div className="rh rh-w"  data-handle="w"  />
      <div className="rot-handle" data-handle="rot" />
    </>
  )
}

// ── Main element renderer ─────────────────────────────────────
export default function CanvasElement({ el, isSelected, onMouseDown, onContextMenu }) {
  const animStyle   = buildAnimStyle(el)
  const borderStyle = buildBorderStyle(el)
  const filterStr   = buildFilterStyle(el)
  const shadowStr   = buildShadowStyle(el)
  const bg          = buildGradient(el)
  const rx          = el.physics?._rotDelta || 0

  // SVG shapes can't use CSS gradients for fill → use flat color
  const svgFill = el.gradient ? el.gradient.from : (el.fill || '#7c3aed')

  const style = {
    position:   'absolute',
    left:       Math.round(el.x),
    top:        Math.round(el.y),
    width:      el.width,
    height:     el.height,
    opacity:    el.opacity,
    transform:  `rotate(${(el.rotation || 0) + rx}deg)`,
    zIndex:     el.zIndex || 0,
    visibility: el.visible === false ? 'hidden' : 'visible',
    cursor:     el.locked ? 'not-allowed' : 'move',
    willChange: 'transform',
  }

  // Box shapes get CSS background
  if (el.type === 'rect') {
    style.background    = bg
    style.borderRadius  = `${el.borderRadius || 8}%`
  } else if (el.type === 'circle') {
    style.background   = bg
    style.borderRadius = '50%'
  }

  // Box shadows only on box / text shapes
  const boxTypes = new Set(['rect', 'circle', 'text', 'image'])
  if (shadowStr && boxTypes.has(el.type)) style.boxShadow = shadowStr
  if (filterStr)  style.filter = filterStr
  if (animStyle && !el.physics?.enabled) style.animation = animStyle
  if (el.borderAnim?.enabled) Object.assign(style, borderStyle)

  return (
    <div
      data-id={el.id}
      className={`canvas-el ${isSelected ? 'sel' : ''} ${el.type}`}
      style={style}
      onMouseDown={e => onMouseDown(e, el)}
      onContextMenu={e => onContextMenu?.(e, el)}
    >
      {/* Text */}
      {el.type === 'text' && (
        <span style={{
          color: el.fontColor || '#fff', fontSize: el.fontSize || 20,
          fontWeight: el.fontWeight || 700, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', userSelect: 'none',
          padding: '0 8px', width: '100%', height: '100%',
        }}>
          {el.label}
        </span>
      )}

      {/* SVG shapes */}
      {el.type === 'triangle' && <TriangleShape el={el} fill={svgFill} />}
      {el.type === 'star'     && <StarShape     el={el} fill={svgFill} />}
      {el.type === 'line'     && <LineShape     el={el} />}
      {el.type === 'draw'     && <DrawShape     el={el} />}
      {el.type === 'image'    && <ImageShape    el={el} />}

      {/* Selection handles */}
      {isSelected && !el.locked && <SelectionHandles />}
    </div>
  )
}
