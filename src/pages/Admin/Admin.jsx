import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import {
  getAnimations, saveAnimation, deleteAnimation,
  getCategories, saveCategory, deleteCategory, generateTags
} from '../../hooks/useAnimations.js'
import './Admin.css'

export default function Admin() {
  const { user, isAdmin, login, loading } = useAuth()
  const navigate = useNavigate()

  // ── Form state ────────────────────────────────────────────────
  const [editDocId,   setEditDocId]   = useState(null)
  const [title,       setTitle]       = useState('')
  const [desc,        setDesc]        = useState('')
  const [category,    setCategory]    = useState('Background')
  const [previewBg,   setPreviewBg]   = useState('#0a0a0f')
  const [cssCode,     setCssCode]     = useState('')
  const [jsCode,      setJsCode]      = useState('')

  // ── Data state ────────────────────────────────────────────────
  const [animations,  setAnimations]  = useState([])
  const [categories,  setCategories]  = useState([])
  const [status,      setStatus]      = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [activeTab,   setActiveTab]   = useState('animations') // 'animations' | 'categories'

  // ── Category form ─────────────────────────────────────────────
  const [catEdit,     setCatEdit]     = useState(null)
  const [catName,     setCatName]     = useState('')
  const [catOrder,    setCatOrder]    = useState(0)

  useEffect(() => {
    if (!loading && !isAdmin) return
    loadData()
  }, [isAdmin, loading])

  async function loadData() {
    const [anims, cats] = await Promise.all([getAnimations(), getCategories()])
    setAnimations(anims); setCategories(cats)
  }

  function editAnim(anim) {
    setEditDocId(anim.docId)
    setTitle(anim.title); setDesc(anim.description || '')
    setCategory(anim.category); setPreviewBg(anim.previewBg || '#0a0a0f')
    setCssCode((anim.cssCode || '').trim())
    setJsCode((anim.jsCode || '').trim())
    setStatus(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditDocId(null); setTitle(''); setDesc('')
    setCategory('Background'); setPreviewBg('#0a0a0f')
    setCssCode(''); setJsCode(''); setStatus(null)
  }

  async function handleSave() {
    if (!title.trim()) { setStatus({ type:'err', msg:'Title nakho!' }); return }
    if (!cssCode.trim() && !jsCode.trim()) { setStatus({ type:'err', msg:'Code nakho!' }); return }
    setSaving(true); setStatus(null)
    try {
      await saveAnimation({ docId: editDocId, title, description: desc, category, previewBg, cssCode, jsCode })
      setStatus({ type:'ok', msg:`✅ "${title}" saved! Gallery ma live chhe.` })
      resetForm(); loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
    finally { setSaving(false) }
  }

  async function handleDelete(docId, titleName) {
    if (!window.confirm(`"${titleName}" delete karvu chhe?`)) return
    try {
      await deleteAnimation(docId)
      setStatus({ type:'ok', msg:`✅ "${titleName}" deleted!` })
      if (editDocId === docId) resetForm()
      loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
  }

  // ── Category handlers ─────────────────────────────────────────
  function editCat(cat) { setCatEdit(cat.docId); setCatName(cat.name); setCatOrder(cat.order || 0) }
  function resetCat()   { setCatEdit(null); setCatName(''); setCatOrder(0) }

  async function handleSaveCat() {
    if (!catName.trim()) return
    try {
      await saveCategory({ docId: catEdit, name: catName.trim(), order: Number(catOrder) })
      setStatus({ type:'ok', msg:`✅ Category "${catName}" saved!` })
      resetCat(); loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
  }

  async function handleDeleteCat(docId, name) {
    if (!window.confirm(`"${name}" category delete karvi chhe?`)) return
    try { await deleteCategory(docId); loadData() } catch(e) { }
  }

  // ── Redirect if not admin ──────────────────────────────────────
  if (loading) return <div className="admin-loading">⏳ Loading...</div>

  if (!user) return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">🔐</div>
        <h1>Admin Panel</h1>
        <p>MotionZync — Restricted Access</p>
        <p className="admin-login-hint">Sirf authorized Gmail thi access thay chhe</p>
        <button className="btn-primary admin-google-btn" onClick={login}>
          <GoogleIcon/> Sign in with Google
        </button>
      </div>
    </div>
  )

  if (!isAdmin) return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">🚫</div>
        <h1>Access Denied</h1>
        <p>{user.email} ne admin access nathi.</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>← Home</button>
      </div>
    </div>
  )

  // ── ADMIN PANEL ────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">⚙️ Admin Panel</h1>
          <p className="admin-subtitle">{editDocId ? `✏️ Editing animation` : 'Navi animation add karo'}</p>
        </div>
        <div className="header-actions">
          {editDocId && <button className="btn-secondary cancel-btn" onClick={resetForm}>✕ Cancel</button>}
          <img src={user.photoURL} className="admin-avatar" alt="" referrerPolicy="no-referrer"/>
          <button className="btn-secondary" onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="admin-tabs container">
        <button className={`admin-tab-btn ${activeTab==='animations'?'active':''}`} onClick={() => setActiveTab('animations')}>🎨 Animations</button>
        <button className={`admin-tab-btn ${activeTab==='categories'?'active':''}`} onClick={() => setActiveTab('categories')}>🗂️ Categories</button>
      </div>

      <div className="admin-body container">
        {status && (
          <div className={`status-banner ${status.type}`}>
            {status.msg}<button onClick={() => setStatus(null)}>✕</button>
          </div>
        )}

        {/* ════ ANIMATIONS TAB ════ */}
        {activeTab === 'animations' && (<>
          <div className="admin-top-grid">
            <div className="admin-form">
              <h2 className="section-label">{editDocId ? '✏️ Edit Animation' : '📝 Navi Animation'}</h2>
              <label className="admin-label">Title *</label>
              <input className="admin-input" placeholder="e.g. Neon Orbit" value={title} onChange={e => setTitle(e.target.value)}/>
              <label className="admin-label">Description</label>
              <textarea className="admin-input admin-textarea" placeholder="Short description..." value={desc} onChange={e => setDesc(e.target.value)} rows={2}/>
              <div className="admin-row">
                <div>
                  <label className="admin-label">Category</label>
                  <select className="admin-input admin-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    <option value="Background">Background</option>
                    <option value="Front">Front</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Preview BG Color</label>
                  <div className="color-pick-row">
                    <input type="color" className="admin-color-pick" value={previewBg} onChange={e => setPreviewBg(e.target.value)}/>
                    <input className="admin-input" value={previewBg} onChange={e => setPreviewBg(e.target.value)} style={{flex:1}}/>
                  </div>
                </div>
              </div>
              {/* Auto tags preview */}
              <div className="tags-preview">
                🏷️ Auto tags: {generateTags(title, desc).slice(0,6).map(t => <span key={t} className="anim-tag">#{t}</span>)}
              </div>
            </div>

            <div className="admin-preview-wrap">
              <h2 className="section-label">👁️ Live Preview</h2>
              <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={previewBg}/>
            </div>
          </div>

          <div className="admin-editor-wrap">
            <h2 className="section-label">💻 Code</h2>
            <CodeEditor cssCode={cssCode} jsCode={jsCode} onCssChange={setCssCode} onJsChange={setJsCode}/>
          </div>

          <div className="admin-save-row">
            <button className={`btn-primary admin-save-btn ${editDocId?'edit-mode':''}`} onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : editDocId ? '✏️ Update Animation' : '🚀 Save to Firestore'}
            </button>
            <span className="admin-save-hint">Firestore ma save thay — turant live!</span>
          </div>

          {/* Animations list */}
          <div className="admin-list-section">
            <h2 className="section-label">📦 All Animations ({animations.length})</h2>
            <div className="admin-anim-list">
              {animations.map(a => (
                <div className={`admin-anim-item ${editDocId===a.docId?'editing':''}`} key={a.docId}>
                  <div className="anim-item-info">
                    <div className="anim-item-dot" style={{background: a.previewBg||'#0a0a0f'}}/>
                    <span className="anim-item-title">{a.title}</span>
                    <span className={`anim-item-cat ${(a.category||'').toLowerCase().replace(/\s/g,'-')}`}>{a.category}</span>
                    {editDocId===a.docId && <span className="editing-tag">editing</span>}
                  </div>
                  <div className="anim-item-actions">
                    <button className="btn-secondary item-btn" onClick={() => editAnim(a)}>✏️ Edit</button>
                    <button className="item-btn delete-btn" onClick={() => handleDelete(a.docId, a.title)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ════ CATEGORIES TAB ════ */}
        {activeTab === 'categories' && (
          <div className="categories-tab">
            <h2 className="section-label">🗂️ Categories Manage Karo</h2>
            <div className="cat-form">
              <input className="admin-input" placeholder="Category name..." value={catName} onChange={e => setCatName(e.target.value)} style={{flex:1}}/>
              <input className="admin-input" type="number" placeholder="Order" value={catOrder} onChange={e => setCatOrder(e.target.value)} style={{width:'80px'}}/>
              <button className="btn-primary" onClick={handleSaveCat}>{catEdit ? '✏️ Update' : '+ Add'}</button>
              {catEdit && <button className="btn-secondary" onClick={resetCat}>Cancel</button>}
            </div>
            <div className="cat-list">
              {categories.map(c => (
                <div className="cat-item" key={c.docId}>
                  <span className="cat-item-name">{c.name}</span>
                  <span className="cat-item-order">order: {c.order}</span>
                  <div className="cat-item-actions">
                    <button className="btn-secondary item-btn" onClick={() => editCat(c)}>✏️</button>
                    <button className="item-btn delete-btn" onClick={() => handleDeleteCat(c.docId, c.name)}>🗑️</button>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
                 }
      
