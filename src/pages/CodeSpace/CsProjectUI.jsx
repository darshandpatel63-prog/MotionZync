// ============================================================
// CsProjectUI.jsx  –  Title bar, tabs, status bar, project switcher
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { getLangFromExt } from './cs-filesystem.js'

// ── Animated bg canvas ────────────────────────────────────────
export function CodeBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d'); let t = 0, id
    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize, { passive: true })
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      for (let i = 0; i < 4; i++) {
        const x = cv.width  * (0.15 + i * 0.25) + Math.sin(t * 0.3 + i * 1.2) * 100
        const y = cv.height * 0.5               + Math.cos(t * 0.2 + i * 0.9) * 80
        const g = ctx.createRadialGradient(x, y, 0, x, y, 250 + i * 50)
        g.addColorStop(0, `hsla(${250 + i * 35},70%,55%,0.05)`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height)
      }
      t += 0.006; id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={cvRef} className="cs2-bg-canvas" />
}

// ── Project Card (welcome screen) ─────────────────────────────
export function ProjectCard({ project, isActive, onOpen, onDelete, onRename }) {
  const [renaming, setRenaming] = useState(false)
  const [name, setName]         = useState(project.name)
  const lang      = project.entry ? getLangFromExt(project.entry) : { icon: '📦', color: '#7c3aed' }
  const fileCount = Object.keys(project.files || {}).length

  function commit() {
    if (name.trim() && name !== project.name) onRename(project.id, name.trim())
    setRenaming(false)
  }

  return (
    <div className={`cs2-proj-card ${isActive ? 'active' : ''}`} onClick={() => onOpen(project.id)}>
      <div className="cs2-proj-card-icon" style={{ color: lang.color }}>{lang.icon}</div>
      <div className="cs2-proj-card-body">
        {renaming ? (
          <input className="cs2-proj-rename" value={name} autoFocus
            onChange={e => setName(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setRenaming(false) }}
            onClick={e => e.stopPropagation()} />
        ) : <div className="cs2-proj-name">{project.name}</div>}
        <div className="cs2-proj-meta">
          {fileCount} file{fileCount !== 1 ? 's' : ''} · {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'New'}
        </div>
      </div>
      <div className="cs2-proj-actions" onClick={e => e.stopPropagation()}>
        <button onClick={() => setRenaming(true)} title="Rename">✏️</button>
        <button onClick={() => onDelete(project.id)} title="Delete" className="cs2-proj-del">🗑️</button>
      </div>
    </div>
  )
}

