// ============================================================
// CsPreview.jsx  –  Live preview with device frames & console
// Fixed (Phase 1 / Step 3): removed 'allow-same-origin' from the sandbox —
//   combined with allow-scripts + srcdoc it let previewed code read this
//   page's localStorage (where the encrypted key vault lives). Preview is
//   fully self-contained (CSS/JS inlined) so same-origin was never actually
//   needed. Also validate postMessage sender via e.source (not just e.data
//   shape) so only this iframe's console output is trusted.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'

const VIEWPORTS = [
  { id: 'responsive', label: 'Responsive', icon: '↔', w: null,  h: null },
  { id: 'mobile',     label: 'Mobile',     icon: '📱', w: 375,  h: 667  },
  { id: 'tablet',     label: 'Tablet',     icon: '📲', w: 768,  h: 1024 },
  { id: 'desktop',    label: 'Desktop',    icon: '🖥', w: 1280, h: 800  },
]

function buildPreviewHtml(files, entry) {
  // Resolve all relative imports for single-file preview
  const entryContent = files[entry] || ''

  // Inject CSS and JS directly for multi-file support
  let html = entryContent

  // Replace <link rel="stylesheet" href="..."> with inline style
  html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*\/?>/gi, (match, href) => {
    const cssPath = resolveRelPath(entry, href)
    const css = files[cssPath] || files[href] || ''
    return css ? `<style>\n/* ${href} */\n${css}\n</style>` : ''
  })

  // Replace <script src="..."> with inline script
  html = html.replace(/<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
    if (src.startsWith('http') || src.startsWith('//')) return match // keep CDN
    const jsPath = resolveRelPath(entry, src)
    const js = files[jsPath] || files[src] || ''
    return js ? `<script>\n/* ${src} */\n${js}\n</script>` : ''
  })

  // Baseline background (Phase 1 / Fix 4): preview must default to white,
  // never the dark IDE chrome behind it. Inserted at the very start of
  // <head> — i.e. BEFORE any of the user's own <style>/<link> tags — so it
  // sits earliest in cascade order. Any background rule the user writes
  // themselves (even plain `body { background: ... }`) comes later at
  // equal-or-higher specificity and wins naturally. No user code is touched.
  const baseline = `<style>html,body{background:#fff;margin:0}</style>`
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n${baseline}`)
  } else if (html.includes('<body')) {
    html = html.replace(/<body[^>]*>/, match => `${baseline}\n${match}`)
  } else {
    html = baseline + html
  }

  // Inject console capture + error overlay
  const consolePatch = `
