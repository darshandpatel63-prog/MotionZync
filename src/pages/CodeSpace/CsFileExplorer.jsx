// ============================================================
// CsFileExplorer.jsx  –  VS Code-style file tree
// Features: inline create, delete, rename, drag-drop move,
//           drag-drop reorder (manual per-folder sort),
//           multi-select (bulk delete / bulk move), ZIP import
// ============================================================
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { getLangFromExt, buildTree } from './cs-filesystem.js'
import { getConfig, setConfig } from './cs-storage.js'
import ignore from 'ignore'
import { useModalA11y } from './cs-a11y.js'

// ── Bulk-move destination picker (own component so it can use the
// focus-trap hook, which expects to mount only while actually open) ──
function MovePickerModal({ count, targets, moveTarget, setMoveTarget, onCancel, onConfirm }) {
  const modalRef = useModalA11y(onCancel)
  return (
    <div className="csfe-modal-overlay" onClick={onCancel}>
      <div className="csfe-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label="Move items" onClick={e => e.stopPropagation()}>
        <div className="csfe-modal-title">Move {count} item(s) to:</div>
        <select className="csfe-modal-select" value={moveTarget} onChange={e => setMoveTarget(e.target.value)}>
          <option value="__none__" disabled>Choose a folder…</option>
          {targets.map(f => (
            <option key={f || '__root__'} value={f}>{f === '' ? '/ (project root)' : f}</option>
          ))}
        </select>
        <div className="csfe-modal-actions">
          <button className="csfe-modal-btn" onClick={onCancel}>Cancel</button>
          <button className="csfe-modal-btn csfe-modal-primary" disabled={moveTarget === '__none__'} onClick={onConfirm}>Move</button>
        </div>
      </div>
    </div>
  )
}

// Phase 5.3 — always-ignored noise, e.g. from a ZIP import that included
// build output. A .gitignore committed in the project (if any) is layered
// on top of this via the 'ignore' package (spec-correct gitignore matching,
// safer than a hand-rolled glob matcher).
const DEFAULT_IGNORES = [
  'node_modules/', '.git/', 'dist/', 'build/', '.next/', 'out/',
  'coverage/', '.DS_Store', '*.log',
]

function FileIcon({ filename }) {
  const lang = getLangFromExt(filename)
  return <span style={{ color: lang.color, fontSize: '0.78rem', flexShrink: 0 }}>{lang.icon}</span>
}

// ── Inline input for new file/folder ─────────────────────────
function InlineInput({ type, depth, onConfirm, onCancel }) {
  const [val, setVal] = useState('')
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  function confirm() {
    const v = val.trim()
    if (v) onConfirm(v)
    else onCancel()
  }

  return (
    <div className="csfe-node" style={{ paddingLeft: depth * 14 + 20 }}>
      <span style={{ fontSize: '0.8rem', marginRight: 4 }}>
        {type === 'folder' ? '📁' : '📄'}
      </span>
      <input
        ref={ref}
        className="csfe-inline-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={confirm}
        onKeyDown={e => {
          if (e.key === 'Enter') confirm()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder={type === 'folder' ? 'folder name' : 'file name'}
      />
    </div>
  )
}

// ── Context menu ──────────────────────────────────────────────
function CtxMenu({ x, y, node, onClose, onNewFile, onNewFolder, onRename, onDelete, onCopy, onCut }) {
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) onClose() }
    setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const menuX = Math.min(x, window.innerWidth  - 170)
  const menuY = Math.min(y, window.innerHeight - 220)

  return (
    <div ref={ref} className="csfe-ctx-menu" style={{ left: menuX, top: menuY }}>
      {node.type === 'dir' && <>
        <button onClick={() => { onNewFile(node.path); onClose() }}>📄 New File</button>
        <button onClick={() => { onNewFolder(node.path); onClose() }}>📁 New Folder</button>
        <div className="csfe-ctx-sep" />
      </>}
      <button onClick={() => { onRename(node.path); onClose() }}>✏️ Rename</button>
      <button onClick={() => { onCopy(node.path); onClose() }}>📋 Copy Path</button>
      <button onClick={() => { onCut(node.path); onClose() }}>✂️ Cut (Move)</button>
      <div className="csfe-ctx-sep" />
      <button className="csfe-ctx-danger" onClick={() => { onDelete(node.path, node.type === 'dir'); onClose() }}>
        🗑️ Delete
      </button>
    </div>
  )
}

