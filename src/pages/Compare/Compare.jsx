import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import { getAnimations } from '../../hooks/useAnimations.js'
import './Compare.css'

const SPEEDS = [
  { label:'0.25x', value:0.25 },
  { label:'0.5x',  value:0.5  },
  { label:'1x',    value:1    },
  { label:'2x',    value:2    },
  { label:'4x',    value:4    },
]
const MAX_SLOTS = 5
const SLOT_COLORS = ['#7c3aed','#06b6d4','#f59e0b','#10b981','#ef4444']
const SLOT_LABELS = ['A','B','C','D','E']

// ─── Animated BG canvas ──────────────────────────────────────
function CompareBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let id, t = 0
    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      const W = cv.width, H = cv.height
      // Dual orbs
      const colors = ['rgba(124,58,237,0.07)', 'rgba(6,182,212,0.06)', 'rgba(245,158,11,0.05)']
      const cx1 = W*0.25 + Math.sin(t*0.3)*W*0.12
      const cy1 = H*0.35 + Math.cos(t*0.25)*H*0.1
      const g1 = ctx.createRadialGradient(cx1,cy1,0,cx1,cy1,W*0.35)
      g1.addColorStop(0,colors[0]); g1.addColorStop(1,'transparent')
      ctx.fillStyle=g1; ctx.fillRect(0,0,W,H)
      const cx2 = W*0.75 + Math.cos(t*0.28)*W*0.12
      const cy2 = H*0.6  + Math.sin(t*0.22)*H*0.12
      const g2 = ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,W*0.3)
      g2.addColorStop(0,colors[1]); g2.addColorStop(1,'transparent')
      ctx.fillStyle=g2; ctx.fillRect(0,0,W,H)
      t += 0.008; id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize) }
  },[])
  return <canvas ref={cvRef} className="compare-bg-canvas"/>
}

// ─── Header ──────────────────────────────────────────────────
function CompareHeader({ count }) {
  return (
    <div className="compare-hero">
      <div className="compare-hero-badge">⚖️ Side by Side</div>
      <h1 className="compare-hero-title">
        Compare <span className="compare-title-gradient">Animations</span>
      </h1>
      <p className="compare-hero-sub">
        {count} animation{count!==1?'s':''} selected — up to {MAX_SLOTS} ek saath compare kari shako
      </p>
    </div>
  )
}

// ─── Empty pane ───────────────────────────────────────────────
function EmptyPane({ label, color }) {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); cv.width=200; cv.height=160
    let t=0, id
    function draw() {
      ctx.clearRect(0,0,200,160)
      // Animated border
      ctx.beginPath()
      ctx.roundRect(4,4,192,152,12)
      ctx.strokeStyle=color+'55'
      ctx.lineWidth=2
      ctx.setLineDash([8,6])
      ctx.lineDashOffset = -t*40
      ctx.stroke()
      ctx.setLineDash([])
      // Center letter
      ctx.font='bold 48px sans-serif'
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillStyle=color+'66'
      ctx.fillText(label, 100, 80)
      t+=0.015; id=requestAnimationFrame(draw)
    }
    draw(); return ()=>cancelAnimationFrame(id)
  },[color,label])
  return (
    <div className="compare-empty-state">
      <canvas ref={cvRef}/>
      <p>Animation {label} select karo</p>
    </div>
  )
}

