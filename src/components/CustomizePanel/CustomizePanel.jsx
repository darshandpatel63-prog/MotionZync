import { useState, useEffect } from 'react'
import './CustomizePanel.css'

// ─── Extractors ───────────────────────────────────────────────────────────────

// Hex colors
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

// Text strings — improved: catches many more patterns
function extractTexts(js) {
  const found = [], seen = new Set()
  const patterns = [
    // textContent / innerText / innerHTML = "..."
    /(?:textContent|innerText|innerHTML)\s*=\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]/g,
    // createTextNode("...")
    /createTextNode\([`'""]([^`'""<>{}\n]{2,80})[`'""]\)/g,
    // text: "..." (in JS object)
    /\btext\s*:\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]/g,
    // content: "..." (CSS-in-JS)
    /\bcontent\s*:\s*[`'""]([^`'""<>{}\\n]{2,80})[`'""]/g,
    // title: "..."
    /\btitle\s*:\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]/g,
    // label: "..."
    /\blabel\s*:\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]/g,
    // placeholder: "..."
    /\bplaceholder\s*:\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]/g,
    // setAttribute("data-text", "...") or setAttribute("placeholder", "...")
    /setAttribute\([`'""]\w+[`'""]\s*,\s*[`'""]([^`'""<>{}\n]{2,80})[`'""]\)/g,
    // Any standalone string that looks like readable text (contains spaces, letters)
    // Only capture if it has at least one space or multiple words
    /(?:^|[=(,\[{])\s*[`'""]([A-Za-z][^`'""<>{}0-9\n]{3,60})[`'""]/gm,
  ]
  for (const pat of patterns) {
    let m
    while ((m = pat.exec(js)) !== null) {
      const val = m[1].trim()
      // Filter out: URLs, hex colors, CSS classes, too-short, pure numbers
      if (
        val.length < 2 ||
        /^https?:\/\//.test(val) ||
        /^#[0-9a-f]{3,6}$/i.test(val) ||
        /^[\d\s.px%emrem]+$/.test(val) ||
        /^[a-z-]+$/.test(val) && val.length < 5 || // likely a CSS prop
        /\\[ntr]/.test(val) // escape sequences
      ) continue
      if (!seen.has(val)) { seen.add(val); found.push(val) }
    }
  }
  return found.slice(0, 8)
}

// CSS content: "..." pseudo-element text
function extractCSSTexts(css) {
  const found = [], seen = new Set()
  const re = /content\s*:\s*["']([^"'\n]{2,60})["']/g
  let m
  while ((m = re.exec(css)) !== null) {
    const val = m[1].trim()
    if (val && val !== '' && !seen.has(val)) { seen.add(val); found.push(val) }
  }
  return found.slice(0, 4)
}

// Image URLs
function extractImages(js) {
  const re = /(?:src|href|url)\s*[=(:]\s*[`'""]?(https?:\/\/[^\s`'"">]+\.(?:png|jpg|jpeg|gif|webp|svg))[`'""]?/gi
  const found = []
  let m
  while ((m = re.exec(js)) !== null) found.push(m[1])
  return found.slice(0, 4)
}

// Font sizes — from CSS
function extractFontSizes(cssJs) {
  const re = /font-size\s*:\s*([\d.]+)(px|rem|em|pt|vw)/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(cssJs)) !== null) {
    const key = `font-size:${m[1]}${m[2]}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Font Size',
        value: parseFloat(m[1]),
        unit: m[2],
        originalStr: `${m[1]}${m[2]}`,
        prop: 'font-size',
        min: m[2]==='px' ? 8 : 0.5,
        max: m[2]==='px' ? 120 : 8,
        step: m[2]==='px' ? 1 : 0.1,
      })
    }
  }
  return found.slice(0, 4)
}

// Letter spacing
function extractSpacings(cssJs) {
  const re = /letter-spacing\s*:\s*([\d.-]+)(px|em|rem)/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(cssJs)) !== null) {
    const key = `letter-spacing:${m[1]}${m[2]}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Letter Spacing',
        value: parseFloat(m[1]),
        unit: m[2],
        originalStr: `${m[1]}${m[2]}`,
        prop: 'letter-spacing',
        min: -5, max: 20, step: 0.5,
      })
    }
  }
  return found.slice(0, 3)
}

