// ============================================================
// CsProjectUI.jsx  –  Welcome screen, project cards, tab bar
// ============================================================
import { useState } from 'react'
import { getLangFromExt } from './cs-filesystem.js'

// ── Animated Aurora Background ────────────────────────────────
import { useEffect, useRef } from 'react'
export function CodeBg() {
  const cvRef = useRef(null)
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    let t = 0, id
    function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      for (let i = 0; i < 4; i++) {
        const x = cv.width  * (0.15 + i * 0.25) + Math.sin(t * 0.3 + i * 1.2) * 100
        const y = cv.height * 0.5               + Math.cos(t * 0.2 + i * 0.9) * 80
        const g = ctx.createRadialGradient(x, y, 0, x, y, 250 + i * 50)
        g.addColorStop(0, `hsla(${250 + i * 35},70%,55%,0.05)`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, cv.width, cv.height)
      }
      t += 0.006
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={cvRef} className="cs2-bg-canvas" />
}

// ── Project Card ──────────────────────────────────────────────
export function ProjectCard({ project, isActive, onOpen, onDelete, onRename }) {
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(project.name)
  const lang = project.entry ? getLangFromExt(project.entry) : { icon: '📦', color: '#7c3aed' }
  const fileCount = Object.keys(project.files || {}).length

  function commitRename() {
    if (name.trim() && name !== project.name) onRename(project.id, name.trim())
    setRenaming(false)
  }

  return (
    <div className={`cs2-proj-card ${isActive ? 'active' : ''}`} onClick={() => onOpen(project.id)}>
      <div className="cs2-proj-card-icon" style={{ color: lang.color }}>{lang.icon}</div>
      <div className="cs2-proj-card-body">
        {renaming ? (
          <input
            className="cs2-proj-rename"
            value={name} autoFocus
            onChange={e => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenaming(false) }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <div className="cs2-proj-name">{project.name}</div>
        )}
        <div className="cs2-proj-meta">
          {fileCount} file{fileCount !== 1 ? 's' : ''} ·{' '}
          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'New'}
        </div>
      </div>
      <div className="cs2-proj-actions" onClick={e => e.stopPropagation()}>
        <button onClick={() => setRenaming(true)} title="Rename">✏️</button>
        <button onClick={() => onDelete(project.id)} title="Delete" className="cs2-proj-del">🗑️</button>
      </div>
    </div>
  )
}

