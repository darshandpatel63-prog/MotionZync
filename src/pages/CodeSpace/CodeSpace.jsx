// ============================================================
// CodeSpace.jsx  –  Main IDE orchestrator
// VS Code + GitHub + Vercel fully in your browser
// Local-first: all code stored in IndexedDB on your device
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import CsEditor       from './CsEditor.jsx'
import CsFileExplorer from './CsFileExplorer.jsx'
import CsTerminal     from './CsTerminal.jsx'
import CsPreview      from './CsPreview.jsx'
import CsGitPanel     from './CsGitPanel.jsx'
import {
  CodeBg, WelcomeScreen, TabBar, Breadcrumb,
  StatusBar, ActivityBar, TitleBar,
} from './CsProjectUI.jsx'
import {
  CommandPalette, SettingsPanel, TemplatePicker,
  EnvModal, SearchPanel, Notifications,
} from './CsOverlays.jsx'
import {
  openDB, getAllProjects, saveProject, deleteProject,
  getConfig, setConfig, genId, encodeShare, decodeShare, exportProjectZip,
} from './cs-storage.js'
import { getLangFromExt, getTemplate } from './cs-filesystem.js'
import { GitRepo } from './cs-git.js'
import './CodeSpace.css'

const DEFAULT_SETTINGS = {
  theme: 'cs-dark', fontSize: 14, minimap: true,
  wordWrap: 'off', autoSave: true, autoPreview: true,
}

