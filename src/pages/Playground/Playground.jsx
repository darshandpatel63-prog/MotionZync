import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CodeEditor from '../../components/CodeEditor/CodeEditor.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import AdSense from '../../components/AdSense/AdSense.jsx'
import backgroundAnimations from '../../animations/backgroundAnimations.js'
import frontAnimations from '../../animations/frontAnimations.js'
import './Playground.css'

const allAnimations = [...backgroundAnimations, ...frontAnimations]

const DEFAULT_CSS = `/* Tamaro CSS yahan likho */
.box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 16px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.2); }
  to   { transform: rotate(360deg) scale(1); }
}`

const DEFAULT_JS = `// Tamaro JavaScript yahan likho
const container = document.getElementById('container');
container.style.cssText = 'display:flex;align-items:center;justify-content:center;';

const box = document.createElement('div');
box.className = 'box';
container.appendChild(box);`

function Playground() {
  const [searchParams] = useSearchParams()
  const [cssCode, setCssCode] = useState(DEFAULT_CSS)
  const [jsCode, setJsCode] = useState(DEFAULT_JS)
  const [copyMsg, setCopyMsg] = useState('')
  const [selectedId, setSelectedId] = useState('')

  // Gallery thi ?id= aave to load karo
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const found = allAnimations.find(a => a.id === id)
      if (found) {
        setCssCode(found.cssCode.trim())
        setJsCode(found.jsCode.trim())
        setSelectedId(id)
      }
    }
  }, [searchParams])

  const handleReset = () => {
    setCssCode(DEFAULT_CSS)
    setJsCode(DEFAULT_JS)
    setSelectedId('')
  }

  const handleCopyCSS = async () => {
    await navigator.clipboard.writeText(cssCode)
    setCopyMsg('CSS Copied!')
    setTimeout(() => setCopyMsg(''), 2000)
  }

  const handleLoadAnimation = (e) => {
    const id = e.target.value
    setSelectedId(id)
    if (!id) { handleReset(); return; }
    const found = allAnimations.find(a => a.id === id)
    if (found) {
      setCssCode(found.cssCode.trim())
      setJsCode(found.jsCode.trim())
    }
  }

  return (
    <div className="playground-page page-section">
      <div className="container">
        <div className="playground-header">
          <h1 className="playground-title">⚡ Live Playground</h1>
          <p className="playground-subtitle">CSS + JavaScript lakho, real-time preview juo</p>
        </div>

        {/* Toolbar */}
        <div className="playground-toolbar">
          <select
            className="animation-select"
            value={selectedId}
            onChange={handleLoadAnimation}
          >
            <option value="">— Gallery thi load karo —</option>
            <optgroup label="Background Animations">
              {backgroundAnimations.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </optgroup>
            <optgroup label="Front Animations">
              {frontAnimations.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </optgroup>
          </select>

          <div className="toolbar-actions">
            <button className="btn-secondary" onClick={handleCopyCSS}>
              {copyMsg || '📋 Copy CSS'}
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </div>

        {/* AdSense top */}
        <div className="ad-zone">
          <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND} />
        </div>

        {/* Editor + Preview Split */}
        <div className="playground-split">
          <div className="editor-pane">
            <CodeEditor
              cssCode={cssCode}
              jsCode={jsCode}
              onCssChange={setCssCode}
              onJsChange={setJsCode}
            />
          </div>
          <div className="preview-pane">
            <LivePreview cssCode={cssCode} jsCode={jsCode} />
          </div>
        </div>

        {/* AdSense bottom */}
        <div className="ad-zone">
          <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND} />
        </div>
      </div>
    </div>
  )
}

export default Playground
