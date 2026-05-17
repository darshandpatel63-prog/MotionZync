import { useState, useEffect, useCallback } from 'react'
import './CustomizePanel.css'

/**
 * CustomizePanel
 * CSS + JS code maathi text, colors, image URLs auto-detect kare chhe
 * User badli shake chhe - code touch karyaa vina
 * Props: cssCode, jsCode, onChange(newCss, newJs)
 */

// Hex colors detect
function extractColors(text) {
  const re = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(text)) !== null) {
    const hex = m[0].toLowerCase()
    if (!seen.has(hex)) { seen.add(hex); found.push(hex) }
  }
  return found.slice(0, 12)
}

// Quoted text strings detect
function extractTexts(js) {
  const re = /(?:textContent|innerHTML|innerText|textContent)\s*=\s*['"`]([^'"`\n]{2,60})['"`]/g
  const also = /\.textContent\s*=\s*['"](.*?)['"]/g
  const found = [], seen = new Set()
  let m
  const patterns = [
    /textContent\s*=\s*['"`]([^'"`\n]{2,60})['"`]/g,
    /innerHTML\s*=\s*['"`]([^'"`\n<>{]{2,60})['"`]/g,
    /innerText\s*=\s*['"`]([^'"`\n]{2,60})['"`]/g,
  ]
  for (const pat of patterns) {
    while ((m = pat.exec(js)) !== null) {
      if (!seen.has(m[1])) { seen.add(m[1]); found.push(m[1]) }
    }
  }
  return found.slice(0, 6)
}

// Image URLs detect
function extractImages(js) {
  const re = /src\s*=\s*['"`](https?:\/\/[^'"`\s]+\.(png|jpg|jpeg|gif|webp|svg))['"`]/gi
  const found = []
  let m
  while ((m = re.exec(js)) !== null) found.push(m[1])
  return found.slice(0, 4)
}

// Width/height pixel values detect (for size)
function extractSizes(css) {
  const re = /(?:width|height)\s*:\s*(\d+)px/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(css)) !== null) {
    const label = m[0].split(':')[0].trim()
    const key = label + ':' + m[1]
    if (!seen.has(key)) { seen.add(key); found.push({ label, value: m[1], original: m[1] }) }
  }
  return found.slice(0, 6)
}

export default function CustomizePanel({ cssCode, jsCode, onChange }) {
  const [colors,  setColors]  = useState([])
  const [texts,   setTexts]   = useState([])
  const [images,  setImages]  = useState([])
  const [editColors, setEditColors] = useState({})
  const [editTexts,  setEditTexts]  = useState({})
  const [editImages, setEditImages] = useState({})
  const [open, setOpen] = useState(true)

  // Detect kariye jyaare code badle
  useEffect(() => {
    const c = extractColors((cssCode||'') + (jsCode||''))
    const t = extractTexts(jsCode||'')
    const i = extractImages(jsCode||'')
    setColors(c); setTexts(t); setImages(i)
    const ec = {}; c.forEach(x => ec[x] = x); setEditColors(ec)
    const et = {}; t.forEach(x => et[x] = x); setEditTexts(et)
    const ei = {}; i.forEach(x => ei[x] = x); setEditImages(ei)
  }, [cssCode, jsCode])

  // Color badlo
  function applyColor(original, newColor) {
    const ec = { ...editColors, [original]: newColor }
    setEditColors(ec)
    let css = cssCode || '', js = jsCode || ''
    Object.entries(ec).forEach(([orig, updated]) => {
      const re = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi')
      css = css.replace(re, updated)
      js  = js.replace(re, updated)
    })
    onChange(css, js)
  }

  // Text badlo
  function applyText(original, newText) {
    const et = { ...editTexts, [original]: newText }
    setEditTexts(et)
    let js = jsCode || ''
    Object.entries(et).forEach(([orig, updated]) => {
      js = js.replace(new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g'), updated)
    })
    onChange(cssCode, js)
  }

  // Image badlo
  function applyImage(original, newUrl) {
    const ei = { ...editImages, [original]: newUrl }
    setEditImages(ei)
    let js = jsCode || ''
    Object.entries(ei).forEach(([orig, updated]) => {
      js = js.replace(new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g'), updated)
    })
    onChange(cssCode, js)
  }

  const hasAnything = colors.length > 0 || texts.length > 0 || images.length > 0

  if (!hasAnything) return (
    <div className="customize-panel empty-panel">
      <span>🎨</span>
      <p>Aa animation ma customizable elements mili nahi.<br/>Code editor ma directly badlavo.</p>
    </div>
  )

  return (
    <div className="customize-panel">
      <button className="cp-toggle" onClick={() => setOpen(p=>!p)}>
        🎨 Customize Animation {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="cp-body">
          {/* Colors */}
          {colors.length > 0 && (
            <div className="cp-section">
              <h4>🎨 Colors</h4>
              <div className="cp-colors-grid">
                {colors.map(c => (
                  <div className="cp-color-item" key={c}>
                    <input
                      type="color"
                      value={editColors[c] || c}
                      onChange={e => applyColor(c, e.target.value)}
                      className="cp-color-swatch"
                      title={c}
                    />
                    <span className="cp-color-code">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Texts */}
          {texts.length > 0 && (
            <div className="cp-section">
              <h4>✏️ Text</h4>
              <div className="cp-texts">
                {texts.map(t => (
                  <div className="cp-text-item" key={t}>
                    <label className="cp-text-label">"{t}"</label>
                    <input
                      type="text"
                      className="cp-text-input"
                      value={editTexts[t] || t}
                      onChange={e => applyText(t, e.target.value)}
                      placeholder="Badlo..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="cp-section">
              <h4>🖼️ Images</h4>
              <div className="cp-images">
                {images.map(img => (
                  <div className="cp-img-item" key={img}>
                    <img src={editImages[img]||img} alt="preview" className="cp-img-thumb" onError={e=>e.target.style.display='none'}/>
                    <input
                      type="text"
                      className="cp-text-input"
                      value={editImages[img] || img}
                      onChange={e => applyImage(img, e.target.value)}
                      placeholder="Navi image URL nakho..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

