import { useState } from 'react'
import './CodeEditor.css'

/**
 * CodeEditor Component
 * Props:
 *   cssCode: string
 *   jsCode: string
 *   onCssChange: fn(newCss)
 *   onJsChange: fn(newJs)
 */
function CodeEditor({ cssCode, jsCode, onCssChange, onJsChange }) {
  const [activeTab, setActiveTab] = useState('css')

  return (
    <div className="code-editor">
      <div className="editor-tabs">
        <button
          className={`editor-tab ${activeTab === 'css' ? 'active' : ''}`}
          onClick={() => setActiveTab('css')}
        >
          🎨 CSS
        </button>
        <button
          className={`editor-tab ${activeTab === 'js' ? 'active' : ''}`}
          onClick={() => setActiveTab('js')}
        >
          ⚡ JavaScript
        </button>
        <span className="editor-hint">Tab key = 2 spaces</span>
      </div>

      <div className="editor-area">
        {activeTab === 'css' ? (
          <textarea
            className="code-textarea"
            value={cssCode}
            onChange={e => onCssChange(e.target.value)}
            placeholder="/* CSS animation yahan likho... */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.box {
  width: 100px;
  height: 100px;
  background: #7c3aed;
  animation: pulse 2s infinite;
}"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={handleTabKey}
          />
        ) : (
          <textarea
            className="code-textarea"
            value={jsCode}
            onChange={e => onJsChange(e.target.value)}
            placeholder="// JavaScript animation yahan likho...
const container = document.getElementById('container');
const box = document.createElement('div');
box.className = 'box';
container.appendChild(box);"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={handleTabKey}
          />
        )}
      </div>
    </div>
  )
}

function handleTabKey(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const el = e.target
    const start = el.selectionStart
    const end = el.selectionEnd
    el.value = el.value.substring(0, start) + '  ' + el.value.substring(end)
    el.selectionStart = el.selectionEnd = start + 2
    // React onChange trigger
    const nativeInputEvent = new Event('input', { bubbles: true })
    el.dispatchEvent(nativeInputEvent)
  }
}

export default CodeEditor
