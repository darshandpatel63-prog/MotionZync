import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { buildSandboxHTML } from '../LivePreview/LivePreview.jsx'
import './AnimationCard.css'

export default function AnimationCard({ animation }) {
  const { docId, title, description, category, cssCode, jsCode, previewBg, tags=[], views=0 } = animation
  const iframeRef = useRef(null)
  useEffect(() => { if (iframeRef.current) iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, previewBg) }, [cssCode, jsCode, previewBg])

  return (
    <div className="anim-card">
      <div className="anim-card-preview" style={{background:previewBg||'#1a1a28'}}>
        <iframe ref={iframeRef} className="anim-preview-frame" sandbox="allow-scripts" title={title}/>
        <span className="anim-cat-badge">{category}</span>
        {views > 0 && <span className="anim-views-badge">👁️ {views > 999 ? (views/1000).toFixed(1)+'k' : views}</span>}
      </div>
      <div className="anim-card-body">
        <h3 className="anim-card-title">{title}</h3>
        <p className="anim-card-desc">{description}</p>
        {tags.length > 0 && (
          <div className="anim-tags">{tags.slice(0,4).map(t=><span key={t} className="anim-tag">#{t}</span>)}</div>
        )}
        <div className="anim-card-actions">
          {/* Alag link - /animation/:docId */}
          <Link to={`/animation/${docId}`} className="btn-primary anim-try-btn">Try it ⚡</Link>
          <Link to={`/wallpaper?id=${docId}`} className="btn-secondary anim-wall-btn">🖼️</Link>
          <button className="btn-secondary anim-share-btn" onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/animation/${docId}`)
            alert('Link copied!')
          }}>🔗</button>
        </div>
      </div>
    </div>
  )
}