// ── Project Switcher Dropdown ─────────────────────────────────
export function ProjectSwitcher({ projects, activeProj, onSwitch, onNew, onDelete, onRename }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="cs2-proj-switcher-wrap">
      <button className="cs2-proj-switcher-btn" onClick={() => setOpen(p => !p)} title="Switch project">
        <span className="cs2-proj-switcher-name">{activeProj?.name || 'No project'}</span>
        <span className="cs2-proj-switcher-arrow">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="cs2-proj-dropdown">
          <div className="cs2-proj-dropdown-header">
            <span>PROJECTS</span>
            <button className="cs2-proj-new-btn" onClick={() => { onNew(); setOpen(false) }}>＋ New</button>
          </div>
          <div className="cs2-proj-dropdown-list">
            {projects.length === 0 && (
              <div className="cs2-proj-dropdown-empty">No projects yet</div>
            )}
            {projects.map(p => (
              <div key={p.id}
                className={`cs2-proj-dropdown-item ${activeProj?.id === p.id ? 'active' : ''}`}
                onClick={() => { onSwitch(p.id); setOpen(false) }}>
                <span className="cs2-proj-dropdown-icon">
                  {p.entry ? getLangFromExt(p.entry).icon : '📦'}
                </span>
                <div className="cs2-proj-dropdown-info">
                  <span className="cs2-proj-dropdown-name">{p.name}</span>
                  <span className="cs2-proj-dropdown-meta">
                    {Object.keys(p.files || {}).length} files · {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                  </span>
                </div>
                {activeProj?.id === p.id && <span className="cs2-proj-current-dot">●</span>}
                <button className="cs2-proj-dropdown-del"
                  onClick={e => { e.stopPropagation(); onDelete(p.id) }}
                  title="Delete">🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Welcome screen ─────────────────────────────────────────────
export function WelcomeScreen({ projects, onNewProject, onOpenProject, onDeleteProject, onRenameProject }) {
  return (
    <div className="cs2-welcome">
      <div className="cs2-welcome-content">
        <div className="cs2-welcome-logo">⚡</div>
        <h1 className="cs2-welcome-title">CodeSpace IDE</h1>
        <p className="cs2-welcome-sub">VS Code + GitHub + Vercel — fully in your browser</p>
        <div className="cs2-welcome-actions">
          <button className="cs2-welcome-btn cs2-welcome-primary" onClick={onNewProject}>🚀 New Project</button>
          {projects.length > 0 && (
            <button className="cs2-welcome-btn" onClick={() => onOpenProject(projects[0].id)}>📂 Open Recent</button>
          )}
        </div>
        {projects.length > 0 && (
          <div className="cs2-recent-projects">
            <div className="cs2-recent-label">RECENT PROJECTS</div>
            {projects.slice(0, 6).map(p => (
              <ProjectCard key={p.id} project={p} isActive={false}
                onOpen={onOpenProject} onDelete={onDeleteProject} onRename={onRenameProject} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab Bar ────────────────────────────────────────────────────
export function TabBar({ tabs, activeTab, onActivate, onClose }) {
  return (
    <div className="cs2-tabbar">
      {tabs.map(tab => {
        const lang     = getLangFromExt(tab.path)
        const filename = tab.path.split('/').pop()
        return (
          <div key={tab.path}
            className={`cs2-tab ${tab.path === activeTab ? 'active' : ''} ${tab.dirty ? 'dirty' : ''}`}
            onClick={() => onActivate(tab.path)} title={tab.path}>
            <span className="cs2-tab-icon" style={{ color: lang.color }}>{lang.icon}</span>
            <span className="cs2-tab-name">{filename}</span>
            {tab.dirty && <span className="cs2-tab-dirty">●</span>}
            <button className="cs2-tab-close"
              onClick={e => { e.stopPropagation(); onClose(tab.path) }}>✕</button>
          </div>
        )
      })}
    </div>
  )
}

// ── Breadcrumb ────────────────────────────────────────────────
export function Breadcrumb({ path, onSplit }) {
  const lang = getLangFromExt(path)
  return (
    <div className="cs2-breadcrumb">
      {path.split('/').map((part, i, arr) => (
        <span key={i}>
          <span className={i === arr.length - 1 ? 'cs2-breadcrumb-active' : 'cs2-breadcrumb-dir'}>{part}</span>
          {i < arr.length - 1 && <span className="cs2-breadcrumb-sep"> / </span>}
        </span>
      ))}
      <div className="cs2-breadcrumb-right">
        <span className="cs2-lang-badge">{lang.label}</span>
        <button className="cs2-split-btn" onClick={onSplit} title="Split Editor">⬜⬜</button>
      </div>
    </div>
  )
}

// ── Status Bar ─────────────────────────────────────────────────
export function StatusBar({ saveStatus, projectName, activeFile, cursorPos }) {
  const lang = activeFile ? getLangFromExt(activeFile) : null
  return (
    <div className="cs2-statusbar">
      <div className="cs2-statusbar-left">
        <span className="cs2-statusbar-item cs2-status-branch">⎇ main</span>
        {saveStatus === 'saving' && <span className="cs2-statusbar-item cs2-status-saving">⏳ Saving...</span>}
        {saveStatus === 'saved'  && <span className="cs2-statusbar-item cs2-status-saved">✓ Saved</span>}
        {saveStatus === 'error'  && <span className="cs2-statusbar-item cs2-status-error">✗ Save failed</span>}
      </div>
      <div className="cs2-statusbar-center">
        {projectName && <span className="cs2-statusbar-item">📦 {projectName}</span>}
      </div>
      <div className="cs2-statusbar-right">
        {lang && <span className="cs2-statusbar-item">{lang.label}</span>}
        {activeFile && <span className="cs2-statusbar-item">Ln {cursorPos.line}, Col {cursorPos.col}</span>}
        <span className="cs2-statusbar-item">UTF-8</span>
        <span className="cs2-statusbar-item">Spaces: 2</span>
      </div>
    </div>
  )
}

// ── Activity Bar ───────────────────────────────────────────────
const ACTIVITIES = [
  { id: 'explorer', icon: '📁', title: 'Explorer' },
  { id: 'git',      icon: '⎇',  title: 'Source Control' },
  { id: 'search',   icon: '🔍', title: 'Search' },
  { id: 'ai',       icon: '✨', title: 'AI Assistant' },
]

export function ActivityBar({ active, onSelect, terminalOpen, previewOpen, onTerminal, onPreview, onSettings }) {
  return (
    <div className="cs2-activity-bar">
      {ACTIVITIES.map(a => (
        <button key={a.id} className={`cs2-activity-btn ${active === a.id ? 'active' : ''}`}
          title={a.title} onClick={() => onSelect(a.id)}>{a.icon}</button>
      ))}
      <div className="cs2-activity-spacer" />
      <button className={`cs2-activity-btn ${terminalOpen ? 'active' : ''}`} title="Terminal (Ctrl+`)" onClick={onTerminal}>⚡</button>
      <button className={`cs2-activity-btn ${previewOpen ? 'active' : ''}`}  title="Preview" onClick={onPreview}>👁</button>
      <button className="cs2-activity-btn" title="Settings" onClick={onSettings}>⚙️</button>
    </div>
  )
}

// ── Title Bar ──────────────────────────────────────────────────
export function TitleBar({ projects, activeProj, saveStatus, onPalette, onSwitch, onNew, onSave, onShare, onExport, onEnv, onZen, onSettings, onDeleteProject, onRenameProject, onMenuToggle }) {
  return (
    <div className="cs2-titlebar">
      <div className="cs2-titlebar-left">
        <button className="cs2-tb-btn cs2-mobile-only cs2-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">☰</button>
        <div className="cs2-logo">
          <span className="cs2-logo-icon">⚡</span>
          <span className="cs2-logo-text">CodeSpace</span>
        </div>
        <ProjectSwitcher
          projects={projects} activeProj={activeProj}
          onSwitch={onSwitch} onNew={onNew}
          onDelete={onDeleteProject} onRename={onRenameProject}
        />
      </div>

      <button className="cs2-palette-trigger" onClick={onPalette} title="Command Palette (Ctrl+P)">
        🔍 Search commands...
        <span className="cs2-palette-hint">⌘P</span>
      </button>

      <div className="cs2-titlebar-right">
        <button className="cs2-tb-btn" onClick={onSave}>
          {saveStatus === 'saving' ? '⏳' : saveStatus === 'saved' ? '✓' : '💾'} Save
        </button>
        <button className="cs2-tb-btn" onClick={onShare}>🔗 Share</button>
        <button className="cs2-tb-btn" onClick={onExport}>📦 Export</button>
        <button className="cs2-tb-btn" onClick={onEnv}>🔐 .env</button>
        <button className="cs2-tb-btn cs2-zen-btn" onClick={onZen} title="Zen Mode">🧘</button>
      </div>
    </div>
  )
            }
                                                         
