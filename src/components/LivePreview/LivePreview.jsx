import { useEffect, useRef, useState } from 'react'
import './LivePreview.css'

/**
 * LivePreview - User na code nu secure sandbox preview
 * 
 * FIX: React kadhi kadhi iframe ni srcDoc attribute update nahi kare
 * tethi useRef + useEffect thi directly iframe.srcdoc set kariye chhe.
 * Debounce: 600ms - type karva darmyan preview flash na thay.
 */
function LivePreview({ cssCode, jsCode }) {
  const iframeRef = useRef(null)
  const [ready, setReady] = useState(false)

  // Debounce: 600ms raho pachhi iframe update karo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [cssCode, jsCode])

  // Pehli vaar render thay tyare turant load karo (no debounce)
  useEffect(() => {
    if (iframeRef.current && !ready) {
      iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode)
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

function buildSandboxHTML(css, js) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
    '<style>' +
    '* { margin: 0; padding: 0; box-sizing: border-box; }' +
    'body { width: 100%; height: 100vh; overflow: hidden; background: #0a0a0f;' +
    'display: flex; align-items: center; justify-content: center; }' +
    '#container { width: 100%; height: 100%; position: relative; }' +
    (css || '') +
    '</style></head><body>' +
    '<div id="container"></div>' +
    '<script>(function(){"use strict";try{' +
    (js || '') +
    '}catch(err){document.body.innerHTML=' +
    '"<div style=\'color:#ef4444;font-family:monospace;padding:1rem;font-size:13px\'>" +' +
    '"Error: "+err.message+"</div>";}})();</script>' +
    '</body></html>'
  )
}

export default LivePreview
