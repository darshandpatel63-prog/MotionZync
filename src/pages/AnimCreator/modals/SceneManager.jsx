// SceneManager.jsx — NEW
// Full scene management modal: save, load, rename, delete, duplicate

import { useState, useEffect, useRef } from 'react'
import { scenesAPI } from '../hooks/useScenes.js'
import { useCreator } from '../store/CreatorContext.jsx'
import './SceneManager.css'

export default function SceneManager({ onClose }) {
  const { elements, bgColor, showGrid, showGuides, dispatch } = useCreator()
  const [scenes,       setScenes]      = useState([])
  const [renamingId,   setRenamingId]  = useState(null)
  const [renameVal,    setRenameVal]   = useState('')
  const [saving,       setSaving]      = useState(false)
  const [saveMsg,      setSaveMsg]     = useState('')
  const [newName,      setNewName]     = useState('')
  const [storageInfo,  setStorageInfo] = useState({ usedKB: 0 })
  const renameRef = useRef(null)

  function refresh() {
    setScenes(scenesAPI.list())
    setStorageInfo(scenesAPI.storageInfo())
  }
  useEffect(() => { refresh() }, [])
  useEffect(() => { if (renamingId) renameRef.current?.focus() }, [renamingId])

  // ── Save current scene ────────────────────────────────────
  function handleSave() {
    if (!elements.length) { setSaveMsg('⚠ Nothing on canvas to save!'); return }
    const name   = newName.trim() || undefined
    const state  = { elements, bgColor, showGrid, showGuides }
    scenesAPI.save(state, { name })
    setNewName('')
    setSaveMsg('✓ Scene saved!')
    refresh()
    setTimeout(() => setSaveMsg(''), 2200)
  }

  // ── Load scene into canvas ────────────────────────────────
  function handleLoad(id) {
    const data = scenesAPI.load(id)
    if (!data) return
    dispatch({ type:'LOAD_ELEMENTS',   elements: data.elements || [] })
    if (data.bgColor)    dispatch({ type:'SET_BG_COLOR',    color: data.bgColor    })
    if (data.showGrid    !== undefined) dispatch({ type:'SET_SHOW_GRID',   value: data.showGrid    })
    if (data.showGuides  !== undefined) dispatch({ type:'SET_SHOW_GUIDES', value: data.showGuides  })
    dispatch({ type:'SELECT', ids: [] })
    onClose()
  }

  // ── Delete ────────────────────────────────────────────────
  function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return
    scenesAPI.delete(id)
    refresh()
  }

  // ── Rename ────────────────────────────────────────────────
  function commitRename(id) {
    if (renameVal.trim()) scenesAPI.rename(id, renameVal.trim())
    setRenamingId(null); setRenameVal('')
    refresh()
  }

  // ── Duplicate ─────────────────────────────────────────────
  function handleDuplicate(id) {
    scenesAPI.duplicate(id)
    refresh()
  }

  const storagePercent = Math.min(100, Math.round(storageInfo.usedKB / 51.2))  // ~5MB limit

  return (
    <div className="sm-backdrop" onMouseDown={onClose}>
      <div className="sm-panel" onMouseDown={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sm-header">
          <span className="sm-logo">📁</span>
          <div>
            <div className="sm-title">Scene Manager</div>
            <div className="sm-sub">{scenes.length} saved · {storageInfo.usedKB} KB used</div>
          </div>
          <button className="sm-close" onClick={onClose}>✕</button>
        </div>

        {/* Save current */}
        <div className="sm-save-row">
          <input
            className="sm-name-input"
            placeholder="Scene name (optional)…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleSave()}
            maxLength={48}
          />
          <button className="sm-save-btn" onClick={handleSave} disabled={saving}>
            💾 Save Current
          </button>
          {saveMsg && <span className="sm-save-msg">{saveMsg}</span>}
        </div>

        {/* Storage bar */}
        <div className="sm-storage">
          <div className="sm-storage-bar">
            <div className="sm-storage-fill" style={{ width:`${storagePercent}%` }}/>
          </div>
          <span className="sm-storage-label">{storageInfo.usedKB} KB / ~5 MB</span>
        </div>

        {/* Scene list */}
        <div className="sm-list">
          {scenes.length === 0 && (
            <div className="sm-empty">
              <span className="sm-empty-icon">🎞</span>
              <span>No saved scenes yet</span>
              <span className="sm-empty-sub">Add elements and click "Save Current"</span>
            </div>
          )}

          {scenes.map(sc => (
            <div key={sc.id} className="sm-card">
              {/* Thumbnail */}
              <div className="sm-thumb">
                {sc.thumbnail
                  ? <img src={sc.thumbnail} alt={sc.name} className="sm-thumb-img"/>
                  : <span className="sm-thumb-ph">🎨</span>
                }
              </div>

              {/* Info */}
              <div className="sm-info">
                {renamingId === sc.id ? (
                  <input
                    ref={renameRef}
                    className="sm-rename-input"
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(sc.id)}
                    onKeyDown={e => { if(e.key==='Enter') commitRename(sc.id); if(e.key==='Escape'){setRenamingId(null);setRenameVal('')} }}
                    maxLength={48}
                  />
                ) : (
                  <div className="sm-name"
                    onDoubleClick={() => { setRenamingId(sc.id); setRenameVal(sc.name) }}>
                    {sc.name}
                  </div>
                )}
                <div className="sm-meta">
                  <span>{sc.elementCount ?? '?'} elements</span>
                  <span>·</span>
                  <span>{_timeAgo(sc.savedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="sm-actions">
                <button className="sm-act-btn load"      onClick={() => handleLoad(sc.id)}      title="Load">▶ Load</button>
                <button className="sm-act-btn dupe"      onClick={() => handleDuplicate(sc.id)} title="Duplicate">⧉</button>
                <button className="sm-act-btn rename-btn"
                  onClick={() => { setRenamingId(sc.id); setRenameVal(sc.name) }} title="Rename">✎</button>
                <button className="sm-act-btn del"       onClick={() => handleDelete(sc.id, sc.name)} title="Delete">🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sm-footer">
          <span>Double-click scene name to rename · Scenes stored in localStorage</span>
        </div>
      </div>
    </div>
  )
}

function _timeAgo(ts) {
  if (!ts) return ''
  const d = Date.now() - ts
  if (d < 60000)   return 'just now'
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`
  if (d < 86400000)return `${Math.floor(d/3600000)}h ago`
  return new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short'})
              }
                    
