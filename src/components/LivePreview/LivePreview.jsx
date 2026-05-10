import { useEffect, useRef, useState } from 'react'
import './LivePreview.css'

function LivePreview({ cssCode, jsCode, bgColor }) {
  const iframeRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [cssCode, jsCode, bgColor])

  useEffect(() => {
    if (iframeRef.current && !ready) {
      iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor)
      setReady(true)
    }
  }, [])

  return (
    <div className="live-preview">
      <div className="preview-header">
        <span className="preview-dot red" />
        <span className="preview-dot yellow" />
        <span className="preview-dot green" />
        <span className="preview-label">Live Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="preview-iframe"
        sandbox="allow-scripts"
        title="Live animation preview"
      />
    </div>
  )
}

export function buildSandboxHTML(css, js, bgColor) {
  const bg = bgColor || '#0a0a0f'
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
    '<style>' +
    '*{margin:0;padding:0;box-sizing:border-box;}' +
    'html,body{width:100%;height:100vh;overflow:hidden;background:' + bg + ';}' +
    '#container{width:100%;height:100%;position:relative;' +
    'display:flex;align-items:center;justify-content:center;}' +
    (css || '') +
    '</style></head><body>' +
    '<div id="container"></div>' +
    '<script>(function(){"use strict";try{' +
    (js || '') +
    '}catch(err){document.body.innerHTML=' +
    '"<div style=\'color:#ef4444;font-family:monospace;padding:1rem;font-size:13px\'>" +' +
    '"❌ Error: "+err.message+"</div>";}})();<\/script>' +
    '</body></html>'
  )
}

export default LivePreview
