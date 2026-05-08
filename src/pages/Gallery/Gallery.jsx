import { useState } from 'react'
import AnimationCard from '../../components/AnimationCard/AnimationCard.jsx'
import AdSense from '../../components/AdSense/AdSense.jsx'
import backgroundAnimations from '../../animations/backgroundAnimations.js'
import frontAnimations from '../../animations/frontAnimations.js'
import './Gallery.css'

const allAnimations = [...backgroundAnimations, ...frontAnimations]
const categories = ['All', 'Background', 'Front']

function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? allAnimations
    : allAnimations.filter(a => a.category === activeCategory)

  return (
    <div className="gallery-page page-section">
      <div className="container">
        <div className="gallery-header">
          <h1 className="gallery-title">Animation Gallery</h1>
          <p className="gallery-subtitle">
            Ready-made animations — click "Try it" to playground ma open karo
          </p>
        </div>

        {/* AdSense top */}
        <div className="ad-zone">
          <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_GALLERY} />
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="empty-state">Koi animation mili nahi 😕</p>
        ) : (
          <div className="gallery-grid">
            {filtered.map(anim => (
              <AnimationCard key={anim.id} animation={anim} />
            ))}
          </div>
        )}

        {/* AdSense bottom */}
        <div className="ad-zone">
          <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_GALLERY} />
        </div>
      </div>
    </div>
  )
}

export default Gallery
