// TopBar.jsx — UPDATED (Feature 3)
// Added: 📁 Scenes button → SceneManager modal
//        FPS Monitor widget (Pro mode only)
//        Auto-save indicator

import { useState, useEffect, useRef } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import { scenesAPI  } from '../hooks/useScenes.js'
import SceneManager  from '../modals/SceneManager.jsx'
import FPSMonitor    from './FPSMonitor.jsx'
import './TopBar.css'

const TOOLS = [
  { id:'select',   icon:'↖',   label:'Select (V)'    },
  { id:'rect',     icon:'⬜',   label:'Rectangle (R)' },
  { id:'circle',   icon:'⭕',   label:'Circle (C)'    },
  { id:'triangle', icon:'△',    label:'Triangle (T)'  },
  { id:'star',     icon:'⭐',   label:'Star'          },
  { id:'text',     icon:'T',    label:'Text (X)'      },
  { id:'line',     icon:'╱',    label:'Line (L)'      },
  { id:'draw',     icon:'✏️',   label:'Draw (D)'      },
  { id:'image',    icon:'🖼️',  label:'Image (I)'     },
]

const AUTO_SAVE_KEY  = 'mz_autosave'
const AUTO_SAVE_MS   = 30_000   // every 30 seconds

export default function TopBar({ onExport, onLibrary }) {
  const {
    activeTool, setTool, mode, setMode,
    undo, redo, zoom, setZoom,
    clearScene, history, future,
    elements, dispatch, showGrid, showGuides,
    bgColor,
  } = useCreator()

  const [showScenes,  setShowScenes]  = useState(false)
  const [autoSaveMsg, setAutoSaveMsg] = useState('')   // '' | 'saving…' | 'saved'
  const autoTimerRef = useRef(null)

  // ── Auto-save every 30s ────────────────────────────────────
  useEffect(() => {
    if (!elements.length) return
    clearTimeout(autoTimerRef.current)
    autoTimerRef.current = setTimeout(() => {
      setAutoSaveMsg('saving…')
      try {
        const state = { elements, bgColor, showGrid, showGuides }
        scenesAPI.save(state, {
          id:   AUTO_SAVE_KEY,
          name: `⟳ Autosave — ${new Date().toLocaleTimeString()}`,
        })
        setAutoSaveMsg('✓ autosaved')
      } catch {
        setAutoSaveMsg('✗ save failed')
      }
      setTimeout(() => setAutoSaveMsg(''), 2500)
    }, AUTO_SAVE_MS)
    return () => clearTimeout(autoTimerRef.current)
  }, [elements, bgColor, showGrid, showGuides])

  function handleZoom(delta) { setZoom(zoom + delta) }

  // ── Quick save (Ctrl+S) ────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey||e.metaKey) && e.key==='s') {
        e.preventDefault()
        if (!elements.length) return
        setAutoSaveMsg('saving…')
        const state = { elements, bgColor, showGrid, showGuides }
        scenesAPI.save(state, { id:AUTO_SAVE_KEY, name:`⟳ Autosave — ${new Date().toLocaleTimeString()}` })
        setAutoSaveMsg('✓ saved (Ctrl+S)')
        setTimeout(() => setAutoSaveMsg(''), 2200)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [elements, bgColor, showGrid, showGuides])

  return (
    <>
      <div className="topbar">
        {/* Logo */}
        <div className="topbar-logo">
          <span className="tl-icon">⚡</span>
          <span className="tl-name">AnimCreator</span>
          <span className="tl-version">v2.0</span>
        </div>

        <div className="topbar-divider"/>

        {/* Tool groups */}
        <div className="tool-section">
          <span className="tool-section-label">TOOLS</span>
          <div className="tools-row">
            {TOOLS.map(t => (
              <button
                key={t.id}
                className={`tool-btn ${activeTool===t.id?'active':''}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                <span className="tool-icon">{t.icon}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="topbar-divider"/>

        {/* Undo / Redo */}
        <div className="topbar-group">
          <button className={`topbar-action-btn ${!history.length?'disabled':''}`}
            onClick={undo} title="Undo (Ctrl+Z)" disabled={!history.length}>↩</button>
          <button className={`topbar-action-btn ${!future.length?'disabled':''}`}
            onClick={redo} title="Redo (Ctrl+Y)" disabled={!future.length}>↪</button>
        </div>

        <div className="topbar-divider"/>

        {/* Zoom */}
        <div className="topbar-group">
          <button className="topbar-action-btn" onClick={() => handleZoom(-0.1)} title="Zoom out">−</button>
          <span className="zoom-label">{Math.round(zoom*100)}%</span>
          <button className="topbar-action-btn" onClick={() => handleZoom(+0.1)} title="Zoom in">+</button>
          <button className="topbar-action-btn small" onClick={() => setZoom(1)} title="Reset zoom">⊡</button>
        </div>

        <div className="topbar-divider"/>

        {/* View toggles */}
        <div className="topbar-group">
          <button
            className={`topbar-toggle ${showGrid?'on':''}`}
            onClick={() => dispatch({type:'SET_SHOW_GRID', value:!showGrid})}
            title="Toggle Grid (G)">⊞ Grid</button>
          <button
            className={`topbar-toggle ${showGuides?'on':''}`}
            onClick={() => dispatch({type:'SET_SHOW_GUIDES', value:!showGuides})}
            title="Toggle Guides">⊟ Guides</button>
        </div>

        <div className="topbar-divider"/>

        {/* ── Scenes button (NEW) ───────────────────────────── */}
        <div className="topbar-group">
          <button
            className="topbar-action-btn scenes-btn"
            onClick={() => setShowScenes(true)}
            title="Scene Manager — Save / Load scenes (Ctrl+S)"
          >
            📁 Scenes
            {scenesAPI.list().length > 0 && (
              <span className="scenes-count">{scenesAPI.list().length}</span>
            )}
          </button>

          {/* Auto-save status */}
          {autoSaveMsg && (
            <span className={`autosave-msg ${autoSaveMsg.startsWith('✓')?'ok':'pending'}`}>
              {autoSaveMsg}
            </span>
          )}
        </div>

        <div className="topbar-spacer"/>

        {/* FPS Monitor — Pro mode only (NEW) */}
        {mode === 'pro' && <FPSMonitor/>}

        {mode === 'pro' && <div className="topbar-divider"/>}

        {/* Mode switch */}
        <div className="mode-switch">
          <button className={`mode-btn ${mode==='simple'?'active':''}`} onClick={() => setMode('simple')}>Simple</button>
          <button className={`mode-btn ${mode==='pro'?'active':''}`}    onClick={() => setMode('pro')}>Pro</button>
        </div>

        <div className="topbar-divider"/>

        {/* Actions */}
        <div className="topbar-group">
          <button className="topbar-action-btn accent"     onClick={onLibrary}  title="Block Library">📦 Library</button>
          <button className="topbar-action-btn clear-btn"  onClick={clearScene} title="Clear scene">🗑</button>
          <button className="topbar-action-btn export-btn" onClick={onExport}   title="Export Code">⬇ Export</button>
        </div>
      </div>

      {/* Scene Manager modal */}
      {showScenes && <SceneManager onClose={() => setShowScenes(false)}/>}
    </>
  )
      }
            