// ── Welcome Screen ────────────────────────────────────────────
export function WelcomeScreen({ projects, onNewProject, onOpenProject, onDeleteProject, onRenameProject }) {
  return (
    <div className="cs2-welcome">
      <div className="cs2-welcome-content">
        <div className="cs2-welcome-logo">⚡</div>
        <h1 className="cs2-welcome-title">CodeSpace IDE</h1>
        <p className="cs2-welcome-sub">VS Code + GitHub + Vercel — fully in your browser</p>
        <div className="cs2-welcome-actions">
          <button className="cs2-welcome-btn cs2-welcome-primary" onClick={onNewProject}>
            🚀 New Project
          </button>
          {projects.length > 0 && (
            <button className="cs2-welcome-btn" onClick={() => onOpenProject(projects[0].id)}>
              📂 Open Recent
            </button>
          )}
        </div>
        {projects.length > 0 && (
          <div className="cs2-recent-projects">
            <div className="cs2-recent-label">RECENT PROJECTS</div>
            {projects.slice(0, 5).map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                isActive={false}
                onOpen={onOpenProject}
                onDelete={onDeleteProject}
                onRename={onRenameProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab Bar ───────────────────────────────────────────────────
export function TabBar({ tabs, activeTab, onActivate, onClose }) {
  return (
    <div className="cs2-tabbar">
      {tabs.map(tab => {
        const lang     = getLangFromExt(tab.path)
        const filename = tab.path.split('/').pop()
        return (
          <div
            key={tab.path}
            className={`cs2-tab ${tab.path === activeTab ? 'active' : ''} ${tab.dirty ? 'dirty' : ''}`}
            onClick={() => onActivate(tab.path)}
            title={tab.path}
          >
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

// ── Breadcrumb bar ────────────────────────────────────────────
export function Breadcrumb({ path, onSplit }) {
  const lang = getLangFromExt(path)
  return (
    <div className="cs2-breadcrumb">
      {path.split('/').map((part, i, arr) => (
        <span key={i}>
          <span className={i === arr.length - 1 ? 'cs2-breadcrumb-active' : 'cs2-breadcrumb-dir'}>
            {part}
          </span>
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

// ── Status Bar ────────────────────────────────────────────────
export function StatusBar({ branch, saveStatus, projectName, activeFile, cursorPos }) {
  const lang = activeFile ? getLangFromExt(activeFile) : null
  return (
    <div className="cs2-statusbar">
      <div className="cs2-statusbar-left">
        <span className="cs2-statusbar-item cs2-status-branch">⎇ {branch || 'main'}</span>
        {saveStatus === 'saving' && <span className="cs2-statusbar-item cs2-status-saving">⏳ Saving...</span>}
        {saveStatus === 'saved'  && <span className="cs2-statusbar-item cs2-status-saved">✓ Saved</span>}
        {saveStatus === 'error'  && <span className="cs2-statusbar-item cs2-status-error">✗ Save failed</span>}
      </div>
      <div className="cs2-statusbar-center">
        {projectName && <span className="cs2-statusbar-item">📦 {projectName}</span>}
      </div>
      <div className="cs2-statusbar-right">
        {activeFile && (
          <>
            <span className="cs2-statusbar-item">{lang?.label}</span>
            <span className="cs2-statusbar-item">Ln {cursorPos.line}, Col {cursorPos.col}</span>
            <span className="cs2-statusbar-item">UTF-8</span>
          </>
        )}
        <span className="cs2-statusbar-item">Spaces: 2</span>
      </div>
    </div>
  )
}

// ── Activity Bar ──────────────────────────────────────────────
const ACTIVITY_ITEMS = [
  { id: 'explorer', icon: '📁', title: 'Explorer' },
  { id: 'git',      icon: '⎇', title: 'Source Control' },
  { id: 'search',   icon: '🔍', title: 'Search' },
  { id: 'settings', icon: '⚙️', title: 'Settings' },
]

export function ActivityBar({ active, onSelect, terminalOpen, previewOpen, onTerminal, onPreview }) {
  return (
    <div className="cs2-activity-bar">
      {ACTIVITY_ITEMS.map(a => (
        <button key={a.id} className={`cs2-activity-btn ${active === a.id ? 'active' : ''}`}
          title={a.title} onClick={() => onSelect(a.id)}>
          {a.icon}
        </button>
      ))}
      <div className="cs2-activity-spacer" />
      <button className={`cs2-activity-btn ${terminalOpen ? 'active' : ''}`}
        title="Terminal" onClick={onTerminal}>⚡</button>
      <button className={`cs2-activity-btn ${previewOpen ? 'active' : ''}`}
        title="Preview" onClick={onPreview}>👁</button>
    </div>
  )
}

// ── Title Bar ─────────────────────────────────────────────────
export function TitleBar({ projectName, saveStatus, onPalette, onNew, onSave, onShare, onExport, onEnv, onZen, onSettings }) {
  return (
    <div className="cs2-titlebar">
      <div className="cs2-titlebar-left">
        <div className="cs2-logo">
          <span className="cs2-logo-icon">⚡</span>
          <span className="cs2-logo-text">CodeSpace</span>
        </div>
        <div className="cs2-project-switcher">
          {projectName
            ? <span className="cs2-proj-name-pill">{projectName}</span>
            : <span className="cs2-proj-name-pill cs2-no-proj">No project open</span>
          }
        </div>
      </div>

      <button className="cs2-palette-trigger" onClick={onPalette} title="Command Palette (Ctrl+P)">
        🔍 Search commands...
        <span className="cs2-palette-hint">⌘P</span>
      </button>

      <div className="cs2-titlebar-right">
        <button className="cs2-tb-btn" onClick={onNew}>＋ New</button>
        <button className="cs2-tb-btn" onClick={onSave}>
          {saveStatus === 'saving' ? '⏳' : saveStatus === 'saved' ? '✓' : '💾'} Save
        </button>
        <button className="cs2-tb-btn" onClick={onShare}>🔗 Share</button>
        <button className="cs2-tb-btn" onClick={onExport}>📦 Export</button>
        <button className="cs2-tb-btn" onClick={onEnv}>🔐 .env</button>
        <button className="cs2-tb-btn cs2-zen-btn" onClick={onZen}>🧘</button>
        <button className="cs2-tb-btn" onClick={onSettings}>⚙️</button>
      </div>
    </div>
  )
}
