import { useEffect, useRef, useState } from 'react'
import './LivePreview.css'

// Speed: CSS animation-duration values ne multiply karo
function applySpeed(css, speed) {
  if (!css || speed === 1) return css
  return css.replace(/animation(-duration)?:\s*([\d.]+)s/g, (match, prop, val) => {
    const newVal = (parseFloat(val) / speed).toFixed(2)
    return prop ? `animation-duration: ${newVal}s` : `animation: ${match.replace(/[\d.]+s/, newVal+'s')}`
  }).replace(/duration:\s*([\d.]+)s/g, (_, val) => `duration: ${(parseFloat(val)/speed).toFixed(2)}s`)
}

export function buildSandboxHTML(css, js, bgColor, speed=1) {
  const bg = bgColor || '#0a0a0f'
  const finalCss = applySpeed(css, speed)
  return (
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/>' +
    '<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100vh;overflow:hidden;background:'+bg+';}#container{width:100%;height:100%;position:relative;}</style>' +
    (finalCss ? '<style>'+finalCss+'</style>' : '') +
    '</head><body><div id="container"></div>' +
    '<script>(function(){"use strict";try{'+( js||'')+'}catch(e){document.body.innerHTML="<div style=\'color:#ef4444;font-family:monospace;padding:1rem;font-size:13px\'>❌ "+e.message+"</div>";}})();<\/script>' +
    '</body></html>'
  )
}

export default function LivePreview({ cssCode, jsCode, bgColor, speed=1 }) {
  const iframeRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor, speed)
    }, 500)
    return () => clearTimeout(t)
  }, [cssCode, jsCode, bgColor, speed])

  useEffect(() => {
    if (!ready && iframeRef.current) {
      iframeRef.current.srcdoc = buildSandboxHTML(cssCode, jsCode, bgColor, speed)
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
