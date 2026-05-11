import { useEffect, useRef, useState } from 'react'
import './LivePreview.css'

export function buildSandboxHTML(css, js, bgColor) {
  const bg = bgColor || '#0a0a0f'
  return (
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/>' +
    '<style>*{margin:0;padding:0;box-sizing:border-box;}' +
    'html,body{width:100%;height:100vh;overflow:hidden;background:' + bg + ';}' +
    '#container{width:100%;height:100%;position:relative;}</style>' +
    (css ? '<style>' + css + '</style>' : '') +
    '</head><body><div id="container"></div>' +
    '<script>(function(){"use strict";try{' + (js||'') +
    '}catch(e){document.body.innerHTML="<div style=\'color:#ef4444;font-family:monospace;padding:1rem;font-size:13px\'>❌ "+e.message+"</div>";}})();<\/script>' +
    '</body></html>'
  )
}

export default function LivePreview({ cssCode, jsCode, bgColor }) {
  const iframeRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor)
    }, 500)
    return () => clearTimeout(t)
  }, [cssCode, jsCode, bgColor])

  useEffect(() => {
    if (!ready && iframeRef.current) {
      iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor)
      setReady(true)
    }
  }, [])

  return (
    <div className="live-preview">
      <div className="preview-header">
        <span className="preview-dot red"/><span className="preview-dot yellow"/><span className="preview-dot green"/>
        <span className="preview-label">Live Preview</span>
      </div>
      <iframe ref={iframeRef} className="preview-iframe" sandbox="allow-scripts" title="preview"/>
    </div>
  )
}
