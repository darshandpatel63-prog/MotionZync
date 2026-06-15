// src/ai/animation/AIAnimationGenerator.jsx
// Standalone AI Animation Generator
// Features: Natural language → CSS Animation, Live preview, direct save to gallery

import { useState, useRef, useCallback } from 'react'
import { useAI } from '../providers/AIProviderContext.jsx'
import APIKeyManager from '../settings/APIKeyManager.jsx'
import './AIAnimationGenerator.css'

const STYLE_TAGS = [
  'Neon Glow', 'Glitch', 'Particle', 'Liquid', 'Morph',
  'Bounce', 'Cinematic', 'Futuristic', 'Organic', 'Pixel',
  'Fire', 'Electric', 'Galaxy', 'Minimal', '3D Flip',
]

const EXAMPLE_PROMPTS = [
  'A pulsing neon ring that glows purple and cyan',
  'Text that glitches and flickers like a broken screen',
  'A floating particle system with orbiting dots',
  'A liquid morphing blob animation',
  'A cinematic film grain overlay effect',
  'Electric lightning bolt crackling effect',
  'Galaxy spiral with rotating stars',
  'A bouncing ball with realistic physics feel',
]

const SYSTEM = `You are an expert CSS animation developer for MotionZync creative platform.

Generate professional, production-ready CSS animations.

OUTPUT FORMAT — strictly follow this:
---TITLE---
Short animation name

---CSS---
/* Complete CSS here */
.mz-element {
  /* base styles */
}
@keyframes animationName {
  /* keyframes */
}
/* Apply animation to .mz-element */

---DESCRIPTION---
What it looks like in 1-2 sentences

---TAGS---
comma,separated,tags

Rules:
- Always use .mz-element as the main animated class
- Include all necessary base styles
- Make it visually stunning
- 60fps smooth
- No external dependencies`

