import { useState, useRef, useEffect } from 'react'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor from '../../components/CodeEditor/CodeEditor.jsx'
import './Admin.css'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 10 * 60 * 1000

function toId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
function fmt(ms) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Admin() {
  const [authed,     setAuthed]     = useState(false)
  const [passInput,  setPassInput]  = useState('')
  const [passErr,    setPassErr]    = useState('')
  const [attempts,   setAttempts]   = useState(0)
  const [lockUntil,  setLockUntil]  = useState(null)
  const [remaining,  setRemaining]  = useState(0)
  const [verifying,  setVerifying]  = useState(false)
  const [savedPass,  setSavedPass]  = useState('')
  const timerRef = useRef(null)

  const [editId,     setEditId]     = useState(null)
  const [title,      setTitle]      = useState('')
  const [desc,       setDesc]       = useState('')
  const [category,   setCategory]   = useState('Background')
  const [previewBg,  setPreviewBg]  = useState('#0a0a0f')
  const [cssCode,    setCssCode]    = useState('')
  const [jsCode,     setJsCode]     = useState('')
  const [confirmPass,setConfirmPass]= useState('')

  const [status,     setStatus]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [savedList,  setSavedList]  = useState([])

  // Lockout countdown
  useEffect(() => {
    if (!lockUntil) return
    timerRef.current = setInterval(() => {
      const left = lockUntil - Date.now()
      if (left <= 0) {
        clearInterval(timerRef.current)
        setLockUntil(null); setRemaining(0); setAttempts(0); setPassErr('')
      } else { setRemaining(left) }
    }, 500)
    return () => clearInterval(timerRef.current)
  }, [lockUntil])

  async function handleLogin(e) {
    e.preventDefault()
    if (lockUntil || verifying) return
    if (!passInput.trim()) { setPassErr('Password nakho!'); return }
    setVerifying(true); setPassErr('')
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passInput })
      })
      if (res.ok) {
        setSavedPass(passInput)
        setAuthed(true); setAttempts(0); setPassInput('')
        fetchList()
      } else {
        const n = attempts + 1
        setAttempts(n)
        if (n >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS
          setLockUntil(until); setRemaining(LOCKOUT_MS)
          setPassErr(`${MAX_ATTEMPTS} vaar khoto password! 10 minute band.`)
        } else {
          setPassErr(`Khoto password! ${MAX_ATTEMPTS - n} try baki.`)
        }
        setPassInput('')
      }
    } catch { setPassErr('Server error — thodi var raho.') }
    finally { setVerifying(false) }
  }

  async function fetchList() {
    try {
      const r = await fetch('/src/animations/animationsData.json?t=' + Date.now())
      if (r.ok) setSavedList(await r.json())
    } catch (_) {}
  }

  function handleEdit(anim) {
    setEditId(anim.id)
    setTitle(anim.title)
    setDesc(anim.description || '')
    setCategory(anim.category)
    setPreviewBg(anim.previewBg || '#0a0a0f')
    setCssCode((anim.cssCode || '').trim())
    setJsCode((anim.jsCode || '').trim())
    setStatus(null); setConfirmPass('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditId(null); setTitle(''); setDesc('')
    setCategory('Background'); setPreviewBg('#0a0a0f')
    setCssCode(''); setJsCode('')
    setStatus(null); setConfirmPass('')
  }

  async function handleSave() {
    if (!title.trim()) { setStatus({ type: 'err', msg: 'Title nakho!' }); return }
    if (!cssCode.trim() && !jsCode.trim()) { setStatus({ type: 'err', msg: 'CSS ya JS code nakho!' }); return }
    if (!confirmPass.trim()) { setStatus({ type: 'err', msg: 'Save karva mate password confirm karo!' }); return }

    setLoading(true); setStatus(null)
    const animation = {
      id: editId || toId(title),
      title: title.trim(),
      description: desc.trim() || title.trim(),
      category, previewBg,
      cssCode: cssCode.trim(),
      jsCode: jsCode.trim()
    }
    try {
      const res = await fetch('/api/save-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: confirmPass, animation })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setStatus({ type: 'ok', msg: `✅ ${data.message}` })
      resetForm(); fetchList()
    } catch (err) { setStatus({ type: 'err', msg: `❌ ${err.message}` }) }
    finally { setLoading(false) }
  }

  async function handleDelete(id, titleName) {
    if (!window.confirm(`"${titleName}" delete karvu chhe?\nAa action undone nahi thay!`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/save-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: savedPass, action: 'delete', animationId: id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus({ type: 'ok', msg: `✅ "${titleName}" deleted!` })
      if (editId === id) resetForm()
      fetchList()
    } catch (err) { setStatus({ type: 'err', msg: `❌ ${err.message}` }) }
    finally { setLoading(false) }
  }

  // ── LOGIN SCREEN ────────────────────────────────────────────────
  if (!authed) {
    const locked = !!lockUntil
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-logo">{locked ? '🔒' : '🔐'}</div>
          <h1>Admin Panel</h1>
          <p>AnimateX — Restricted Access</p>
          {locked ? (
            <div className="lockout-box">
              <div className="lockout-timer">{fmt(remaining)}</div>
              <p>Vadhare prayash karva mate raho</p>
              <small>{MAX_ATTEMPTS} vaar khoto password — 10 minute band chhe</small>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="admin-login-form">
              <input
                type="password" placeholder="Password nakho..."
                value={passInput} onChange={e => setPassInput(e.target.value)}
                className="admin-input" autoFocus disabled={verifying}
              />
              {passErr && (
                <div className="admin-err-msg">
                  {passErr}
                  {attempts > 0 && attempts < MAX_ATTEMPTS && (
                    <span className="attempt-dots">
                      {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                        <span key={i} className={`dot ${i < attempts ? 'used' : ''}`} />
                      ))}
                    </span>
                  )}
                </div>
              )}
              <button type="submit" className="btn-primary admin-login-btn" disabled={verifying}>
                {verifying ? '⏳ Checking...' : 'Login →'}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // ── ADMIN PANEL ────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">⚙️ Admin Panel</h1>
          <p className="admin-subtitle">
            {editId ? `✏️ Editing: "${title || editId}"` : 'Navi animation add karo → auto deploy thase'}
          </p>
        </div>
        <div className="header-actions">
          {editId && <button className="btn-secondary cancel-edit-btn" onClick={resetForm}>✕ Cancel</button>}
          <button className="btn-secondary logout-btn" onClick={() => { setAuthed(false); setSavedPass('') }}>Logout</button>
        </div>
      </div>

      <div className="admin-body container">
        {status && (
          <div className={`status-banner ${status.type}`}>
            {status.msg}
            <button onClick={() => setStatus(null)}>✕</button>
          </div>
        )}

        <div className="admin-top-grid">
          <div className="admin-form">
            <h2 className="section-label">{editId ? '✏️ Animation Edit Karo' : '📝 Navi Animation'}</h2>
            <label className="admin-label">Title *</label>
            <input className="admin-input" placeholder="e.g. Neon Orbit" value={title} onChange={e => setTitle(e.target.value)} />
            <label className="admin-label">Description</label>
            <input className="admin-input" placeholder="Short description..." value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="admin-row">
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input admin-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Background">Background</option>
                  <option value="Front">Front</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Preview BG Color</label>
                <div className="color-pick-row">
                  <input type="color" className="admin-color-pick" value={previewBg} onChange={e => setPreviewBg(e.target.value)} />
                  <input className="admin-input" value={previewBg} onChange={e => setPreviewBg(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>
            <div className="admin-id-preview">
              ID: <code>{editId || toId(title) || '...'}</code>
              {editId && <span className="edit-badge">EDIT MODE</span>}
            </div>
          </div>

          <div className="admin-preview-wrap">
            <h2 className="section-label">👁️ Live Preview</h2>
            {/* bgColor prop pass karo - aa j fix chhe */}
            <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={previewBg} />
          </div>
        </div>

        <div className="admin-editor-wrap">
          <h2 className="section-label">💻 Code</h2>
          <CodeEditor cssCode={cssCode} jsCode={jsCode} onCssChange={setCssCode} onJsChange={setJsCode} />
        </div>

        <div className="admin-save-section">
          <div className="save-password-row">
            <input
              type="password" className="admin-input save-pass-input"
              placeholder="🔒 Password confirm karo..."
              value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
            />
            <button
              className={`btn-primary admin-save-btn ${editId ? 'edit-mode' : ''}`}
              onClick={handleSave} disabled={loading}
            >
              {loading ? '⏳ Saving...' : editId ? '✏️ Update Animation' : '🚀 Save & Deploy'}
            </button>
          </div>
          <span className="admin-save-hint">Save pachhi Vercel ~30 sec ma auto deploy kareshe</span>
        </div>

        {savedList.length > 0 && (
          <div className="admin-list-section">
            <h2 className="section-label">📦 Saved Animations ({savedList.length})</h2>
            <div className="admin-anim-list">
              {savedList.map(anim => (
                <div className={`admin-anim-item ${editId === anim.id ? 'editing' : ''}`} key={anim.id}>
                  <div className="anim-item-info">
                    <span className="anim-item-title">{anim.title}</span>
                    <span className={`anim-item-cat ${anim.category.toLowerCase()}`}>{anim.category}</span>
                    {editId === anim.id && <span className="editing-tag">editing</span>}
                  </div>
                  <div className="anim-item-actions">
                    <button className="btn-secondary item-btn" onClick={() => handleEdit(anim)} disabled={loading}>✏️ Edit</button>
                    <button className="item-btn delete-btn" onClick={() => handleDelete(anim.id, anim.title)} disabled={loading}>🗑️</button>
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
      
