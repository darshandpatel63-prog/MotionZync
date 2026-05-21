import { useState, useEffect, useCallback, useRef } from 'react'
import AnimationCard from '../../components/AnimationCard/AnimationCard.jsx'
import AdSense       from '../../components/AdSense/AdSense.jsx'
import { getAnimations, getCategories, searchByTag } from '../../hooks/useAnimations.js'
import './Gallery.css'

// ─── Floating Particles BG ───────────────────────────────────────────────────
function ParticleBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let animId
    cv.width  = cv.offsetWidth
    cv.height = cv.offsetHeight
    const W = cv.width, H = cv.height

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 2,
      hue: 240 + Math.random() * 60,
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      // Connect nearby dots
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist/110)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        const p = pts[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},70%,65%,0.45)`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])
  return <canvas ref={cvRef} className="gallery-particle-bg"/>
}

// ─── Animated Header ─────────────────────────────────────────────────────────
function GalleryHeader({ count }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    setTimeout(() => el.classList.add('header-revealed'), 80)
  }, [])

  return (
    <div ref={ref} className="gallery-header anim-header">
      <div className="gallery-header-badge">✦ Browse & Copy</div>
      <h1 className="gallery-title">
        Animation <span className="gallery-title-gradient">Gallery</span>
      </h1>
      <p className="gallery-subtitle">
        {count > 0
          ? <><span className="gallery-count-pill">{count} animations</span> — ready to preview, customize & copy</>
          : 'Ready-made animations — "Try it" dabso playground ma open thase'}
      </p>
      {/* Animated underline */}
      <div className="header-line"/>
    </div>
  )
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-preview shimmer"/>
      <div className="skeleton-body">
        <div className="skeleton-line shimmer" style={{ width: '70%' }}/>
        <div className="skeleton-line shimmer" style={{ width: '45%', height: '10px' }}/>
        <div className="skeleton-actions">
          <div className="skeleton-btn shimmer"/>
          <div className="skeleton-btn shimmer"/>
        </div>
      </div>
    </div>
  )
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 900, 1)
      setVal(Math.floor(p * to))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [to])
  return <>{val}</>
}

// ─── Category Filter with animation ─────────────────────────────────────────
function CategoryFilter({ categories, activeCat, onChange }) {
  return (
    <div className="category-filter">
      {categories.map((c, i) => (
        <button
          key={c.name}
          className={`filter-btn ${activeCat === c.name ? 'active' : ''}`}
          onClick={() => onChange(c.name)}
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          {c.name}
          {activeCat === c.name && <span className="filter-dot"/>}
        </button>
      ))}
    </div>
  )
}

// ─── Animated Card Wrapper ───────────────────────────────────────────────────
function CardReveal({ children, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('card-visible'); io.disconnect() }
    }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="card-reveal"
      style={{ '--ci': index % 6, '--delay': `${(index % 6) * 0.07}s` }}
    >
      {children}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ search }) {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = 160; cv.height = 160
    let t = 0, id
    function draw() {
      ctx.clearRect(0, 0, 160, 160)
      const cx = 80, cy = 80
      for (let i = 0; i < 3; i++) {
        const r = 20 + i * 18 + Math.sin(t * 2 + i) * 5
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(124,58,237,${0.35 - i * 0.09})`
        ctx.lineWidth = 2 - i * 0.4
        ctx.stroke()
      }
      ctx.font = '36px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('😕', cx, cy)
      t += 0.04
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="empty-state-wrap">
      <canvas ref={cvRef} className="empty-canvas"/>
      <p className="empty-title">No animations found</p>
      <p className="empty-hint">"{search}" mate koi result nathi</p>
    </div>
  )
}

// ─── Main Gallery ────────────────────────────────────────────────────────────
export default function Gallery() {
  const [animations,  setAnimations]  = useState([])
  const [categories,  setCategories]  = useState([])
  const [activeCat,   setActiveCat]   = useState('All')
  const [search,      setSearch]      = useState('')
  const [bgFilter,    setBgFilter]    = useState('')
  const [loading,     setLoading]     = useState(true)
  const [gridVisible, setGridVisible] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    async function load() {
      const [anims, cats] = await Promise.all([getAnimations(), getCategories()])
      setAnimations(anims)
      setCategories([{ name: 'All' }, ...cats])
      setLoading(false)
      setTimeout(() => setGridVisible(true), 100)
    }
    load()
  }, [])

  const handleSearch = useCallback(async (val) => {
    setSearch(val)
    if (!val.trim()) { const a = await getAnimations(); setAnimations(a); return }
    const tag = val.replace(/^#/, '').trim()
    const results = await searchByTag(tag)
    setAnimations(results)
  }, [])

  const filtered = animations.filter(a => {
    const catOk = activeCat === 'All' || a.category === activeCat
    const bgOk  = !bgFilter || (a.previewBg || '').toLowerCase().includes(bgFilter.toLowerCase())
    return catOk && bgOk
  })

  return (
    <div className="gallery-page page-section">
      {/* Animated particle background */}
      <ParticleBg/>

      <div className="container">

        {/* Header */}
        <GalleryHeader count={filtered.length}/>

        {/* Search */}
        <div className="gallery-search-row">
          <div className="search-wrap">
            <span className="search-icon search-pulse">🔍</span>
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search by title, #tag..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => handleSearch('')}>✕</button>}
          </div>

          <div className="bg-filter-wrap">
            <label className="bg-filter-label">🎨 BG:</label>
            <input type="color" className="bg-color-input"
              value={bgFilter || '#0a0a0f'}
              onChange={e => setBgFilter(e.target.value)}
              title="Preview BG color thi filter karo"/>
            <input className="bg-hex-input" placeholder="#0a0a0f"
              value={bgFilter} onChange={e => setBgFilter(e.target.value)}/>
            {bgFilter && <button className="search-clear" onClick={() => setBgFilter('')}>✕</button>}
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_GALLERY}/></div>

        {/* Category */}
        <CategoryFilter
          categories={categories}
          activeCat={activeCat}
          onChange={setActiveCat}
        />

        {/* Stats bar */}
        {!loading && (
          <div className="gallery-stats-bar">
            <span className="stats-count">
              <Counter to={filtered.length}/> animations
            </span>
            <span className="stats-cat">
              {activeCat !== 'All' ? `📁 ${activeCat}` : '📦 All categories'}
            </span>
            {search && <span className="stats-search">🔍 "{search}"</span>}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="gallery-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState search={search}/>
        ) : (
          <div className={`gallery-grid ${gridVisible ? 'grid-in' : ''}`}>
            {filtered.map((anim, i) => (
              <CardReveal key={anim.docId} index={i}>
                <AnimationCard animation={anim}/>
              </CardReveal>
            ))}
          </div>
        )}

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_GALLERY}/></div>
      </div>
    </div>
  )
      }
      