// Line height
function extractLineHeights(cssJs) {
  const re = /line-height\s*:\s*([\d.]+)(px|rem|em|)?/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(cssJs)) !== null) {
    const unit = m[2] || ''
    const key = `line-height:${m[1]}${unit}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Line Height',
        value: parseFloat(m[1]),
        unit,
        originalStr: `${m[1]}${unit}`,
        prop: 'line-height',
        min: 0.8, max: 4, step: 0.1,
      })
    }
  }
  return found.slice(0, 2)
}

// Opacity
function extractOpacities(cssJs) {
  const re = /\bopacity\s*:\s*(0?\.\d+|1(?:\.0)?|0)/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(cssJs)) !== null) {
    const val = parseFloat(m[1])
    const key = `opacity:${val}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Opacity',
        value: val,
        unit: '',
        originalStr: m[1],
        prop: 'opacity',
        min: 0, max: 1, step: 0.05,
      })
    }
  }
  return found.slice(0, 3)
}

// Width/Height sizes
function extractSizes(css) {
  const re = /(?:width|height)\s*:\s*(\d+)px/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(css)) !== null) {
    const propName = m[0].split(':')[0].trim()
    const key = `${propName}:${m[1]}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: propName.charAt(0).toUpperCase() + propName.slice(1),
        value: parseInt(m[1]),
        unit: 'px',
        originalStr: `${m[1]}px`,
        prop: propName,
        min: 10, max: 600, step: 1,
      })
    }
  }
  return found.slice(0, 6)
}

// Border radius
function extractBorderRadius(css) {
  const re = /border-radius\s*:\s*(\d+)(px|%)/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(css)) !== null) {
    const key = `border-radius:${m[1]}${m[2]}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Border Radius',
        value: parseInt(m[1]),
        unit: m[2],
        originalStr: `${m[1]}${m[2]}`,
        prop: 'border-radius',
        min: 0, max: m[2]==='%' ? 50 : 200, step: 1,
      })
    }
  }
  return found.slice(0, 2)
}

// Animation duration
function extractDurations(css) {
  const re = /animation(?:-duration)?\s*:[^;]*?([\d.]+)(s|ms)\b/gi
  const found = [], seen = new Set()
  let m
  while ((m = re.exec(css)) !== null) {
    const key = `duration:${m[1]}${m[2]}`
    if (!seen.has(key)) {
      seen.add(key)
      found.push({
        label: 'Duration',
        value: parseFloat(m[1]),
        unit: m[2],
        originalStr: `${m[1]}${m[2]}`,
        prop: 'animation-duration',
        min: m[2]==='s' ? 0.1 : 100,
        max: m[2]==='s' ? 30 : 30000,
        step: m[2]==='s' ? 0.1 : 100,
      })
    }
  }
  return found.slice(0, 3)
}

