import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getChangelogs } from '../../hooks/useAnimations.js'
import './Changelog.css'

const TYPE_META = {
  feature:      { label:'🚀 Feature',      color:'#7c3aed' },
  fix:          { label:'🐛 Fix',           color:'#ef4444' },
  update:       { label:'🔄 Update',        color:'#06b6d4' },
  announcement: { label:'📢 Announcement', color:'#f59e0b' },
}

// ─── Canvas header — kinetic typography style ─────────────────
function ChangelogCanvas() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let id, t = 0
    function resize() { cv.width = cv.offsetWidth || 600; cv.height = 110 }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Grid of small dots that pulse
    const cols = Math.ceil(cv.width / 28)
    const rows = 4
    const dots = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * 28 + 14,
          y: r * 28 + 6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.2,
          hue: 250 + Math.random() * 60,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      dots.forEach(d => {
        const pulse = (Math.sin(t * d.speed + d.phase) + 1) / 2
        const r = 1.5 + pulse * 2.5
        const alpha = 0.08 + pulse * 0.25
        ctx.beginPath()
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${d.hue},70%,65%,${alpha})`
        ctx.fill()
      })
      t += 0.025
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={cvRef} className="cl-header-canvas"/>
}

// ─── Skeleton loader ─────────────────────────────────────────
function SkeletonEntry() {
  return (
    <div className="cl-skeleton">
      <div className="cl-skeleton-dot shimmer"/>
      <div className="cl-skeleton-body">
        <div className="cl-skeleton-line shimmer" style={{width:'30%',height:'18px'}}/>
        <div className="cl-skeleton-line shimmer" style={{width:'60%',height:'14px',marginTop:'8px'}}/>
        <div className="cl-skeleton-line shimmer" style={{width:'85%',height:'11px',marginTop:'10px'}}/>
        <div className="cl-skeleton-line shimmer" style={{width:'70%',height:'11px',marginTop:'6px'}}/>
      </div>
    </div>
  )
}

// ─── Single changelog entry ──────────────────────────────────
function ChangelogEntry({ entry, index, isFirst }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const meta = TYPE_META[entry.type] || TYPE_META.feature

  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const dateStr = entry.date
    ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    : ''

  return (
    <div
      ref={ref}
      className={`cl-entry ${visible ? 'cl-entry-in' : ''} ${entry.pinned ? 'cl-pinned' : ''}`}
      style={{ '--delay': `${index * 0.08}s`, '--accent': meta.color }}
    >
      {/* Timeline dot */}
      <div className="cl-timeline-col">
        <div className="cl-timeline-dot" style={{ background: meta.color, boxShadow: `0 0 12px ${meta.color}66` }}>
          {isFirst && <div className="cl-dot-pulse" style={{ background: meta.color }}/>}
        </div>
        <div className="cl-timeline-line"/>
      </div>

      {/* Content card */}
      <div className="cl-card">
        {entry.pinned && <div className="cl-pin-banner">📌 Pinned</div>}

        <div className="cl-card-header">
          <div className="cl-card-title-row">
            <span className="cl-version" style={{ color: meta.color, borderColor: meta.color + '44' }}>
              {entry.version}
            </span>
            <span className="cl-type-pill" style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}33` }}>
              {meta.label}
            </span>
            {isFirst && <span className="cl-new-badge">NEW ✨</span>}
          </div>
          <h2 className="cl-card-title">{entry.title}</h2>
          {dateStr && <div className="cl-date">📅 {dateStr}</div>}
        </div>

        {entry.items?.length > 0 && (
          <ul className="cl-items">
            {entry.items.map((item, i) => (
              <li key={i} className="cl-item" style={{ animationDelay: `${index * 0.08 + i * 0.06}s` }}>
                <span className="cl-item-dot" style={{ background: meta.color }}/>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────
function EmptyState() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); cv.width = 120; cv.height = 120
    let t = 0, id
    function draw() {
      ctx.clearRect(0, 0, 120, 120)
      for (let i = 0; i < 3; i++) {
        const r = 15 + i * 18 + Math.sin(t + i) * 4
        ctx.beginPath(); ctx.arc(60, 60, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(124,58,237,${0.2 - i * 0.05})`
        ctx.lineWidth = 1.5; ctx.stroke()
      }
      ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('📋', 60, 62)
      t += 0.04; id = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div className="cl-empty">
      <canvas ref={cvRef}/>
      <p>Abhi tak koi changelog entry nathi.</p>
      <p className="cl-empty-sub">Admin panel thi entries add karo.</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function Changelog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    getChangelogs().then(data => {
      setEntries(data); setLoading(false)
    })
  }, [])

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => e.type === filter)

  return (
    <div className="changelog-page page-section">
      <div className="container">

        {/* Header */}
        <div className="cl-header">
          <ChangelogCanvas/>
          <div className="cl-header-content">
            <div className="cl-header-badge">📋 Version History</div>
            <h1 className="cl-header-title">
              What's <span className="cl-title-gradient">New</span>
            </h1>
            <p className="cl-header-sub">
              MotionZync na navin features, fixes ane updates ni complete list
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="cl-filters">
          {['all','feature','fix','update','announcement'].map(f => (
            <button
              key={f}
              className={`cl-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '🔍 All' : TYPE_META[f]?.label}
              {f !== 'all' && (
                <span className="cl-filter-count">
                  {entries.filter(e => e.type === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="cl-timeline">
          {loading
            ? Array.from({length:4}).map((_,i) => <SkeletonEntry key={i}/>)
            : filtered.length === 0
              ? <EmptyState/>
              : filtered.map((entry, i) => (
                  <ChangelogEntry
                    key={entry.docId}
                    entry={entry}
                    index={i}
                    isFirst={i === 0}
                  />
                ))
          }
        </div>

        {/* Footer note */}
        <div className="cl-footer-note">
          <span>🔧 MotionZync is actively developed.</span>
          <Link to="/gallery" className="cl-footer-link">Browse Animations →</Link>
        </div>
      </div>
    </div>
  )
}

