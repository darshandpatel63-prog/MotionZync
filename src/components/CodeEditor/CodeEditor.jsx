import { useState } from 'react'
import './CodeEditor.css'

export default function CodeEditor({ cssCode, jsCode, onCssChange, onJsChange, showCopyButtons = false }) {
  const [tab, setTab]        = useState('css')
  const [copied, setCopied]  = useState('')

  async function copy(text, which) {
    await navigator.clipboard.writeText(text)
    setCopied(which)
    setTimeout(() => setCopied(''), 2000)
  }

  function handleTab(e) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.target, s = el.selectionStart, end = el.selectionEnd
    const before = el.value.substring(0, s)
    const after  = el.value.substring(end)
    el.value = before + '  ' + after
    el.selectionStart = el.selectionEnd = s + 2
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }

  return (
    <div className="code-editor">
      <div className="editor-tabs">
        <button className={`editor-tab ${tab === 'css' ? 'active' : ''}`} onClick={() => setTab('css')}>🎨 CSS</button>
        <button className={`editor-tab ${tab === 'js' ? 'active' : ''}`} onClick={() => setTab('js')}>⚡ JavaScript</button>
        {showCopyButtons && (
          <div className="copy-btns">
            <button className="copy-btn" onClick={() => copy(cssCode, 'css')}>
              {copied === 'css' ? '✅ Copied!' : '📋 CSS'}
            </button>
            <button className="copy-btn" onClick={() => copy(jsCode, 'js')}>
              {copied === 'js' ? '✅ Copied!' : '📋 JS'}
            </button>
          </div>
        )}
        <span className="editor-hint">Tab = 2 spaces</span>
      </div>
      <div className="editor-area">
        {tab === 'css' ? (
          <textarea className="code-textarea" value={cssCode}
            onChange={e => onCssChange(e.target.value)}
            placeholder="/* CSS yahan likho... */"
            spellCheck={false} onKeyDown={handleTab}/>
        ) : (
          <textarea className="code-textarea" value={jsCode}
            onChange={e => onJsChange(e.target.value)}
            placeholder="// JavaScript yahan likho..."
            spellCheck={false} onKeyDown={handleTab}/>
        )}
      </div>
    </div>
  )
}