// ─── Replace helper ───────────────────────────────────────────────────────────
function replaceAll(str, original, replacement) {
  return str.split(original).join(replacement)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomizePanel({ cssCode, jsCode, onChange }) {
  const [colors,     setColors]     = useState([])
  const [texts,      setTexts]      = useState([])
  const [cssTexts,   setCssTexts]   = useState([])
  const [images,     setImages]     = useState([])
  const [numericItems, setNumericItems] = useState([]) // font, spacing, sizes, etc.

  const [editColors,    setEditColors]    = useState({})
  const [editTexts,     setEditTexts]     = useState({})
  const [editCssTexts,  setEditCssTexts]  = useState({})
  const [editImages,    setEditImages]    = useState({})
  const [editNumerics,  setEditNumerics]  = useState({}) // key = prop+original, value = number

  const [open,        setOpen]        = useState(true)
  const [activeGroup, setActiveGroup] = useState('colors')

  useEffect(() => {
    const css = cssCode || ''
    const js  = jsCode  || ''
    const all = css + ' ' + js

    const c  = extractColors(all)
    const t  = extractTexts(js)
    const ct = extractCSSTexts(css)
    const i  = extractImages(js)

    // Combine all numeric items
    const nums = [
      ...extractFontSizes(all),
      ...extractSpacings(all),
      ...extractLineHeights(all),
      ...extractOpacities(all),
      ...extractSizes(css),
      ...extractBorderRadius(css),
      ...extractDurations(css),
    ]

    setColors(c); setTexts(t); setCssTexts(ct); setImages(i); setNumericItems(nums)

    const ec = {}; c.forEach(x => ec[x] = x); setEditColors(ec)
    const et = {}; t.forEach(x => et[x] = x); setEditTexts(et)
    const ect= {}; ct.forEach(x=> ect[x]= x); setEditCssTexts(ect)
    const ei = {}; i.forEach(x => ei[x] = x); setEditImages(ei)
    const en = {}; nums.forEach(n => en[n.originalStr] = n.value); setEditNumerics(en)
  }, [cssCode, jsCode])

  // ── Apply color change ──────────────────────────────────
  function applyColor(original, newColor) {
    const ec = { ...editColors, [original]: newColor }
    setEditColors(ec)
    let css = cssCode || '', js = jsCode || ''
    Object.entries(ec).forEach(([orig, upd]) => {
      const re = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi')
      css = css.replace(re, upd)
      js  = js.replace(re, upd)
    })
    onChange(css, js)
  }

  // ── Apply text change (JS) ──────────────────────────────
  function applyText(original, newText) {
    const et = { ...editTexts, [original]: newText }
    setEditTexts(et)
    let js = jsCode || ''
    Object.entries(et).forEach(([orig, upd]) => {
      js = replaceAll(js, orig, upd)
    })
    onChange(cssCode, js)
  }

  // ── Apply CSS content text ──────────────────────────────
  function applyCssText(original, newText) {
    const ect = { ...editCssTexts, [original]: newText }
    setEditCssTexts(ect)
    let css = cssCode || ''
    Object.entries(ect).forEach(([orig, upd]) => {
      css = replaceAll(css, `"${orig}"`, `"${upd}"`)
      css = replaceAll(css, `'${orig}'`, `'${upd}'`)
    })
    onChange(css, jsCode)
  }

  // ── Apply image change ──────────────────────────────────
  function applyImage(original, newUrl) {
    const ei = { ...editImages, [original]: newUrl }
    setEditImages(ei)
    let js = jsCode || ''
    Object.entries(ei).forEach(([orig, upd]) => {
      js = replaceAll(js, orig, upd)
    })
    onChange(cssCode, js)
  }

  // ── Apply numeric value change ──────────────────────────
  function applyNumeric(item, newValue) {
    const en = { ...editNumerics, [item.originalStr]: newValue }
    setEditNumerics(en)
    const newStr = `${newValue}${item.unit}`
    let css = replaceAll(cssCode || '', item.originalStr, newStr)
    let js  = replaceAll(jsCode  || '', item.originalStr, newStr)
    onChange(css, js)
    // Update item's originalStr reference for next change
    item.originalStr = newStr
  }

  const allTexts = [...texts, ...cssTexts]
  const hasColors   = colors.length > 0
  const hasTexts    = allTexts.length > 0
  const hasImages   = images.length > 0
  const hasNumerics = numericItems.length > 0
  const hasAnything = hasColors || hasTexts || hasImages || hasNumerics

  // Group labels
  const groups = [
    hasColors   && { key:'colors',   icon:'🎨', label:'Colors',   count: colors.length },
    hasTexts    && { key:'text',     icon:'✏️',  label:'Text',     count: allTexts.length },
    hasNumerics && { key:'style',    icon:'📐', label:'Style',    count: numericItems.length },
    hasImages   && { key:'images',   icon:'🖼️', label:'Images',   count: images.length },
  ].filter(Boolean)

  if (!hasAnything) return (
    <div className="customize-panel empty-panel">
      <span>🎨</span>
      <p>Aa animation ma customizable elements mili nahi.<br/>Code editor ma directly badlavo.</p>
    </div>
  )

  return (
    <div className="customize-panel">
      <button className="cp-toggle" onClick={() => setOpen(p => !p)}>
        <span>🎨 Customize Animation</span>
        <span className="cp-toggle-right">
          <span className="cp-count-badges">
            {groups.map(g => (
              <span key={g.key} className="cp-badge">{g.icon} {g.count}</span>
            ))}
          </span>
          <span>{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div className="cp-body">
          {/* Tab bar */}
          <div className="cp-tabs">
            {groups.map(g => (
              <button
                key={g.key}
                className={`cp-tab ${activeGroup === g.key ? 'active' : ''}`}
                onClick={() => setActiveGroup(g.key)}
              >
                {g.icon} {g.label}
                <span className="cp-tab-count">{g.count}</span>
              </button>
            ))}
          </div>

          {/* ── Colors ── */}
          {activeGroup === 'colors' && (
            <div className="cp-section">
              <p className="cp-section-hint">Color picker thi badlo — preview turant update thase</p>
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

          {/* ── Text ── */}
          {activeGroup === 'text' && (
            <div className="cp-section">
              <p className="cp-section-hint">Text content badlo — animation ma instantly dakhshe</p>
              <div className="cp-texts">
                {/* JS texts */}
                {texts.map(t => (
                  <div className="cp-text-item" key={t}>
                    <label className="cp-text-label">
                      <span className="cp-text-source">JS</span>
                      "{t}"
                    </label>
                    <input
                      type="text"
                      className="cp-text-input"
                      value={editTexts[t] ?? t}
                      onChange={e => applyText(t, e.target.value)}
                      placeholder="Badlo..."
                    />
                  </div>
                ))}
                {/* CSS content texts */}
                {cssTexts.map(t => (
                  <div className="cp-text-item" key={'css:'+t}>
                    <label className="cp-text-label">
                      <span className="cp-text-source css-src">CSS</span>
                      content: "{t}"
                    </label>
                    <input
                      type="text"
                      className="cp-text-input"
                      value={editCssTexts[t] ?? t}
                      onChange={e => applyCssText(t, e.target.value)}
                      placeholder="Badlo..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Style (Numeric) ── */}
          {activeGroup === 'style' && (
            <div className="cp-section">
              <p className="cp-section-hint">Slider vapro ya value directly type karo</p>
              <div className="cp-numerics">
                {numericItems.map((item, idx) => (
                  <div className="cp-numeric-item" key={`${item.prop}-${idx}`}>
                    <div className="cp-numeric-header">
                      <label className="cp-numeric-label">{item.label}</label>
                      <div className="cp-numeric-value-wrap">
                        <input
                          type="number"
                          className="cp-numeric-input"
                          value={editNumerics[item.originalStr] ?? item.value}
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          onChange={e => applyNumeric(item, parseFloat(e.target.value) || 0)}
                        />
                        <span className="cp-numeric-unit">{item.unit || 'x'}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="cp-slider"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={editNumerics[item.originalStr] ?? item.value}
                      onChange={e => applyNumeric(item, parseFloat(e.target.value))}
                    />
                    <div className="cp-slider-labels">
                      <span>{item.min}{item.unit}</span>
                      <span>{item.max}{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Images ── */}
          {activeGroup === 'images' && (
            <div className="cp-section">
              <p className="cp-section-hint">Image URL badlo — koi pan public image link nakho</p>
              <div className="cp-images">
                {images.map(img => (
                  <div className="cp-img-item" key={img}>
                    <img
                      src={editImages[img] || img}
                      alt="preview"
                      className="cp-img-thumb"
                      onError={e => e.target.style.display='none'}
                    />
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
  
