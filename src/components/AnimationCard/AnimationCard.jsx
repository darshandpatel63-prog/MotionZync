import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './AnimationCard.css'

function AnimationCard({ animation }) {
  const { id, title, description, category, cssCode, jsCode, previewBg } = animation
  const iframeRef = useRef(null)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = buildPreviewHTML(cssCode, jsCode)
    }
  }, [cssCode, jsCode])

  return (
    <div className="anim-card">
      <div className="anim-card-preview" style={{ background: previewBg || '#1a1a28' }}>
        <iframe
          ref={iframeRef}
          className="anim-preview-frame"
          sandbox="allow-scripts"
          title={`Preview of ${title}`}
        />
        <span className="anim-category-badge">{category}</span>
      </div>
      <div className="anim-card-body">
        <h3 className="anim-card-title">{title}</h3>
        <p className="anim-card-desc">{description}</p>
        <div className="anim-card-actions">
          <Link to={`/playground?id=${id}`} className="btn-primary">Try it ⚡</Link>
        </div>
      </div>
    </div>
  )
}

function buildPreviewHTML(css, js) {
  return (
    '<!DOCTYPE html><html><head><style>' +
    '*{margin:0;padding:0;box-sizing:border-box;}' +
    'body{width:100%;height:100vh;overflow:hidden;background:#0a0a0f;}' +
    '#container{width:100%;height:100%;position:relative;}' +
    (css || '') +
    '</style></head><body><div id="container"></div>' +
    '<script>try{' + (js || '') + '}catch(e){}</script>' +
    '</body></html>'
  )
}

export default AnimationCard
