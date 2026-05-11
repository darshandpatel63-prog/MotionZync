import { useState, useEffect, useCallback } from 'react'
import AnimationCard from '../../components/AnimationCard/AnimationCard.jsx'
import AdSense       from '../../components/AdSense/AdSense.jsx'
import { getAnimations, getCategories, searchByTag } from '../../hooks/useAnimations.js'
import './Gallery.css'

export default function Gallery() {
  const [animations,  setAnimations]  = useState([])
  const [categories,  setCategories]  = useState([])
  const [activeCat,   setActiveCat]   = useState('All')
  const [search,      setSearch]      = useState('')
  const [bgFilter,    setBgFilter]    = useState('')
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const [anims, cats] = await Promise.all([getAnimations(), getCategories()])
      setAnimations(anims)
      setCategories([{ name: 'All' }, ...cats])
      setLoading(false)
    }
    load()
  }, [])

  // Search by tag or title
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
      <div className="container">
        <div className="gallery-header">
          <h1 className="gallery-title">Animation Gallery</h1>
          <p className="gallery-subtitle">Ready-made animations — "Try it" dabso playground ma open thase</p>
        </div>

        {/* Search bar */}
        <div className="gallery-search-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by title, #tag..."
              value={search} onChange={e => handleSearch(e.target.value)}/>
            {search && <button className="search-clear" onClick={() => handleSearch('')}>✕</button>}
          </div>
          {/* BG Color filter */}
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

        {/* Category filter */}
        <div className="category-filter">
          {categories.map(c => (
            <button key={c.name}
              className={`filter-btn ${activeCat === c.name ? 'active' : ''}`}
              onClick={() => setActiveCat(c.name)}>
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="gallery-loading">⏳ Loading animations...</div>
        ) : filtered.length === 0 ? (
          <p className="empty-state">Koi animation mili nahi 😕</p>
        ) : (
          <div className="gallery-grid">
            {filtered.map(anim => <AnimationCard key={anim.docId} animation={anim}/>)}
          </div>
        )}

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_GALLERY}/></div>
      </div>
    </div>
  )
}

