import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import { getAnimations, saveAnimation, deleteAnimation, getCategories, saveCategory, deleteCategory, generateTags, getSubmissions, approveSubmission, deleteSubmission } from '../../hooks/useAnimations.js'
import { getSiteContent, setSiteContent, defaultContent } from '../../hooks/useSiteContent.js'
import './Admin.css'

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
}

export default function Admin() {
  const { user, isAdmin, login, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('animations')

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

  const [catEdit,  setCatEdit]  = useState(null)
  const [catName,  setCatName]  = useState('')
  const [catOrder, setCatOrder] = useState(0)

  const [settings,      setSettings]      = useState(defaultContent)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Submissions — sirf pending j store karay
  const [submissions,  setSubmissions]  = useState([])
  const [reviewingId,  setReviewingId]  = useState(null)
  const [adminNote,    setAdminNote]    = useState('')
  const [subPreviewId, setSubPreviewId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { if (!loading && isAdmin) loadData() }, [isAdmin, loading])

  async function loadData() {
    const [anims, cats] = await Promise.all([getAnimations(), getCategories()])
    setAnimations(anims); setCategories(cats)
    const sc = await getSiteContent('main')
    if (sc) setSettings({ ...defaultContent, ...sc })
    try {
      // Sirf pending fetch kariye — approved/rejected nai
      const subs = await getSubmissions('pending')
      setSubmissions(subs)
    } catch(e) {}
  }

  function editAnim(anim) {
    setEditDocId(anim.docId); setTitle(anim.title); setDesc(anim.description||'')
    setCategory(anim.category); setPreviewBg(anim.previewBg||'#0a0a0f')
    setCssCode((anim.cssCode||'').trim()); setJsCode((anim.jsCode||'').trim())
    setStatus(null); setActiveTab('animations')
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  function resetForm() {
    setEditDocId(null); setTitle(''); setDesc(''); setCategory('Background')
    setPreviewBg('#0a0a0f'); setCssCode(''); setJsCode(''); setStatus(null)
  }

  async function handleSave() {
    if (!title.trim()) { setStatus({ type:'err', msg:'Title nakho!' }); return }
    if (!cssCode.trim() && !jsCode.trim()) { setStatus({ type:'err', msg:'Code nakho!' }); return }
    setSaving(true); setStatus(null)
    try {
      await saveAnimation({ docId:editDocId, title, description:desc, category, previewBg, cssCode, jsCode })
      setStatus({ type:'ok', msg:`✅ "${title}" saved! Turant live chhe.` })
      resetForm(); loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
    finally { setSaving(false) }
  }

  async function handleDelete(docId, t) {
    if (!window.confirm(`"${t}" delete karvu chhe?`)) return
    try { await deleteAnimation(docId); setStatus({ type:'ok', msg:`✅ "${t}" deleted!` }); if (editDocId===docId) resetForm(); loadData() }
    catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
  }

  function editCat(c) { setCatEdit(c.docId); setCatName(c.name); setCatOrder(c.order||0) }
  function resetCat()  { setCatEdit(null); setCatName(''); setCatOrder(0) }

  async function handleSaveCat() {
    if (!catName.trim()) return
    try { await saveCategory({ docId:catEdit, name:catName.trim(), order:Number(catOrder) }); setStatus({ type:'ok', msg:'✅ Category saved!' }); resetCat(); loadData() }
    catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
  }

  async function handleDeleteCat(docId, name) {
    if (!window.confirm(`"${name}" delete karvi?`)) return
    try { await deleteCategory(docId); loadData() } catch(e) {}
  }

  async function saveSettings() {
    try { await setSiteContent('main', settings); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000) }
    catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
  }

  // ── Approve: animations ma save + submission delete ──────
  async function handleApprove(sub) {
    setActionLoading(true)
    try {
      await approveSubmission(sub, adminNote)
      // Submission Firestore thi delete — storage bachao
      await deleteSubmission(sub.docId)
      setStatus({ type:'ok', msg:`✅ "${sub.title}" approved! Gallery ma live chhe.` })
      setReviewingId(null); setAdminNote(''); setSubPreviewId(null)
      loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
    finally { setActionLoading(false) }
  }

  // ── Reject: seedho delete — koi data nai rakho ──────────
  async function handleReject(sub) {
    setActionLoading(true)
    try {
      await deleteSubmission(sub.docId)
      setStatus({ type:'ok', msg:`"${sub.title}" reject karyu — Firestore thi delete thayu.` })
      setReviewingId(null); setAdminNote(''); setSubPreviewId(null)
      loadData()
    } catch(e) { setStatus({ type:'err', msg:`❌ ${e.message}` }) }
    finally { setActionLoading(false) }
  }

  if (loading) return <div className="admin-loading">⏳ Loading...</div>

  if (!user) return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">🔐</div>
        <h1>Admin Panel</h1>
        <p>MotionZync — Restricted Access</p>
        <p className="admin-login-hint">Sirf authorized Gmail thi access thay chhe</p>
        <button className="btn-primary admin-google-btn" onClick={login}><GoogleIcon/> Sign in with Google</button>
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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">⚙️ Admin Panel</h1>
          <p className="admin-subtitle">{editDocId ? '✏️ Editing animation' : 'MotionZync control panel'}</p>
        </div>
        <div className="header-actions">
          {editDocId && <button className="btn-secondary cancel-btn" onClick={resetForm}>✕ Cancel</button>}
          <img src={user.photoURL} className="admin-avatar" alt="" referrerPolicy="no-referrer"/>
          <button className="btn-secondary" onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>

      <div className="admin-tabs container">
        {['animations','categories','settings','submissions'].map(t => (
          <button key={t} className={`admin-tab-btn ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
            {t==='animations' ? '🎨 Animations' :
             t==='categories' ? '🗂️ Categories'  :
             t==='settings'   ? '⚙️ Settings'    : '📬 Submissions'}
            {t==='submissions' && submissions.length > 0 && (
              <span className="sub-badge-count">{submissions.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-body container">
        {status && <div className={`status-banner ${status.type}`}>{status.msg}<button onClick={() => setStatus(null)}>✕</button></div>}

        {/* ── Animations Tab ── */}
        {activeTab==='animations' && (<>
          <div className="admin-top-grid">
            <div className="admin-form">
              <h2 className="section-label">{editDocId?'✏️ Edit Animation':'📝 Navi Animation'}</h2>
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
              <div className="tags-preview">🏷️ Tags: {generateTags(title,desc).slice(0,6).map(t => <span key={t} className="tag-chip">#{t}</span>)}</div>
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
            <span className="admin-save-hint">Firestore ma save thay — turant live!</span>
          </div>
          <div className="admin-list-section">
            <h2 className="section-label">📦 All Animations ({animations.length})</h2>
            <div className="admin-anim-list">
              {animations.map(a => (
                <div className={`admin-anim-item ${editDocId===a.docId?'editing':''}`} key={a.docId}>
                  <div className="anim-item-info">
                    <div className="anim-item-dot" style={{background:a.previewBg||'#0a0a0f'}}/>
                    <span className="anim-item-title">{a.title}</span>
                    <span className="anim-item-cat">{a.category}</span>
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

        {/* ── Categories Tab ── */}
        {activeTab==='categories' && (
          <div className="categories-tab">
            <h2 className="section-label">🗂️ Categories</h2>
            <div className="cat-form">
              <input className="admin-input" placeholder="Category name..." value={catName} onChange={e => setCatName(e.target.value)} style={{flex:1}}/>
              <input className="admin-input" type="number" placeholder="Order" value={catOrder} onChange={e => setCatOrder(e.target.value)} style={{width:'80px'}}/>
              <button className="btn-primary" onClick={handleSaveCat}>{catEdit?'✏️ Update':'+ Add'}</button>
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

        {/* ── Settings Tab ── */}
        {activeTab==='settings' && (
          <div className="settings-tab">
            <h2 className="section-label">⚙️ Site Settings</h2>
            <div className="settings-grid">
              <div className="settings-group"><label className="admin-label">Home Page Title</label><input className="admin-input" value={settings.heroTitle} onChange={e => setSettings({...settings,heroTitle:e.target.value})}/></div>
              <div className="settings-group"><label className="admin-label">Home Page Subtitle</label><textarea className="admin-input admin-textarea" value={settings.heroSubtitle} onChange={e => setSettings({...settings,heroSubtitle:e.target.value})} rows={2}/></div>
              <div className="settings-group"><label className="admin-label">Contact Email</label><input className="admin-input" value={settings.contactEmail} onChange={e => setSettings({...settings,contactEmail:e.target.value})}/></div>
              <div className="settings-group"><label className="admin-label">Announcement Text</label><input className="admin-input" placeholder="Empty = hide" value={settings.announcementText||''} onChange={e => setSettings({...settings,announcementText:e.target.value})}/></div>
              <div className="settings-toggles">
                <label className="toggle-label"><input type="checkbox" checked={settings.enableWallpaper} onChange={e => setSettings({...settings,enableWallpaper:e.target.checked})}/> Enable Wallpaper Feature</label>
                <label className="toggle-label"><input type="checkbox" checked={settings.enableCourse} onChange={e => setSettings({...settings,enableCourse:e.target.checked})}/> Enable Course Page</label>
                <label className="toggle-label"><input type="checkbox" checked={settings.showAnnouncement||false} onChange={e => setSettings({...settings,showAnnouncement:e.target.checked})}/> Show Announcement Bar</label>
              </div>
            </div>
            <button className="btn-primary settings-save-btn" onClick={saveSettings}>{settingsSaved?'✅ Saved!':'💾 Save Settings'}</button>
          </div>
        )}

        {/* ── Submissions Tab ── */}
        {activeTab==='submissions' && (
          <div className="submissions-tab">
            <h2 className="section-label">📬 Pending Submissions</h2>

            {/* Info bar */}
            <div className="sub-info-bar">
              <span>⏳ <strong>{submissions.length}</strong> pending review</span>
              <span className="sub-info-note">
                ✅ Approve = Gallery ma live + Firestore thi delete &nbsp;|&nbsp;
                ❌ Reject = Seedho Firestore thi delete
              </span>
            </div>

            {submissions.length === 0 && (
              <div className="sub-empty">
                <div className="sub-empty-icon">🎉</div>
                <div>Badha submissions review thai gaya!</div>
                <div className="sub-empty-sub">Navi submissions avshe tyaare yahan dakhshe.</div>
              </div>
            )}

            <div className="sub-list">
              {submissions.map(sub => (
                <div key={sub.docId} className="sub-item">

                  {/* Header */}
                  <div className="sub-item-header">
                    <div className="sub-item-info">
                      <div className="sub-dot" style={{background: sub.previewBg||'#0a0a0f'}}/>
                      <div>
                        <div className="sub-title">{sub.title}</div>
                        <div className="sub-meta">
                          📁 {sub.category}
                          {sub.submitterName  && <> &nbsp;•&nbsp; 👤 {sub.submitterName}</>}
                          {sub.submitterEmail && <> &nbsp;•&nbsp; ✉️ {sub.submitterEmail}</>}
                          {sub.submittedAt    && <> &nbsp;•&nbsp; 🕐 {new Date(sub.submittedAt?.seconds ? sub.submittedAt.seconds*1000 : sub.submittedAt).toLocaleDateString('en-IN')}</>}
                        </div>
                      </div>
                    </div>
                    <span className="sub-pending-badge">⏳ Pending</span>
                  </div>

                  {sub.description && <p className="sub-desc">{sub.description}</p>}

                  {/* Preview toggle */}
                  <button
                    className="btn-secondary sub-preview-btn"
                    onClick={() => setSubPreviewId(subPreviewId===sub.docId ? null : sub.docId)}
                  >
                    {subPreviewId===sub.docId ? '▲ Preview Band Karo' : '👁️ Preview Juo'}
                  </button>

                  {subPreviewId===sub.docId && (
                    <div className="sub-preview-wrap">
                      <LivePreview cssCode={sub.cssCode} jsCode={sub.jsCode} bgColor={sub.previewBg}/>
                    </div>
                  )}

                  {/* Review panel */}
                  {reviewingId===sub.docId ? (
                    <div className="sub-review-form">
                      <textarea
                        className="admin-input admin-textarea"
                        placeholder="Admin note (optional — e.g. submitter credit, title suggestion...)"
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        rows={2}
                      />
                      <div className="sub-review-actions">
                        <button
                          className="btn-primary sub-approve-btn"
                          onClick={() => handleApprove(sub)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? '⏳ ...' : '✅ Approve & Publish'}
                        </button>
                        <button
                          className="sub-reject-btn"
                          onClick={() => handleReject(sub)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? '⏳ ...' : '❌ Reject & Delete'}
                        </button>
                        <button className="btn-secondary" onClick={() => {setReviewingId(null);setAdminNote('')}}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="sub-actions">
                      <button
                        className="btn-primary sub-review-open-btn"
                        onClick={() => {setReviewingId(sub.docId); setAdminNote(''); setSubPreviewId(sub.docId)}}
                      >
                        🔍 Review Karo
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