export default function CodeSpace() {
  // ── Projects ────────────────────────────────────────────────
  const [projects,    setProjects]   = useState([])
  const [activeProj,  setActiveProj] = useState(null)
  const [files,       setFiles]      = useState({})

  // ── Editor tabs ──────────────────────────────────────────────
  const [openTabs,   setOpenTabs]  = useState([])  // [{ path, dirty }]
  const [activeTab,  setActiveTab] = useState(null)
  const [cursorPos,  setCursor]    = useState({ line: 1, col: 1 })
  const [splitOn,    setSplit]     = useState(false)
  const [splitTab,   setSplitTab]  = useState(null)

  // ── Layout ───────────────────────────────────────────────────
  const [activity,   setActivity]  = useState('explorer')
  const [sideOpen,   setSideOpen]  = useState(true)
  const [termOpen,   setTerm]      = useState(false)
  const [prevOpen,   setPrev]      = useState(true)
  const [zenMode,    setZen]       = useState(false)

  // ── Overlays ─────────────────────────────────────────────────
  const [showPalette,  setPalette]   = useState(false)
  const [showSettings, setSettings]  = useState(false)
  const [showTemplates,setTemplates] = useState(false)
  const [showEnv,      setEnv]       = useState(false)

  // ── Misc ──────────────────────────────────────────────────────
  const [settings,    setSett]      = useState(DEFAULT_SETTINGS)
  const [git,         setGit]       = useState(null)
  const [refreshTick, setRefresh]   = useState(0)
  const [saveStatus,  setSaveStatus] = useState('')
  const [notices,     setNotices]   = useState([])
  const autoSaveTimer = useRef(null)

  // ── Bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      await openDB()
      const [projs, saved] = await Promise.all([
        getAllProjects(),
        getConfig('settings', DEFAULT_SETTINGS),
      ])
      setSett({ ...DEFAULT_SETTINGS, ...saved })

      const sorted = projs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      setProjects(sorted)

      // Check URL for shared project
      const enc = new URLSearchParams(window.location.search).get('cs')
      if (enc) {
        const dec = decodeShare(enc)
        if (dec?.files) {
          const p = { id: genId(), name: 'Shared Project', files: dec.files,
            entry: dec.entry, createdAt: Date.now(), updatedAt: Date.now() }
          openProject(p)
          window.history.replaceState({}, '', window.location.pathname)
          notify('Shared project loaded!', 'success')
          return
        }
      }
      const lastId = await getConfig('lastProjectId')
      const last   = (lastId && sorted.find(p => p.id === lastId)) || sorted[0]
      if (last) openProject(last)
    }
    init()
  }, [])

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 's') { e.preventDefault(); doSave() }
      if (mod && e.key === 'p') { e.preventDefault(); setPalette(p => !p) }
      if (e.key === 'Escape' && showPalette) setPalette(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [files, activeProj, showPalette])

  // ── Notifications ─────────────────────────────────────────────
  function notify(message, type = 'info') {
    const id = genId()
    setNotices(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotices(prev => prev.filter(n => n.id !== id)), 3500)
  }

  // ── Project operations ────────────────────────────────────────
  function openProject(proj) {
    setActiveProj(proj)
    setFiles(proj.files || {})
    setOpenTabs([])
    setActiveTab(null)
    const gitStorage = { get: getConfig, set: setConfig }
    setGit(new GitRepo(proj.id, gitStorage))
    const entry = proj.entry || Object.keys(proj.files || {})[0]
    if (entry && proj.files?.[entry] !== undefined) {
      setOpenTabs([{ path: entry, dirty: false }])
      setActiveTab(entry)
    }
    setConfig('lastProjectId', proj.id)
  }

  async function createProject(templateId) {
    const tmpl = getTemplate(templateId)
    const id   = genId()
    const proj = {
      id, name: `${tmpl.name} ${new Date().toLocaleDateString()}`,
      files: { ...tmpl.files }, entry: tmpl.entry,
      createdAt: Date.now(), updatedAt: Date.now(),
    }
    await saveProject(proj)
    setProjects(prev => [proj, ...prev])
    openProject(proj)
    setTemplates(false)
    notify(`Created "${proj.name}"`, 'success')
  }

  async function handleDeleteProject(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await deleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
    if (activeProj?.id === id) { setActiveProj(null); setFiles({}); setOpenTabs([]); setActiveTab(null) }
  }

  function handleRenameProject(id, name) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p))
    if (activeProj?.id === id) setActiveProj(p => ({ ...p, name }))
    const proj = projects.find(p => p.id === id)
    if (proj) saveProject({ ...proj, name })
  }

  // ── File operations ───────────────────────────────────────────
  function openTab(path, fileOverride) {
    const fm = fileOverride || files
    if (fm[path] === undefined) return
    setOpenTabs(prev => prev.find(t => t.path === path) ? prev : [...prev, { path, dirty: false }])
    setActiveTab(path)
  }

  function closeTab(path) {
    setOpenTabs(prev => {
      const next = prev.filter(t => t.path !== path)
      if (activeTab === path) {
        const idx = prev.findIndex(t => t.path === path)
        setActiveTab(next[Math.min(idx, next.length - 1)]?.path || null)
      }
      return next
    })
  }

  function handleFileChange(path, value) {
    setFiles(prev => ({ ...prev, [path]: value }))
    setOpenTabs(prev => prev.map(t => t.path === path ? { ...t, dirty: true } : t))
    if (settings.autoSave) {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(doSave, 2000)
    }
    if (settings.autoPreview) setRefresh(t => t + 1)
  }

  async function doSave() {
    if (!activeProj) return
    setSaveStatus('saving')
    try {
      const updated = { ...activeProj, files, updatedAt: Date.now() }
      await saveProject(updated)
      setActiveProj(updated)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
      setOpenTabs(prev => prev.map(t => ({ ...t, dirty: false })))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch { setSaveStatus('error'); setTimeout(() => setSaveStatus(''), 3000) }
  }

  async function handleNewFile(dir) {
    const name = prompt('File name (e.g. index.html, src/app.js):')
    if (!name?.trim()) return
    const path = dir ? `${dir}/${name.trim()}` : name.trim()
    const ext  = path.split('.').pop()?.toLowerCase()
    const DEFAULTS = { js:'// New file\n', ts:'// New file\n', jsx:'// New component\n',
      html:'<!DOCTYPE html>\n<html>\n<head>\n<title>New</title>\n</head>\n<body>\n\n</body>\n</html>',
      css:'/* styles */\n', py:'# main.py\n', json:'{\n  \n}', md:'# New File\n' }
    const content = DEFAULTS[ext] || ''
    setFiles(prev => ({ ...prev, [path]: content }))
    openTab(path, { ...files, [path]: content })
    notify(`Created ${path}`, 'success')
  }

  function handleNewFolder(dir) {
    const name = prompt('Folder name:')
    if (!name?.trim()) return
    const path = dir ? `${dir}/${name.trim()}/.gitkeep` : `${name.trim()}/.gitkeep`
    setFiles(prev => ({ ...prev, [path]: '' }))
  }

  function handleRenameFile(oldPath, newName) {
    const parts = oldPath.split('/'); parts[parts.length - 1] = newName
    const newPath = parts.join('/')
    setFiles(prev => { const n = { ...prev, [newPath]: prev[oldPath] }; delete n[oldPath]; return n })
    setOpenTabs(prev => prev.map(t => t.path === oldPath ? { ...t, path: newPath } : t))
    if (activeTab === oldPath) setActiveTab(newPath)
  }

  function handleDeleteFile(path, isDir) {
    if (!confirm(`Delete "${path}"?`)) return
    setFiles(prev => {
      const n = { ...prev }
      if (isDir) Object.keys(n).filter(k => k.startsWith(path + '/') || k === path).forEach(k => delete n[k])
      else delete n[path]
      return n
    })
    closeTab(path)
  }

  function handleUpload(filename, content) {
    setFiles(prev => ({ ...prev, [filename]: content }))
    openTab(filename, { ...files, [filename]: content })
    notify(`Uploaded ${filename}`, 'success')
  }

  // ── Share / Export ────────────────────────────────────────────
  function handleShare() {
    const url = `${window.location.origin}/codespace?cs=${encodeShare({ files, entry: activeProj?.entry })}`
    navigator.clipboard.writeText(url)
    notify('Share link copied!', 'success')
  }

  async function handleExport() {
    if (!activeProj) return
    await exportProjectZip({ ...activeProj, files })
    notify('Exported as ZIP', 'success')
  }

  // ── Settings ──────────────────────────────────────────────────
  function updateSetting(key, value) {
    const next = { ...settings, [key]: value }
    setSett(next); setConfig('settings', next)
  }

  // ── Command palette actions ────────────────────────────────────
  function onPaletteAction(id) {
    const MAP = {
      save:     doSave,
      'new-file': () => handleNewFile(''),
      terminal: () => setTerm(p => !p),
      preview:  () => setPrev(p => !p),
      git:      () => { setActivity('git'); setSideOpen(true) },
      zen:      () => setZen(p => !p),
      export:   handleExport,
      share:    handleShare,
      settings: () => setSettings(true),
      split:    () => setSplit(p => !p),
    }
    MAP[id]?.()
  }

  // ── Activity bar handler ──────────────────────────────────────
  function handleActivity(id) {
    if (id === 'settings') { setSettings(true); return }
    setSideOpen(activity === id ? !sideOpen : true)
    setActivity(id)
  }

  // ── Preview entry resolution ──────────────────────────────────
  const previewEntry = useMemo(() => {
    if (activeProj?.entry && files[activeProj.entry]) return activeProj.entry
    return Object.keys(files).find(k => k === 'index.html' || k.endsWith('/index.html'))
  }, [files, activeProj?.entry])

  const activeContent = activeTab ? (files[activeTab] || '') : ''
  const hasProject    = !!activeProj

  // ── Sidebar content ────────────────────────────────────────────
  function SidePanel() {
    if (activity === 'explorer') return (
      <CsFileExplorer files={files} activeFile={activeTab} projectName={activeProj?.name}
        onOpen={openTab} onNewFile={handleNewFile} onNewFolder={handleNewFolder}
        onRename={handleRenameFile} onDelete={handleDeleteFile} onUpload={handleUpload} />
    )
    if (activity === 'git') return (
      <CsGitPanel files={files} git={git} projectName={activeProj?.name}
        onRestoreFiles={f => { setFiles(f); notify('Checked out', 'success') }} />
    )
    if (activity === 'search') return (
      <SearchPanel files={files} onOpen={openTab} />
    )
    return null
  }

  // ════════════════════════════════════════════════════════════
  return (
    <div className={`cs2-root ${zenMode ? 'cs2-zen' : ''}`}>
      <CodeBg />

      {/* Title Bar */}
      {!zenMode && (
        <TitleBar
          projectName={activeProj?.name}
          saveStatus={saveStatus}
          onPalette={() => setPalette(true)}
          onNew={() => setTemplates(true)}
          onSave={doSave}
          onShare={handleShare}
          onExport={handleExport}
          onEnv={() => setEnv(p => !p)}
          onZen={() => setZen(true)}
          onSettings={() => setSettings(true)}
        />
      )}

      {/* Main layout */}
      <div className={`cs2-layout ${zenMode ? 'cs2-layout-zen' : ''}`}>

        {/* Activity bar */}
        {!zenMode && (
          <ActivityBar
            active={activity}
            onSelect={handleActivity}
            terminalOpen={termOpen}
            previewOpen={prevOpen}
            onTerminal={() => setTerm(p => !p)}
            onPreview={() => setPrev(p => !p)}
          />
        )}

        {/* Sidebar */}
        {!zenMode && sideOpen && hasProject && (
          <div className="cs2-sidebar"><SidePanel /></div>
        )}

        {/* Welcome or IDE */}
        {!hasProject ? (
          <WelcomeScreen
            projects={projects}
            onNewProject={() => setTemplates(true)}
            onOpenProject={id => openProject(projects.find(p => p.id === id))}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
          />
        ) : (
          <div className="cs2-center">
            {/* Tabs */}
            {openTabs.length > 0 && (
              <TabBar tabs={openTabs} activeTab={activeTab} onActivate={openTab} onClose={closeTab} />
            )}

            {/* Editors */}
            <div className={`cs2-editors ${splitOn ? 'cs2-split' : ''}`}>
              {activeTab ? (
                <>
                  <div className={`cs2-editor-pane ${splitOn ? 'cs2-editor-half' : 'cs2-editor-full'}`}>
                    <Breadcrumb path={activeTab} onSplit={() => {
                      setSplit(p => !p)
                      if (!splitTab) setSplitTab(openTabs.find(t => t.path !== activeTab)?.path || activeTab)
                    }} />
                    <CsEditor
                      key={activeTab} value={activeContent} filename={activeTab}
                      onChange={v => handleFileChange(activeTab, v)} onSave={doSave}
                      theme={settings.theme} fontSize={settings.fontSize}
                      wordWrap={settings.wordWrap} minimap={settings.minimap}
                      onCursorChange={setCursor}
                    />
                  </div>

                  {splitOn && splitTab && files[splitTab] !== undefined && (
                    <div className="cs2-editor-pane cs2-editor-half cs2-editor-split-right">
                      <div className="cs2-breadcrumb">
                        <span className="cs2-breadcrumb-active">{splitTab.split('/').pop()}</span>
                        <button className="cs2-split-close" onClick={() => setSplit(false)}>
                          ✕ Close Split
                        </button>
                      </div>
                      <CsEditor
                        key={`split-${splitTab}`} value={files[splitTab] || ''} filename={splitTab}
                        onChange={v => handleFileChange(splitTab, v)} onSave={doSave}
                        theme={settings.theme} fontSize={settings.fontSize}
                        wordWrap={settings.wordWrap} minimap={false}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="cs2-no-editor">
                  <div>📄</div>
                  <div>Open a file from the explorer</div>
                  <button className="cs2-open-file-btn" onClick={() => handleNewFile('')}>
                    Create New File
                  </button>
                </div>
              )}
            </div>

            {/* Terminal */}
            {termOpen && (
              <div className="cs2-terminal-pane">
                <CsTerminal files={files} onFilesChange={setFiles}
                  projectName={activeProj?.name} gitRepo={git} />
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {hasProject && prevOpen && !zenMode && (
          <div className="cs2-preview-panel">
            <CsPreview files={files} entry={previewEntry}
              autoRefresh={settings.autoPreview} refreshTick={refreshTick} />
          </div>
        )}
      </div>

      {/* Status bar */}
      {!zenMode && (
        <StatusBar
          branch="main" saveStatus={saveStatus}
          projectName={activeProj?.name} activeFile={activeTab} cursorPos={cursorPos}
        />
      )}

      {/* Zen exit */}
      {zenMode && <button className="cs2-zen-exit" onClick={() => setZen(false)}>Exit Zen</button>}

      {/* Overlays */}
      {showPalette  && <CommandPalette files={files} onClose={() => setPalette(false)}
        onOpenFile={openTab} onAction={onPaletteAction} />}
      {showSettings && <SettingsPanel settings={settings} onChange={updateSetting}
        onClose={() => setSettings(false)} />}
      {showTemplates && <TemplatePicker onSelect={createProject} onClose={() => setTemplates(false)} />}
      {showEnv && activeProj && <EnvModal files={files} onChange={handleFileChange}
        onClose={() => setEnv(false)} />}

      <Notifications items={notices} />
    </div>
  )
}
