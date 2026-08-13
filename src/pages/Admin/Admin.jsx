import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import {
  getAnimations, saveAnimation, deleteAnimation,
  getCategories, saveCategory, deleteCategory, generateTags,
  getSubmissions, approveSubmission, deleteSubmission,
  getChangelogs, saveChangelog, deleteChangelog,
} from '../../hooks/useAnimations.js'
import { getSiteContent, setSiteContent, defaultContent } from '../../hooks/useSiteContent.js'
import './Admin.css'

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
}

const TYPE_LABELS = { feature:'🚀 Feature', fix:'🐛 Fix', update:'🔄 Update', announcement:'📢 Announcement' }
const TYPE_COLORS = { feature:'#7c3aed', fix:'#ef4444', update:'#06b6d4', announcement:'#f59e0b' }

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

  // Submissions
  const [submissions,    setSubmissions]    = useState([])
  const [subLoadError,   setSubLoadError]   = useState(null)   // ✅ NEW
  const [subRefreshing,  setSubRefreshing]  = useState(false)  // ✅ NEW
  const [reviewingId,    setReviewingId]    = useState(null)
  const [adminNote,      setAdminNote]      = useState('')
  const [subPreviewId,   setSubPreviewId]   = useState(null)
  const [actionLoading,  setActionLoading]  = useState(false)

  // Changelog
  const [changelogs,    setChangelogs]    = useState([])
  const [clEditDocId,   setClEditDocId]   = useState(null)
  const [clVersion,     setClVersion]     = useState('v1.0')
  const [clTitle,       setClTitle]       = useState('')
  const [clDate,        setClDate]        = useState(new Date().toISOString().split('T')[0])
  const [clType,        setClType]        = useState('feature')
  const [clItemsText,   setClItemsText]   = useState('')
  const [clPinned,      setClPinned]      = useState(false)
  const [clSaving,      setClSaving]      = useState(false)

  // ✅ FIX: Submissions load SEPARATELY so a Firestore-rules error
  //         on 'submissions' does NOT block animations/categories loading.
  const loadSubmissions = useCallback(async (showSpinner = false) => {
    if (showSpinner) setSubRefreshing(true)
    setSubLoadError(null)
    try {
      const subs = await getSubmissions('pending')
      setSubmissions(subs)
    } catch (e) {
      console.error('Submissions load error:', e)
      setSubLoadError(e.message || 'Permission denied')
    } finally {
      if (showSpinner) setSubRefreshing(false)
    }
  }, [])

  // ✅ FIX: loadData no longer includes submissions in Promise.all
  async function loadData() {
    try {
      const [anims, cats, sc, cls] = await Promise.all([
        getAnimations(),
        getCategories(),
        getSiteContent('main'),
        getChangelogs(),
      ])
      setAnimations(anims)
      setCategories(cats)
      if (sc) setSettings({ ...defaultContent, ...sc })
      setChangelogs(cls)
    } catch (e) {
      console.error('loadData error:', e)
      setStatus({ type: 'err', msg: 'Data load error: ' + e.message })
    }
    // Load submissions separately — never blocks other data
    loadSubmissions()
  }

  useEffect(() => {
    if (!loading && isAdmin) loadData()
  }, [isAdmin, loading])

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

  // ── Submission handlers ──────────────────────────────────────
  async function handleApprove(sub) {
    setActionLoading(true)
    try {
      await approveSubmission(sub, adminNote)
      await deleteSubmission(sub.docId)
      setStatus({ type:'ok', msg:`✅ "${sub.title}" approved & gallery ma add thayuu!` })
      setSubmissions(prev=>prev.filter(s=>s.docId!==sub.docId))
      setReviewingId(null); setAdminNote('')
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setActionLoading(false); setTimeout(()=>setStatus(null),4000)
  }
  async function handleReject(sub) {
    if (!window.confirm(`"${sub.title}" reject karvu chhe?`)) return
    setActionLoading(true)
    try {
      await deleteSubmission(sub.docId)
      setStatus({ type:'ok', msg:`"${sub.title}" reject karyu.` })
      setSubmissions(prev=>prev.filter(s=>s.docId!==sub.docId))
      setReviewingId(null)
    } catch(e) { setStatus({type:'err',msg:'Error: '+e.message}) }
    setActionLoading(false); setTimeout(()=>setStatus(null),3000)
  }

  // ── Changelog handlers ───────────────────────────────────────
  function editCl(cl) {
    setClEditDocId(cl.docId); setClVersion(cl.version||'v1.0'); setClTitle(cl.title||'')
    setClDate(cl.date||new Date().toISOString().split('T')[0]); setClType(cl.type||'feature')
    setClItemsText((cl.items||[]).join('\n')); setClPinned(cl.pinned||false)
    window.scrollTo({top:0,behavior:'smooth'})
  }
  function resetCl() {
    setClEditDocId(null); setClVersion('v1.0'); setClTitle(''); setClType('feature')
    setClDate(new Date().toISOString().split('T')[0]); setClItemsText(''); setClPinned(false)
  }
  async function handleSaveCl() {
    if (!clTitle.trim()) { alert('Title required!'); return }
    setClSaving(true)
    const items = clItemsText.split('\n').map(s=>s.trim()).filter(Boolean)
    try {
      await saveChangelog({ docId:clEditDocId, version:clVersion, title:clTitle, date:clDate, type:clType, items, pinned:clPinned })
      const cls = await getChangelogs(); setChangelogs(cls); resetCl()
    } catch(e) { alert('Error: '+e.message) }
    setClSaving(false)
  }
  async function handleDeleteCl(docId, t) {
    if (!window.confirm(`Delete "${t}"?`)) return
    await deleteChangelog(docId); setChangelogs(prev=>prev.filter(c=>c.docId!==docId))
    if (clEditDocId===docId) resetCl()
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
        {['animations','categories','settings','submissions','changelog'].map(t => (
          <button key={t} className={`admin-tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>
            { t==='animations'   ? '🎬 Animations'
            : t==='categories'   ? '🗂️ Categories'
            : t==='settings'     ? '⚙️ Settings'
            : t==='submissions'  ? '📬 Submissions'
            :                      '📋 Changelog' }
            {t==='submissions' && submissions.length>0 && (
              <span className="sub-badge-count">{submissions.length}</span>
            )}
            {/* ✅ Show error dot if submissions failed to load */}
            {t==='submissions' && subLoadError && submissions.length===0 && (
              <span className="sub-badge-err">!</span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-content container">

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
                <label className="toggle-label"><input type="checkbox" checked={settings.enableWallpaper} onChange={e=>setSettings({...settings,enableWallpaper:e.target.checked})}/> Enable Wallpaper Feature</label>
                <label className="toggle-label"><input type="checkbox" checked={settings.enableCourse} onChange={e=>setSettings({...settings,enableCourse:e.target.checked})}/> Enable Course Page</label>
                <label className="toggle-label"><input type="checkbox" checked={settings.showAnnouncement||false} onChange={e=>setSettings({...settings,showAnnouncement:e.target.checked})}/> Show Announcement Bar</label>
              </div>
            </div>
            <button className="btn-primary settings-save-btn" onClick={saveSettings}>{settingsSaved?'✅ Saved!':'💾 Save Settings'}</button>
          </div>
        )}

        {/* ── Submissions Tab ── */}
        {activeTab==='submissions' && (
          <div className="submissions-tab">

            {/* ✅ Header row with refresh button */}
            <div className="sub-tab-header">
              <h2 className="section-label" style={{marginBottom:0}}>
                📬 Pending Submissions
                {submissions.length > 0 && (
                  <span className="sub-count-inline"> ({submissions.length})</span>
                )}
              </h2>
              <button
                className="btn-secondary sub-refresh-btn"
                onClick={() => loadSubmissions(true)}
                disabled={subRefreshing}
              >
                {subRefreshing ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {/* ✅ Firestore Rules Error — clear fix instructions */}
            {subLoadError && (
              <div className="sub-rules-error">
                <div className="sub-rules-error-title">⚠️ Submissions Load Thayi Nahi</div>
                <div className="sub-rules-error-msg">
                  <strong>Error:</strong> {subLoadError}
                </div>
                <div className="sub-rules-error-fix">
                  <strong>Fix:</strong> Firebase Console → Firestore → Rules ma aa rules add karo:
                </div>
                <pre className="sub-rules-code">{`match /submissions/{doc} {
  allow read, write: if true;
  // OR secure version:
  // allow read: if request.auth.token.email == "YOUR_ADMIN_EMAIL";
  // allow write: if true; // anyone can submit
}`}</pre>
                <button
                  className="btn-primary"
                  style={{marginTop:'0.75rem', fontSize:'0.82rem', padding:'0.5rem 1.1rem'}}
                  onClick={() => loadSubmissions(true)}
                >
                  🔄 Fari Try Karo
                </button>
              </div>
            )}

            {/* Normal info bar */}
            {!subLoadError && (
              <div className="sub-info-bar">
                <span>⏳ <strong>{submissions.length}</strong> pending review</span>
                <span className="sub-info-note">✅ Approve = Gallery ma live &nbsp;|&nbsp; ❌ Reject = Delete</span>
              </div>
            )}

            {!subLoadError && submissions.length===0 && !subRefreshing && (
              <div className="sub-empty">
                <div className="sub-empty-icon">🎉</div>
                <div>Badha submissions review thai gaya!</div>
                <div className="sub-empty-sub">Navi submissions avshe tyaare yahan dakhshe.</div>
              </div>
            )}

            {subRefreshing && submissions.length === 0 && (
              <div className="sub-empty">
                <div className="sub-empty-icon">⏳</div>
                <div>Submissions load thai rahi chhe...</div>
              </div>
            )}

            <div className="sub-list">
              {submissions.map(sub=>(
                <div key={sub.docId} className="sub-item">
                  <div className="sub-item-header">
                    <div className="sub-item-info">
                      <div className="sub-dot" style={{background:sub.previewBg||'#0a0a0f'}}/>
                      <div>
                        <div className="sub-title">{sub.title}</div>
                        <div className="sub-meta">
                          📁 {sub.category}
                          {sub.submitterName  && <> &nbsp;•&nbsp; 👤 {sub.submitterName}</>}
                          {sub.submitterEmail && <> &nbsp;•&nbsp; ✉️ {sub.submitterEmail}</>}
                          {sub.submittedAt    && <> &nbsp;•&nbsp; 🕐 {new Date(sub.submittedAt?.seconds?sub.submittedAt.seconds*1000:sub.submittedAt).toLocaleDateString('en-IN')}</>}
                        </div>
                      </div>
                    </div>
                    <span className="sub-pending-badge">⏳ Pending</span>
                  </div>
                  {sub.description && <p className="sub-desc">{sub.description}</p>}
                  <button className="btn-secondary sub-preview-btn" onClick={()=>setSubPreviewId(subPreviewId===sub.docId?null:sub.docId)}>
                    {subPreviewId===sub.docId?'▲ Preview Band Karo':'👁️ Preview Juo'}
                  </button>
                  {subPreviewId===sub.docId && (
                    <div className="sub-preview-wrap">
                      <LivePreview cssCode={sub.cssCode} jsCode={sub.jsCode} bgColor={sub.previewBg}/>
                    </div>
                  )}
                  {reviewingId===sub.docId ? (
                    <div className="sub-review-form">
                      <textarea className="admin-input admin-textarea" placeholder="Admin note (optional — credit/feedback)" value={adminNote} onChange={e=>setAdminNote(e.target.value)} rows={2}/>
                      <div className="sub-review-actions">
                        <button className="btn-primary sub-approve-btn" onClick={()=>handleApprove(sub)} disabled={actionLoading}>
                          {actionLoading?'⏳ ...':'✅ Approve & Gallery ma Add Karo'}
                        </button>
                        <button className="sub-reject-btn" onClick={()=>handleReject(sub)} disabled={actionLoading}>
                          {actionLoading?'⏳ ...':'❌ Reject & Delete'}
                        </button>
                        <button className="btn-secondary" onClick={()=>{setReviewingId(null);setAdminNote('')}}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="sub-actions">
                      <button className="btn-primary sub-review-open-btn" onClick={()=>{setReviewingId(sub.docId);setAdminNote('');setSubPreviewId(sub.docId)}}>
                        🔍 Review Karo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Changelog Tab ── */}
        {activeTab==='changelog' && (
          <div className="changelog-admin-tab">
            <h2 className="section-label">📋 Changelog Manager</h2>
            <div className="cl-form-card">
              <h3 className="cl-form-title">{clEditDocId?'✏️ Edit Entry':'+ New Entry'}</h3>
              <div className="cl-form-grid">
                <div className="cl-form-group">
                  <label className="admin-label">Version *</label>
                  <input className="admin-input" placeholder="v1.2" value={clVersion} onChange={e=>setClVersion(e.target.value)}/>
                </div>
                <div className="cl-form-group">
                  <label className="admin-label">Date</label>
                  <input className="admin-input" type="date" value={clDate} onChange={e=>setClDate(e.target.value)}/>
                </div>
                <div className="cl-form-group">
                  <label className="admin-label">Type</label>
                  <select className="admin-input admin-select" value={clType} onChange={e=>setClType(e.target.value)}>
                    <option value="feature">🚀 Feature</option>
                    <option value="fix">🐛 Fix</option>
                    <option value="update">🔄 Update</option>
                    <option value="announcement">📢 Announcement</option>
                  </select>
                </div>
                <div className="cl-form-group cl-form-span2">
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" placeholder="e.g. Gallery Sort + Download" value={clTitle} onChange={e=>setClTitle(e.target.value)}/>
                </div>
                <div className="cl-form-group cl-form-fullwidth">
                  <label className="admin-label">Items (ek line = ek item)</label>
                  <textarea
                    className="admin-input admin-textarea"
                    placeholder={"Sort by added to Gallery\nDownload CSS/JS/HTML from Detail page\nRelated animations by code similarity"}
                    value={clItemsText}
                    onChange={e=>setClItemsText(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="cl-form-group cl-form-fullwidth">
                  <label className="toggle-label">
                    <input type="checkbox" checked={clPinned} onChange={e=>setClPinned(e.target.checked)}/>
                    📌 Pin this entry (top ma dikhshe)
                  </label>
                </div>
              </div>
              <div className="cl-form-actions">
                <button className="btn-primary" onClick={handleSaveCl} disabled={clSaving}>
                  {clSaving?'⏳ Saving...':clEditDocId?'✏️ Update Entry':'🚀 Publish Entry'}
                </button>
                {clEditDocId && <button className="btn-secondary" onClick={resetCl}>Cancel</button>}
              </div>
            </div>
            <div className="cl-list">
              <h3 className="cl-list-title">📋 Published Entries ({changelogs.length})</h3>
              {changelogs.length===0 && (
                <div className="sub-empty">
                  <div className="sub-empty-icon">📋</div>
                  <div>Koi changelog entry nathi abhi tak.</div>
                  <div className="sub-empty-sub">Upar form thi pehli entry add karo.</div>
                </div>
              )}
              {changelogs.map(cl=>(
                <div key={cl.docId} className={`cl-list-item ${clEditDocId===cl.docId?'cl-editing':''}`}>
                  <div className="cl-item-left">
                    <span className="cl-version-badge">{cl.version}</span>
                    <span className="cl-type-badge" style={{background:TYPE_COLORS[cl.type]+'22',color:TYPE_COLORS[cl.type],border:`1px solid ${TYPE_COLORS[cl.type]}44`}}>
                      {TYPE_LABELS[cl.type]}
                    </span>
                    {cl.pinned && <span className="cl-pin-badge">📌 Pinned</span>}
                    <span className="cl-item-title">{cl.title}</span>
                    <span className="cl-item-date">{cl.date}</span>
                  </div>
                  <div className="cl-item-actions">
                    <button className="btn-secondary item-btn" onClick={()=>editCl(cl)}>✏️ Edit</button>
                    <button className="item-btn delete-btn" onClick={()=>handleDeleteCl(cl.docId,cl.title)}>🗑️</button>
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
            
 
