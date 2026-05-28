// SceneTabs.jsx — NEW (Feature 7)
// Multi-scene tab bar — below TopBar, above canvas
// Add · Switch · Rename (double-click) · Delete · Duplicate · Drag-to-reorder

import { useState, useRef } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import './SceneTabs.css'

const MAX_SCENES = 12

export default function SceneTabs() {
  const {
    scenes, activeSceneId,
    addScene, switchScene, deleteScene, renameScene, duplicateScene, reorderScenes,
  } = useCreator()

  const [renamingId,  setRenamingId]  = useState(null)
  const [renameVal,   setRenameVal]   = useState('')
  const [dragOver,    setDragOver]    = useState(null)
  const dragSrcRef = useRef(null)
  const renameRef  = useRef(null)

  // ── Switch / click ───────────────────────────────────────
  function handleTabClick(id) {
    if (renamingId) return
    switchScene(id)
  }

  // ── Double-click → rename ────────────────────────────────
  function handleDoubleClick(e, sc) {
    e.stopPropagation()
    setRenamingId(sc.id)
    setRenameVal(sc.name)
    setTimeout(() => renameRef.current?.select(), 30)
  }

  function commitRename(id) {
    if (renameVal.trim()) renameScene(id, renameVal.trim())
    setRenamingId(null); setRenameVal('')
  }

  // ── Delete ───────────────────────────────────────────────
  function handleDelete(e, id) {
    e.stopPropagation()
    if (scenes.length <= 1) return
    if (scenes.find(s=>s.id===id)?.elements?.length > 0)
      if (!window.confirm('Delete this scene and all its elements?')) return
    deleteScene(id)
  }

  // ── Duplicate ────────────────────────────────────────────
  function handleDuplicate(e, id) {
    e.stopPropagation()
    if (scenes.length >= MAX_SCENES) return
    duplicateScene(id)
  }

  // ── Add new scene ────────────────────────────────────────
  function handleAdd() {
    if (scenes.length >= MAX_SCENES) return
    addScene(`Scene ${scenes.length + 1}`)
  }

  // ── Drag to reorder ──────────────────────────────────────
  function onDragStart(e, idx) {
    dragSrcRef.current = idx
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', idx)
  }
  function onDragOver(e, idx) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(idx)
  }
  function onDrop(e, idx) {
    e.preventDefault()
    const from = dragSrcRef.current
    if (from !== null && from !== idx) reorderScenes(from, idx)
    dragSrcRef.current = null; setDragOver(null)
  }
  function onDragEnd() { dragSrcRef.current = null; setDragOver(null) }

  return (
    <div className="scene-tabs-bar">
      {/* Tabs */}
      <div className="scene-tabs-scroll">
        {scenes.map((sc, idx) => {
          const isActive  = sc.id === activeSceneId
          const isRenaming= renamingId === sc.id
          const isDragOver= dragOver === idx
          const elCount   = sc.elements?.length || 0

          return (
            <div
              key={sc.id}
              className={`sc-tab ${isActive?'active':''} ${isDragOver?'drag-over':''}`}
              onClick={() => handleTabClick(sc.id)}
              onDoubleClick={e => handleDoubleClick(e, sc)}
              draggable={!isRenaming}
              onDragStart={e => onDragStart(e, idx)}
              onDragOver={e  => onDragOver(e,  idx)}
              onDrop={e      => onDrop(e,       idx)}
              onDragEnd={onDragEnd}
              title={`${sc.name} · ${elCount} elements · Double-click to rename`}
            >
              {/* Scene colour dot */}
              <div className="sc-tab-dot" style={{ background: _sceneColor(idx) }}/>

              {/* Name or rename input */}
              {isRenaming ? (
                <input
                  ref={renameRef}
                  className="sc-tab-rename"
                  value={renameVal}
                  onChange={e => setRenameVal(e.target.value)}
                  onBlur={() => commitRename(sc.id)}
                  onKeyDown={e => {
                    if (e.key==='Enter')  commitRename(sc.id)
                    if (e.key==='Escape') { setRenamingId(null); setRenameVal('') }
                    e.stopPropagation()
                  }}
                  onClick={e => e.stopPropagation()}
                  maxLength={24}
                />
              ) : (
                <span className="sc-tab-name">{sc.name}</span>
              )}

              {/* Element count badge */}
              {elCount > 0 && !isRenaming && (
                <span className="sc-tab-count">{elCount}</span>
              )}

              {/* Action buttons (show on hover / active) */}
              {!isRenaming && (
                <div className="sc-tab-actions">
                  <button className="sc-tab-btn dup"
                    onClick={e => handleDuplicate(e, sc.id)}
                    title="Duplicate scene" disabled={scenes.length>=MAX_SCENES}>⧉</button>
                  {scenes.length > 1 && (
                    <button className="sc-tab-btn del"
                      onClick={e => handleDelete(e, sc.id)}
                      title="Delete scene">✕</button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add scene button */}
      <button
        className={`sc-add-btn ${scenes.length>=MAX_SCENES?'disabled':''}`}
        onClick={handleAdd}
        title={scenes.length>=MAX_SCENES ? `Max ${MAX_SCENES} scenes` : 'Add new scene (Alt+N)'}
        disabled={scenes.length>=MAX_SCENES}
      >
        + Scene
      </button>

      {/* Scene count */}
      <div className="sc-tabs-info">
        <span>{scenes.length}/{MAX_SCENES}</span>
      </div>
    </div>
  )
}

// ── Per-index hue for scene dots ──────────────────────────────
function _sceneColor(idx) {
  const COLORS = ['#7c3aed','#06b6d4','#f97316','#10b981','#ec4899','#f59e0b','#3b82f6','#8b5cf6','#14b8a6','#ef4444','#84cc16','#a78bfa']
  return COLORS[idx % COLORS.length]
}

