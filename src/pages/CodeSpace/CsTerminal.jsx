// ============================================================
// CsTerminal.jsx  –  Browser terminal emulator
// Full shell simulation: npm, git, file ops, history, colors
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react'

const ANSI = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  gray:   '\x1b[90m',
  bgRed:  '\x1b[41m',
}

function colorize(text, color) {
  return `${ANSI[color] || ''}${text}${ANSI.reset}`
}

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

// ── Shell command processor ───────────────────────────────────
function createShell(files, setFiles, git, projectName) {
  let cwd = '/'

  function resolve(path) {
    if (!path || path === '/') return '/'
    if (path.startsWith('/')) return path
    const parts = (cwd === '/' ? [] : cwd.slice(1).split('/'))
    for (const p of path.split('/')) {
      if (p === '..')  parts.pop()
      else if (p && p !== '.') parts.push(p)
    }
    return '/' + parts.join('/')
  }

  function relPath(path) {
    if (path === '/') return '/'
    if (path.startsWith('/')) return path.slice(1)
    return path
  }

  function getFilesInDir(dir) {
    const prefix = dir === '/' ? '' : relPath(dir) + '/'
    return Object.keys(files).filter(k =>
      dir === '/' ? !k.includes('/') : k.startsWith(prefix) && !k.slice(prefix.length).includes('/')
    )
  }

  async function run(input) {
    const trimmed = input.trim()
    if (!trimmed) return ''
    const parts   = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []
    const cmd     = parts[0]?.toLowerCase()
    const args    = parts.slice(1).map(a => a.replace(/^['"]|['"]$/g, ''))

    switch (cmd) {
      case 'help':
        return [
          colorize('Available commands:', 'cyan'),
          '',
          colorize('File System:', 'yellow'),
          '  ls              List files in current directory',
          '  cd <dir>        Change directory',
          '  pwd             Print working directory',
          '  cat <file>      Show file contents',
          '  touch <file>    Create empty file',
          '  mkdir <dir>     Create directory',
          '  rm <file>       Remove file',
          '  cp <src> <dst>  Copy file',
          '  mv <src> <dst>  Move/rename file',
          '  echo <text>     Print text',
          '',
          colorize('Package Manager:', 'yellow'),
          '  npm install [pkg]   Install package (simulated)',
          '  npm run <script>    Run script',
          '  npm list            List dependencies',
          '',
          colorize('Git:', 'yellow'),
          '  git status          Show changed files',
          '  git add .           Stage changes',
          '  git commit -m "msg" Commit changes',
          '  git log             Show commit history',
          '  git branch          List branches',
          '  git checkout <br>   Switch branch',
          '',
          colorize('Utilities:', 'yellow'),
          '  clear / cls         Clear terminal',
          '  date                Show current date/time',
          '  whoami              Show current user',
          '  env                 Show environment variables',
          '  node <file>         Run JS file (simulated)',
          '  python <file>       Run Python file (simulated)',
          '',
        ].join('\n')

      case 'clear':
      case 'cls':
        return '\x1b[2J\x1b[H'

      case 'pwd':
        return cwd

      case 'ls': {
        const target  = args[0] ? resolve(args[0]) : cwd
        const prefix  = target === '/' ? '' : relPath(target) + '/'
        const entries = new Set()
        for (const path of Object.keys(files)) {
          const rest = target === '/' ? path : (path.startsWith(prefix) ? path.slice(prefix.length) : null)
          if (rest !== null) {
            const part = rest.split('/')[0]
            if (part) entries.add(part + (rest.includes('/') ? '/' : ''))
          }
        }
        if (!entries.size) return colorize('(empty)', 'gray')
        return [...entries].sort().map(e =>
          e.endsWith('/')
            ? colorize(e, 'cyan')
            : colorize(e, 'white')
        ).join('  ')
      }

      case 'cd': {
        const target = args[0] || '/'
        if (target === '..') { cwd = cwd.split('/').slice(0, -1).join('/') || '/'; return '' }
        if (target === '~' || target === '/') { cwd = '/'; return '' }
        const newPath = resolve(target)
        const prefix  = newPath === '/' ? '' : relPath(newPath) + '/'
        const exists  = newPath === '/' || Object.keys(files).some(k => k.startsWith(prefix))
        if (!exists) return colorize(`cd: no such directory: ${target}`, 'red')
        cwd = newPath
        return ''
      }

      case 'cat': {
        if (!args[0]) return colorize('Usage: cat <file>', 'yellow')
        const path    = relPath(resolve(args[0]))
        const content = files[path]
        if (content === undefined) return colorize(`cat: ${args[0]}: No such file`, 'red')
        return colorize(content, 'white')
      }

      case 'touch': {
        if (!args[0]) return colorize('Usage: touch <file>', 'yellow')
        const path = relPath(resolve(args[0]))
        if (!files[path]) setFiles(f => ({ ...f, [path]: '' }))
        return ''
      }

      case 'mkdir': {
        if (!args[0]) return colorize('Usage: mkdir <dir>', 'yellow')
        const path = relPath(resolve(args[0]))
        const key  = `${path}/.gitkeep`
        setFiles(f => ({ ...f, [key]: '' }))
        return colorize(`Directory created: ${path}`, 'green')
      }

      case 'rm': {
        if (!args[0]) return colorize('Usage: rm <file>', 'yellow')
        const path = relPath(resolve(args[0]))
        if (!files[path]) return colorize(`rm: ${args[0]}: No such file`, 'red')
        setFiles(f => { const n = { ...f }; delete n[path]; return n })
        return colorize(`Removed: ${path}`, 'green')
      }

      case 'cp': {
        if (!args[1]) return colorize('Usage: cp <src> <dst>', 'yellow')
        const src = relPath(resolve(args[0]))
        const dst = relPath(resolve(args[1]))
        if (!files[src]) return colorize(`cp: ${args[0]}: No such file`, 'red')
        setFiles(f => ({ ...f, [dst]: f[src] }))
        return colorize(`Copied: ${src} → ${dst}`, 'green')
      }

      case 'mv': {
        if (!args[1]) return colorize('Usage: mv <src> <dst>', 'yellow')
        const src = relPath(resolve(args[0]))
        const dst = relPath(resolve(args[1]))
        if (!files[src]) return colorize(`mv: ${args[0]}: No such file`, 'red')
        setFiles(f => { const n = { ...f, [dst]: f[src] }; delete n[src]; return n })
        return colorize(`Moved: ${src} → ${dst}`, 'green')
      }

      case 'echo': {
        const text = args.join(' ').replace(/\\n/g, '\n')
        // handle echo "text" > file.txt
        const idx = args.indexOf('>')
        if (idx !== -1) {
          const content  = args.slice(0, idx).join(' ')
          const destFile = relPath(resolve(args[idx + 1]))
          setFiles(f => ({ ...f, [destFile]: content }))
          return colorize(`Written to ${destFile}`, 'green')
        }
        return text
      }

      case 'date':
        return new Date().toString()

      case 'whoami':
        return colorize('developer', 'cyan')

      case 'env':
        return [
          colorize('USER=developer', 'green'),
          colorize('HOME=/', 'green'),
          colorize(`PROJECT=${projectName}`, 'green'),
          colorize('EDITOR=CodeSpace', 'green'),
          colorize('TERM=xterm-256color', 'green'),
        ].join('\n')

      case 'node': {
        if (!args[0]) return colorize('Usage: node <file>', 'yellow')
        const path    = relPath(resolve(args[0]))
        const content = files[path]
        if (!content) return colorize(`node: ${args[0]}: File not found`, 'red')
        try {
          const logs = []
          const fakeConsole = { log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push(colorize(a.join(' '), 'red')), warn: (...a) => logs.push(colorize(a.join(' '), 'yellow')) }
          // eslint-disable-next-line no-new-func
          new Function('console', 'require', content)(fakeConsole, () => ({}))
          return logs.length ? logs.join('\n') : colorize('(no output)', 'gray')
        } catch (e) {
          return colorize(`Error: ${e.message}`, 'red')
        }
      }

      case 'python': {
        if (!args[0]) return colorize('Usage: python <file>', 'yellow')
        return [
          colorize('Python runtime is not available in browser.', 'yellow'),
          colorize('Tip: Use Pyodide integration for Python execution.', 'gray'),
          colorize('For now, view your Python code in the editor.', 'gray'),
        ].join('\n')
      }

      case 'npm': {
        const sub = args[0]
        if (sub === 'install' || sub === 'i') {
          const pkg = args[1]
          if (!pkg) {
            return [
              colorize('📦 Installing dependencies...', 'cyan'),
              colorize('✓ Dependencies resolved (simulated)', 'green'),
              colorize('Note: Actual npm requires Node.js runtime', 'gray'),
            ].join('\n')
          }
          return [
            colorize(`📦 Installing ${pkg}...`, 'cyan'),
            colorize(`✓ added ${pkg}@latest`, 'green'),
            colorize('Note: Actual install requires Node.js runtime', 'gray'),
          ].join('\n')
        }
        if (sub === 'run') {
          const pkgJson = files['package.json']
          if (!pkgJson) return colorize('No package.json found', 'red')
          try {
            const pkg  = JSON.parse(pkgJson)
            const script = pkg.scripts?.[args[1]]
            if (!script) return colorize(`Script '${args[1]}' not found in package.json`, 'red')
            return [
              colorize(`> ${script}`, 'cyan'),
              colorize('(Script execution requires Node.js runtime)', 'gray'),
            ].join('\n')
          } catch { return colorize('Invalid package.json', 'red') }
        }
        if (sub === 'list' || sub === 'ls') {
          const pkgJson = files['package.json']
          if (!pkgJson) return colorize('No package.json found', 'red')
          try {
            const pkg  = JSON.parse(pkgJson)
            const deps = { ...pkg.dependencies, ...pkg.devDependencies }
            if (!Object.keys(deps).length) return colorize('No dependencies', 'gray')
            return Object.entries(deps).map(([k,v]) => colorize(`${k}@${v}`, 'cyan')).join('\n')
          } catch { return colorize('Invalid package.json', 'red') }
        }
        return colorize('Usage: npm install|run|list', 'yellow')
      }

      case 'git': {
        const sub = args[0]
        if (!sub) return colorize('Usage: git <status|add|commit|log|branch|checkout>', 'yellow')
        if (sub === 'status') {
          return [
            colorize(`On branch main`, 'cyan'),
            colorize(`${Object.keys(files).length} file(s) tracked`, 'green'),
          ].join('\n')
        }
        if (sub === 'add') return colorize('Changes staged for commit ✓', 'green')
        if (sub === 'commit') {
          const msgIdx = args.indexOf('-m')
          const msg    = msgIdx !== -1 ? args[msgIdx + 1] : 'Update'
          return [
            colorize(`[main] ${msg}`, 'green'),
            colorize(`${Object.keys(files).length} files changed`, 'gray'),
          ].join('\n')
        }
        if (sub === 'log') {
          return [
            colorize('commit a1b2c3d (HEAD -> main)', 'yellow'),
            colorize('Author: Developer <dev@codespace.local>', 'white'),
            colorize('Date:   ' + new Date().toDateString(), 'white'),
            '',
            '    Initial commit',
          ].join('\n')
        }
        if (sub === 'branch') {
          const newBr = args[1]
          if (newBr) return colorize(`Branch '${newBr}' created`, 'green')
          return colorize('* main', 'green')
        }
        if (sub === 'checkout') {
          return colorize(`Switched to branch '${args[1] || 'main'}'`, 'green')
        }
        if (sub === 'stash') return colorize('Stash saved (simulated)', 'green')
        if (sub === 'pull')  return colorize('Already up to date. (simulated)', 'green')
        if (sub === 'push')  return colorize('Push successful (simulated)', 'green')
        return colorize(`git: '${sub}' is not a git command`, 'red')
      }

      default:
        return colorize(`${cmd}: command not found. Type 'help' for available commands.`, 'red')
    }
  }

  return { run, getCwd: () => cwd }
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
          
