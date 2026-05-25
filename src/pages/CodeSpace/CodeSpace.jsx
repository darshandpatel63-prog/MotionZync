import { useState, useEffect, useRef, useCallback } from 'react'
import './CodeSpace.css'

// ─── localStorage helpers ────────────────────────────────────
const LS_KEY = 'mz_codespace_projects'

function loadProjects() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveProjects(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ─── URL share — encode/decode project ──────────────────────
function encodeProject(html, css, js) {
  const data = JSON.stringify({ h: html, c: css, j: js })
  try {
    return btoa(unescape(encodeURIComponent(data)))
  } catch { return '' }
}
function decodeProject(str) {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(str))))
    return { html: data.h || '', css: data.c || '', js: data.j || '' }
  } catch { return null }
}

// ─── Build preview HTML ──────────────────────────────────────
function buildPreview(html, css, js) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0a0a0f;color:#e2e8f0;font-family:system-ui,sans-serif;}
${css}
</style>
</head>
<body>
${html}
<script>
try{
${js}
}catch(e){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#ef4444;color:#fff;padding:8px 12px;font-size:12px;font-family:monospace;z-index:9999;';
  d.textContent='JS Error: '+e.message;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),4000);
}
</script>
</body>
</html>`
}

// ─── Default starter code ────────────────────────────────────
const DEFAULT_HTML = `<div class="scene">
  <div class="orb"></div>
  <h1 class="title">CodeSpace</h1>
  <p class="sub">Edit HTML, CSS & JS — live preview on right</p>
</div>`

const DEFAULT_CSS = `.scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.5rem;
  background: radial-gradient(ellipse at center, #1a0533 0%, #0a0a0f 70%);
}

.orb {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 40px rgba(124,58,237,0.5);
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-18px) scale(1.05); }
}

.title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub {
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  text-align: center;
  max-width: 280px;
  line-height: 1.6;
}`

const DEFAULT_JS = `// Your JavaScript here
// DOM is fully loaded when this runs

const orb = document.querySelector('.orb')

orb?.addEventListener('click', () => {
  orb.style.background = \`hsl(\${Math.random()*360},70%,60%)\`
})`

// ─── Animated background ─────────────────────────────────────
function CodeBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let t = 0, id
    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize, { passive: true })
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      for (let i = 0; i < 3; i++) {
        const x = cv.width * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i) * 80
        const y = cv.height * 0.5 + Math.cos(t * 0.3 + i) * 60
        const g = ctx.createRadialGradient(x, y, 0, x, y, 200 + i * 60)
        g.addColorStop(0, `hsla(${260 + i * 40},70%,50%,0.06)`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height)
      }
      t += 0.008; id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={cvRef} className="cs-bg-canvas" />
}

