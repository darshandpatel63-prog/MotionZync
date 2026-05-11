import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import CodeEditor  from '../../components/CodeEditor/CodeEditor.jsx'
import LivePreview from '../../components/LivePreview/LivePreview.jsx'
import AdSense     from '../../components/AdSense/AdSense.jsx'
import { getAnimationById, getAnimations } from '../../hooks/useAnimations.js'
import './Playground.css'

const DEFAULT_CSS = `.box {
  width: 120px; height: 120px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 20px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`

const DEFAULT_JS = `const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const box = document.createElement('div');
box.className = 'box';
c.appendChild(box);`

export default function Playground() {
  const [searchParams] = useSearchParams()
  const [cssCode,   setCssCode]   = useState(DEFAULT_CSS)
  const [jsCode,    setJsCode]    = useState(DEFAULT_JS)
  const [bgColor,   setBgColor]   = useState('#0a0a0f')
  const [allAnims,  setAllAnims]  = useState([])
  const [selectedId,setSelectedId]= useState('')
  const [copyMsg,   setCopyMsg]   = useState('')
  const [loadedTitle, setLoadedTitle] = useState('')

  useEffect(() => {
    getAnimations().then(setAllAnims)
  }, [])

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) return
    getAnimationById(id).then(anim => {
      if (!anim) return
      setCssCode(anim.cssCode || '')
      setJsCode(anim.jsCode || '')
      setBgColor(anim.previewBg || '#0a0a0f')
      setSelectedId(id)
      setLoadedTitle(anim.title)
    })
  }, [searchParams])

  function handleLoad(e) {
    const id = e.target.value
    setSelectedId(id)
    if (!id) { reset(); return }
    const anim = allAnims.find(a => a.docId === id)
    if (anim) {
      setCssCode(anim.cssCode || '')
      setJsCode(anim.jsCode || '')
      setBgColor(anim.previewBg || '#0a0a0f')
      setLoadedTitle(anim.title)
    }
  }

  function reset() {
    setCssCode(DEFAULT_CSS); setJsCode(DEFAULT_JS)
    setBgColor('#0a0a0f'); setSelectedId(''); setLoadedTitle('')
  }

  async function copyAll() {
    const text = `/* CSS */\n${cssCode}\n\n/* JS */\n${jsCode}\n\n/* Preview BG: ${bgColor} */`
    await navigator.clipboard.writeText(text)
    setCopyMsg('✅ Copied!'); setTimeout(() => setCopyMsg(''), 2000)
  }

  return (
    <div className="playground-page page-section">
      <div className="container">
        <div className="playground-header">
          <h1 className="playground-title">⚡ Live Playground</h1>
          {loadedTitle && <p className="loaded-title">📌 {loadedTitle}</p>}
        </div>

        <div className="playground-toolbar">
          <select className="anim-select" value={selectedId} onChange={handleLoad}>
            <option value="">— Gallery thi load karo —</option>
            {allAnims.map(a => <option key={a.docId} value={a.docId}>{a.title}</option>)}
          </select>
          <div className="toolbar-right">
            {/* BG color + code mathi dikhshe */}
            <div className="bg-display">
              <span className="bg-display-dot" style={{ background: bgColor }}/>
              <code className="bg-display-code">{bgColor}</code>
            </div>
            <button className="btn-secondary toolbar-btn" onClick={copyAll}>{copyMsg || '📋 Copy All'}</button>
            <button className="btn-secondary toolbar-btn" onClick={reset}>🔄 Reset</button>
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/></div>

        <div className="playground-split">
          <div className="editor-pane">
            <CodeEditor cssCode={cssCode} jsCode={jsCode}
              onCssChange={setCssCode} onJsChange={setJsCode}
              showCopyButtons={true}/>
          </div>
          <div className="preview-pane">
            <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={bgColor}/>
          </div>
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/></div>
      </div>
    </div>
  )
}