// ─── Single compare slot ──────────────────────────────────────
function CompareSlot({ slot, index, animations, onPick, onRemove, speed, canRemove }) {
  const color = SLOT_COLORS[index % SLOT_COLORS.length]
  const label = SLOT_LABELS[index]
  const anim  = animations.find(a => a.docId === slot.id) || null

  return (
    <div
      className={`compare-pane ${anim ? 'has-anim' : ''}`}
      style={{ '--slot-color': color }}
    >
      {/* Slot header */}
      <div className="compare-pane-header" style={{ borderTopColor: color }}>
        <div className="pane-header-left">
          <span className="pane-slot-badge" style={{ background: color }}>{label}</span>
          {anim
            ? <span className="compare-pane-title">{anim.title}</span>
            : <span className="compare-pane-title pane-placeholder">Select animation...</span>
          }
        </div>
        <div className="pane-header-right">
          {anim && (
            <Link to={`/animation/${anim.docId}`} className="comp-try-btn">
              ⚡ Try
            </Link>
          )}
          {canRemove && (
            <button className="pane-remove-btn" onClick={()=>onRemove(index)} title="Remove this slot">✕</button>
          )}
        </div>
      </div>

      {/* Selector */}
      <div className="pane-selector-wrap">
        <select
          className="comp-select"
          value={slot.id}
          onChange={e=>onPick(index, e.target.value)}
          style={{ borderColor: slot.id ? color+'66' : '' }}
        >
          <option value="">— Animation {label} choose karo —</option>
          {animations.map(a=>(
            <option key={a.docId} value={a.docId}>{a.title}</option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div className="compare-preview">
        {anim ? (
          <LivePreview cssCode={anim.cssCode} jsCode={anim.jsCode} bgColor={anim.previewBg} speed={speed}/>
        ) : (
          <EmptyPane label={label} color={color}/>
        )}
      </div>

      {/* Info bar */}
      {anim && (
        <div className="compare-info">
          <span className="detail-cat">{anim.category}</span>
          {anim.tags?.slice(0,3).map(t=><span key={t} className="detail-tag">#{t}</span>)}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function Compare() {
  const [searchParams] = useSearchParams()
  const [animations, setAnimations] = useState([])
  const [slots,      setSlots]      = useState([
    { id: '' },
    { id: '' },
  ])
  const [speed, setSpeed] = useState(1)
  const [synced, setSynced] = useState(true)

  useEffect(() => {
    getAnimations().then(list => {
      setAnimations(list)
      // Pre-fill from URL params ?a=xx&b=xx
      const a = searchParams.get('a')
      const b = searchParams.get('b')
      setSlots(prev => {
        const next = [...prev]
        if (a && list.find(x=>x.docId===a)) next[0] = { id: a }
        else if (list.length > 0)            next[0] = { id: list[0].docId }
        if (b && list.find(x=>x.docId===b)) next[1] = { id: b }
        else if (list.length > 1)            next[1] = { id: list[1].docId }
        return next
      })
    })
  }, [])

  function handlePick(index, id) {
    setSlots(prev => {
      const next = [...prev]
      next[index] = { id }
      return next
    })
  }

  function addSlot() {
    if (slots.length >= MAX_SLOTS) return
    setSlots(prev => [...prev, { id: '' }])
  }

  function removeSlot(index) {
    if (slots.length <= 2) return
    setSlots(prev => prev.filter((_,i)=>i!==index))
  }

  // Grid columns based on slot count
  const colClass = {
    1: 'grid-1',
    2: 'grid-2',
    3: 'grid-3',
    4: 'grid-4',
    5: 'grid-5',
  }[slots.length] || 'grid-2'

  const filledCount = slots.filter(s=>s.id).length

  return (
    <div className="compare-page page-section">
      <CompareBg/>
      <div className="container compare-container">

        <CompareHeader count={filledCount}/>

        {/* Controls bar */}
        <div className="compare-controls">
          {/* Speed */}
          <div className="speed-control">
            <span className="speed-label">⚡</span>
            {SPEEDS.map(s=>(
              <button
                key={s.value}
                className={`speed-btn ${speed===s.value?'active':''}`}
                onClick={()=>setSpeed(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Slot count indicator */}
          <div className="slot-count-wrap">
            {Array.from({length:MAX_SLOTS}).map((_,i)=>(
              <div
                key={i}
                className={`slot-dot ${i<slots.length?'active':''}`}
                style={{ background: i<slots.length ? SLOT_COLORS[i] : '' }}
              />
            ))}
            <span className="slot-count-label">{slots.length}/{MAX_SLOTS}</span>
          </div>

          {/* Add / remove slots */}
          <div className="slot-btns">
            {slots.length < MAX_SLOTS && (
              <button className="slot-add-btn" onClick={addSlot}>
                <span className="slot-add-plus">+</span>
                Add Slot
              </button>
            )}
            {slots.length >= MAX_SLOTS && (
              <span className="slot-max-note">Max {MAX_SLOTS} slots</span>
            )}
          </div>
        </div>

        {/* Compare grid — dynamic columns */}
        <div className={`compare-grid ${colClass}`}>
          {slots.map((slot,i)=>(
            <CompareSlot
              key={i}
              slot={slot}
              index={i}
              animations={animations}
              onPick={handlePick}
              onRemove={removeSlot}
              speed={speed}
              canRemove={slots.length > 2}
            />
          ))}
        </div>

        {/* Helper tip */}
        <p className="compare-tip">
          💡 Animations sync thay chhe — same speed sathe badha ek saath play thay
        </p>
      </div>
    </div>
  )
              }
            