// ─── Projects sidebar ────────────────────────────────────────
function ProjectSidebar({ projects, activeId, onSelect, onCreate, onDelete, onRename }) {
  const [renaming, setRenaming] = useState(null)
  const [newName,  setNewName]  = useState('')

  function startRename(proj) {
    setRenaming(proj.id); setNewName(proj.name)
  }
  function commitRename(id) {
    if (newName.trim()) onRename(id, newName.trim())
    setRenaming(null)
  }

  return (
    <div className="cs-sidebar">
      <div className="cs-sidebar-header">
        <span className="cs-sidebar-title">📁 Projects</span>
        <button className="cs-new-btn" onClick={onCreate} title="New project">+</button>
      </div>

      <div className="cs-project-list">
        {projects.length === 0 && (
          <div className="cs-no-projects">No projects yet.<br/>Click + to create one.</div>
        )}
        {projects.map(p => (
          <div
            key={p.id}
            className={`cs-project-item ${p.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <span className="cs-project-dot" />
            {renaming === p.id ? (
              <input
                className="cs-rename-input"
                value={newName}
                autoFocus
                onChange={e => setNewName(e.target.value)}
                onBlur={() => commitRename(p.id)}
                onKeyDown={e => { if (e.key === 'Enter') commitRename(p.id); if (e.key === 'Escape') setRenaming(null) }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="cs-project-name">{p.name}</span>
            )}
            <div className="cs-project-actions">
              <button
                className="cs-proj-btn"
                onClick={e => { e.stopPropagation(); startRename(p) }}
                title="Rename"
              >✏️</button>
              <button
                className="cs-proj-btn cs-proj-del"
                onClick={e => { e.stopPropagation(); onDelete(p.id) }}
                title="Delete"
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cs-sidebar-footer">
        <span className="cs-storage-note">💾 Saved in browser storage</span>
      </div>
    </div>
  )
}

// ─── Tab bar for HTML/CSS/JS ─────────────────────────────────
function EditorTabs({ active, onChange, errors }) {
  const tabs = [
    { id: 'html', label: 'HTML', icon: '🌐', color: '#f97316' },
    { id: 'css',  label: 'CSS',  icon: '🎨', color: '#06b6d4' },
    { id: 'js',   label: 'JS',   icon: '⚡', color: '#f59e0b' },
  ]
  return (
    <div className="cs-editor-tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`cs-editor-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
          style={{ '--tab-color': t.color }}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
          {errors[t.id] && <span className="cs-tab-error">●</span>}
        </button>
      ))}
    </div>
  )
}

// ─── Simple code editor (textarea) ──────────────────────────
function CodePane({ value, onChange, language }) {
  const taRef      = useRef(null)
  const lineRef    = useRef(null)
  const [lines, setLines] = useState(1)

  useEffect(() => {
    setLines(value.split('\n').length)
  }, [value])

  function handleTab(e) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const ta    = taRef.current
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const next  = value.substring(0, start) + '  ' + value.substring(end)
    onChange(next)
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + 2
    })
  }

  function syncScroll() {
    if (lineRef.current && taRef.current) {
      lineRef.current.scrollTop = taRef.current.scrollTop
    }
  }

  return (
    <div className="cs-code-pane">
      <div ref={lineRef} className="cs-line-numbers" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="cs-line-num">{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        className={`cs-textarea cs-lang-${language}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleTab}
        onScroll={syncScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}

// ─── Preview pane ────────────────────────────────────────────
function PreviewPane({ html, css, js, refreshKey }) {
  const iframeRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const iframe = iframeRef.current; if (!iframe) return
    setLoading(true)
    const src = buildPreview(html, css, js)
    iframe.srcdoc = src
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [refreshKey])

  return (
    <div className="cs-preview-pane">
      <div className="cs-preview-topbar">
        <div className="cs-browser-dots">
          <span className="cs-bd cs-bd-r" /><span className="cs-bd cs-bd-y" /><span className="cs-bd cs-bd-g" />
        </div>
        <div className="cs-browser-url">
          <span>🔒</span> codespace / preview
        </div>
        {loading && <div className="cs-preview-loading"><div className="cs-spin" /></div>}
        <div className="cs-preview-live"><span className="cs-live-dot" />LIVE</div>
      </div>
      <iframe
        ref={iframeRef}
        className="cs-preview-iframe"
        sandbox="allow-scripts allow-same-origin"
        title="preview"
      />
    </div>
  )
}

// ─── Toolbar ────────────────────────────────────────────────
function Toolbar({ project, onSave, onShare, onRun, saved, shared, layout, onLayout, onFullscreen }) {
  return (
    <div className="cs-toolbar">
      <div className="cs-toolbar-left">
        <span className="cs-toolbar-project-name">{project?.name || 'Untitled'}</span>
        {saved && <span className="cs-saved-badge">✓ Saved</span>}
      </div>
      <div className="cs-toolbar-center">
        <button className="cs-tool-btn cs-run-btn" onClick={onRun} title="Run (Ctrl+Enter)">
          ▶ Run
        </button>
      </div>
      <div className="cs-toolbar-right">
        {/* Layout toggle */}
        <div className="cs-layout-btns">
          <button
            className={`cs-layout-btn ${layout === 'split' ? 'active' : ''}`}
            onClick={() => onLayout('split')}
            title="Split view"
          >⬜⬜</button>
          <button
            className={`cs-layout-btn ${layout === 'editor' ? 'active' : ''}`}
            onClick={() => onLayout('editor')}
            title="Editor only"
          >⬜</button>
          <button
            className={`cs-layout-btn ${layout === 'preview' ? 'active' : ''}`}
            onClick={() => onLayout('preview')}
            title="Preview only"
          >▶</button>
        </div>
        <button className="cs-tool-btn" onClick={onSave} title="Save project">
          💾 Save
        </button>
        <button className={`cs-tool-btn ${shared ? 'cs-btn-success' : ''}`} onClick={onShare} title="Copy shareable link">
          {shared ? '✅ Copied!' : '🔗 Share'}
        </button>
        <button className="cs-tool-btn" onClick={onFullscreen} title="Fullscreen preview">
          ⛶
        </button>
      </div>
    </div>
  )
}

// ─── Fullscreen preview modal ─────────────────────────────────
function FullscreenModal({ html, css, js, onClose }) {
  const iframeRef = useRef(null)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = buildPreview(html, css, js)
    }, 80)
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t); document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [])
  return (
    <div className="cs-fs-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cs-fs-container">
        <div className="cs-fs-bar">
          <span className="cs-fs-label">⛶ Fullscreen Preview</span>
          <span className="cs-fs-esc">ESC to close</span>
          <button className="cs-fs-close" onClick={onClose}>✕</button>
        </div>
        <iframe ref={iframeRef} className="cs-fs-iframe" sandbox="allow-scripts allow-same-origin" title="fs"/>
      </div>
    </div>
  )
}

// ─── Version history ─────────────────────────────────────────
function VersionHistory({ versions, onRestore }) {
  if (versions.length === 0) return (
    <div className="cs-no-versions">No saved versions yet. Click Save to create one.</div>
  )
  return (
    <div className="cs-version-list">
      {versions.slice().reverse().map((v, i) => (
        <div key={v.ts} className="cs-version-item">
          <div className="cs-version-info">
            <span className="cs-version-num">v{versions.length - i}</span>
            <span className="cs-version-time">{new Date(v.ts).toLocaleString()}</span>
          </div>
          <button className="cs-tool-btn cs-restore-btn" onClick={() => onRestore(v)}>
            ↩ Restore
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Main CodeSpace ───────────────────────────────────────────
export default function CodeSpace() {
  const [projects,    setProjects]    = useState(() => loadProjects())
  const [activeId,    setActiveId]    = useState(() => {
    const p = loadProjects(); return p.length > 0 ? p[0].id : null
  })
  const [html,        setHtml]        = useState(DEFAULT_HTML)
  const [css,         setCss]         = useState(DEFAULT_CSS)
  const [js,          setJs]          = useState(DEFAULT_JS)
  const [activeTab,   setActiveTab]   = useState('html')
  const [layout,      setLayout]      = useState('split')
  const [refreshKey,  setRefreshKey]  = useState(0)
  const [saved,       setSaved]       = useState(false)
  const [shared,      setShared]      = useState(false)
  const [fullscreen,  setFullscreen]  = useState(false)
  const [rightTab,    setRightTab]    = useState('preview') // 'preview' | 'history'
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeProject = projects.find(p => p.id === activeId)

  // Load project from active id
  useEffect(() => {
    if (!activeId) {
      // No projects — show defaults
      setHtml(DEFAULT_HTML); setCss(DEFAULT_CSS); setJs(DEFAULT_JS); return
    }
    const p = projects.find(x => x.id === activeId)
    if (p) { setHtml(p.html); setCss(p.css); setJs(p.js) }
  }, [activeId])

  // Check URL for shared project (?cs=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('cs')
    if (encoded) {
      const decoded = decodeProject(encoded)
      if (decoded) {
        setHtml(decoded.html); setCss(decoded.css); setJs(decoded.js)
        setRefreshKey(k => k + 1)
        // Clear param from URL
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  // Auto-run on code change (debounced 800ms)
  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setRefreshKey(k => k + 1), 800)
    return () => clearTimeout(debounceRef.current)
  }, [html, css, js])

  // Keyboard shortcut Ctrl+S = save, Ctrl+Enter = run
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); setRefreshKey(k => k + 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [html, css, js, activeId, projects])

  function handleCreate() {
    const id = genId()
    const name = `Project ${projects.length + 1}`
    const newProj = { id, name, html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS, versions: [], createdAt: Date.now() }
    const next = [newProj, ...projects]
    setProjects(next); saveProjects(next)
    setActiveId(id)
    setHtml(DEFAULT_HTML); setCss(DEFAULT_CSS); setJs(DEFAULT_JS)
  }

  function handleSelect(id) {
    setActiveId(id)
    const p = projects.find(x => x.id === id)
    if (p) { setHtml(p.html); setCss(p.css); setJs(p.js); setRefreshKey(k => k + 1) }
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return
    const next = projects.filter(p => p.id !== id)
    setProjects(next); saveProjects(next)
    if (activeId === id) {
      const first = next[0]
      setActiveId(first?.id || null)
      if (first) { setHtml(first.html); setCss(first.css); setJs(first.js) }
      else { setHtml(DEFAULT_HTML); setCss(DEFAULT_CSS); setJs(DEFAULT_JS) }
    }
  }

  function handleRename(id, name) {
    const next = projects.map(p => p.id === id ? { ...p, name } : p)
    setProjects(next); saveProjects(next)
  }

  function handleSave() {
    const versions = (activeProject?.versions || []).slice(-9) // keep last 10
    const snapshot = { ts: Date.now(), html, css, js }
    const updated  = { ...activeProject, html, css, js, versions: [...versions, snapshot], updatedAt: Date.now() }
    let next
    if (activeId) {
      next = projects.map(p => p.id === activeId ? updated : p)
    } else {
      const id = genId()
      const newProj = { id, name: 'Project 1', html, css, js, versions: [snapshot], createdAt: Date.now() }
      next = [newProj, ...projects]
      setActiveId(id)
    }
    setProjects(next); saveProjects(next)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  function handleShare() {
    const encoded = encodeProject(html, css, js)
    const url = `${window.location.origin}/codespace?cs=${encoded}`
    navigator.clipboard.writeText(url)
    setShared(true); setTimeout(() => setShared(false), 2500)
  }

  function handleRestore(version) {
    setHtml(version.html); setCss(version.css); setJs(version.js)
    setRefreshKey(k => k + 1)
  }

  const versions = activeProject?.versions || []

  return (
    <div className="cs-page">
      <CodeBg />

      <div className="cs-wrapper">
        {/* Sidebar toggle (mobile) */}
        <button className="cs-sidebar-toggle" onClick={() => setSidebarOpen(p => !p)}>
          {sidebarOpen ? '◀ Hide' : '▶ Projects'}
        </button>

        {/* Projects sidebar */}
        {sidebarOpen && (
          <ProjectSidebar
            projects={projects}
            activeId={activeId}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}

        {/* Main editor area */}
        <div className="cs-main">
          {/* Toolbar */}
          <Toolbar
            project={activeProject}
            onSave={handleSave}
            onShare={handleShare}
            onRun={() => setRefreshKey(k => k + 1)}
            saved={saved}
            shared={shared}
            layout={layout}
            onLayout={setLayout}
            onFullscreen={() => setFullscreen(true)}
          />

          {/* Editor + Preview */}
          <div className={`cs-content cs-layout-${layout}`}>
            {/* Editor column */}
            {layout !== 'preview' && (
              <div className="cs-editor-col">
                <EditorTabs active={activeTab} onChange={setActiveTab} errors={{}} />
                {activeTab === 'html' && <CodePane value={html} onChange={setHtml} language="html" />}
                {activeTab === 'css'  && <CodePane value={css}  onChange={setCss}  language="css"  />}
                {activeTab === 'js'   && <CodePane value={js}   onChange={setJs}   language="js"   />}
              </div>
            )}

            {/* Preview + History column */}
            {layout !== 'editor' && (
              <div className="cs-preview-col">
                <div className="cs-right-tabs">
                  <button
                    className={`cs-right-tab ${rightTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setRightTab('preview')}
                  >▶ Preview</button>
                  <button
                    className={`cs-right-tab ${rightTab === 'history' ? 'active' : ''}`}
                    onClick={() => setRightTab('history')}
                  >🕐 History {versions.length > 0 && `(${versions.length})`}</button>
                </div>

                {rightTab === 'preview' && (
                  <PreviewPane html={html} css={css} js={js} refreshKey={refreshKey} />
                )}
                {rightTab === 'history' && (
                  <div className="cs-history-pane">
                    <VersionHistory versions={versions} onRestore={handleRestore} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {fullscreen && (
        <FullscreenModal html={html} css={css} js={js} onClose={() => setFullscreen(false)} />
      )}
    </div>
  )
}
