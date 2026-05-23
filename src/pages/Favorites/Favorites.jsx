import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AnimationCard from '../../components/AnimationCard/AnimationCard.jsx'
import { getAnimationById } from '../../hooks/useAnimations.js'
import './Favorites.css'

const LS_FAVS = 'mz_favorites'
const LS_LIKES = 'mz_likes'

function getFavIds()  { try { return JSON.parse(localStorage.getItem(LS_FAVS)  || '[]') } catch { return [] } }
function getLikeIds() { try { return JSON.parse(localStorage.getItem(LS_LIKES) || '{}') } catch { return {} } }

// ─── Animated canvas header ───────────────────────────────────
function FavCanvas() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = cv.offsetWidth || 600
    cv.height = 100
    const W = cv.width
    let t = 0, id
    // Floating hearts
    const hearts = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * W,
      y: 50 + Math.random() * 40,
      vy: -(0.3 + Math.random() * 0.5),
      size: 10 + Math.random() * 14,
      hue: 330 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      life: Math.random(),
    }))
    function drawHeart(cx, cy, size, alpha, hue) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = `hsl(${hue},85%,65%)`
      ctx.font = `${size}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('❤', cx, cy)
      ctx.restore()
    }
    function draw() {
      ctx.clearRect(0, 0, W, 100)
      hearts.forEach(h => {
        h.y += h.vy
        h.x += Math.sin(t + h.phase) * 0.4
        h.life += 0.008
        if (h.life > 1) { h.life = 0; h.y = 100; h.x = Math.random() * W }
        const alpha = Math.sin(h.life * Math.PI) * 0.6
        drawHeart(h.x, h.y, h.size, alpha, h.hue)
      })
      t += 0.03
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [])
  return <canvas ref={cvRef} className="fav-header-canvas"/>
}

// ─── Empty state ──────────────────────────────────────────────
function EmptyState({ tab }) {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width = 140; cv.height = 140
    let t = 0, id
    function draw() {
      ctx.clearRect(0, 0, 140, 140)
      for (let i = 2; i >= 0; i--) {
        const r = 22 + i * 20 + Math.sin(t + i) * 4
        ctx.beginPath()
        ctx.arc(70, 70, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(124,58,237,${0.18 - i * 0.05})`
        ctx.lineWidth = 1.5; ctx.stroke()
      }
      ctx.font = '44px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.globalAlpha = 0.7
      ctx.fillText(tab === 'liked' ? '🤍' : '📄', 70, 70)
      ctx.globalAlpha = 1
      t += 0.04
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(id)
  }, [tab])
  return (
    <div className="favs-empty">
      <canvas ref={cvRef}/>
      <p className="favs-empty-title">
        {tab === 'liked' ? 'No liked animations yet' : 'No saved animations yet'}
      </p>
      <p className="favs-empty-hint">
        {tab === 'liked'
          ? 'Gallery ma jao ane animation card par ❤️ button press karo'
          : 'Gallery ma jao ane animation card par 🔖 button press karo'}
      </p>
      <Link to="/gallery" className="favs-gallery-btn">Browse Gallery →</Link>
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────
function StatsBar({ favCount, likeCount }) {
  return (
    <div className="favs-stats-bar">
      <span className="favs-stat">
        <span className="favs-stat-icon">🔖</span>
        <span className="favs-stat-num">{favCount}</span>
        <span className="favs-stat-label">Saved</span>
      </span>
      <span className="favs-stat-div"/>
      <span className="favs-stat">
        <span className="favs-stat-icon">❤️</span>
        <span className="favs-stat-num">{likeCount}</span>
        <span className="favs-stat-label">Liked</span>
      </span>
      {(favCount > 0 || likeCount > 0) && (
        <>
          <span className="favs-stat-div"/>
          <span className="favs-stat favs-stat-total">
            <span className="favs-stat-icon">✨</span>
            <span className="favs-stat-num">{favCount + likeCount}</span>
            <span className="favs-stat-label">Total</span>
          </span>
        </>
      )}
    </div>
  )
}

// ─── Clear confirm ────────────────────────────────────────────
function ClearBtn({ label, onClear }) {
  const [confirm, setConfirm] = useState(false)
  return confirm ? (
    <div className="clear-confirm">
      <span>Confirm karo?</span>
      <button className="clear-yes" onClick={() => { onClear(); setConfirm(false) }}>Yes, clear</button>
      <button className="clear-no"  onClick={() => setConfirm(false)}>Cancel</button>
    </div>
  ) : (
    <button className="favs-clear-btn" onClick={() => setConfirm(true)}>🗑️ {label}</button>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function Favorites() {
  const [tab,       setTab]       = useState('saved')   // 'saved' | 'liked'
  const [savedAnims, setSavedAnims] = useState([])
  const [likedAnims, setLikedAnims] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [favIds,    setFavIds]    = useState(getFavIds)
  const [likeIds,   setLikeIds]   = useState(() => Object.keys(getLikeIds()))

  // Load animations from Firestore by stored IDs
  useEffect(() => {
    async function loadSaved() {
      if (favIds.length === 0) { setSavedAnims([]); setLoading(false); return }
      const results = await Promise.all(favIds.map(id => getAnimationById(id)))
      setSavedAnims(results.filter(Boolean))
      setLoading(false)
    }
    loadSaved()
  }, [favIds])

  useEffect(() => {
    async function loadLiked() {
      if (likeIds.length === 0) { setLikedAnims([]); return }
      const results = await Promise.all(likeIds.map(id => getAnimationById(id)))
      setLikedAnims(results.filter(Boolean))
    }
    loadLiked()
  }, [likeIds])

  // Listen for real-time fav changes (from AnimationCard on same page)
  useEffect(() => {
    function onFavChange() {
      setFavIds(getFavIds())
      setLikeIds(Object.keys(getLikeIds()))
    }
    window.addEventListener('mz-favs-changed', onFavChange)
    window.addEventListener('storage', onFavChange)
    return () => {
      window.removeEventListener('mz-favs-changed', onFavChange)
      window.removeEventListener('storage', onFavChange)
    }
  }, [])

  function clearSaved() {
    localStorage.setItem('mz_favorites', '[]')
    setFavIds([])
  }
  function clearLiked() {
    localStorage.setItem('mz_likes', '{}')
    setLikeIds([])
  }

  const currentList = tab === 'saved' ? savedAnims : likedAnims

  return (
    <div className="favs-page page-section">
      <div className="container">

        {/* Header with canvas */}
        <div className="favs-header">
          <FavCanvas/>
          <div className="favs-header-content">
            <div className="favs-badge">✦ Personal Collection</div>
            <h1 className="favs-title">
              My <span className="favs-title-gradient">Favorites</span>
            </h1>
            <p className="favs-subtitle">
              Tara device par save thayela animations — no account needed
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsBar favCount={favIds.length} likeCount={likeIds.length}/>

        {/* Tabs */}
        <div className="favs-tabs">
          <button
            className={`favs-tab ${tab === 'saved' ? 'active' : ''}`}
            onClick={() => setTab('saved')}
          >
            🔖 Saved
            {favIds.length > 0 && <span className="tab-count">{favIds.length}</span>}
          </button>
          <button
            className={`favs-tab ${tab === 'liked' ? 'active' : ''}`}
            onClick={() => setTab('liked')}
          >
            ❤️ Liked
            {likeIds.length > 0 && <span className="tab-count">{likeIds.length}</span>}
          </button>

          {/* Clear button */}
          {currentList.length > 0 && (
            <div className="favs-clear-wrap">
              <ClearBtn
                label={tab === 'saved' ? 'Clear Saved' : 'Clear Liked'}
                onClear={tab === 'saved' ? clearSaved : clearLiked}
              />
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="favs-loading">
            <div className="favs-spinner"/>
            <span>Loading your collection...</span>
          </div>
        ) : currentList.length === 0 ? (
          <EmptyState tab={tab === 'saved' ? 'saved' : 'liked'}/>
        ) : (
          <div className="favs-grid">
            {currentList.map((anim, i) => (
              <div
                key={anim.docId}
                className="favs-card-wrap"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <AnimationCard animation={anim}/>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        <p className="favs-local-note">
          💾 Browser ni localStorage ma save chhe — clear cache karo to data jaashe
        </p>
      </div>
    </div>
  )
      }
        
