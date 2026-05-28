// ============================================================
// CsFileExplorer.jsx  –  VS Code-style file tree sidebar
// ============================================================
import { useState, useRef, useEffect } from 'react'
import { getLangFromExt, buildTree } from './cs-filesystem.js'

function FileIcon({ filename }) {
  const lang = getLangFromExt(filename)
  return <span style={{ color: lang.color, fontSize: '0.78rem', lineHeight: 1 }}>{lang.icon}</span>
}

function TreeNode({ node, depth, activeFile, onOpen, onRename, onDelete, onNewFile, onNewFolder, isExpanded, onToggle }) {
  const [ctx, setCtx]     = useState(null) // right-click menu pos
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(node.name)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  function handleCtx(e) {
    e.preventDefault()
    setCtx({ x: e.clientX, y: e.clientY })
  }

  function closeCtx() { setCtx(null) }

  function commitRename() {
    if (editVal.trim() && editVal !== node.name) onRename(node.path, editVal.trim())
    setEditing(false)
  }

  const isDir   = node.type === 'dir'
  const isActive = !isDir && activeFile === node.path
  const expanded = isExpanded?.[node.path]
  const indent   = depth * 14 + 6

  return (
    <>
      <div
        className={`csfe-node ${isActive ? 'csfe-active' : ''} ${isDir ? 'csfe-dir' : 'csfe-file'}`}
        style={{ paddingLeft: indent }}
        onClick={() => isDir ? onToggle(node.path) : onOpen(node.path)}
        onContextMenu={handleCtx}
        title={node.path}
      >
        {isDir ? (
          <span className="csfe-chevron">{expanded ? '▾' : '▸'}</span>
        ) : (
          <span className="csfe-file-spacer" />
        )}

        {isDir
          ? <span className="csfe-dir-icon">{expanded ? '📂' : '📁'}</span>
          : <FileIcon filename={node.name} />
        }

        {editing ? (
          <input
            ref={inputRef}
            className="csfe-rename-input"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setEditing(false)
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="csfe-name">{node.name}</span>
        )}
      </div>

      {/* Right-click context menu */}
      {ctx && (
        <>
          <div className="csfe-ctx-overlay" onClick={closeCtx} />
          <div className="csfe-ctx-menu" style={{ left: ctx.x, top: ctx.y }}>
            {isDir && <>
              <button onClick={() => { onNewFile(node.path); closeCtx() }}>📄 New File</button>
              <button onClick={() => { onNewFolder(node.path); closeCtx() }}>📁 New Folder</button>
              <div className="csfe-ctx-sep" />
            </>}
            {!isDir && <button onClick={() => { onOpen(node.path); closeCtx() }}>📂 Open</button>}
            <button onClick={() => { setEditing(true); setEditVal(node.name); closeCtx() }}>✏️ Rename</button>
            <button className="csfe-ctx-danger" onClick={() => { onDelete(node.path, isDir); closeCtx() }}>🗑️ Delete</button>
          </div>
        </>
      )}

      {/* Children */}
      {isDir && expanded && Object.values(node.children || {}).sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
        return a.name.localeCompare(b.name)
      }).map(child => (
        <TreeNode
          key={child.path || child.name}
          node={child}
          depth={depth + 1}
          activeFile={activeFile}
          onOpen={onOpen}
          onRename={onRename}
          onDelete={onDelete}
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

export default function CsFileExplorer({
  files,
  activeFile,
  onOpen,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
  onUpload,
  projectName,
}) {
  const [expanded, setExpanded] = useState({ '': true })
  const [search, setSearch]     = useState('')
  const fileInputRef = useRef(null)

  function toggleDir(path) {
    setExpanded(p => ({ ...p, [path]: !p[path] }))
  }

  const tree = buildTree(files || {})

  // Filtered flat list for search
  const allPaths = Object.keys(files || {})
  const filtered = search
    ? allPaths.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    : null

  function handleUpload(e) {
    const fileList = Array.from(e.target.files)
    fileList.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => onUpload?.(f.name, ev.target.result)
      reader.readAsText(f)
    })
    e.target.value = ''
  }

  return (
    <div className="csfe-root">
      {/* Header */}
      <div className="csfe-header">
        <span className="csfe-title">EXPLORER</span>
        <div className="csfe-header-actions">
          <button className="csfe-icon-btn" onClick={() => onNewFile('')} title="New File">📄</button>
          <button className="csfe-icon-btn" onClick={() => onNewFolder('')} title="New Folder">📁</button>
          <button className="csfe-icon-btn" onClick={() => fileInputRef.current?.click()} title="Upload Files">⬆️</button>
        </div>
      </div>

      {/* Search */}
      <div className="csfe-search-wrap">
        <input
          className="csfe-search"
          placeholder="Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="csfe-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Project root label */}
      <div className="csfe-project-label" onClick={() => setExpanded(p => ({ ...p, '': !p[''] }))}>
        <span>{expanded[''] ? '▾' : '▸'}</span>
        <span>📦 {projectName || 'PROJECT'}</span>
      </div>

      {/* Tree or search results */}
      <div className="csfe-tree">
        {filtered ? (
          filtered.length === 0
            ? <div className="csfe-empty">No files found</div>
            : filtered.map(path => (
                <div
                  key={path}
                  className={`csfe-node csfe-file ${activeFile === path ? 'csfe-active' : ''}`}
                  style={{ paddingLeft: 12 }}
                  onClick={() => onOpen(path)}
                >
                  <span className="csfe-file-spacer" />
                  <FileIcon filename={path.split('/').pop()} />
                  <span className="csfe-name csfe-search-match">{path}</span>
                </div>
              ))
        ) : (
          expanded[''] && Object.values(tree.children).sort((a, b) => {
            if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
            return a.name.localeCompare(b.name)
          }).map(child => (
            <TreeNode
              key={child.path || child.name}
              node={child}
              depth={0}
              activeFile={activeFile}
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
              isExpanded={expanded}
              onToggle={toggleDir}
            />
          ))
        )}

        {Object.keys(files || {}).length === 0 && !search && (
          <div className="csfe-empty">
            <div>📂</div>
            <div>No files yet</div>
            <button className="csfe-empty-btn" onClick={() => onNewFile('')}>New File</button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </div>
  )
}
