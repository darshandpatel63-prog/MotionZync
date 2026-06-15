// src/ai/preview/DesignFilePreview.jsx
// My UI Design — DesignFilesPanel pattern → MotionZync
// Preview: SVG, PNG, CSS animations, HTML snippets, color palettes
// Mobile + Desktop both perfect

import { useState, useRef, useCallback } from 'react'
import './DesignFilePreview.css'

/** @typedef {'svg'|'image'|'css'|'html'|'palette'|'code'} PreviewType */

/** @param {string} content - file text or data URL */
function detectType(content = '') {
  if (content.trim().startsWith('<svg'))          return 'svg'
  if (content.startsWith('data:image'))           return 'image'
  if (content.includes('@keyframes') ||
      content.includes('animation:'))             return 'css'
  if (content.trim().startsWith('<') &&
      content.includes('html'))                   return 'html'
  if (/^#[0-9A-Fa-f]{3,6}/.test(content.trim())) return 'palette'
  return 'code'
}

/** @param {PreviewType} type */
function typeIcon(type) {
  const icons = { svg:'🔷', image:'🖼', css:'✨', html:'🌐', palette:'🎨', code:'💻' }
  return icons[type] || '📄'
}

/** Renders a live CSS animation preview */
function CSSPreview({ css }) {
  const src = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a12;display:flex;align-items:center;justify-content:center;height:100vh;}
    .mz-el{width:80px;height:80px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:14px;}
    ${css}
  </style></head><body><div class="mz-el"></div></body></html>`
  return (
    <iframe className="dfp-iframe" srcDoc={src} sandbox="allow-scripts" title="CSS Preview"/>
  )
}

/** Renders SVG inline */
function SVGPreview({ svg }) {
  return (
    <div className="dfp-svg-wrap"
      dangerouslySetInnerHTML={{ __html: svg }}/>
  )
}

/** Renders color palette from hex list */
function PalettePreview({ content }) {
  const colors = content.match(/#[0-9A-Fa-f]{3,6}/g) || []
  return (
    <div className="dfp-palette">
      {colors.map((c, i) => (
        <div key={i} className="dfp-palette-swatch"
          onClick={() => navigator.clipboard.writeText(c)}
          title={`Copy ${c}`}>
          <div className="dfp-ps-color" style={{ background: c }}/>
          <span className="dfp-ps-hex">{c}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * @param {{
 *   content?: string,
 *   fileName?: string,
 *   onClose?: Function
 * }} props
 */
export default function DesignFilePreview({ content = '', fileName = '', onClose }) {
  const [tab,     setTab]     = useState('preview')
  const [zoom,    setZoom]    = useState(1)
  const [copied,  setCopied]  = useState(false)
  const [dragging,setDragging]= useState(false)
  const [localContent, setLocalContent] = useState(content)
  const [localName,    setLocalName]    = useState(fileName)
  const dropRef = useRef(null)

  const type = detectType(localContent)

  // Drop zone handler
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    setLocalName(file.name)
    const reader = new FileReader()
    if (file.type.startsWith('image/')) {
      reader.onload = ev => setLocalContent(ev.target.result)
      reader.readAsDataURL(file)
    } else {
      reader.onload = ev => setLocalContent(ev.target.result)
      reader.readAsText(file)
    }
  }, [])

  const copy = () => {
    navigator.clipboard.writeText(localContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([localContent], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = localName || 'design-file.txt'
    a.click()
  }

  return (
    <div className="dfp-root"
      ref={dropRef}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}>

      {/* ── Header ─────────────────────────────────── */}
      <div className="dfp-header">
        <div className="dfp-header-left">
          <span className="dfp-type-icon">{typeIcon(type)}</span>
          <span className="dfp-filename">{localName || 'Design Preview'}</span>
          <span className="dfp-type-badge">{type.toUpperCase()}</span>
        </div>
        <div className="dfp-header-right">
          {/* Zoom controls (image/svg only) */}
          {(type === 'svg' || type === 'image') && (
            <div className="dfp-zoom">
              <button className="ghost" style={{ padding:'4px 8px', fontSize:12 }}
                onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}>−</button>
              <span style={{ fontSize:11, minWidth:36, textAlign:'center' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button className="ghost" style={{ padding:'4px 8px', fontSize:12 }}
                onClick={() => setZoom(z => Math.min(4, z + 0.25))}>+</button>
              <button className="ghost" style={{ padding:'4px 8px', fontSize:12 }}
                onClick={() => setZoom(1)}>⊡</button>
            </div>
          )}
          <button className="ghost" style={{ fontSize:11, padding:'4px 10px' }}
            onClick={copy}>
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
          <button className="ghost" style={{ fontSize:11, padding:'4px 10px' }}
            onClick={download}>↓</button>
          {onClose && (
            <button className="settings-close" onClick={onClose}>✕</button>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────── */}
      {(type === 'css' || type === 'html' || type === 'code') && (
        <div className="seg-control dfp-tabs" style={{ '--seg-cols': 2, borderRadius:0, border:'none', borderBottom:'1px solid var(--border)' }}>
          <button className={`seg-btn ${tab === 'preview' ? 'active' : ''}`}
            onClick={() => setTab('preview')}>
            <span className="seg-title">Preview</span>
          </button>
          <button className={`seg-btn ${tab === 'code' ? 'active' : ''}`}
            onClick={() => setTab('code')}>
            <span className="seg-title">Code</span>
          </button>
        </div>
      )}

      {/* ── Content area ───────────────────────────── */}
      <div className={`dfp-content ${dragging ? 'dragging' : ''}`}>

        {/* Drop zone overlay */}
        {dragging && (
          <div className="dfp-drop-overlay">
            <div className="dfp-drop-msg">
              <span style={{ fontSize:40 }}>📂</span>
              <span>Drop file here to preview</span>
            </div>
          </div>
        )}

        {/* Empty state — drop zone */}
        {!localContent && (
          <div className="dfp-empty">
            <span style={{ fontSize:44 }}>📂</span>
            <strong>Drop a file to preview</strong>
            <p className="hint">SVG, PNG, CSS, HTML files supported</p>
            <label className="primary" style={{ cursor:'pointer', fontSize:13 }}>
              Browse File
              <input type="file" style={{ display:'none' }}
                accept=".svg,.png,.jpg,.jpeg,.gif,.webp,.css,.html,.txt"
                onChange={e => {
                  const file = e.target.files[0]
                  if (!file) return
                  setLocalName(file.name)
                  const reader = new FileReader()
                  if (file.type.startsWith('image/')) {
                    reader.onload = ev => setLocalContent(ev.target.result)
                    reader.readAsDataURL(file)
                  } else {
                    reader.onload = ev => setLocalContent(ev.target.result)
                    reader.readAsText(file)
                  }
                }}/>
            </label>
          </div>
        )}

        {/* SVG Preview */}
        {localContent && type === 'svg' && (
          <div className="dfp-preview-area">
            <div style={{ transform:`scale(${zoom})`, transformOrigin:'center center', transition:'transform .2s' }}>
              <SVGPreview svg={localContent}/>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {localContent && type === 'image' && (
          <div className="dfp-preview-area">
            <img src={localContent} alt="Preview"
              style={{ maxWidth:'100%', maxHeight:'100%', transform:`scale(${zoom})`, objectFit:'contain', borderRadius:8 }}/>
          </div>
        )}

        {/* CSS Preview + code tab */}
        {localContent && type === 'css' && (
          tab === 'preview'
            ? <CSSPreview css={localContent}/>
            : <pre className="dfp-code"><code>{localContent}</code></pre>
        )}

        {/* HTML Preview */}
        {localContent && type === 'html' && (
          tab === 'preview'
            ? <iframe className="dfp-iframe" srcDoc={localContent} sandbox="allow-scripts" title="HTML Preview"/>
            : <pre className="dfp-code"><code>{localContent}</code></pre>
        )}

        {/* Palette Preview */}
        {localContent && type === 'palette' && <PalettePreview content={localContent}/>}

        {/* Code viewer */}
        {localContent && type === 'code' && (
          <pre className="dfp-code"><code>{localContent}</code></pre>
        )}
      </div>
    </div>
  )
        }
            
