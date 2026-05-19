import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import { getCategories, submitAnimation } from '../../hooks/useAnimations.js'
import './Submit.css'

const EMPTY_CSS = `/* Tari animation CSS yahan lakho */
.my-element {
  width: 100px;
  height: 100px;
  background: #7c3aed;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.6; }
}`

const EMPTY_JS = `// Taro JavaScript code yahan lakho
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;';
const el = document.createElement('div');
el.className = 'my-element';
c.appendChild(el);`

export default function Submit() {
  const [step,       setStep]       = useState(1) // 1=form, 2=code, 3=success
  const [categories, setCategories] = useState([])

  // Form fields
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [title,     setTitle]     = useState('')
  const [desc,      setDesc]      = useState('')
  const [category,  setCategory]  = useState('Background')
  const [previewBg, setPreviewBg] = useState('#0a0a0f')
  const [cssCode,   setCssCode]   = useState(EMPTY_CSS)
  const [jsCode,    setJsCode]    = useState(EMPTY_JS)

  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [submittedId, setSubmittedId] = useState(null)

  useEffect(() => {
    getCategories().then(cats => setCategories(cats))
  }, [])

  function validateStep1() {
    if (!title.trim())       { setError('Title jaroori chhe!'); return false }
    if (title.trim().length < 3) { setError('Title ochhamaa 3 akshar joiye!'); return false }
    setError(''); return true
  }

  function validateStep2() {
    if (!cssCode.trim() && !jsCode.trim()) {
      setError('Ochhamaa CSS ya JS code nakho!'); return false
    }
    setError(''); return true
  }

  async function handleSubmit() {
    if (!validateStep2()) return
    setSubmitting(true); setError('')
    try {
      const id = await submitAnimation({
        title: title.trim(),
        description: desc.trim(),
        category,
        previewBg,
        cssCode,
        jsCode,
        submitterName: name.trim(),
        submitterEmail: email.trim(),
      })
      setSubmittedId(id)
      setStep(3)
    } catch(e) {
      setError('Submit nai thayo: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success State ───────────────────────────────────────
  if (step === 3) return (
    <div className="submit-page page-section">
      <div className="container submit-success-wrap">
        <div className="submit-success-card">
          <div className="success-icon">🎉</div>
          <h1>Submit Thayu!</h1>
          <p>Tamari animation review mate moka di chhe.<br/>Admin approve karshe tyaar pachhi gallery ma dakhshe.</p>
          <div className="success-id">🔖 ID: <code>{submittedId}</code></div>
          <div className="success-actions">
            <Link to="/gallery" className="btn-primary">Gallery Juo →</Link>
            <button className="btn-secondary" onClick={() => {
              setStep(1); setTitle(''); setDesc(''); setName(''); setEmail('')
              setCssCode(EMPTY_CSS); setJsCode(EMPTY_JS); setPreviewBg('#0a0a0f')
            }}>
              + Ek Vadhare Submit Karo
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── Main Form ───────────────────────────────────────────
  return (
    <div className="submit-page page-section">
      <div className="container">

        {/* Header */}
        <div className="submit-header">
          <span className="submit-badge">✦ Community</span>
          <h1 className="submit-title">Animation Submit Karo</h1>
          <p className="submit-subtitle">
            Tari CSS/JS animation share karo. Admin review pachhi gallery ma live thase.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="submit-steps">
          {['Details', 'Code & Preview', 'Submit'].map((s, i) => (
            <div key={s} className={`submit-step ${step > i+1 ? 'done' : step === i+1 ? 'active' : ''}`}>
              <div className="step-num">{step > i+1 ? '✓' : i+1}</div>
              <span className="step-label">{s}</span>
              {i < 2 && <div className="step-line"/>}
            </div>
          ))}
        </div>

        {error && (
          <div className="submit-error">⚠️ {error}<button onClick={() => setError('')}>✕</button></div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="submit-card">
            <h2 className="submit-card-title">📋 Animation Details</h2>

            <div className="submit-form-grid">
              {/* Title */}
              <div className="form-group full">
                <label className="form-label">Animation Title <span className="required">*</span></label>
                <input
                  className="form-input"
                  placeholder="e.g. Neon Pulse Circle"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={60}
                />
                <span className="form-hint">{title.length}/60</span>
              </div>

              {/* Description */}
              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Tamari animation shu kare chhe te briefly lakho..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <span className="form-hint">{desc.length}/200</span>
              </div>

              {/* Category + BG Color */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  {categories.map(c => <option key={c.docId} value={c.name}>{c.name}</option>)}
                  <option value="Background">Background</option>
                  <option value="Front">Front</option>
                  <option value="Button">Button</option>
                  <option value="Text">Text</option>
                  <option value="Canvas">Canvas</option>
                  <option value="Particle">Particle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preview Background Color</label>
                <div className="color-row">
                  <input type="color" className="color-swatch" value={previewBg} onChange={e => setPreviewBg(e.target.value)}/>
                  <input className="form-input" value={previewBg} onChange={e => setPreviewBg(e.target.value)} placeholder="#0a0a0f"/>
                </div>
              </div>

              {/* Submitter info */}
              <div className="form-group">
                <label className="form-label">Tamaru Naam (optional)</label>
                <input className="form-input" placeholder="e.g. Raj Patel" value={name} onChange={e => setName(e.target.value)}/>
              </div>
              <div className="form-group">
                <label className="form-label">Email (optional — credit mate)</label>
                <input className="form-input" type="email" placeholder="you@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
            </div>

            <div className="submit-nav">
              <span/>
              <button className="btn-primary" onClick={() => { if (validateStep1()) setStep(2) }}>
                Code Lakho →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Code + Preview ── */}
        {step === 2 && (
          <div className="submit-card code-step">
            <h2 className="submit-card-title">💻 Code Lakho & Preview Juo</h2>

            {/* Info */}
            <div className="submit-info-bar">
              <span>🎨 <strong>{title}</strong></span>
              <span>📁 {category}</span>
              <span className="bg-preview-dot" style={{background: previewBg}}/> <code>{previewBg}</code>
            </div>

            {/* Split: Editor + Preview */}
            <div className="submit-split">
              <div className="submit-editor-pane">
                <CodeEditor
                  cssCode={cssCode}
                  jsCode={jsCode}
                  onCssChange={setCssCode}
                  onJsChange={setJsCode}
                  showCopyButtons={false}
                />
              </div>
              <div className="submit-preview-pane">
                <div className="submit-preview-label">👁️ Live Preview</div>
                <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={previewBg}/>
              </div>
            </div>

            {/* Tips */}
            <div className="submit-tips">
              <h4>💡 Tips</h4>
              <ul>
                <li>Container ID chhe <code>container</code> — JS ma <code>document.getElementById('container')</code> vapro</li>
                <li>Background color preview ma dakhshe — animation clear hovaaj joiye</li>
                <li>CSS animations performant rakhjo (<code>transform</code>, <code>opacity</code> best chhe)</li>
              </ul>
            </div>

            <div className="submit-nav">
              <button className="btn-secondary" onClick={() => setStep(1)}>← Pachha</button>
              <button
                className="btn-primary submit-final-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '⏳ Submitting...' : '🚀 Submit for Review'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
      }
          
