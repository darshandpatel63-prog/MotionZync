// ============================================================
// CsFileExplorer.jsx  –  VS Code-style file tree
// Features: inline create, delete, rename, drag-drop move,
//           drag-drop reorder (manual per-folder sort), ZIP import
// ============================================================
import { useState, useRef, useEffect, useCallback } from 'react'
import { getLangFromExt, buildTree } from './cs-filesystem.js'
import { getConfig, setConfig } from './cs-storage.js'

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

  // Keep menu inside viewport
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

// ── Manual-order sort helpers (Phase 5) ─────────────────────────
// Children render alphabetically (dirs before files) until the user
// drags something within a folder — at that point that folder's order
// is captured and persisted (per project), and used from then on.
// Anything not yet in the saved order (new files, etc.) is appended
// at the end of its type group, alphabetically among themselves.
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

// Where on a row the pointer is determines the drop action. Folders get
// a middle "inside" band (existing drop-to-move-into behaviour); files
// only ever split top/bottom since they can't contain anything.
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

// ── Single tree node ──────────────────────────────────────────
function TreeNode({
  node, depth, activeFile, expanded, onToggle, order,
  onOpen, onRename, onDelete, onNewFile, onNewFolder,
  creating, onCreateConfirm, onCreateCancel,
  dragging, onDragStart, onDragEnd, onDropInto, onReorder,
  dropZone, onDragOverNode,
  clipboard, renamingPath, onRenameConfirm, onRenameCancel,
  onCtxMenu,
}) {
  const isDir    = node.type === 'dir'
  const isActive = !isDir && activeFile === node.path
  const isOpen   = expanded[node.path]
  const isRenaming = renamingPath === node.path

  const [renameVal, setRenameVal] = useState(node.name)
  const renameRef = useRef(null)
  useEffect(() => { if (isRenaming) { setRenameVal(node.name); setTimeout(() => renameRef.current?.select(), 50) } }, [isRenaming])

  const indent = depth * 14 + 6

  const isDropTarget = dragging && dragging !== node.path && dropZone?.path === node.path
  const dropClass = !isDropTarget ? '' :
    dropZone.position === 'inside' ? ' csfe-drop-inside' :
    dropZone.position === 'before' ? ' csfe-drop-before' : ' csfe-drop-after'

  function handleDragOver(e) {
    if (!dragging || dragging === node.path) return
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    onDragOverNode(node.path, readDropZone(e, isDir))
  }

  function handleDropEvent(e) {
    e.preventDefault()
    if (!dragging || dragging === node.path) return
    const zone = readDropZone(e, isDir)
    if (zone === 'inside') onDropInto(node.path)
    else onReorder(dragging, node.path, zone)
  }

  const children = isDir ? sortWithOrder(node.children || {}, node.path, order) : []

  return (
    <>
      <div
        className={`csfe-node ${isActive ? 'csfe-active' : ''} ${isDir ? 'csfe-dir' : ''}${dropClass}`}
        style={{ paddingLeft: indent }}
        onClick={() => isDir ? onToggle(node.path) : onOpen(node.path)}
        onContextMenu={e => { e.preventDefault(); onCtxMenu(e, node) }}
        draggable={!isRenaming}
        onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; onDragStart(node.path) }}
        onDragEnd={onDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
        title={node.path}
      >
        {/* Chevron / spacer */}
        {isDir
          ? <span className="csfe-chevron">{isOpen ? '▾' : '▸'}</span>
          : <span className="csfe-file-spacer" />
        }

        {/* Icon */}
        {isDir
          ? <span style={{ fontSize: '0.8rem' }}>{isOpen ? '📂' : '📁'}</span>
          : <FileIcon filename={node.name} />
        }

        {/* Name or rename input */}
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
          <span className="csfe-name" onDoubleClick={e => { e.stopPropagation(); onRename(node.path) }}>
            {node.name}
          </span>
        )}

        {/* Inline action buttons on hover */}
        {!isRenaming && (
          <span className="csfe-hover-actions" onClick={e => e.stopPropagation()}>
            {isDir && <button className="csfe-act-btn" title="New File" onClick={() => onNewFile(node.path)}>📄</button>}
            {isDir && <button className="csfe-act-btn" title="New Folder" onClick={() => onNewFolder(node.path)}>📁</button>}
            <button className="csfe-act-btn csfe-act-del" title="Delete" onClick={() => onDelete(node.path, isDir)}>🗑</button>
          </span>
        )}
      </div>

      {/* Children when open */}
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
              clipboard={clipboard}
              renamingPath={renamingPath}
              onRenameConfirm={onRenameConfirm}
              onRenameCancel={onRenameCancel}
              onCtxMenu={onCtxMenu}
            />
          ))}
          {/* Inline creation input inside this folder */}
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
  const [creating,    setCreating]   = useState(null)   // { dir, type }
  const [renamingPath,setRenaming]   = useState(null)
  const [dragging,    setDragging]   = useState(null)
  const [dropZone,    setDropZone]   = useState(null)   // { path, position: 'before'|'inside'|'after' }
  const [order,       setOrder]      = useState({})     // { [parentPath]: [childName, ...] }
  const [clipboard,   setClipboard]  = useState(null)   // { path, mode: 'cut' }
  const [ctx,         setCtx]        = useState(null)   // { x, y, node }
  const fileInputRef  = useRef(null)
  const zipInputRef   = useRef(null)

  const tree = buildTree(files || {})

  // Phase 5: load this project's manual sort order, and keep it saved
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
    // Auto-expand the target dir
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
    // Keep this file's spot in its folder's manual order, if it has one
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

  // ── Drag & Drop: move into a folder (existing behaviour) ───────
  function handleDropInto(targetDir) {
    if (!dragging || dragging === targetDir) return
    if (dragging.startsWith(targetDir + '/')) return  // Can't move into own child
    onMoveFile(dragging, targetDir)
    setDragging(null)
  }

  // ── Drag & Drop: reorder among siblings (Phase 5, new) ──────────
  // Dropping on the top/bottom edge of a row places the dragged item
  // right before/after it. If the drop target lives in a different
  // folder, this also performs the move — so dragging into a new
  // folder and dropping it in a specific spot works in one motion.
  function handleReorder(draggedPath, targetPath, position) {
    if (!draggedPath || draggedPath === targetPath) return
    if (targetPath.startsWith(draggedPath + '/')) return  // Can't drop into own descendant

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
    if (file) onUpload('__zip__', file)   // CodeSpace.jsx handles __zip__
    e.target.value = ''
  }

  // ── Search results ────────────────────────────────────────────
  const allPaths = Object.keys(files || {})
  const filtered = search ? allPaths.filter(p => p.toLowerCase().includes(search.toLowerCase())) : null

  const rootChildren = sortWithOrder(tree.children || {}, '', order)

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
    clipboard, renamingPath, onRenameConfirm: handleRenameConfirm, onRenameCancel: () => setRenaming(null),
    onCtxMenu: showCtx,
  }

  return (
    <div className="csfe-root">
      {/* Header */}
      <div className="csfe-header">
        <span className="csfe-title">EXPLORER</span>
        <div className="csfe-header-actions">
          <button className="csfe-icon-btn" title="New File"    onClick={() => startCreate('', 'file')}>📄</button>
          <button className="csfe-icon-btn" title="New Folder"  onClick={() => startCreate('', 'folder')}>📁</button>
          <button className="csfe-icon-btn" title="Upload Files" onClick={() => fileInputRef.current?.click()}>⬆️</button>
          <button className="csfe-icon-btn" title="Import ZIP"  onClick={() => zipInputRef.current?.click()}>📦</button>
        </div>
      </div>

      {/* Search */}
      <div className="csfe-search-wrap">
        <input className="csfe-search" placeholder="Search files..." value={search}
          onChange={e => setSearch(e.target.value)} />
        {search && <button className="csfe-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Project root */}
      <div className="csfe-project-label" onClick={() => setExpanded(p => ({ ...p, '': !p[''] }))}>
        <span>{expanded[''] ? '▾' : '▸'}</span>
        <span>📦 {projectName || 'PROJECT'}</span>
      </div>

      {/* Tree */}
      <div className="csfe-tree"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (dragging) handleDropInto('') }}>

        {filtered ? (
          filtered.length === 0
            ? <div className="csfe-empty">No files found</div>
            : filtered.map(path => (
              <div key={path}
                className={`csfe-node csfe-file ${activeFile === path ? 'csfe-active' : ''}`}
                style={{ paddingLeft: 12 }}
                onClick={() => onOpen(path)}>
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
            {/* Root level inline creation */}
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