// ── Manual-order sort helpers (Phase 5.1) ────────────────────────
function sortWithOrder(children, parentPath, orderMap) {
  const saved = orderMap[parentPath] || []
  return Object.values(children).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    const oi = saved.indexOf(a.name)
    const oj = saved.indexOf(b.name)
    if (oi === -1 && oj === -1) return a.name.localeCompare(b.name)
    return (oi === -1 ? Infinity : oi) - (oj === -1 ? Infinity : oj)
  })
}

function findNodeByPath(root, path) {
  if (!path) return root
  let node = root
  for (const part of path.split('/')) {
    node = node?.children?.[part]
    if (!node) return null
  }
  return node
}

function readDropZone(e, isDir) {
  const rect  = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientY - rect.top) / rect.height
  if (isDir) {
    if (ratio < 0.25) return 'before'
    if (ratio > 0.75) return 'after'
    return 'inside'
  }
  return ratio < 0.5 ? 'before' : 'after'
}

// Collects every folder path in the tree (root included, as '') — used
// to populate the bulk-move destination picker.
function collectFolderPaths(node, path, out) {
  out.push(path)
  Object.values(node.children || {}).forEach(child => {
    if (child.type === 'dir') collectFolderPaths(child, child.path, out)
  })
}

// ── Single tree node ──────────────────────────────────────────
function TreeNode({
  node, depth, activeFile, expanded, onToggle, order,
  onOpen, onRename, onDelete, onNewFile, onNewFolder,
  creating, onCreateConfirm, onCreateCancel,
  dragging, onDragStart, onDragEnd, onDropInto, onReorder,
  dropZone, onDragOverNode,
  selectMode, selected, onToggleSelect,
  clipboard, renamingPath, onRenameConfirm, onRenameCancel,
  onCtxMenu,
}) {
  const isDir    = node.type === 'dir'
  const isActive = !isDir && activeFile === node.path
  const isOpen   = expanded[node.path]
  const isRenaming = renamingPath === node.path
  const isChecked  = selected?.has(node.path)

  const [renameVal, setRenameVal] = useState(node.name)
  const renameRef = useRef(null)
  useEffect(() => { if (isRenaming) { setRenameVal(node.name); setTimeout(() => renameRef.current?.select(), 50) } }, [isRenaming])

  const indent = depth * 14 + 6

  const isDropTarget = !selectMode && dragging && dragging !== node.path && dropZone?.path === node.path
  const dropClass = !isDropTarget ? '' :
    dropZone.position === 'inside' ? ' csfe-drop-inside' :
    dropZone.position === 'before' ? ' csfe-drop-before' : ' csfe-drop-after'

  function handleDragOver(e) {
    if (selectMode || !dragging || dragging === node.path) return
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    onDragOverNode(node.path, readDropZone(e, isDir))
  }

  function handleDropEvent(e) {
    e.preventDefault()
    if (selectMode || !dragging || dragging === node.path) return
    const zone = readDropZone(e, isDir)
    if (zone === 'inside') onDropInto(node.path)
    else onReorder(dragging, node.path, zone)
  }

  function handleRowClick() {
    if (selectMode) { onToggleSelect(node.path); return }
    isDir ? onToggle(node.path) : onOpen(node.path)
  }

  const children = isDir ? sortWithOrder(node.children || {}, node.path, order) : []

  return (
    <>
      <div
        className={`csfe-node ${isActive ? 'csfe-active' : ''} ${isDir ? 'csfe-dir' : ''}${dropClass}${isChecked ? ' csfe-selected' : ''}`}
        style={{ paddingLeft: indent }}
        onClick={handleRowClick}
        onContextMenu={e => { if (selectMode) return; e.preventDefault(); onCtxMenu(e, node) }}
        draggable={!isRenaming && !selectMode}
        onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; onDragStart(node.path) }}
        onDragEnd={onDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
        title={node.path}
        role="treeitem"
        tabIndex={isRenaming ? -1 : 0}
        aria-expanded={isDir ? isOpen : undefined}
        aria-selected={isActive || isChecked}
        onKeyDown={e => {
          if (isRenaming) return
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick() }
        }}
      >
        {selectMode && (
          <span className="csfe-select-box">{isChecked ? '☑' : '☐'}</span>
        )}

        {isDir
          ? <span className="csfe-chevron">{isOpen ? '▾' : '▸'}</span>
          : <span className="csfe-file-spacer" />
        }

        {isDir
          ? <span style={{ fontSize: '0.8rem' }}>{isOpen ? '📂' : '📁'}</span>
          : <FileIcon filename={node.name} />
        }

        {isRenaming ? (
          <input
            ref={renameRef}
            className="csfe-rename-input"
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={() => { const v = renameVal.trim(); v ? onRenameConfirm(node.path, v) : onRenameCancel() }}
            onKeyDown={e => {
              e.stopPropagation()
              if (e.key === 'Enter') { const v = renameVal.trim(); v ? onRenameConfirm(node.path, v) : onRenameCancel() }
              if (e.key === 'Escape') onRenameCancel()
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="csfe-name" onDoubleClick={e => { if (selectMode) return; e.stopPropagation(); onRename(node.path) }}>
            {node.name}
          </span>
        )}

        {!isRenaming && !selectMode && (
          <span className="csfe-hover-actions" onClick={e => e.stopPropagation()}>
            {isDir && <button className="csfe-act-btn" title="New File" aria-label="New File" onClick={() => onNewFile(node.path)}>📄</button>}
            {isDir && <button className="csfe-act-btn" title="New Folder" aria-label="New Folder" onClick={() => onNewFolder(node.path)}>📁</button>}
            <button className="csfe-act-btn csfe-act-del" title="Delete" aria-label="Delete" onClick={() => onDelete(node.path, isDir)}>🗑</button>
          </span>
        )}
      </div>

      {isDir && isOpen && (
        <>
          {children.map(child => (
            <TreeNode
              key={child.path || child.name}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              expanded={expanded}
              onToggle={onToggle}
              order={order}
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
              creating={creating}
              onCreateConfirm={onCreateConfirm}
              onCreateCancel={onCreateCancel}
              dragging={dragging}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDropInto={onDropInto}
              onReorder={onReorder}
              dropZone={dropZone}
              onDragOverNode={onDragOverNode}
              selectMode={selectMode}
              selected={selected}
              onToggleSelect={onToggleSelect}
              clipboard={clipboard}
              renamingPath={renamingPath}
              onRenameConfirm={onRenameConfirm}
              onRenameCancel={onRenameCancel}
              onCtxMenu={onCtxMenu}
            />
          ))}
          {creating && creating.dir === node.path && (
            <InlineInput
              type={creating.type}
              depth={depth + 1}
              onConfirm={name => onCreateConfirm(node.path, name, creating.type)}
              onCancel={onCreateCancel}
            />
          )}
        </>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
export default function CsFileExplorer({
  files, activeFile, projectName, projectId,
  onOpen, onNewFile, onNewFolder, onRename, onDelete, onUpload, onMoveFile,
}) {
  const [expanded,    setExpanded]   = useState({ '': true })
  const [search,      setSearch]     = useState('')
  const [creating,    setCreating]   = useState(null)
  const [renamingPath,setRenaming]   = useState(null)
  const [dragging,    setDragging]   = useState(null)
  const [dropZone,    setDropZone]   = useState(null)
  const [order,       setOrder]      = useState({})
  const [clipboard,   setClipboard]  = useState(null)
  const [ctx,         setCtx]        = useState(null)
  const [selectMode,  setSelectMode] = useState(false)
  const [selected,    setSelected]   = useState(() => new Set())
  const [movePicker,  setMovePicker] = useState(false)
  const [moveTarget,  setMoveTarget] = useState('__none__') // sentinel: '' is a real value (project root)
  const [showIgnored, setShowIgnored] = useState(false)
  const fileInputRef  = useRef(null)
  const zipInputRef   = useRef(null)

  // Phase 5.3: baseline noise patterns + the project's own .gitignore (if any)
  const gitignoreText = files?.['.gitignore'] || ''
  const ig = useMemo(() => {
    const inst = ignore()
    inst.add(DEFAULT_IGNORES)
    if (gitignoreText) inst.add(gitignoreText)
    return inst
  }, [gitignoreText])

  const { visibleFiles, ignoredCount } = useMemo(() => {
    const visible = {}
    let hidden = 0
    for (const path of Object.keys(files || {})) {
      if (path !== '.gitignore' && ig.ignores(path)) hidden++
      else visible[path] = files[path]
    }
    return { visibleFiles: showIgnored ? files : visible, ignoredCount: hidden }
  }, [files, ig, showIgnored])

  const tree = buildTree(visibleFiles || {})

  useEffect(() => {
    if (!projectId) { setOrder({}); return }
    let cancelled = false
    getConfig('fileOrder:' + projectId, {}).then(saved => { if (!cancelled) setOrder(saved || {}) })
    return () => { cancelled = true }
  }, [projectId])

  function persistOrder(next) {
    setOrder(next)
    if (projectId) setConfig('fileOrder:' + projectId, next)
  }

  function toggleDir(path) { setExpanded(p => ({ ...p, [path]: !p[path] })) }

  // ── Create ──────────────────────────────────────────────────
  function startCreate(dir, type) {
    setExpanded(p => ({ ...p, [dir]: true }))
    setCreating({ dir, type })
  }

  function handleCreateConfirm(parentDir, name, type) {
    const path = parentDir ? `${parentDir}/${name}` : name
    if (type === 'folder') {
      onNewFolder(parentDir, name)
      setExpanded(p => ({ ...p, [path]: true }))
    } else {
      onNewFile(parentDir, name)
    }
    setCreating(null)
  }

  // ── Rename ──────────────────────────────────────────────────
  function startRename(path) { setRenaming(path) }

  function handleRenameConfirm(oldPath, newName) {
    const parentPath = oldPath.includes('/') ? oldPath.slice(0, oldPath.lastIndexOf('/')) : ''
    const oldName     = oldPath.split('/').pop()
    if (order[parentPath]?.includes(oldName)) {
      persistOrder({ ...order, [parentPath]: order[parentPath].map(n => n === oldName ? newName : n) })
    }
    onRename(oldPath, newName)
    setRenaming(null)
  }

  // ── Delete ──────────────────────────────────────────────────
  function handleDelete(path, isDir) {
    if (!window.confirm(`Delete "${path.split('/').pop()}"?`)) return
    onDelete(path, isDir)
  }

  // ── Drag & Drop: move into a folder (existing) ───────────────
  function handleDropInto(targetDir) {
    if (!dragging || dragging === targetDir) return
    if (dragging.startsWith(targetDir + '/')) return
    onMoveFile(dragging, targetDir)
    setDragging(null)
  }

  // ── Drag & Drop: reorder among siblings (Phase 5.1) ─────────────
  function handleReorder(draggedPath, targetPath, position) {
    if (!draggedPath || draggedPath === targetPath) return
    if (targetPath.startsWith(draggedPath + '/')) return

    const draggedName   = draggedPath.split('/').pop()
    const draggedParent = draggedPath.includes('/') ? draggedPath.slice(0, draggedPath.lastIndexOf('/')) : ''
    const targetName    = targetPath.split('/').pop()
    const targetParent  = targetPath.includes('/') ? targetPath.slice(0, targetPath.lastIndexOf('/')) : ''

    const parentNode = findNodeByPath(tree, targetParent)
    if (!parentNode) return

    const seq = sortWithOrder(parentNode.children || {}, targetParent, order)
      .map(c => c.name)
      .filter(n => n !== draggedName)
    const idx = seq.indexOf(targetName)
    if (idx === -1) return
    seq.splice(position === 'after' ? idx + 1 : idx, 0, draggedName)

    persistOrder({ ...order, [targetParent]: seq })
    if (draggedParent !== targetParent) onMoveFile(draggedPath, targetParent)
    setDragging(null)
  }

  // ── Multi-select (Phase 5.2) ─────────────────────────────────────
  // Explicit "Select" toggle rather than long-press: long-press would
  // race against the drag-start gesture on rows that are already
  // draggable (Phase 5.1), which is a known source of flaky touch
  // behaviour. A plain toggle button keeps the two gestures from ever
  // competing for the same tap.
  function toggleSelectMode() {
    setSelectMode(m => !m)
    setSelected(new Set())
    setMovePicker(false)
    setCreating(null)
    setRenaming(null)
  }

  function toggleSelected(path) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }

  // Selecting a folder implicitly covers everything inside it, so a
  // selected descendant of another selected folder is dropped before
  // any bulk action runs — otherwise it'd be processed twice.
  function topLevelSelection() {
    const arr = [...selected]
    return arr.filter(p => !arr.some(other => other !== p && p.startsWith(other + '/')))
  }

  function handleBulkDelete() {
    const items = topLevelSelection()
    if (items.length === 0) return
    if (!window.confirm(`Delete ${items.length} item(s)? This can't be undone.`)) return
    items.forEach(path => {
      const n = findNodeByPath(tree, path)
      onDelete(path, n?.type === 'dir')
    })
    toggleSelectMode()
  }

  function openMovePicker() {
    if (topLevelSelection().length === 0) return
    setMoveTarget('__none__')
    setMovePicker(true)
  }

  function confirmBulkMove() {
    const items = topLevelSelection()
    items.forEach(path => {
      if (moveTarget === path || moveTarget.startsWith(path + '/')) return
      onMoveFile(path, moveTarget)
    })
    setMovePicker(false)
    toggleSelectMode()
  }

  // ── Cut / Paste (keyboard move) ──────────────────────────────
  function handleCut(path) { setClipboard({ path, mode: 'cut' }) }
  function handleCopyPath(path) {
    navigator.clipboard?.writeText(path)
  }

  // ── Context menu ─────────────────────────────────────────────
  function showCtx(e, node) {
    e.preventDefault()
    setCtx({ x: e.clientX, y: e.clientY, node })
  }

  // ── File upload ──────────────────────────────────────────────
  function handleUpload(e) {
    Array.from(e.target.files).forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => onUpload(f.name, ev.target.result)
      reader.readAsText(f)
    })
    e.target.value = ''
  }

  // ── ZIP import ────────────────────────────────────────────────
  function handleZipImport(e) {
    const file = e.target.files[0]
    if (file) onUpload('__zip__', file)
    e.target.value = ''
  }

  // ── Search results ────────────────────────────────────────────
  const allPaths = Object.keys(visibleFiles || {})
  const filtered = search ? allPaths.filter(p => p.toLowerCase().includes(search.toLowerCase())) : null

  const rootChildren = sortWithOrder(tree.children || {}, '', order)

  // Valid destinations for bulk move: every folder except ones that are
  // themselves selected, or nested inside a selected folder.
  let moveTargets = []
  if (movePicker) {
    collectFolderPaths(tree, '', moveTargets)
    const sel = new Set(topLevelSelection())
    moveTargets = moveTargets.filter(f => !sel.has(f) && ![...sel].some(s => f.startsWith(s + '/')))
  }

  const sharedProps = {
    activeFile, expanded, onToggle: toggleDir, order,
    onOpen,
    onRename: startRename, onDelete: handleDelete,
    onNewFile: (dir) => startCreate(dir, 'file'),
    onNewFolder: (dir) => startCreate(dir, 'folder'),
    creating, onCreateConfirm: handleCreateConfirm, onCreateCancel: () => setCreating(null),
    dragging, onDragStart: setDragging, onDragEnd: () => { setDragging(null); setDropZone(null) },
    onDropInto: handleDropInto, onReorder: handleReorder,
    dropZone, onDragOverNode: (path, position) => setDropZone({ path, position }),
    selectMode, selected, onToggleSelect: toggleSelected,
    clipboard, renamingPath, onRenameConfirm: handleRenameConfirm, onRenameCancel: () => setRenaming(null),
    onCtxMenu: showCtx,
  }

  return (
    <div className="csfe-root">
      {/* Header */}
      <div className="csfe-header">
        <span className="csfe-title">EXPLORER</span>
        <div className="csfe-header-actions">
          <button className="csfe-icon-btn" title="New File" aria-label="New File"    onClick={() => startCreate('', 'file')}>📄</button>
          <button className="csfe-icon-btn" title="New Folder" aria-label="New Folder"  onClick={() => startCreate('', 'folder')}>📁</button>
          <button className="csfe-icon-btn" title="Upload Files" aria-label="Upload Files" onClick={() => fileInputRef.current?.click()}>⬆️</button>
          <button className="csfe-icon-btn" title="Import ZIP" aria-label="Import ZIP"  onClick={() => zipInputRef.current?.click()}>📦</button>
          <button className={`csfe-icon-btn${selectMode ? ' csfe-icon-btn-active' : ''}`} title="Select" aria-label="Select" onClick={toggleSelectMode}>☑️</button>
          {ignoredCount > 0 && (
            <button className={`csfe-icon-btn csfe-icon-btn-badge${showIgnored ? ' csfe-icon-btn-active' : ''}`}
              title={showIgnored ? 'Hide ignored files again' : `${ignoredCount} files hidden (node_modules, dist, .gitignore, …) — tap to show`}
              aria-label={showIgnored ? 'Hide ignored files again' : `${ignoredCount} files hidden, tap to show`}
              onClick={() => setShowIgnored(s => !s)}>
              👁️{!showIgnored && <span className="csfe-badge">{ignoredCount}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Bulk-select action bar */}
      {selectMode && (
        <div className="csfe-select-bar">
          <span className="csfe-select-count">{selected.size} selected</span>
          <div className="csfe-select-bar-actions">
            <button className="csfe-select-btn" disabled={selected.size === 0} onClick={openMovePicker}>Move</button>
            <button className="csfe-select-btn csfe-select-btn-danger" disabled={selected.size === 0} onClick={handleBulkDelete}>Delete</button>
            <button className="csfe-select-btn" onClick={toggleSelectMode}>✕ Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="csfe-search-wrap">
        <input className="csfe-search" placeholder="Search files..." value={search}
          onChange={e => setSearch(e.target.value)} />
        {search && <button className="csfe-search-clear" aria-label="Clear search" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Project root */}
      <div className="csfe-project-label" onClick={() => setExpanded(p => ({ ...p, '': !p[''] }))}>
        <span>{expanded[''] ? '▾' : '▸'}</span>
        <span>📦 {projectName || 'PROJECT'}</span>
      </div>

      {/* Tree */}
      <div className="csfe-tree" role="tree" aria-multiselectable={selectMode}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (dragging) handleDropInto('') }}>

        {filtered ? (
          filtered.length === 0
            ? <div className="csfe-empty">No files found</div>
            : filtered.map(path => (
              <div key={path}
                className={`csfe-node csfe-file ${activeFile === path ? 'csfe-active' : ''}${selected.has(path) ? ' csfe-selected' : ''}`}
                style={{ paddingLeft: 12 }}
                role="treeitem" tabIndex={0} aria-selected={activeFile === path || selected.has(path)}
                onClick={() => selectMode ? toggleSelected(path) : onOpen(path)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMode ? toggleSelected(path) : onOpen(path) } }}>
                {selectMode && <span className="csfe-select-box">{selected.has(path) ? '☑' : '☐'}</span>}
                <span className="csfe-file-spacer" />
                <FileIcon filename={path.split('/').pop()} />
                <span className="csfe-name">{path}</span>
              </div>
            ))
        ) : (
          <>
            {expanded[''] && rootChildren.map(child => (
              <TreeNode key={child.path || child.name} node={child} depth={0} {...sharedProps} />
            ))}
            {creating && creating.dir === '' && (
              <InlineInput type={creating.type} depth={0}
                onConfirm={name => handleCreateConfirm('', name, creating.type)}
                onCancel={() => setCreating(null)} />
            )}
          </>
        )}

        {allPaths.length === 0 && !search && (
          <div className="csfe-empty">
            <div style={{ fontSize: '2rem', opacity: 0.3 }}>📂</div>
            <div>No files yet</div>
            <button className="csfe-empty-btn" onClick={() => startCreate('', 'file')}>Create File</button>
            <button className="csfe-empty-btn" onClick={() => zipInputRef.current?.click()}>Import ZIP</button>
          </div>
        )}
      </div>

      {/* Bulk-move destination picker */}
      {movePicker && (
        <MovePickerModal
          count={topLevelSelection().length}
          targets={moveTargets}
          moveTarget={moveTarget}
          setMoveTarget={setMoveTarget}
          onCancel={() => setMovePicker(false)}
          onConfirm={confirmBulkMove}
        />
      )}

      {/* Context menu */}
      {ctx && (
        <CtxMenu x={ctx.x} y={ctx.y} node={ctx.node}
          onClose={() => setCtx(null)}
          onNewFile={dir => startCreate(dir, 'file')}
          onNewFolder={dir => startCreate(dir, 'folder')}
          onRename={startRename}
          onDelete={handleDelete}
          onCopy={handleCopyPath}
          onCut={handleCut}
        />
      )}

      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={handleUpload} />
      <input ref={zipInputRef}  type="file" accept=".zip" style={{ display:'none' }} onChange={handleZipImport} />
    </div>
  )
}
