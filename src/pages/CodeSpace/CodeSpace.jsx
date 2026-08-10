// ============================================================
// CodeSpace.jsx  –  Main IDE (all Phase 1 bugs fixed)
// Fixes: delete, rename, new folder+file, move, ZIP import,
//        project switching, no forced file naming prompts
// Added (Phase 2 / Step 1): GitHub OAuth connect — see GitHubContext.jsx
// ============================================================
import { useState, useEffect, useRef, useMemo } from 'react'
import CsEditor       from './CsEditor.jsx'
import CsFileExplorer from './CsFileExplorer.jsx'
import CsTerminal, { createShell } from './CsTerminal.jsx'
import CsPreview      from './CsPreview.jsx'
import CsGitPanel     from './CsGitPanel.jsx'
import CsAIPanel      from './CsAIPanel.jsx'
import CsResizeHandle from './CsResizeHandle.jsx'
import { GitHubProvider, useGitHub } from './GitHubContext.jsx'
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

function CodeSpaceInner() {
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

  // ── Phase 1 / Fix 2: live refs for the autosave stale-closure bug ──
  // `doSave`/`scheduleSave` used to close over `files`/`activeProj` from
  // whatever render scheduled the setTimeout — by the time it actually
  // fired, that could be 1+ renders stale, so refresh/close could lose
  // the most recent edits (or all of them, if refresh happened before the
  // 2s debounce ever got to fire). Reading from refs instead means the
  // save ALWAYS uses the latest value, no matter when the timer fires.
  const filesRef      = useRef(files)
  const activeProjRef = useRef(activeProj)
  useEffect(() => { filesRef.current = files }, [files])
  useEffect(() => { activeProjRef.current = activeProj }, [activeProj])

  // ── Phase 1 / Fix 6: resizable side panels ──────────────────────
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [previewWidth, setPreviewWidth] = useState(420)
  const widthSaveTimer = useRef(null)
  const [booted, setBooted] = useState(false)
  const mainEditorRef = useRef(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileView, setMobileView] = useState('editor') // 'editor' | 'preview' — mobile-only

  // ── Bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
      await openDB()
      const [projs, saved, savedWidths] = await Promise.all([
        getAllProjects(),
        getConfig('settings', DEFAULT_SETTINGS),
        getConfig('panelWidths', { sidebar: 240, preview: 420 }),
      ])
      setSett({ ...DEFAULT_SETTINGS, ...saved })
      if (savedWidths?.sidebar) setSidebarWidth(savedWidths.sidebar)
      if (savedWidths?.preview) setPreviewWidth(savedWidths.preview)
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
      } finally {
        setBooted(true)
      }
    }
    init()
  }, [])

  // ── GitHub OAuth callback (Phase 2 / Step 1) ───────────────────
  const { handleCallback: githubHandleCallback, error: githubError } = useGitHub()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code  = params.get('code')
    const state = params.get('state')
    if (code && state) {
      githubHandleCallback(code, state).then(() => {
        notify('✓ GitHub connected', 'success')
      })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (githubError) notify(githubError, 'error')
  }, [githubError])

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

  async function importGitHubProject(name, files) {
    const id = genId()
    const entry = files['index.html'] ? 'index.html' : Object.keys(files)[0]
    const proj = { id, name, files, entry, createdAt: Date.now(), updatedAt: Date.now() }
    await saveProject(proj)
    setProjects(prev => [proj, ...prev])
    doOpenProject(proj)
    notify(`Imported "${name}" from GitHub`, 'success')
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

  // ── Save (Phase 1 / Fix 2: reads refs, never a stale render) ────
  async function doSave() {
    const proj = activeProjRef.current
    if (!proj) return
    setSaveStatus('saving')
    try {
      const updated = { ...proj, files: filesRef.current, updatedAt: Date.now() }
      await saveProject(updated)
      activeProjRef.current = updated
      setActiveProj(updated)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
      setOpenTabs(prev => prev.map(t => ({ ...t, dirty: false })))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch { setSaveStatus('error'); setTimeout(() => setSaveStatus(''), 3000) }
  }

  // Force-flush any pending edit immediately when the tab is backgrounded
  // or closed. A 2s debounce alone is not enough on mobile: switching apps
  // or closing the tab very often happens *before* that timer would ever
  // fire, which is exactly how "everything I typed disappeared" happened.
  // visibilitychange fires reliably on mobile (before the OS can kill the
  // tab); pagehide/beforeunload are added as extra safety nets on desktop.
  useEffect(() => {
    const flush = () => {
      clearTimeout(autoSaveTimer.current)
      doSave()
    }
    const onVis = () => { if (document.visibilityState === 'hidden') flush() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
    }
  }, [])

  // Persist panel widths (debounced — dragging fires many updates/sec,
  // no need to hit IndexedDB on every pixel)
  useEffect(() => {
    clearTimeout(widthSaveTimer.current)
    widthSaveTimer.current = setTimeout(() => {
      setConfig('panelWidths', { sidebar: sidebarWidth, preview: previewWidth })
    }, 500)
    return () => clearTimeout(widthSaveTimer.current)
  }, [sidebarWidth, previewWidth])

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
    if (settings.autoSave) { clearTimeout(autoSaveTimer.current); autoSaveTimer.current = setTimeout(doSave, 500) }
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

  // ── AI Agent tools (Phase 2.1) — CsAIPanel calls these when the model
  // requests a tool. Routed through one helper so every write stays safe
  // (functional setState — correct even if the agent calls this several
  // times back-to-back before a re-render) and always triggers a save.
  function applyFilesUpdate(updater) {
    setFiles(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      filesRef.current = next
      scheduleSave(next)
      return next
    })
  }
  function agentListFiles() { return Object.keys(filesRef.current) }
  function agentReadFile(path) { return filesRef.current[path] ?? null }
  function agentWriteFile(path, content) {
    applyFilesUpdate(prev => ({ ...prev, [path]: content }))
  }
  function agentDeleteFile(path) {
    applyFilesUpdate(prev => { const n = { ...prev }; delete n[path]; return n })
    closeTab(path)
  }
  async function agentRunCommand(cmd) {
    const shell = createShell(filesRef.current, applyFilesUpdate, git, activeProj?.name)
    return await shell.run(cmd)
  }

  // Phase 4: project-wide Find & Replace
  function handleReplaceAll(query, replacement, caseSensitive) {
    if (!query) return
    const flags = caseSensitive ? 'g' : 'gi'
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(esc, flags)
    let changedFiles = 0, changedMatches = 0
    applyFilesUpdate(prev => {
      const next = { ...prev }
      for (const [path, content] of Object.entries(prev)) {
        const matches = content.match(re)
        if (!matches) continue
        next[path] = content.replace(re, replacement)
        changedFiles++; changedMatches += matches.length
      }
      return next
    })
    notify(`Replaced ${changedMatches} match${changedMatches === 1 ? '' : 'es'} in ${changedFiles} file${changedFiles === 1 ? '' : 's'}`, 'success')
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
    if (!activeProjRef.current) return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      const proj = activeProjRef.current
      if (!proj) return
      const updated = { ...proj, files: nextFiles, updatedAt: Date.now() }
      await saveProject(updated)
      activeProjRef.current = updated
      setActiveProj(updated)
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    }, 500)
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
      format:   handleFormatDocument,
      'cursor-above':  () => mainEditorRef.current?.runAction('editor.action.insertCursorAbove'),
      'cursor-below':  () => mainEditorRef.current?.runAction('editor.action.insertCursorBelow'),
      'select-next':   () => mainEditorRef.current?.runAction('editor.action.addSelectionToNextFindMatch'),
      'select-all-occurrences': () => mainEditorRef.current?.runAction('editor.action.selectHighlights'),
    }
    MAP[id]?.()
  }

  const FORMAT_PARSERS = {
    js: 'babel', jsx: 'babel', mjs: 'babel', cjs: 'babel',
    ts: 'babel-ts', tsx: 'babel-ts',
    json: 'json', json5: 'json5', jsonc: 'json5',
    css: 'css', scss: 'scss', less: 'less',
    html: 'html', htm: 'html', vue: 'vue',
    md: 'markdown', markdown: 'markdown',
  }
  async function loadPrettier() {
    if (window.__csPrettier) return window.__csPrettier
    const base = 'https://unpkg.com/prettier@3'
    const [prettier, babel, estree, postcss, html, markdown] = await Promise.all([
      import(/* @vite-ignore */ `${base}/standalone.mjs`),
      import(/* @vite-ignore */ `${base}/plugins/babel.mjs`),
      import(/* @vite-ignore */ `${base}/plugins/estree.mjs`),
      import(/* @vite-ignore */ `${base}/plugins/postcss.mjs`),
      import(/* @vite-ignore */ `${base}/plugins/html.mjs`),
      import(/* @vite-ignore */ `${base}/plugins/markdown.mjs`),
    ])
    window.__csPrettier = { prettier, plugins: [babel, estree, postcss, html, markdown] }
    return window.__csPrettier
  }
  async function handleFormatDocument() {
    if (!activeTab) return
    const ext = activeTab.split('.').pop().toLowerCase()
    const parser = FORMAT_PARSERS[ext]
    if (!parser) { notify(`Format Document doesn't support .${ext} files yet`, 'info'); return }
    try {
      const { prettier, plugins } = await loadPrettier()
      const formatted = await prettier.format(files[activeTab] || '', { parser, plugins })
      handleFileChange(activeTab, formatted)
      notify('Formatted', 'success')
    } catch (e) {
      // JSON at least always has a dependency-free fallback
      if (parser === 'json') {
        try {
          handleFileChange(activeTab, JSON.stringify(JSON.parse(files[activeTab] || '{}'), null, 2))
          notify('Formatted (fallback)', 'success')
          return
        } catch {}
      }
      notify(`Could not format — ${e.message?.slice(0, 90) || 'syntax error'}`, 'error')
    }
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
        onOpen={path => { openTab(path); setMobileSidebarOpen(false); setMobileView('editor') }}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onRename={handleRenameFile}
        onDelete={handleDeleteFile}
        onUpload={handleUpload}
        onMoveFile={handleMoveFile}
      />
    )
    if (activity === 'git') return (
      <CsGitPanel files={files} git={git} projectName={activeProj?.name} projectId={activeProj?.id}
        onImportProject={importGitHubProject}
        onRestoreFiles={f => { setFiles(f); notify('Checked out', 'success') }} />
    )
    if (activity === 'search') return <SearchPanel files={files} onOpen={openTab} onReplaceAll={handleReplaceAll} />
    if (activity === 'ai') return (
      <CsAIPanel
        activeFile={activeTab}
        fileContent={files[activeTab]}
        dirtyFiles={openTabs.filter(t => t.dirty).map(t => t.path)}
        projectId={activeProj?.id}
        onListFiles={agentListFiles}
        onReadFile={agentReadFile}
        onWriteFile={agentWriteFile}
        onDeleteFile={agentDeleteFile}
        onRunCommand={agentRunCommand}
      />
    )
    return null
  }

  return (
    <div
      className={`cs2-root ${zenMode ? 'cs2-zen' : ''}`}
      style={{ '--sidebar-w': `${sidebarWidth}px`, '--preview-w': `${previewWidth}px` }}
    >
      <CodeBg />

      {!booted && (
        <div className="cs2-boot" role="status" aria-live="polite">
          <div className="cs2-boot-mark">⚡</div>
          <div className="cs2-boot-name">CodeSpace</div>
          <div className="cs2-boot-bar"><span /></div>
        </div>
      )}

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
          onMenuToggle={() => setMobileSidebarOpen(o => !o)}
        />
      )}

      {/* Mobile-only Code/Preview switcher — Desktop Site OFF used to hide preview
          entirely (display:none in CSS); this restores full feature parity on
          narrow screens by making it a switchable view instead of a hidden one. */}
      {!zenMode && hasProject && (
        <div className="cs2-mobile-viewtabs">
          <button className={mobileSidebarOpen && activity === 'explorer' ? 'cs2-mvt-active' : ''} onClick={() => { handleActivity('explorer'); setMobileSidebarOpen(true) }}>📁 Files</button>
          <button className={mobileView === 'editor' ? 'cs2-mvt-active' : ''} onClick={() => { setMobileView('editor'); setMobileSidebarOpen(false) }}>📝 Code</button>
          <button className={mobileView === 'preview' ? 'cs2-mvt-active' : ''} onClick={() => { setMobileView('preview'); setMobileSidebarOpen(false) }}>▶ Preview</button>
          <button className={mobileSidebarOpen && activity === 'ai' ? 'cs2-mvt-active' : ''} onClick={() => { handleActivity('ai'); setMobileSidebarOpen(true) }}>✨ AI</button>
        </div>
      )}

      <div className={`cs2-layout ${zenMode ? 'cs2-layout-zen' : ''}`}>

        {!zenMode && (
          <ActivityBar active={activity} onSelect={handleActivity}
            terminalOpen={termOpen} previewOpen={prevOpen}
            onTerminal={() => setTerm(p => !p)} onPreview={() => setPrev(p => !p)}
            onSettings={() => setSettings(true)} />
        )}

        {!zenMode && mobileSidebarOpen && (
          <div className="cs2-mobile-backdrop" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {!zenMode && sideOpen && hasProject && (
          <>
            <div className={`cs2-sidebar ${mobileSidebarOpen ? 'cs2-sidebar-open' : ''}`}><SidePanel /></div>
            <CsResizeHandle
              width={sidebarWidth} onResize={setSidebarWidth}
              min={180} max={480} side="left"
              className="cs2-resize-handle-sidebar"
            />
          </>
        )}

        {!hasProject ? (
          <WelcomeScreen projects={projects}
            onNewProject={() => setTemplates(true)}
            onOpenProject={id => doOpenProject(projects.find(p => p.id === id))}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
          />
        ) : (
          <div className={`cs2-center ${mobileView !== 'editor' ? 'cs2-mobile-hide' : ''}`}>
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
                    <CsEditor ref={mainEditorRef} key={activeTab} value={activeContent} filename={activeTab}
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
          <>
            <CsResizeHandle
              width={previewWidth} onResize={setPreviewWidth}
              min={280} max={720} side="right"
              className="cs2-resize-handle-preview"
            />
            <div className={`cs2-preview-panel ${mobileView === 'preview' ? 'cs2-mobile-show' : ''}`}>
              <CsPreview files={files} entry={previewEntry}
                autoRefresh={settings.autoPreview} refreshTick={refreshTick} />
            </div>
          </>
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

export default function CodeSpace() {
  return (
    <GitHubProvider>
      <CodeSpaceInner />
    </GitHubProvider>
  )
}