<script>
(function() {
  const _log   = console.log.bind(console)
  const _warn  = console.warn.bind(console)
  const _error = console.error.bind(console)
  const send   = (type, args) => {
    try { window.parent.postMessage({ type: 'console', level: type, args: args.map(a => {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a) } catch { return String(a) }
    })}, '*') } catch {}
  }
  console.log   = (...a) => { _log(...a);   send('log',   a) }
  console.warn  = (...a) => { _warn(...a);  send('warn',  a) }
  console.error = (...a) => { _error(...a); send('error', a) }
  window.onerror = (msg, src, line, col, err) => {
    send('error', [\`Runtime Error: \${msg} (line \${line})\`])
    const d = document.createElement('div')
    d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#ef4444;color:#fff;padding:8px 12px;font-size:12px;font-family:monospace;z-index:9999;'
    d.textContent = 'JS Error: ' + msg + ' (line ' + line + ')'
    document.body?.appendChild(d)
    setTimeout(() => d.remove(), 5000)
    return false
  }
  window.addEventListener('unhandledrejection', e => {
    send('error', ['Unhandled Promise: ' + e.reason])
  })
})()
</script>`

  // Insert before </head> or at start of <body>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${consolePatch}\n</head>`)
  } else if (html.includes('<body')) {
    html = html.replace(/<body[^>]*>/, match => match + consolePatch)
  } else {
    html = consolePatch + html
  }

  return html
}

function resolveRelPath(base, rel) {
  if (rel.startsWith('/')) return rel.slice(1)
  const baseParts = base.split('/')
  baseParts.pop()
  const relParts = rel.split('/')
  for (const p of relParts) {
    if (p === '..') baseParts.pop()
    else if (p && p !== '.') baseParts.push(p)
  }
  return baseParts.join('/')
}

// ── Console viewer ────────────────────────────────────────────
function ConsoleLog({ log }) {
  const colors = { log: '#e2e8f0', warn: '#fbbf24', error: '#f87171', info: '#60a5fa' }
  const icons  = { log: '▸', warn: '⚠', error: '✕', info: 'ℹ' }
  return (
    <div className={`csp-console-log csp-console-${log.level}`}>
      <span className="csp-console-icon" style={{ color: colors[log.level] }}>{icons[log.level]}</span>
      <span className="csp-console-text" style={{ color: colors[log.level] }}>
        {log.args.join(' ')}
      </span>
      <span className="csp-console-time">{log.time}</span>
    </div>
  )
}

export default function CsPreview({ files, entry, autoRefresh = true, refreshTick }) {
  const [viewport,  setViewport]  = useState('responsive')
  const [consoleLogs, setLogs]    = useState([])
  const [showConsole, setConsole] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [errorCount, setErrCount] = useState(0)
  const [scale,      setScale]    = useState(1)
  const iframeRef = useRef(null)
  const wrapRef   = useRef(null)

  const vp = VIEWPORTS.find(v => v.id === viewport) || VIEWPORTS[0]

  // Listen for console messages from iframe
  useEffect(() => {
    function onMsg(e) {
      if (e.source !== iframeRef.current?.contentWindow) return // only trust our own preview frame
      if (e.data?.type !== 'console') return
      const log = {
        level: e.data.level,
        args:  e.data.args,
        time:  new Date().toLocaleTimeString(),
      }
      setLogs(prev => [...prev.slice(-199), log])
      if (e.data.level === 'error') setErrCount(c => c + 1)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  // Refresh preview
  const refresh = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !entry || !files[entry]) return
    setLoading(true)
    setErrCount(0)
    const html = buildPreviewHtml(files, entry)
    iframe.srcdoc = html
    setTimeout(() => setLoading(false), 500)
  }, [files, entry])

  useEffect(() => { refresh() }, [refreshTick])
  useEffect(() => {
    if (autoRefresh) {
      const t = setTimeout(refresh, 600)
      return () => clearTimeout(t)
    }
  }, [files, entry, autoRefresh, refresh])

  // Scale for device frames (Phase 1 / Fix 5 rebuild). Previously only
  // recalculated when `viewport` itself changed, so the frame stayed
  // mis-scaled after a side-panel toggle, window resize, or orientation
  // change — exactly the "doesn't work properly" symptom. A ResizeObserver
  // now recalculates whenever the panel's actual size changes. A 0.35
  // floor keeps content legible on small phones instead of shrinking to
  // unreadable size; `.csp-frame-wrap` already has overflow:auto so the
  // rest of the frame stays reachable by panning.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (!vp.w) { setScale(1); return }
    const recalc = () => {
      const available = el.clientWidth - 48
      setScale(Math.max(0.35, Math.min(1, available / vp.w)))
    }
    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [viewport])

  return (
    <div className="csp-root">
      {/* Toolbar */}
      <div className="csp-toolbar">
        <div className="csp-viewport-btns">
          {VIEWPORTS.map(v => (
            <button
              key={v.id}
              className={`csp-vp-btn ${viewport === v.id ? 'active' : ''}`}
              onClick={() => setViewport(v.id)}
              title={v.label}
            >{v.icon}</button>
          ))}
        </div>

        <div className="csp-url-bar">
          <span className="csp-lock">🔒</span>
          <span className="csp-url-text">preview / {entry || 'index.html'}</span>
          {loading && <div className="csp-spinner" />}
          <span className={`csp-live-badge ${loading ? 'csp-loading' : ''}`}>
            <span className="csp-live-dot" />LIVE
          </span>
        </div>

        <div className="csp-toolbar-right">
          <button
            className={`csp-console-btn ${errorCount > 0 ? 'csp-has-errors' : ''}`}
            onClick={() => setConsole(p => !p)}
            title="Toggle Console"
          >
            🖥 Console {errorCount > 0 && <span className="csp-err-badge">{errorCount}</span>}
          </button>
          <button className="csp-refresh-btn" onClick={refresh} title="Refresh">↻</button>
        </div>
      </div>

      {/* Preview area */}
      <div ref={wrapRef} className="csp-frame-wrap">
        {vp.w ? (
          <div
            className="csp-device-frame"
            style={{
              width:  vp.w,
              height: vp.h,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="csp-device-notch" />
            <iframe
              ref={iframeRef}
              className="csp-iframe"
              sandbox="allow-scripts allow-forms allow-modals"
              title="preview"
              style={{ width: vp.w, height: vp.h }}
            />
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="csp-iframe csp-iframe-full"
            sandbox="allow-scripts allow-forms allow-modals"
            title="preview"
          />
        )}

        {!entry && (
          <div className="csp-no-preview">
            <div className="csp-no-preview-icon">👁</div>
            <div>Select an HTML file to preview</div>
          </div>
        )}
      </div>

      {/* Console panel */}
      {showConsole && (
        <div className="csp-console-panel">
          <div className="csp-console-header">
            <span>🖥 Console ({consoleLogs.length})</span>
            <button onClick={() => setLogs([])} className="csp-console-clear">Clear</button>
          </div>
          <div className="csp-console-logs">
            {consoleLogs.length === 0
              ? <div className="csp-console-empty">No console output</div>
              : consoleLogs.map((log, i) => <ConsoleLog key={i} log={log} />)
            }
          </div>
        </div>
      )}
    </div>
  )
                                            }

        