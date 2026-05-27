// ContextMenu.jsx — NEW
// Right-click context menu for canvas elements and empty space

import { useEffect, useRef } from 'react'
import './ContextMenu.css'

// ── Menu item definitions ─────────────────────────────────────
// type: 'item' | 'divider' | 'submenu'
function buildMenuItems({ el, selected, hasClipboard, onAction }) {
  if (!el) {
    // Right-click on empty canvas
    return [
      { type:'item', icon:'📋', label:'Paste',        shortcut:'Ctrl+V', action:'paste',      disabled:!hasClipboard },
      { type:'item', icon:'⬜', label:'Add Rect',      shortcut:'R',      action:'add-rect'  },
      { type:'item', icon:'⭕', label:'Add Circle',    shortcut:'C',      action:'add-circle'},
      { type:'item', icon:'T',  label:'Add Text',      shortcut:'X',      action:'add-text'  },
      { type:'divider' },
      { type:'item', icon:'⊞', label:'Toggle Grid',                       action:'toggle-grid'},
      { type:'item', icon:'⊟', label:'Toggle Guides',                     action:'toggle-guides'},
      { type:'divider' },
      { type:'item', icon:'🗑', label:'Clear Scene',                       action:'clear',    danger:true },
    ]
  }

  const multi = selected.length > 1
  return [
    { type:'item', icon:'✂', label:'Cut',             shortcut:'Ctrl+X', action:'cut'       },
    { type:'item', icon:'📋', label:'Copy',            shortcut:'Ctrl+C', action:'copy'      },
    { type:'item', icon:'📋', label:'Paste',           shortcut:'Ctrl+V', action:'paste',     disabled:!hasClipboard },
    { type:'item', icon:'⧉',  label:'Duplicate',       shortcut:'Ctrl+D', action:'duplicate' },
    { type:'divider' },
    ...(multi ? [
      { type:'item', icon:'⊞', label:`Group (${selected.length})`,        action:'group'     },
    ] : [
      { type:'item', icon: el.locked?'🔓':'🔒',
                     label: el.locked?'Unlock':'Lock',                     action:'toggle-lock'},
      { type:'item', icon: el.visible===false?'👁':'🙈',
                     label: el.visible===false?'Show':'Hide',              action:'toggle-vis' },
    ]),
    { type:'divider' },
    { type:'item', icon:'⬆', label:'Bring to Front',   shortcut:'Ctrl+]', action:'to-front'  },
    { type:'item', icon:'⬇', label:'Send to Back',     shortcut:'Ctrl+[', action:'to-back'   },
    { type:'item', icon:'↑',  label:'Bring Forward',                      action:'forward'   },
    { type:'item', icon:'↓',  label:'Send Backward',                      action:'backward'  },
    { type:'divider' },
    { type:'item', icon:'📐', label:'Align Center H',                     action:'align-cx'  },
    { type:'item', icon:'📐', label:'Align Center V',                     action:'align-cy'  },
    { type:'divider' },
    { type:'item', icon:'🗑', label: multi?`Delete (${selected.length})`:'Delete',
                   shortcut:'Del', action:'delete', danger:true },
  ]
}

// ── Context Menu Component ────────────────────────────────────
export default function ContextMenu({ x, y, el, selected, hasClipboard, onAction, onClose }) {
  const menuRef = useRef(null)

  // Close on outside click / Escape / scroll
  useEffect(() => {
    function close(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    function onKey(e) { if (e.key==='Escape') onClose() }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown',   onKey)
    document.addEventListener('scroll',    onClose, true)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown',   onKey)
      document.removeEventListener('scroll',    onClose, true)
    }
  }, [onClose])

  // Flip menu if near viewport edge
  const vw = window.innerWidth, vh = window.innerHeight
  const MENU_W = 210, MENU_H = 320
  const fx = x + MENU_W > vw - 8 ? x - MENU_W : x
  const fy = y + MENU_H > vh - 8 ? y - MENU_H : y

  const items = buildMenuItems({ el, selected, hasClipboard, onAction })

  function handleAction(action, e) {
    e.stopPropagation()
    onAction(action)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="ctx-menu"
      style={{ left: fx, top: fy }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Header */}
      <div className="ctx-header">
        {el
          ? <><span className="ctx-h-icon">{getShapeIcon(el.type)}</span><span className="ctx-h-name">{el.label||el.type}</span></>
          : <><span className="ctx-h-icon">🎨</span><span className="ctx-h-name">Canvas</span></>
        }
        {selected.length > 1 && <span className="ctx-h-badge">{selected.length} selected</span>}
      </div>

      <div className="ctx-separator"/>

      {/* Items */}
      {items.map((item, i) => {
        if (item.type === 'divider') return <div key={i} className="ctx-divider"/>

        return (
          <button
            key={i}
            className={`ctx-item ${item.danger?'danger':''} ${item.disabled?'disabled':''}`}
            onClick={item.disabled ? undefined : e => handleAction(item.action, e)}
            onMouseDown={e => e.stopPropagation()}
            disabled={item.disabled}
          >
            <span className="ctx-item-icon">{item.icon}</span>
            <span className="ctx-item-label">{item.label}</span>
            {item.shortcut && <span className="ctx-item-shortcut">{item.shortcut}</span>}
          </button>
        )
      })}
    </div>
  )
}

function getShapeIcon(type) {
  const m = { rect:'⬜', circle:'⭕', triangle:'△', star:'⭐', text:'T', line:'╱', draw:'✏️', image:'🖼️' }
  return m[type] || '◻'
    }
          
