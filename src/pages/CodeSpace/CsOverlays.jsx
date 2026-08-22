// ============================================================
// CsOverlays.jsx  –  Command Palette, Settings, Templates, ENV
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { getLangFromExt, TEMPLATES } from './cs-filesystem.js'
import { useModalA11y } from './cs-a11y.js'

// ── Command Palette ───────────────────────────────────────────
export function CommandPalette({ files, onClose, onOpenFile, onAction }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  const modalRef = useModalA11y(onClose)

  const COMMANDS = [
    { id: 'save',     label: 'Save File',        icon: '💾', shortcut: 'Ctrl+S' },
    { id: 'new-file', label: 'New File',          icon: '📄', shortcut: '' },
    { id: 'terminal', label: 'Toggle Terminal',   icon: '⚡', shortcut: '`' },
    { id: 'preview',  label: 'Toggle Preview',    icon: '👁', shortcut: '' },
    { id: 'git',      label: 'Toggle Git Panel',  icon: '⎇', shortcut: '' },
    { id: 'zen',      label: 'Zen Mode',          icon: '🧘', shortcut: '' },
    { id: 'export',   label: 'Export ZIP',        icon: '📦', shortcut: '' },
    { id: 'share',    label: 'Share Project',     icon: '🔗', shortcut: '' },
    { id: 'settings', label: 'Open Settings',     icon: '⚙️', shortcut: '' },
    { id: 'split',    label: 'Split Editor',      icon: '⬜', shortcut: '' },
    { id: 'format',   label: 'Format Document',   icon: '✨', shortcut: '' },
    { id: 'cursor-above', label: 'Add Cursor Above',           icon: '↖', shortcut: '' },
    { id: 'cursor-below', label: 'Add Cursor Below',           icon: '↙', shortcut: '' },
    { id: 'select-next',  label: 'Select Next Occurrence',     icon: '⇥', shortcut: '' },
    { id: 'select-all-occurrences', label: 'Select All Occurrences', icon: '⇶', shortcut: '' },
  ]

  const lq        = query.toLowerCase()
  const allPaths  = Object.keys(files || {})
  const matchedFiles = lq ? allPaths.filter(p => p.toLowerCase().includes(lq)).slice(0, 6) : allPaths.slice(0, 6)
  const matchedCmds  = lq ? COMMANDS.filter(c => c.label.toLowerCase().includes(lq)) : COMMANDS

  return (
    <div className="cs2-palette-overlay" onClick={onClose}>
      <div className="cs2-palette" ref={modalRef} role="dialog" aria-modal="true" aria-label="Command palette" onClick={e => e.stopPropagation()}>
        <div className="cs2-palette-search">
          <span className="cs2-palette-magnify">🔍</span>
          <input
            ref={inputRef}
            className="cs2-palette-input"
            placeholder="Type a command or file name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          <span className="cs2-palette-esc">ESC</span>
        </div>
        <div className="cs2-palette-results">
          {matchedFiles.length > 0 && (
            <>
              <div className="cs2-palette-section">FILES</div>
              {matchedFiles.map(path => {
                const lang = getLangFromExt(path)
                return (
                  <button key={path} className="cs2-palette-item"
                    onClick={() => { onOpenFile(path); onClose() }}>
                    <span style={{ color: lang.color }}>{lang.icon}</span>
                    <span className="cs2-palette-label">{path}</span>
                  </button>
                )
              })}
            </>
          )}
          {matchedCmds.length > 0 && (
            <>
              <div className="cs2-palette-section">COMMANDS</div>
              {matchedCmds.map(cmd => (
                <button key={cmd.id} className="cs2-palette-item"
                  onClick={() => { onAction(cmd.id); onClose() }}>
                  <span>{cmd.icon}</span>
                  <span className="cs2-palette-label">{cmd.label}</span>
                  {cmd.shortcut && <span className="cs2-palette-shortcut">{cmd.shortcut}</span>}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Settings Panel ────────────────────────────────────────────
const THEMES = [
  { id: 'cs-dark',  label: 'Dark (Default)' },
  { id: 'vs-dark',  label: 'Dark (VS Code)' },
  { id: 'cs-light', label: 'Light' },
  { id: 'hc-black', label: 'High Contrast' },
]

export function SettingsPanel({ settings, onChange, onClose }) {
  const modalRef = useModalA11y(onClose)
  return (
    <div className="cs2-settings-overlay" onClick={onClose}>
      <div className="cs2-settings" ref={modalRef} role="dialog" aria-modal="true" aria-label="Settings" onClick={e => e.stopPropagation()}>
        <div className="cs2-settings-header">
          <span>⚙️ Settings</span>
          <button aria-label="Close settings" onClick={onClose}>✕</button>
        </div>
        <div className="cs2-settings-body">
          <label className="cs2-setting">
            <span>Theme</span>
            <select value={settings.theme} onChange={e => onChange('theme', e.target.value)}>
              {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label className="cs2-setting">
            <span>Font Size</span>
            <input type="range" min={10} max={24} value={settings.fontSize}
              onChange={e => onChange('fontSize', +e.target.value)} />
            <span className="cs2-setting-val">{settings.fontSize}px</span>
          </label>
          <label className="cs2-setting cs2-setting-toggle">
            <span>Minimap</span>
            <input type="checkbox" checked={settings.minimap}
              onChange={e => onChange('minimap', e.target.checked)} />
          </label>
          <label className="cs2-setting cs2-setting-toggle">
            <span>Word Wrap</span>
            <input type="checkbox" checked={settings.wordWrap === 'on'}
              onChange={e => onChange('wordWrap', e.target.checked ? 'on' : 'off')} />
          </label>
          <label className="cs2-setting cs2-setting-toggle">
            <span>Auto Save</span>
            <input type="checkbox" checked={settings.autoSave}
              onChange={e => onChange('autoSave', e.target.checked)} />
          </label>
          <label className="cs2-setting cs2-setting-toggle">
            <span>Auto Preview</span>
            <input type="checkbox" checked={settings.autoPreview}
              onChange={e => onChange('autoPreview', e.target.checked)} />
          </label>
        </div>
      </div>
    </div>
  )
}

// ── Template Picker ───────────────────────────────────────────
export function TemplatePicker({ onSelect, onClose }) {
  const categories = [...new Set(TEMPLATES.map(t => t.category))]
  const [cat, setCat] = useState(categories[0])
  const modalRef = useModalA11y(onClose)

  return (
    <div className="cs2-tmpl-overlay" onClick={onClose}>
      <div className="cs2-tmpl" ref={modalRef} role="dialog" aria-modal="true" aria-label="New project from template" onClick={e => e.stopPropagation()}>
        <div className="cs2-tmpl-header">
          <span>🚀 New Project</span>
          <button aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="cs2-tmpl-cats">
          {categories.map(c => (
            <button key={c} className={`cs2-tmpl-cat ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="cs2-tmpl-grid">
          {TEMPLATES.filter(t => t.category === cat).map(t => (
            <button key={t.id} className="cs2-tmpl-card" onClick={() => onSelect(t.id)}>
              <span className="cs2-tmpl-icon">{t.icon}</span>
              <span className="cs2-tmpl-name">{t.name}</span>
              <span className="cs2-tmpl-desc">{t.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ENV Editor ────────────────────────────────────────────────
export function EnvEditor({ files, onChange }) {
  const [vals, setVals]   = useState({})
  const [masked, setMask] = useState({})

  useEffect(() => {
    const parsed = {}
    for (const line of (files['.env'] || '').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (m) parsed[m[1]] = m[2]
    }
    setVals(parsed)
  }, [files['.env']])

  function update(k, v) {
    const next = { ...vals, [k]: v }
    setVals(next)
    onChange('.env', Object.entries(next).map(([k, v]) => `${k}=${v}`).join('\n'))
  }

  function addVar() {
    const k = prompt('Variable name (e.g. API_KEY):')
    if (k?.trim()) update(k.trim(), '')
  }

  function removeVar(k) {
    const next = { ...vals }; delete next[k]
    setVals(next)
    onChange('.env', Object.entries(next).map(([k, v]) => `${k}=${v}`).join('\n'))
  }

  return (
    <div className="cs2-env-editor">
      <div className="cs2-env-header">
        <span>🔐 Environment Variables</span>
        <button className="cs2-env-add" onClick={addVar}>+ Add</button>
      </div>
      {Object.entries(vals).map(([k, v]) => (
        <div key={k} className="cs2-env-row">
          <span className="cs2-env-key">{k}</span>
          <input className="cs2-env-val" type={masked[k] ? 'password' : 'text'}
            value={v} onChange={e => update(k, e.target.value)} />
          <button className="cs2-env-mask" aria-label={masked[k] ? `Show value of ${k}` : `Hide value of ${k}`}
            onClick={() => setMask(p => ({ ...p, [k]: !p[k] }))}>
            {masked[k] ? '👁' : '🙈'}
          </button>
          <button className="cs2-env-del" aria-label={`Remove ${k}`} onClick={() => removeVar(k)}>✕</button>
        </div>
      ))}
      {Object.keys(vals).length === 0 && (
        <div className="cs2-env-empty">No variables. Click + Add to create one.</div>
      )}
    </div>
  )
}

// ── ENV Modal Wrapper ─────────────────────────────────────────
export function EnvModal({ files, onChange, onClose }) {
  const modalRef = useModalA11y(onClose)
  return (
    <div className="cs2-env-overlay" onClick={onClose}>
      <div className="cs2-env-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label="Environment variables" onClick={e => e.stopPropagation()}>
        <div className="cs2-env-modal-header">
          <span>🔐 Environment Variables</span>
          <button aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <EnvEditor files={files} onChange={onChange} />
      </div>
    </div>
  )
}

// ── Search Panel ──────────────────────────────────────────────
export function SearchPanel({ files, onOpen, onReplaceAll }) {
  const [query, setQuery] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = caseSensitive ? query : query.toLowerCase()
    const found = []
    for (const [path, content] of Object.entries(files)) {
      content.split('\n').forEach((line, i) => {
        const hay = caseSensitive ? line : line.toLowerCase()
        if (hay.includes(q)) found.push({ path, lineNo: i + 1, preview: line.trim().slice(0, 80) })
      })
    }
    setResults(found.slice(0, 200))
  }, [query, files, caseSensitive])

  const fileCount = new Set(results.map(r => r.path)).size

  function doReplaceAll() {
    if (!query.trim() || !results.length) return
    if (!window.confirm(`Replace ${results.length} match${results.length === 1 ? '' : 'es'} in ${fileCount} file${fileCount === 1 ? '' : 's'}? This can't be undone.`)) return
    onReplaceAll?.(query, replaceText, caseSensitive)
  }

  return (
    <div className="cs2-search-panel">
      <div className="csfe-header">
        <span className="csfe-title">SEARCH</span>
        <button className="cs2-search-toggle" onClick={() => setShowReplace(s => !s)} title="Toggle replace">⇄ Replace</button>
      </div>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <input className="csfe-search" placeholder="Search in files..."
          value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%' }} />
        {showReplace && (
          <div className="cs2-search-replacerow">
            <input className="csfe-search" placeholder="Replace with..."
              value={replaceText} onChange={e => setReplaceText(e.target.value)} style={{ width: '100%' }} />
            <button className="cs2-search-replaceall" onClick={doReplaceAll} disabled={!results.length}>Replace All</button>
          </div>
        )}
        <label className="cs2-search-case">
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} /> Case sensitive
        </label>
        {query && <div className="cs2-search-summary">{results.length} result{results.length === 1 ? '' : 's'} in {fileCount} file{fileCount === 1 ? '' : 's'}</div>}
      </div>
      <div className="cs2-search-results">
        {results.length === 0 && query && <div className="csfe-empty">No results found</div>}
        {results.map((r, i) => (
          <div key={i} className="cs2-search-result" onClick={() => onOpen(r.path)}>
            <div className="cs2-search-result-path">{r.path}:{r.lineNo}</div>
            <div className="cs2-search-result-line">{r.preview}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Notification Toast ────────────────────────────────────────
export function Notifications({ items }) {
  return (
    <div className="cs2-notifications">
      {items.map(n => (
        <div key={n.id} className={`cs2-notification cs2-notif-${n.type}`}>
          {n.type === 'success' ? '✓' : n.type === 'error' ? '✗' : 'ℹ'} {n.message}
        </div>
      ))}
    </div>
  )
            }
                                      