export default function AIAnimationGenerator({ onSave }) {
  const { chat, getConfig, activeProvider } = useAI()
  const [prompt,   setPrompt]   = useState('')
  const [tags,     setTags]     = useState([])
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [history,  setHistory]  = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [customEl, setCustomEl] = useState('box') // box | text | circle | custom
  const textareaRef = useRef(null)

  const cfg    = getConfig(activeProvider)
  const hasKey = cfg.apiKey || cfg.noKeyRequired

  const addTag = (tag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const buildPrompt = () => {
    let p = prompt.trim()
    if (tags.length) p += `. Style: ${tags.join(', ')}`
    return p
  }

  const generate = useCallback(async () => {
    const p = buildPrompt()
    if (!p || loading) return
    if (!hasKey) { setShowKeys(true); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const reply = await chat([
        { role: 'system', content: SYSTEM },
        { role: 'user',   content: `Create animation: ${p}` }
      ])

      const parsed = parse(reply)
      if (!parsed) throw new Error('Parse error — try again')

      setResult(parsed)
      setHistory(h => [{ ...parsed, prompt: p, id: Date.now() }, ...h.slice(0, 9)])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [prompt, tags, loading, hasKey, chat])

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPreviewHTML = (css, elType) => {
    const elStyles = {
      box:    'width:100px;height:100px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:16px;',
      text:   'font-size:32px;font-weight:900;color:#a78bfa;font-family:system-ui;',
      circle: 'width:100px;height:100px;background:linear-gradient(135deg,#ec4899,#f97316);border-radius:50%;',
    }
    const elContent = elType === 'text' ? 'Motion' : ''
    return `<!DOCTYPE html><html><head><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#0a0a12;display:flex;align-items:center;justify-content:center;
           min-height:100vh;overflow:hidden;}
      .mz-element{${elStyles[elType]||elStyles.box}}
      ${css}
    </style></head><body>
      <div class="mz-element">${elContent}</div>
    </body></html>`
  }

  return (
    <div className="aiag-root">

      {/* ── Header ─────────────────────────────────── */}
      <div className="aiag-header">
        <div className="aiag-title">🎬 AI Animation Generator</div>
        <div className="aiag-header-right">
          {!hasKey && (
            <button className="aiag-key-btn" onClick={() => setShowKeys(true)}>
              🔑 Setup API
            </button>
          )}
          <button className="aiag-hist-btn"
            onClick={() => setShowHistory(s => !s)}>
            ⏱ History ({history.length})
          </button>
        </div>
      </div>

      <div className="aiag-body">

        {/* ── LEFT: Input ────────────────────────────── */}
        <div className="aiag-left">

          {/* Prompt input */}
          <div className="aiag-section">
            <label className="aiag-label">✦ Describe your animation</label>
            <textarea ref={textareaRef}
              className="aiag-textarea"
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. A glowing neon ring that pulses purple and cyan with particle trails..."
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate()
              }}
            />
            <div className="aiag-hint">Ctrl+Enter to generate</div>
          </div>

          {/* Example prompts */}
          <div className="aiag-section">
            <label className="aiag-label">💡 Quick Ideas</label>
            <div className="aiag-examples">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button key={i} className="aiag-ex-btn"
                  onClick={() => { setPrompt(ex); textareaRef.current?.focus() }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Style tags */}
          <div className="aiag-section">
            <label className="aiag-label">🎨 Style Tags</label>
            <div className="aiag-tags">
              {STYLE_TAGS.map(tag => (
                <button key={tag}
                  className={`aiag-tag ${tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => addTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Preview element type */}
          <div className="aiag-section">
            <label className="aiag-label">🔷 Preview Element</label>
            <div className="aiag-el-types">
              {[['box','⬛ Box'],['text','T Text'],['circle','⭕ Circle']].map(([k,l]) => (
                <button key={k}
                  className={`aiag-el-btn ${customEl === k ? 'active' : ''}`}
                  onClick={() => setCustomEl(k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button className="aiag-gen-btn"
            onClick={generate}
            disabled={!prompt.trim() || loading || !hasKey}>
            {loading
              ? <><span className="aiag-spin">⟳</span> Generating...</>
              : '✨ Generate Animation'
            }
          </button>

          {error && <div className="aiag-error">⚠️ {error}</div>}
        </div>

        {/* ── RIGHT: Preview + Result ─────────────────── */}
        <div className="aiag-right">
          {result ? (
            <>
              {/* Live preview */}
              <div className="aiag-preview-wrap">
                <div className="aiag-preview-header">
                  <span className="aiag-anim-title">{result.title}</span>
                  <div className="aiag-result-tags">
                    {(result.tags||[]).map(t => (
                      <span key={t} className="aiag-rtag">{t}</span>
                    ))}
                  </div>
                </div>
                <iframe
                  key={result.title + customEl}
                  className="aiag-iframe"
                  srcDoc={getPreviewHTML(result.css, customEl)}
                  sandbox="allow-scripts"
                  title="Animation Preview"
                />
                <div className="aiag-description">{result.description}</div>
              </div>

              {/* Actions */}
              <div className="aiag-actions">
                <button className="aiag-act-btn aiag-copy"
                  onClick={() => copy(result.css)}>
                  {copied ? '✓ Copied!' : '⧉ Copy CSS'}
                </button>
                <button className="aiag-act-btn aiag-download"
                  onClick={() => {
                    const blob = new Blob([result.css], { type: 'text/css' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = `${result.title.replace(/\s+/g,'-').toLowerCase()}.css`
                    a.click()
                  }}>
                  ↓ Download CSS
                </button>
                {onSave && (
                  <button className="aiag-act-btn aiag-save"
                    onClick={() => onSave(result)}>
                    ＋ Save to Gallery
                  </button>
                )}
              </div>

              {/* CSS Code */}
              <div className="aiag-code-wrap">
                <div className="aiag-code-header">
                  <span>CSS Code</span>
                  <button onClick={() => copy(result.css)} className="aiag-copy-mini">
                    {copied ? '✓' : '⧉'}
                  </button>
                </div>
                <pre className="aiag-code"><code>{result.css}</code></pre>
              </div>

              {/* Regenerate */}
              <button className="aiag-regen-btn" onClick={generate} disabled={loading}>
                {loading ? '⏳ Generating...' : '↺ Regenerate'}
              </button>
            </>
          ) : (
            <div className="aiag-empty-preview">
              <div className="aiag-empty-icon">🎬</div>
              <p>Describe an animation and click Generate</p>
              <span>AI will create CSS + live preview</span>
            </div>
          )}
        </div>
      </div>

      {/* ── History panel ────────────────────────────── */}
      {showHistory && history.length > 0 && (
        <div className="aiag-history">
          <div className="aiag-hist-head">
            <span>Recent Generations</span>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          <div className="aiag-hist-list">
            {history.map(h => (
              <div key={h.id} className="aiag-hist-item"
                onClick={() => { setResult(h); setShowHistory(false) }}>
                <span className="aiag-hist-name">{h.title}</span>
                <span className="aiag-hist-prompt">{h.prompt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showKeys && <APIKeyManager onClose={() => setShowKeys(false)}/>}
    </div>
  )
}

// ─── Parser ───────────────────────────────────────────────────
function parse(text) {
  const title       = text.match(/---TITLE---\s*\n(.*?)\n/)?.[1]?.trim()
  const css         = text.match(/---CSS---\s*\n([\s\S]*?)(?:---|$)/)?.[1]?.trim()
  const description = text.match(/---DESCRIPTION---\s*\n([\s\S]*?)(?:---|$)/)?.[1]?.trim()
  const tagsRaw     = text.match(/---TAGS---\s*\n(.*?)(?:\n|$)/)?.[1]?.trim()
  const tags        = tagsRaw?.split(',').map(t => t.trim()).filter(Boolean) || []
  if (!css) return null
  return { title: title || 'AI Animation', css, description: description || '', tags }
}
