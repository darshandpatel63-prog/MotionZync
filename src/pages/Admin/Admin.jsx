import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import {
  getAnimations, saveAnimation, deleteAnimation,
  getCategories, saveCategory, deleteCategory, generateTags,
} from '../../hooks/useAnimations.js'
import { getSiteContent, setSiteContent, defaultContent } from '../../hooks/useSiteContent.js'
import './Admin.css'
import DesignIntelligenceAdminBilling from '../DesignIntelligence/DesignIntelligenceAdminBilling.jsx'

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
}


export default function Admin() {
  const { user, isAdmin, login, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('animations')

  // Animations
  const [editDocId, setEditDocId] = useState(null)
  const [title,     setTitle]     = useState('')
  const [desc,      setDesc]      = useState('')
  const [category,  setCategory]  = useState('Background')
  const [previewBg, setPreviewBg] = useState('#0a0a0f')
  const [cssCode,   setCssCode]   = useState('')
  const [jsCode,    setJsCode]    = useState('')
  const [animations, setAnimations] = useState([])
  const [categories, setCategories] = useState([])
  const [status,     setStatus]     = useState(null)
  const [saving,     setSaving]     = useState(false)

  // Categories
  const [catEdit,  setCatEdit]  = useState(null)
  const [catName,  setCatName]  = useState('')
  const [catOrder, setCatOrder] = useState(0)

  // Settings
  const [settings,      setSettings]      = useState(defaultContent)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // ── Animation handlers ───────────────────────────────────────
  function editAnim(a) {
    setEditDocId(a.docId); setTitle(a.title); setDesc(a.description||'')
    setCategory(a.category||'Background'); setPreviewBg(a.previewBg||'#0a0a0f')
    setCssCode(a.cssCode||''); setJsCode(a.jsCode||'')
    window.scrollTo({top:0,behavior:'smooth'})
  }
  function resetAnim() {
    setEditDocId(null); setTitle(''); setDesc(''); setCategory('Background')
    setPreviewBg('#0a0a0f'); setCssCode(''); setJsCode('')
  }
  async function handleSave() {
    if (!title.trim()) { setStatus({type:'err',msg:'Title required!'}); return }
    setSaving(true)
    try {
      const docId = await saveAnimation({ docId:editDocId, title, description:desc, category, previewBg, cssCode, jsCode })
      // Optimistic local update: the GitHub commit is done, but the live
      // site needs ~30-60s to redeploy, so re-fetching manifest.json right
      // now would still show the old version. Update the list from what we
      // just sent instead — it'll match exactly once the redeploy lands.
      const optimistic = {
        docId, title, description: desc, category, previewBg, cssCode, jsCode,
        tags: generateTags(title, desc), updatedAt: new Date().toISOString(),
      }
      setAnimations(prev => {
        const idx = prev.findIndex(a => a.docId === docId)
        if (idx === -1) return [optimistic, ...prev]
        const copy = [...prev]; copy[idx] = { ...copy[idx], ...optimistic }
        return copy
      })
      setStatus({ type:'ok', msg: (editDocId?`✅ "${title}" updated!`:`✅ "${title}" saved!`) + ' GitHub par commit thai gayu — live site ~30-60 sec ma update thashe.' })
      resetAnim()
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setSaving(false); setTimeout(()=>setStatus(null), 5000)
  }
  async function handleDelete(docId, t) {
    if (!window.confirm(`Delete "${t}"?`)) return
    try {
      await deleteAnimation(docId)
      setAnimations(prev=>prev.filter(a=>a.docId!==docId))
      if (editDocId===docId) resetAnim()
      setStatus({ type:'ok', msg:`🗑️ "${t}" deleted` })
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setTimeout(()=>setStatus(null), 3000)
  }

  // ── Category handlers ────────────────────────────────────────
  function editCat(c) { setCatEdit(c.docId); setCatName(c.name); setCatOrder(c.order||0) }
  function resetCat()  { setCatEdit(null); setCatName(''); setCatOrder(0) }
  async function handleSaveCat() {
    if (!catName.trim()) return
    try {
      await saveCategory({ docId:catEdit, name:catName, order:parseInt(catOrder)||0 })
      const cats = await getCategories(); setCategories(cats); resetCat()
      setStatus({ type:'ok', msg: catEdit ? '✅ Category updated!' : '✅ Category added!' })
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setTimeout(()=>setStatus(null), 3000)
  }
  async function handleDeleteCat(docId, name) {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await deleteCategory(docId)
      setCategories(prev=>prev.filter(c=>c.docId!==docId))
      setStatus({ type:'ok', msg:`🗑️ "${name}" category deleted` })
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setTimeout(()=>setStatus(null), 3000)
  }

  // ── Settings handler ─────────────────────────────────────────
  async function saveSettings() {
    try { await setSiteContent('main', settings); setSettingsSaved(true); setTimeout(()=>setSettingsSaved(false),3000) }
    catch(e) { alert('Error: '+e.message) }
  }

  // ── Login gate ───────────────────────────────────────────────
  if (loading) return <div className="admin-loading"><div className="admin-spinner"/></div>
  if (!user) return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">MotionZync Admin</h1>
        <p className="admin-login-sub">Google account thi login karo</p>
        <button className="google-login-btn" onClick={login}><GoogleIcon/> Sign in with Google</button>
      </div>
    </div>
  )
  if (!isAdmin) return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>🚫 Access Denied</h1>
        <p style={{color:'var(--text-secondary)',marginTop:'0.5rem'}}>Tame admin nathi.</p>
        <button className="btn-secondary" style={{marginTop:'1rem'}} onClick={()=>navigate('/')}>← Home</button>
      </div>
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <span className="admin-logo">⚙️ MotionZync Admin</span>
          <div className="admin-user">
            {user.photoURL && <img src={user.photoURL} className="admin-avatar" alt="avatar"/>}
            <span className="admin-email">{user.displayName||user.email}</span>
          </div>
        </div>
      </div>

      {status && (
        <div className={`admin-status-bar ${status.type==='ok'?'status-ok':'status-err'}`}>
          {status.msg}
          <button onClick={()=>setStatus(null)}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs container">
        {['animations','categories','settings','di-billing'].map(t => (
          <button key={t} className={`admin-tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>
            { t==='animations' ? '🎬 Animations'
            : t==='categories' ? '🗂️ Categories'
            : t==='settings' ? '⚙️ Settings'
            : '📊 DI Billing'
            }
          </button>
        ))}
      </div>

      <div className="admin-content container">

        {activeTab==='di-billing' && <DesignIntelligenceAdminBilling/>}

        {/* ── Animations Tab ── */}
        {activeTab==='animations' && (<>
          <div className="admin-top-grid">
            <div className="admin-form">
              <h2 className="section-label">{editDocId?'✏️ Edit Animation':'📝 Navi Animation'}</h2>
              <label className="admin-label">Title *</label>
              <input className="admin-input" placeholder="e.g. Neon Orbit" value={title} onChange={e=>setTitle(e.target.value)}/>
              <label className="admin-label">Description</label>
              <textarea className="admin-input admin-textarea" placeholder="Short description..." value={desc} onChange={e=>setDesc(e.target.value)} rows={2}/>
              <div className="admin-row">
                <div>
                  <label className="admin-label">Category</label>
                  <select className="admin-input admin-select" value={category} onChange={e=>setCategory(e.target.value)}>
                    {categories.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
                    <option value="Background">Background</option>
                    <option value="Front">Front</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Preview BG Color</label>
                  <div className="color-pick-row">
                    <input type="color" className="admin-color-pick" value={previewBg} onChange={e=>setPreviewBg(e.target.value)}/>
                    <input className="admin-input" value={previewBg} onChange={e=>setPreviewBg(e.target.value)} style={{flex:1}}/>
                  </div>
                </div>
              </div>
              <div className="tags-preview">🏷️ Tags: {generateTags(title,desc).slice(0,6).map(t=><span key={t} className="tag-chip">#{t}</span>)}</div>
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
              {saving?'⏳ Saving...':editDocId?'✏️ Update Animation':'🚀 Save to Firestore'}
            </button>
            {editDocId && <button className="btn-secondary" onClick={resetAnim}>Cancel Edit</button>}
            <span className="admin-save-hint">Firestore ma save thay — turant live!</span>
          </div>
          <div className="admin-list-section">
            <h2 className="section-label">📦 All Animations ({animations.length})</h2>
            <div className="admin-anim-list">
              {animations.map(a=>(
                <div className={`admin-anim-item ${editDocId===a.docId?'editing':''}`} key={a.docId}>
                  <div className="anim-item-info">
                    <div className="anim-item-dot" style={{background:a.previewBg||'#0a0a0f'}}/>
                    <span className="anim-item-title">{a.title}</span>
                    <span className="anim-item-cat">{a.category}</span>
                    {editDocId===a.docId && <span className="editing-tag">editing</span>}
                  </div>
                  <div className="anim-item-actions">
                    <button className="btn-secondary item-btn" onClick={()=>editAnim(a)}>✏️ Edit</button>
                    <button className="item-btn delete-btn" onClick={()=>handleDelete(a.docId,a.title)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ── Categories Tab ── */}
        {activeTab==='categories' && (
          <div className="categories-tab">
            <h2 className="section-label">🗂️ Categories</h2>
            <div className="cat-form">
              <input className="admin-input" placeholder="Category name..." value={catName} onChange={e=>setCatName(e.target.value)} style={{flex:1}}/>
              <input className="admin-input" type="number" placeholder="Order" value={catOrder} onChange={e=>setCatOrder(e.target.value)} style={{width:'80px'}}/>
              <button className="btn-primary" onClick={handleSaveCat}>{catEdit?'✏️ Update':'+ Add'}</button>
              {catEdit && <button className="btn-secondary" onClick={resetCat}>Cancel</button>}
            </div>
            <div className="cat-list">
              {categories.map(c=>(
                <div className="cat-item" key={c.docId}>
                  <span className="cat-item-name">{c.name}</span>
                  <span className="cat-item-order">order: {c.order}</span>
                  <div className="cat-item-actions">
                    <button className="btn-secondary item-btn" onClick={()=>editCat(c)}>✏️</button>
                    <button className="item-btn delete-btn" onClick={()=>handleDeleteCat(c.docId,c.name)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab==='settings' && (
          <div className="settings-tab">
            <h2 className="section-label">⚙️ Site Settings</h2>
            <div className="settings-grid">
              <div className="settings-group"><label className="admin-label">Home Page Title</label><input className="admin-input" value={settings.heroTitle} onChange={e=>setSettings({...settings,heroTitle:e.target.value})}/></div>
              <div className="settings-group"><label className="admin-label">Home Page Subtitle</label><textarea className="admin-input admin-textarea" value={settings.heroSubtitle} onChange={e=>setSettings({...settings,heroSubtitle:e.target.value})} rows={2}/></div>
              <div className="settings-group"><label className="admin-label">Contact Email</label><input className="admin-input" value={settings.contactEmail} onChange={e=>setSettings({...settings,contactEmail:e.target.value})}/></div>
              <div className="settings-group"><label className="admin-label">Announcement Text</label><input className="admin-input" placeholder="Empty = hide" value={settings.announcementText||''} onChange={e=>setSettings({...settings,announcementText:e.target.value})}/></div>
              <div className="settings-toggles">
                <label className="toggle-label"><input type="checkbox" checked={settings.enableCourse} onChange={e=>setSettings({...settings,enableCourse:e.target.checked})}/> Enable Course Page</label>
                <label className="toggle-label"><input type="checkbox" checked={settings.showAnnouncement||false} onChange={e=>setSettings({...settings,showAnnouncement:e.target.checked})}/> Show Announcement Bar</label>
              </div>
            </div>
            <button className="btn-primary settings-save-btn" onClick={saveSettings}>{settingsSaved?'✅ Saved!':'💾 Save Settings'}</button>
          </div>
        )}


      </div>
    </div>
  )
}
