// ============================================================
// CsFileExplorer.jsx  –  VS Code-style file tree
// Features: inline create, delete, rename, drag-drop move, ZIP import
// ============================================================
import { useState, useRef, useEffect, useCallback } from 'react'
import { getLangFromExt, buildTree } from './cs-filesystem.js'

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

// ── Single tree node ──────────────────────────────────────────
function TreeNode({
  node, depth, activeFile, expanded, onToggle,
  onOpen, onRename, onDelete, onNewFile, onNewFolder,
  creating, onCreateConfirm, onCreateCancel,
  dragging, onDragStart, onDragEnd, onDrop,
  clipboard, renamingPath, onRenameConfirm, onRenameCancel,
  onCtxMenu,
}) {
  const isDir    = node.type === 'dir'
  const isActive = !isDir && activeFile === node.path
  const isOpen   = expanded[node.path]
  const isRenaming = renamingPath === node.path
  const isDragOver = dragging && dragging !== node.path

  const [renameVal, setRenameVal] = useState(node.name)
  const renameRef = useRef(null)
  useEffect(() => { if (isRenaming) { setRenameVal(node.name); setTimeout(() => renameRef.current?.select(), 50) } }, [isRenaming])

  const indent = depth * 14 + 6

  function handleDragOver(e) {
    if (!dragging || dragging === node.path) return
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
  }

  const children = isDir ? Object.values(node.children || {}).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name)
  }) : []

  return (
    <>
      <div
        className={`csfe-node ${isActive ? 'csfe-active' : ''} ${isDir ? 'csfe-dir' : ''}`}
        style={{ paddingLeft: indent }}
        onClick={() => isDir ? onToggle(node.path) : onOpen(node.path)}
        onContextMenu={e => { e.preventDefault(); onCtxMenu(e, node) }}
        draggable={!isRenaming}
        onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; onDragStart(node.path) }}
        onDragEnd={onDragEnd}
        onDragOver={handleDragOver}
        onDrop={e => { e.preventDefault(); if (isDir) onDrop(node.path) }}
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
              onDrop={onDrop}
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
  files, activeFile, projectName,
  onOpen, onNewFile, onNewFolder, onRename, onDelete, onUpload, onMoveFile,
}) {
  const [expanded,    setExpanded]   = useState({ '': true })
  const [search,      setSearch]     = useState('')
  const [creating,    setCreating]   = useState(null)   // { dir, type }
  const [renamingPath,setRenaming]   = useState(null)
  const [dragging,    setDragging]   = useState(null)
  const [clipboard,   setClipboard]  = useState(null)   // { path, mode: 'cut' }
  const [ctx,         setCtx]        = useState(null)   // { x, y, node }
  const fileInputRef  = useRef(null)
  const zipInputRef   = useRef(null)

  const tree = buildTree(files || {})

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
    onRename(oldPath, newName)
    setRenaming(null)
  }

  // ── Delete ──────────────────────────────────────────────────
  function handleDelete(path, isDir) {
    if (!window.confirm(`Delete "${path.split('/').pop()}"?`)) return
    onDelete(path, isDir)
  }

  // ── Drag & Drop Move ────────────────────────────────────────
  function handleDrop(targetDir) {
    if (!dragging || dragging === targetDir) return
    if (dragging.startsWith(targetDir + '/')) return  // Can't move into own child
    onMoveFile(dragging, targetDir)
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

  const rootChildren = Object.values(tree.children || {}).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  const sharedProps = {
    activeFile, expanded, onToggle: toggleDir, onOpen,
    onRename: startRename, onDelete: handleDelete,
    onNewFile: (dir) => startCreate(dir, 'file'),
    onNewFolder: (dir) => startCreate(dir, 'folder'),
    creating, onCreateConfirm: handleCreateConfirm, onCreateCancel: () => setCreating(null),
    dragging, onDragStart: setDragging, onDragEnd: () => setDragging(null), onDrop: handleDrop,
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
        onDrop={e => { e.preventDefault(); if (dragging) handleDrop('') }}>

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
                                        
