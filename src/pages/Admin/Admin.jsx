import { useState, useRef } from 'react'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor from '../../components/CodeEditor/CodeEditor.jsx'
import './Admin.css'

// ─── Default template ───────────────────────────────────────────────
const BLANK_CSS = `/* Tamari animation no CSS yahan likho */
.box {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 20px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`

const BLANK_JS = `const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;';
const box = document.createElement('div');
box.className = 'box';
c.appendChild(box);`

// ─── Slugify helper ──────────────────────────────────────────────────
function toId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Admin() {
  const [authed, setAuthed]       = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passErr, setPassErr]     = useState('')

  const [title, setTitle]         = useState('')
  const [desc, setDesc]           = useState('')
  const [category, setCategory]   = useState('Background')
  const [previewBg, setPreviewBg] = useState('#0a0a0f')
  const [cssCode, setCssCode]     = useState(BLANK_CSS)
  const [jsCode, setJsCode]       = useState(BLANK_JS)

  const [status, setStatus]       = useState(null)   // { type: 'ok'|'err', msg }
  const [loading, setLoading]     = useState(false)
  const [savedList, setSavedList] = useState([])

  const passRef = useRef()

  // ── Login ─────────────────────────────────────────────────────────
  function handleLogin(e) {
    e.preventDefault()
    // Client-side sanity: password env variable frontend ma nathi hoti
    // Real check server par thay chhe. Yahan sirf blank check.
    if (!passInput.trim()) { setPassErr('Password nakho'); return }
    setAuthed(true)
    fetchList()
  }

  // ── Fetch current animations list ────────────────────────────────
  async function fetchList() {
    try {
      // animationsData.json directly fetch karo (public asset)
      const r = await fetch('/src/animations/animationsData.json')
      if (r.ok) {
        const data = await r.json()
        setSavedList(data)
      }
    } catch (_) { /* silent */ }
  }

  // ── Save animation ───────────────────────────────────────────────
  async function handleSave() {
    if (!title.trim()) { setStatus({ type: 'err', msg: 'Title nakho!' }); return }
    if (!cssCode.trim()) { setStatus({ type: 'err', msg: 'CSS code nakho!' }); return }

    setLoading(true)
    setStatus(null)

    const animation = {
      id: toId(title),
      title: title.trim(),
      description: desc.trim() || title.trim(),
      category,
      previewBg,
      cssCode,
      jsCode
    }

    try {
      const res = await fetch('/api/save-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passInput, animation })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setStatus({ type: 'ok', msg: `✅ ${data.message}` })
      // Form reset
      setTitle(''); setDesc(''); setCssCode(BLANK_CSS); setJsCode(BLANK_JS)
      fetchList()
    } catch (err) {
      setStatus({ type: 'err', msg: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  // ── Delete animation ─────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm(`"${id}" delete karvu chhe?`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/save-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passInput, action: 'delete', animationId: id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus({ type: 'ok', msg: `✅ ${data.message}` })
      fetchList()
    } catch (err) {
      setStatus({ type: 'err', msg: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  // ── Load existing for edit ────────────────────────────────────────
  function handleEdit(anim) {
    setTitle(anim.title)
    setDesc(anim.description)
    setCategory(anim.category)
    setPreviewBg(anim.previewBg || '#0a0a0f')
    setCssCode(anim.cssCode)
    setJsCode(anim.jsCode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ══════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-logo">🔐</div>
          <h1>Admin Panel</h1>
          <p>AnimateX — Restricted Access</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              ref={passRef}
              type="password"
              placeholder="Password nakho..."
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              className="admin-input"
              autoFocus
            />
            {passErr && <span className="admin-err-msg">{passErr}</span>}
            <button type="submit" className="btn-primary admin-login-btn">
              Login →
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">⚙️ Admin Panel</h1>
          <p className="admin-subtitle">Animation add karo → auto deploy thase</p>
        </div>
        <button className="btn-secondary logout-btn" onClick={() => setAuthed(false)}>
          Logout
        </button>
      </div>

      <div className="admin-body container">

        {/* ── Status banner ── */}
        {status && (
          <div className={`status-banner ${status.type}`}>
            {status.msg}
            <button onClick={() => setStatus(null)}>✕</button>
          </div>
        )}

        {/* ── Form + Preview ── */}
        <div className="admin-top-grid">

          {/* Left: Form fields */}
          <div className="admin-form">
            <h2 className="section-label">📝 Animation Info</h2>

            <label className="admin-label">Title *</label>
            <input
              className="admin-input"
              placeholder="e.g. Neon Orbit"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <label className="admin-label">Description</label>
            <input
              className="admin-input"
              placeholder="Short description..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />

            <div className="admin-row">
              <div>
                <label className="admin-label">Category</label>
                <select
                  className="admin-input admin-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="Background">Background</option>
                  <option value="Front">Front</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Preview BG Color</label>
                <div className="color-pick-row">
                  <input
                    type="color"
                    className="admin-color-pick"
                    value={previewBg}
                    onChange={e => setPreviewBg(e.target.value)}
                  />
                  <input
                    className="admin-input"
                    value={previewBg}
                    onChange={e => setPreviewBg(e.target.value)}
                    placeholder="#0a0a0f"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="admin-id-preview">
              Generated ID: <code>{toId(title) || '...'}</code>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="admin-preview-wrap">
            <h2 className="section-label">👁️ Live Preview</h2>
            <LivePreview cssCode={cssCode} jsCode={jsCode} />
          </div>
        </div>

        {/* ── Code Editor ── */}
        <div className="admin-editor-wrap">
          <h2 className="section-label">💻 Code</h2>
          <CodeEditor
            cssCode={cssCode}
            jsCode={jsCode}
            onCssChange={setCssCode}
            onJsChange={setJsCode}
          />
        </div>

        {/* ── Save Button ── */}
        <div className="admin-save-row">
          <button
            className="btn-primary admin-save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : '🚀 Save & Deploy'}
          </button>
          <span className="admin-save-hint">
            Save thaya pachhi Vercel ~30 sec ma auto deploy kareshe
          </span>
        </div>

        {/* ── Saved Animations List ── */}
        {savedList.length > 0 && (
          <div className="admin-list-section">
            <h2 className="section-label">📦 Saved Animations ({savedList.length})</h2>
            <div className="admin-anim-list">
              {savedList.map(anim => (
                <div className="admin-anim-item" key={anim.id}>
                  <div className="anim-item-info">
                    <span className="anim-item-title">{anim.title}</span>
                    <span className={`anim-item-cat ${anim.category.toLowerCase()}`}>
                      {anim.category}
                    </span>
                  </div>
                  <div className="anim-item-actions">
                    <button
                      className="btn-secondary item-btn"
                      onClick={() => handleEdit(anim)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="item-btn delete-btn"
                      onClick={() => handleDelete(anim.id)}
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
        }
                 
