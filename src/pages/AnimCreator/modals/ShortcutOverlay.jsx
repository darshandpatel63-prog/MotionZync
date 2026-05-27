// ShortcutOverlay.jsx — NEW
// Press ? to open — full keyboard shortcut reference

import { useEffect } from 'react'
import './ShortcutOverlay.css'

const SECTIONS = [
  {
    title: '🖱 Selection & Navigation',
    rows: [
      ['V',            'Select tool'],
      ['Click',        'Select element'],
      ['Shift + Click','Add to selection'],
      ['Drag (empty)', 'Marquee multi-select'],
      ['Escape',       'Deselect all'],
      ['Space + Drag', 'Pan canvas'],
      ['Scroll Wheel', 'Zoom in / out'],
    ],
  },
  {
    title: '✏️ Tools',
    rows: [
      ['R',  'Rectangle'],
      ['C',  'Circle'],
      ['T',  'Triangle'],
      ['X',  'Text'],
      ['L',  'Line'],
      ['D',  'Draw (freehand)'],
      ['I',  'Image (upload)'],
    ],
  },
  {
    title: '⚙️ Edit',
    rows: [
      ['Ctrl + Z',     'Undo'],
      ['Ctrl + Y',     'Redo'],
      ['Ctrl + C',     'Copy selected'],
      ['Ctrl + V',     'Paste'],
      ['Ctrl + D',     'Duplicate'],
      ['Delete / ⌫',  'Delete selected'],
    ],
  },
  {
    title: '🎞 Layers & Order',
    rows: [
      ['Ctrl + ]',  'Bring to front'],
      ['Ctrl + [',  'Send to back'],
      ['Right-click → Layer', 'Bring forward / backward'],
    ],
  },
  {
    title: '🔭 View',
    rows: [
      ['+  /  −',   'Zoom in / out'],
      ['⊡',         'Reset zoom to 100%'],
      ['G',         'Toggle grid'],
    ],
  },
  {
    title: '🖥 Canvas Actions',
    rows: [
      ['Right-click', 'Context menu'],
      ['?',           'Open this shortcut overlay'],
      ['Escape',      'Close overlay / deselect'],
    ],
  },
]

export default function ShortcutOverlay({ onClose }) {
  // Close on Escape or ?
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' || e.key === '?') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sc-backdrop" onMouseDown={onClose}>
      <div className="sc-panel" onMouseDown={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sc-header">
          <span className="sc-logo">⌨️</span>
          <div>
            <div className="sc-title">Keyboard Shortcuts</div>
            <div className="sc-sub">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</div>
          </div>
          <button className="sc-close" onClick={onClose}>✕</button>
        </div>

        {/* Sections grid */}
        <div className="sc-grid">
          {SECTIONS.map(sec => (
            <div key={sec.title} className="sc-section">
              <div className="sc-section-title">{sec.title}</div>
              <table className="sc-table">
                <tbody>
                  {sec.rows.map(([key, desc]) => (
                    <tr key={key} className="sc-row">
                      <td className="sc-key-cell">
                        {key.split('+').map((k, i) => (
                          <span key={i}>
                            {i > 0 && <span className="sc-plus">+</span>}
                            <kbd className="sc-kbd">{k.trim()}</kbd>
                          </span>
                        ))}
                      </td>
                      <td className="sc-desc">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sc-footer">
          <span>AnimCreator v2.0</span>
          <span>·</span>
          <span>All shortcuts work when canvas is focused</span>
        </div>
      </div>
    </div>
  )
}

