// ============================================================
// CodeSpace.jsx  –  Main IDE (all Phase 1 bugs fixed)
// Fixes: delete, rename, new folder+file, move, ZIP import,
//        project switching, no forced file naming prompts
// ============================================================
import { useState, useEffect, useRef, useMemo } from 'react'
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
  getConfig, setConfig, genId, encodeShare, decodeShare,
  exportProjectZip, importZipFile,
} from './cs-storage.js'
import { getLangFromExt, getTemplate } from './cs-filesystem.js'
import { GitRepo } from './cs-git.js'
import './CodeSpace.css'

const DEFAULT_SETTINGS = {
  theme: 'cs-dark', fontSize: 14, minimap: true,
  wordWrap: 'off', autoSave: true, autoPreview: true,
}

const FILE_DEFAULTS = {
  js:'// New file\n', ts:'// New file\n', jsx:'// New component\n',
  tsx:'// New component\n',
  html:'<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <title>Page</title>\n</head>\n<body>\n\n</body>\n</html>\n',
  css:'/* Styles */\n', scss:'// Styles\n', py:'# main\n',
  json:'{\n  \n}\n', md:'# Title\n', yaml:'# config\n',
  sh:'#!/bin/bash\n', sql:'-- Query\n', txt:'',
}

export default function CodeSpace() {
  // ── State ────────────────────────────────────────────────────
  const [projects,    setProjects]   = useState([])
  const [activeProj,  setActiveProj] = useState(null)
  const [files,       setFiles]      = useState({})
  const [openTabs,    setOpenTabs]   = useState([])
  const [activeTab,   setActiveTab]  = useState(null)
  const [cursorPos,   setCursor]     = useState({ line: 1, col: 1 })
  const [splitOn,     setSplit]      = useState(false)
  const [splitTab,    setSplitTab]   = useState(null)
  const [activity,    setActivity]   = useState('explorer')
  const [sideOpen,    setSideOpen]   = useState(true)
  const [termOpen,    setTerm]       = useState(false)
  const [prevOpen,    setPrev]       = useState(true)
  const [zenMode,     setZen]        = useState(false)
  const [showPalette, setPalette]    = useState(false)
  const [showSettings,setSettings]   = useState(false)
  const [showTemplates,setTemplates] = useState(false)
  const [showEnv,     setEnv]        = useState(false)
  const [settings,    setSett]       = useState(DEFAULT_SETTINGS)
  const [git,         setGit]        = useState(null)
  const [refreshTick, setRefresh]    = useState(0)
  const [saveStatus,  setSaveStatus] = useState('')
  const [notices,     setNotices]    = useState([])
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

      // Shared URL
      const enc = new URLSearchParams(window.location.search).get('cs')
      if (enc) {
        const dec = decodeShare(enc)
        if (dec?.files) {
          const p = { id: genId(), name: 'Shared Project', files: dec.files,
            entry: dec.entry, createdAt: Date.now(), updatedAt: Date.now() }
          await saveProject(p)
          setProjects(prev => [p, ...prev])
          doOpenProject(p)
          window.history.replaceState({}, '', window.location.pathname)
          notify('Shared project loaded!', 'success')
          return
        }
      }
      const lastId = await getConfig('lastProjectId')
      const last   = (lastId && sorted.find(p => p.id === lastId)) || sorted[0]
      if (last) doOpenProject(last)
    }
    init()
  }, [])

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 's') { e.preventDefault(); doSave() }
      if (mod && e.key === 'p') { e.preventDefault(); setPalette(p => !p) }
      if (mod && e.key === '`') { e.preventDefault(); setTerm(p => !p) }
      if (e.key === 'Escape' && showPalette) setPalette(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [files, activeProj, showPalette])

  function notify(msg, type = 'info') {
    const id = genId()
    setNotices(p => [...p, { id, message: msg, type }])
    setTimeout(() => setNotices(p => p.filter(n => n.id !== id)), 3500)
  }

  // ── Project operations ─────────────────────────────────────────
  function doOpenProject(proj) {
    setActiveProj(proj)
    setFiles(proj.files || {})
    setOpenTabs([])
    setActiveTab(null)
    setSplit(false)
    setGit(new GitRepo(proj.id, { get: getConfig, set: setConfig }))
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
      id, name: tmpl.name,
      files: { ...tmpl.files }, entry: tmpl.entry,
      createdAt: Date.now(), updatedAt: Date.now(),
    }
    await saveProject(proj)
    setProjects(prev => [proj, ...prev])
    doOpenProject(proj)
    setTemplates(false)
    notify(`Created "${proj.name}"`, 'success')
  }

  async function handleDeleteProject(id) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    await deleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
    if (activeProj?.id === id) {
      setActiveProj(null); setFiles({}); setOpenTabs([]); setActiveTab(null)
    }
    notify('Project deleted', 'info')
  }

  function handleRenameProject(id, name) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p))
    if (activeProj?.id === id) setActiveProj(p => ({ ...p, name }))
    const proj = projects.find(p => p.id === id)
    if (proj) saveProject({ ...proj, name })
  }

  // ── Save ──────────────────────────────────────────────────────
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

  // ── Tab operations ─────────────────────────────────────────────
  function openTab(path, fileOverride) {
    const fm = fileOverride || files
    if (fm[path] === undefined) return
    setOpenTabs(prev => prev.find(t => t.path === path) ? prev : [...prev, { path, dirty: false }])
    setActiveTab(path)
  }

  function closeTab(path) {
    setOpenTabs(prev => {
      const next = prev.filter(t => t.path !== path)
      if (activeTab === path) setActiveTab(next[Math.max(0, prev.findIndex(t => t.path === path) - 1)]?.path || next[0]?.path || null)
      return next
    })
    if (splitTab === path) { setSplit(false); setSplitTab(null) }
  }

  function handleFileChange(path, value) {
    setFiles(prev => ({ ...prev, [path]: value }))
    setOpenTabs(prev => prev.map(t => t.path === path ? { ...t, dirty: true } : t))
    if (settings.autoSave) { clearTimeout(autoSaveTimer.current); autoSaveTimer.current = setTimeout(doSave, 2000) }
    if (settings.autoPreview) setRefresh(t => t + 1)
  }

  // ── File system operations ────────────────────────────────────
  // Called from CsFileExplorer with (parentDir, name)
  function handleNewFile(parentDir, name) {
    if (!name) return
    const path    = parentDir ? `${parentDir}/${name}` : name
    const ext     = name.split('.').pop()?.toLowerCase() || ''
    const content = FILE_DEFAULTS[ext] ?? ''
    const next    = { ...files, [path]: content }
    setFiles(next)
    openTab(path, next)
    scheduleSave(next)
    notify(`Created ${name}`, 'success')
  }

  function handleNewFolder(parentDir, name) {
    if (!name) return
    // Folders are virtual — just expand, no .gitkeep needed
    const placeholder = parentDir ? `${parentDir}/${name}/.gitkeep` : `${name}/.gitkeep`
    const next = { ...files, [placeholder]: '' }
    setFiles(next)
    scheduleSave(next)
  }

  function handleRenameFile(oldPath, newName) {
    // newName can be just the filename or a new full path
    const parts    = oldPath.split('/')
    parts[parts.length - 1] = newName
    const newPath  = parts.join('/')
    if (newPath === oldPath) return

    setFiles(prev => {
      const next = { ...prev }
      // Handle folder rename — rename all children
      if (Object.keys(prev).some(k => k.startsWith(oldPath + '/'))) {
        for (const k of Object.keys(prev)) {
          if (k === oldPath || k.startsWith(oldPath + '/')) {
            next[k.replace(oldPath, newPath)] = prev[k]
            delete next[k]
          }
        }
      } else {
        next[newPath] = prev[oldPath]
        delete next[oldPath]
      }
      return next
    })
    setOpenTabs(prev => prev.map(t =>
      t.path === oldPath ? { ...t, path: newPath }
      : t.path.startsWith(oldPath + '/') ? { ...t, path: t.path.replace(oldPath, newPath) }
      : t
    ))
    if (activeTab === oldPath) setActiveTab(newPath)
    if (splitTab === oldPath) setSplitTab(newPath)
  }

  function handleDeleteFile(path, isDir) {
    setFiles(prev => {
      const next = { ...prev }
      if (isDir) {
        for (const k of Object.keys(next)) {
          if (k === path || k.startsWith(path + '/')) delete next[k]
        }
      } else {
        delete next[path]
      }
      return next
    })
    if (isDir) {
      setOpenTabs(prev => prev.filter(t => !t.path.startsWith(path + '/') && t.path !== path))
    } else {
      closeTab(path)
    }
    notify(`Deleted ${path.split('/').pop()}`, 'info')
  }

  // ── Move file (drag & drop) ───────────────────────────────────
  function handleMoveFile(srcPath, destDir) {
    const filename = srcPath.split('/').pop()
    const newPath  = destDir ? `${destDir}/${filename}` : filename
    if (newPath === srcPath) return

    setFiles(prev => {
      const next = { ...prev }
      if (Object.keys(prev).some(k => k.startsWith(srcPath + '/'))) {
        // Folder move
        for (const k of Object.keys(prev)) {
          if (k === srcPath || k.startsWith(srcPath + '/')) {
            next[k.replace(srcPath, newPath)] = prev[k]
            delete next[k]
          }
        }
      } else {
        next[newPath] = prev[srcPath]
        delete next[srcPath]
      }
      return next
    })
    setOpenTabs(prev => prev.map(t =>
      t.path === srcPath ? { ...t, path: newPath } : t
    ))
    if (activeTab === srcPath) setActiveTab(newPath)
    notify(`Moved to ${destDir || '/'}`, 'success')
  }

  // ── Upload / ZIP import ───────────────────────────────────────
  async function handleUpload(filename, content) {
    // Special signal from CsFileExplorer for ZIP files
    if (filename === '__zip__') {
      try {
        notify('Importing ZIP...', 'info')
        const extracted = await importZipFile(content)  // content is a File object
        const keys = Object.keys(extracted)
        if (!keys.length) { notify('ZIP is empty or unreadable', 'error'); return }
        const id   = genId()
        const name = content.name?.replace('.zip', '') || 'Imported Project'
        const entry = keys.find(k => k === 'index.html' || k.endsWith('/index.html')) || keys[0]
        const proj = { id, name, files: extracted, entry, createdAt: Date.now(), updatedAt: Date.now() }
        await saveProject(proj)
        setProjects(prev => [proj, ...prev])
        doOpenProject(proj)
        notify(`Imported "${name}" — ${keys.length} files`, 'success')
      } catch (e) { notify(`ZIP import failed: ${e.message}`, 'error') }
      return
    }
    const next = { ...files, [filename]: content }
    setFiles(next)
    openTab(filename, next)
    scheduleSave(next)
    notify(`Uploaded ${filename}`, 'success')
  }

  function scheduleSave(nextFiles) {
    if (!activeProj) return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      const updated = { ...activeProj, files: nextFiles, updatedAt: Date.now() }
      await saveProject(updated)
      setActiveProj(updated)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    }, 1500)
  }

  // ── Share / Export ────────────────────────────────────────────
  function handleShare() {
    const url = `${window.location.origin}/codespace?cs=${encodeShare({ files, entry: activeProj?.entry })}`
    navigator.clipboard?.writeText(url)
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

  // ── Command palette ───────────────────────────────────────────
  function onPaletteAction(id) {
    const MAP = {
      save:     doSave,
      'new-file': () => {},
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

  function handleActivity(id) {
    setSideOpen(activity === id ? !sideOpen : true)
    setActivity(id)
  }

  // ── Preview entry ─────────────────────────────────────────────
  const previewEntry = useMemo(() => {
    if (activeProj?.entry && files[activeProj.entry]) return activeProj.entry
    return Object.keys(files).find(k => k === 'index.html' || k.endsWith('/index.html'))
  }, [files, activeProj?.entry])

  const activeContent = activeTab != null ? (files[activeTab] ?? '') : ''
  const hasProject    = !!activeProj

  function SidePanel() {
    if (activity === 'explorer') return (
      <CsFileExplorer
        files={files} activeFile={activeTab} projectName={activeProj?.name}
        onOpen={openTab}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onRename={handleRenameFile}
        onDelete={handleDeleteFile}
        onUpload={handleUpload}
        onMoveFile={handleMoveFile}
      />
    )
    if (activity === 'git') return (
      <CsGitPanel files={files} git={git} projectName={activeProj?.name}
        onRestoreFiles={f => { setFiles(f); notify('Checked out', 'success') }} />
    )
    if (activity === 'search') return <SearchPanel files={files} onOpen={openTab} />
    return null
  }

  return (
    <div className={`cs2-root ${zenMode ? 'cs2-zen' : ''}`}>
      <CodeBg />

      {!zenMode && (
        <TitleBar
          projects={projects} activeProj={activeProj} saveStatus={saveStatus}
          onPalette={() => setPalette(true)}
          onSwitch={id => doOpenProject(projects.find(p => p.id === id))}
          onNew={() => setTemplates(true)}
          onSave={doSave} onShare={handleShare} onExport={handleExport}
          onEnv={() => setEnv(p => !p)} onZen={() => setZen(true)}
          onSettings={() => setSettings(true)}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
        />
      )}

      <div className={`cs2-layout ${zenMode ? 'cs2-layout-zen' : ''}`}>

        {!zenMode && (
          <ActivityBar active={activity} onSelect={handleActivity}
            terminalOpen={termOpen} previewOpen={prevOpen}
            onTerminal={() => setTerm(p => !p)} onPreview={() => setPrev(p => !p)}
            onSettings={() => setSettings(true)} />
        )}

        {!zenMode && sideOpen && hasProject && (
          <div className="cs2-sidebar"><SidePanel /></div>
        )}

        {!hasProject ? (
          <WelcomeScreen projects={projects}
            onNewProject={() => setTemplates(true)}
            onOpenProject={id => doOpenProject(projects.find(p => p.id === id))}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
          />
        ) : (
          <div className="cs2-center">
            {openTabs.length > 0 && (
              <TabBar tabs={openTabs} activeTab={activeTab} onActivate={openTab} onClose={closeTab} />
            )}

            <div className={`cs2-editors ${splitOn ? 'cs2-split' : ''}`}>
              {activeTab != null ? (
                <>
                  <div className={`cs2-editor-pane ${splitOn ? 'cs2-editor-half' : 'cs2-editor-full'}`}>
                    <Breadcrumb path={activeTab} onSplit={() => {
                      setSplit(p => !p)
                      if (!splitTab) setSplitTab(openTabs.find(t => t.path !== activeTab)?.path || null)
                    }} />
                    <CsEditor key={activeTab} value={activeContent} filename={activeTab}
                      onChange={v => handleFileChange(activeTab, v)} onSave={doSave}
                      theme={settings.theme} fontSize={settings.fontSize}
                      wordWrap={settings.wordWrap} minimap={settings.minimap}
                      onCursorChange={setCursor} />
                  </div>

                  {splitOn && splitTab && files[splitTab] !== undefined && (
                    <div className="cs2-editor-pane cs2-editor-half cs2-editor-split-right">
                      <div className="cs2-breadcrumb">
                        <span className="cs2-breadcrumb-active">{splitTab.split('/').pop()}</span>
                        <button className="cs2-split-close" onClick={() => { setSplit(false); setSplitTab(null) }}>✕ Close Split</button>
                      </div>
                      <CsEditor key={`split-${splitTab}`} value={files[splitTab] || ''} filename={splitTab}
                        onChange={v => handleFileChange(splitTab, v)} onSave={doSave}
                        theme={settings.theme} fontSize={settings.fontSize}
                        wordWrap={settings.wordWrap} minimap={false} />
                    </div>
                  )}
                </>
              ) : (
                <div className="cs2-no-editor">
                  <div style={{ fontSize: '3rem', opacity: 0.2 }}>📄</div>
                  <div>Open a file from the explorer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cs-text3)', marginTop: 4 }}>
                    or right-click in the explorer to create one
                  </div>
                </div>
              )}
            </div>

            {termOpen && (
              <div className="cs2-terminal-pane">
                <CsTerminal files={files} onFilesChange={setFiles}
                  projectName={activeProj?.name} gitRepo={git} />
              </div>
            )}
          </div>
        )}

        {hasProject && prevOpen && !zenMode && (
          <div className="cs2-preview-panel">
            <CsPreview files={files} entry={previewEntry}
              autoRefresh={settings.autoPreview} refreshTick={refreshTick} />
          </div>
        )}
      </div>

      {!zenMode && (
        <StatusBar saveStatus={saveStatus} projectName={activeProj?.name}
          activeFile={activeTab} cursorPos={cursorPos} />
      )}

      {zenMode && <button className="cs2-zen-exit" onClick={() => setZen(false)}>Exit Zen</button>}

      {showPalette   && <CommandPalette files={files} onClose={() => setPalette(false)} onOpenFile={openTab} onAction={onPaletteAction} />}
      {showSettings  && <SettingsPanel settings={settings} onChange={updateSetting} onClose={() => setSettings(false)} />}
      {showTemplates && <TemplatePicker onSelect={createProject} onClose={() => setTemplates(false)} />}
      {showEnv && activeProj && <EnvModal files={files} onChange={handleFileChange} onClose={() => setEnv(false)} />}

      <Notifications items={notices} />
    </div>
  )
}

    
