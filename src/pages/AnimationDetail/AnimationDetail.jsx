import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import CodeEditor    from '../../components/CodeEditor/CodeEditor.jsx'
import LivePreview   from '../../components/LivePreview/LivePreview.jsx'
import CustomizePanel from '../../components/CustomizePanel/CustomizePanel.jsx'
import AdSense       from '../../components/AdSense/AdSense.jsx'
import { getAnimationById, incrementView } from '../../hooks/useAnimations.js'
import './AnimationDetail.css'

const SPEEDS = [
  { label:'0.25x', value:0.25 },
  { label:'0.5x',  value:0.5  },
  { label:'1x',    value:1    },
  { label:'2x',    value:2    },
  { label:'4x',    value:4    },
]

export default function AnimationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anim,    setAnim]    = useState(null)
  const [cssCode, setCssCode] = useState('')
  const [jsCode,  setJsCode]  = useState('')
  const [speed,   setSpeed]   = useState(1)
  const [copied,  setCopied]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getAnimationById(id).then(data => {
      if (!data) { setLoading(false); return }
      setAnim(data)
      setCssCode(data.cssCode || '')
      setJsCode(data.jsCode || '')
      setLoading(false)
      // View count increment
      incrementView(id)
    })
  }, [id])

  async function copy(text, which) {
    await navigator.clipboard.writeText(text)
    setCopied(which); setTimeout(() => setCopied(''), 2000)
  }

  function shareLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied('link'); setTimeout(() => setCopied(''), 2000)
  }

  // CustomizePanel callback - code update thay
  function handleCustomize(newCss, newJs) {
    setCssCode(newCss); setJsCode(newJs)
  }

  if (loading) return <div className="detail-loading">⏳ Loading animation...</div>
  if (!anim)   return <div className="detail-loading">❌ Animation not found. <Link to="/gallery">← Back to Gallery</Link></div>

  return (
    <div className="detail-page page-section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/gallery">Gallery</Link>
          <span>›</span>
          <span>{anim.title}</span>
        </div>

        {/* Header */}
        <div className="detail-header">
          <div>
            <h1 className="detail-title">{anim.title}</h1>
            <p className="detail-desc">{anim.description}</p>
            <div className="detail-meta">
              <span className="detail-cat">{anim.category}</span>
              {anim.views > 0 && <span className="detail-views">👁️ {anim.views > 999 ? (anim.views/1000).toFixed(1)+'k' : anim.views} views</span>}
              {anim.tags?.slice(0,4).map(t => <span key={t} className="detail-tag">#{t}</span>)}
            </div>
          </div>
          <div className="detail-header-actions">
            <button className="btn-secondary detail-share-btn" onClick={shareLink}>
              {copied==='link' ? '✅ Copied!' : '🔗 Share'}
            </button>
            <Link to={`/compare?a=${id}`} className="btn-secondary detail-compare-btn">
              ⚖️ Compare
            </Link>
            <Link to={`/wallpaper?id=${id}`} className="btn-secondary">🖼️ Wallpaper</Link>
          </div>
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/>

        {/* Speed Control */}
        <div className="speed-control">
          <span className="speed-label">⚡ Speed:</span>
          {SPEEDS.map(s => (
            <button
              key={s.value}
              className={`speed-btn ${speed===s.value ? 'active' : ''}`}
              onClick={() => setSpeed(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Preview + Code split */}
        <div className="detail-split">
          {/* Live Preview */}
          <div className="detail-preview-pane">
            <div className="detail-preview-header">
              <div className="bg-display">
                <span className="bg-dot" style={{background: anim.previewBg||'#0a0a0f'}}/>
                <code className="bg-code">{anim.previewBg||'#0a0a0f'}</code>
              </div>
            </div>
            <LivePreview cssCode={cssCode} jsCode={jsCode} bgColor={anim.previewBg} speed={speed}/>
          </div>

          {/* Code Editor */}
          <div className="detail-code-pane">
            <div className="detail-copy-row">
              <button className="btn-secondary copy-btn" onClick={() => copy(cssCode, 'css')}>
                {copied==='css' ? '✅ CSS Copied!' : '📋 Copy CSS'}
              </button>
              <button className="btn-secondary copy-btn" onClick={() => copy(jsCode, 'js')}>
                {copied==='js' ? '✅ JS Copied!' : '📋 Copy JS'}
              </button>
              <button className="btn-secondary copy-btn" onClick={() => copy(`/* CSS */\n${cssCode}\n\n/* JS */\n${jsCode}`, 'all')}>
                {copied==='all' ? '✅ Copied!' : '📋 Copy All'}
              </button>
            </div>
            <CodeEditor
              cssCode={cssCode}
              jsCode={jsCode}
              onCssChange={setCssCode}
              onJsChange={setJsCode}
            />
          </div>
        </div>

        {/* Customize Panel - code ni niche */}
        <CustomizePanel
          cssCode={cssCode}
          jsCode={jsCode}
          onChange={handleCustomize}
        />

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_PLAYGROUND}/>

        {/* How to use this animation */}
        <div className="detail-howto prose">
          <h2>How to Use This Animation</h2>
          <p>Copy the CSS and JS code above. In your HTML file:</p>
          <pre><code>{`<div id="container" style="width:100%;height:400px;position:relative;overflow:hidden;background:${anim.previewBg||'#0a0a0f'};"></div>
<style>/* Paste CSS here */</style>
<script>/* Paste JS here */</script>`}</code></pre>
          <p>To make it full-screen background, set the container to <code>position:fixed; inset:0; z-index:-1;</code></p>
          <p>To resize, change <code>width</code> and <code>height</code> of the container, and update any fixed pixel values in the Customize panel above.</p>
        </div>
      </div>
    </div>
  )
          }
                  
