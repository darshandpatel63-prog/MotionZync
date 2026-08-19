// ============================================================
// CsTerminal.jsx  –  Browser terminal emulator
// Full shell simulation: npm, git, file ops, history, colors
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react'
import { createShell, colorize } from './cs-shell.js'

function parseAnsi(str) {
  // Convert ANSI codes to styled spans
  const segments = []
  let remaining  = str
  let currentStyle = {}
  const ANSI_RE = /\x1b\[([0-9;]*)m/g
  let lastIdx = 0
  let match

  while ((match = ANSI_RE.exec(str)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ text: str.slice(lastIdx, match.index), style: { ...currentStyle } })
    }
    const code = parseInt(match[1]) || 0
    if (code === 0)  currentStyle = {}
    else if (code === 1)  currentStyle.fontWeight = 'bold'
    else if (code === 2)  currentStyle.opacity = 0.6
    else if (code === 31) currentStyle.color = '#f87171'
    else if (code === 32) currentStyle.color = '#4ade80'
    else if (code === 33) currentStyle.color = '#fbbf24'
    else if (code === 34) currentStyle.color = '#60a5fa'
    else if (code === 35) currentStyle.color = '#c084fc'
    else if (code === 36) currentStyle.color = '#22d3ee'
    else if (code === 37) currentStyle.color = '#f1f5f9'
    else if (code === 90) currentStyle.color = '#6b7280'
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < str.length) {
    segments.push({ text: str.slice(lastIdx), style: { ...currentStyle } })
  }
  if (!segments.length) segments.push({ text: str, style: {} })
  return segments
}

// ── Terminal line component ───────────────────────────────────
function TermLine({ line }) {
  if (line.type === 'input') {
    return (
      <div className="cst-line cst-input-line">
        <span className="cst-prompt">
          <span className="cst-prompt-user">dev</span>
          <span className="cst-prompt-at">@</span>
          <span className="cst-prompt-host">codespace</span>
          <span className="cst-prompt-colon">:</span>
          <span className="cst-prompt-path">{line.cwd || '~'}</span>
          <span className="cst-prompt-dollar">$</span>
        </span>
        <span className="cst-input-text">{line.text}</span>
      </div>
    )
  }
  if (line.type === 'output') {
    if (line.text === '\x1b[2J\x1b[H') return null // clear handled differently
    const segments = parseAnsi(line.text)
    return (
      <div className="cst-line cst-output-line">
        {segments.map((seg, i) => (
          <span key={i} style={seg.style}>{seg.text}</span>
        ))}
      </div>
    )
  }
  return null
}

export default function CsTerminal({ files, onFilesChange, projectName, gitRepo }) {
  const [lines,   setLines]   = useState([
    { type: 'output', text: colorize('CodeSpace Terminal v1.0', 'cyan') },
    { type: 'output', text: colorize("Type 'help' for available commands.", 'gray') },
    { type: 'output', text: '' },
  ])
  const [input,   setInput]   = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [cwd,     setCwd]     = useState('/')
  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const shellRef    = useRef(null)
  const filesRef    = useRef(files)

  useEffect(() => { filesRef.current = files }, [files])

  // Create shell with live file access
  useEffect(() => {
    shellRef.current = createShell(
      filesRef.current,
      onFilesChange,
      gitRepo,
      projectName
    )
  }, [onFilesChange, gitRepo, projectName])

  // Re-create shell when files change (for cat, ls, etc.)
  useEffect(() => {
    if (shellRef.current) {
      // Patch the shell's file reference
      shellRef.current = createShell(files, onFilesChange, gitRepo, projectName)
    }
  }, [files])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  async function submit() {
    const cmd = input.trim()
    setInput('')
    setHistIdx(-1)

    const newLines = [...lines, { type: 'input', text: cmd, cwd }]
    setLines(newLines)

    if (!cmd) return
    setHistory(h => [cmd, ...h.slice(0, 99)])

    const shell  = shellRef.current
    if (!shell) return

    const output = await shell.run(cmd)
    setCwd(shell.getCwd())

    if (output === '\x1b[2J\x1b[H') {
      setLines([]) // clear
      return
    }

    if (output) {
      const outputLines = output.split('\n').map(text => ({ type: 'output', text }))
      setLines(prev => [...prev, ...outputLines])
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = histIdx + 1
      if (idx < history.length) {
        setHistIdx(idx)
        setInput(history[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = histIdx - 1
      if (idx < 0) { setHistIdx(-1); setInput('') }
      else { setHistIdx(idx); setInput(history[idx]) }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete filenames
      const words = input.split(' ')
      const last  = words[words.length - 1]
      const matches = Object.keys(files).filter(f => f.startsWith(last))
      if (matches.length === 1) {
        words[words.length - 1] = matches[0]
        setInput(words.join(' '))
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('')
      setLines(prev => [...prev, { type: 'input', text: input + '^C', cwd }])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div className="cst-root" onClick={() => inputRef.current?.focus()}>
      <div className="cst-topbar">
        <span className="cst-title">⚡ TERMINAL</span>
        <div className="cst-topbar-actions">
          <button className="cst-btn" onClick={() => setLines([])} title="Clear">🗑️ Clear</button>
        </div>
      </div>

      <div className="cst-output">
        {lines.map((line, i) => <TermLine key={i} line={line} />)}
        <div ref={bottomRef} />
      </div>

      <div className="cst-input-row">
        <span className="cst-prompt">
          <span className="cst-prompt-user">dev</span>
          <span className="cst-prompt-at">@</span>
          <span className="cst-prompt-host">codespace</span>
          <span className="cst-prompt-colon">:</span>
          <span className="cst-prompt-path">{cwd === '/' ? '~' : cwd}</span>
          <span className="cst-prompt-dollar">$</span>
        </span>
        <input
          ref={inputRef}
          className="cst-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="Type a command..."
        />
      </div>
    </div>
  )
          }
          
