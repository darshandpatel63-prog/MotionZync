import { useState } from 'react'
import { generateHTMLCSS, generateReact, generateJSON } from '../utils/codeGen.js'
import { useCreator } from '../store/CreatorContext.jsx'
import './ExportModal.css'

const TABS = [
  { id:'html',   label:'HTML/CSS', icon:'🌐' },
  { id:'react',  label:'React',    icon:'⚛️' },
  { id:'json',   label:'JSON',     icon:'{ }' },
]

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}

export default function ExportModal({ onClose }) {
  const { elements, bgColor } = useCreator()
  const [activeTab, setActiveTab] = useState('html')
  const [copied, setCopied]       = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const { html: fullHTML, cssOnly } = generateHTMLCSS(elements, bgColor || '#0a0a0f')
  const reactCode = generateReact(elements, bgColor || '#0a0a0f')
  const jsonCode  = generateJSON(elements, { bgColor })

  const content = activeTab === 'html' ? fullHTML : activeTab === 'react' ? reactCode : jsonCode
  const filename = activeTab === 'html' ? 'animation.html' : activeTab === 'react' ? 'AnimScene.jsx' : 'scene.json'

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true); setTimeout(() => setCopied(false), 2200)
  }
  function handleDownload() {
    downloadFile(content, filename)
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2200)
  }

  return (
    <div className="em-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="em-modal">
        {/* Header */}
        <div className="em-header">
          <div className="em-title">
            <span className="em-title-icon">⬇</span>
            Export Your Creation
          </div>
          <div className="em-stats">
            <span className="em-stat">{elements.length} elements</span>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="em-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`em-tab ${activeTab===t.id?'active':''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="em-desc">
          {activeTab === 'html'  && '✅ Complete standalone HTML file — open directly in any browser'}
          {activeTab === 'react' && '⚛️ React component — paste into your React project'}
          {activeTab === 'json'  && '📦 Scene JSON — reimport or share your creation'}
        </div>

        {/* Code preview */}
        <pre className="em-code">{content}</pre>

        {/* Actions */}
        <div className="em-actions">
          <button className={`em-btn em-copy ${copied?'done':''}`} onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
          <button className={`em-btn em-download ${downloaded?'done':''}`} onClick={handleDownload}>
            {downloaded ? '✅ Downloaded!' : `⬇ Download ${filename}`}
          </button>
          <button className="em-btn em-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
