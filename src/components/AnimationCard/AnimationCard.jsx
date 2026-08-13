import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { buildSandboxHTML } from '../LivePreview/LivePreview.jsx'
import './AnimationCard.css'

// ─── localStorage helpers ─────────────────────────────────────
const LS_LIKES = 'mz_likes'
const LS_FAVS  = 'mz_favorites'

function getLikes()  { try { return JSON.parse(localStorage.getItem(LS_LIKES) || '{}') } catch { return {} } }
function getFavs()   { try { return JSON.parse(localStorage.getItem(LS_FAVS)  || '[]') } catch { return [] } }

function toggleLike(docId) {
  const likes = getLikes()
  if (likes[docId]) { delete likes[docId] } else { likes[docId] = true }
  localStorage.setItem(LS_LIKES, JSON.stringify(likes))
  return !!likes[docId]
}

function toggleFav(docId) {
  const favs = getFavs()
  const idx  = favs.indexOf(docId)
  const next = idx === -1 ? [...favs, docId] : favs.filter(id => id !== docId)
  localStorage.setItem(LS_FAVS, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('mz-favs-changed', { detail: next.length }))
  return idx === -1
}

// ─── Heart burst canvas (one-shot) ───────────────────────────
function HeartBurst({ active }) {
  const cvRef = useRef(null)
  const didRef = useRef(false)

  useEffect(() => {
    if (!active || didRef.current) return
    didRef.current = true
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = 80; cv.height = 80
    const pts = Array.from({ length: 10 }, () => ({
      x: 40, y: 40,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5 - 2,
      r: 2 + Math.random() * 3,
      hue: 330 + Math.random() * 40,
      life: 1,
    }))
    let id
    function draw() {
      ctx.clearRect(0, 0, 80, 80)
      let alive = false
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 0.04
        if (p.life <= 0) return
        alive = true
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},90%,65%,${p.life})`
        ctx.fill()
      })
      if (alive) id = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, 80, 80)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [active])

  return (
    <canvas
      ref={cvRef}
      className="heart-burst-canvas"
      style={{ opacity: active ? 1 : 0 }}
    />
  )
}

// ─── Main Card ────────────────────────────────────────────────
export default function AnimationCard({ animation }) {
  const { docId, title, description, category, cssCode, jsCode, previewBg, tags=[] } = animation
  const iframeRef = useRef(null)

  // Like state — from localStorage
  const [liked,    setLiked]    = useState(() => !!getLikes()[docId])
  const [burst,    setBurst]    = useState(false)
  // Fav state — from localStorage
  const [favd,     setFavd]     = useState(() => getFavs().includes(docId))

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, previewBg)
  }, [cssCode, jsCode, previewBg])

  function handleLike(e) {
    e.preventDefault(); e.stopPropagation()
    const nowLiked = toggleLike(docId)
    setLiked(nowLiked)
    if (nowLiked) { setBurst(true); setTimeout(() => setBurst(false), 600) }
  }

  function handleFav(e) {
    e.preventDefault(); e.stopPropagation()
    const nowFavd = toggleFav(docId)
    setFavd(nowFavd)
  }

  function handleShare(e) {
    e.preventDefault(); e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/animation/${docId}`)
    // Show toast-style temporary label on button
    const btn = e.currentTarget
    const prev = btn.textContent
    btn.textContent = '✅'
    setTimeout(() => { btn.textContent = prev }, 1600)
  }

  return (
    <div className="anim-card">
      <div className="anim-card-preview" style={{ background: previewBg || '#1a1a28' }}>
        <iframe ref={iframeRef} className="anim-preview-frame" sandbox="allow-scripts" title={title}/>

        {/* Category badge */}
        <span className="anim-cat-badge">{category}</span>

        {/* ── Like button (top-right overlay on hover) ── */}
        <button
          className={`card-like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          title={liked ? 'Unlike' : 'Like'}
          aria-label="Like animation"
        >
          <span className="like-heart">{liked ? '❤️' : '🤍'}</span>
          <HeartBurst active={burst}/>
        </button>
      </div>

      <div className="anim-card-body">
        <h3 className="anim-card-title">{title}</h3>
        <p className="anim-card-desc">{description}</p>

        {tags.length > 0 && (
          <div className="anim-tags">
            {tags.slice(0,4).map(t => <span key={t} className="anim-tag">#{t}</span>)}
          </div>
        )}

        <div className="anim-card-actions">
          <Link to={`/animation/${docId}`} className="btn-primary anim-try-btn">Try it ⚡</Link>
          <Link to={`/wallpaper?id=${docId}`} className="btn-secondary anim-wall-btn">🖼️</Link>
          <button className="btn-secondary anim-share-btn" onClick={handleShare}>🔗</button>

          {/* ── Bookmark / Save to Favorites ── */}
          <button
            className={`btn-secondary anim-fav-btn ${favd ? 'favd' : ''}`}
            onClick={handleFav}
            title={favd ? 'Remove from Favorites' : 'Save to Favorites'}
            aria-label="Save to favorites"
          >
            {favd ? '🔖' : '📄'}
          </button>
        </div>
      </div>
    </div>
  )
  }
      
