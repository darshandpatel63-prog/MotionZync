// src/ai/floating/FloatingAI.jsx
// Global Floating AI — every page except /ai-studio and /admin
// My UI Design ChatComposer pattern for input
// Mobile + Desktop both work perfectly

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAI } from '../providers/AIProviderContext.jsx'
import APIKeyManager from '../settings/APIKeyManager.jsx'
import './FloatingAI.css'

const HIDDEN_ROUTES = ['/ai-studio', '/admin']

const MODES = [
  { id:'chat',      icon:'💬', label:'Chat'      },
  { id:'animation', icon:'🎬', label:'Animate'   },
  { id:'palette',   icon:'🎨', label:'Colors'    },
  { id:'css',       icon:'✨', label:'Effect'    },
  { id:'image',     icon:'🖼', label:'Image'     },
]

const SYSTEM = {
  chat:
    'You are a creative AI assistant for MotionZync. Help with design, animation, and code. Be concise.',
  animation:
    `Generate CSS animation. Output:
---TITLE---
Name
---CSS---
.mz-el{...}@keyframes name{...}
---DESCRIPTION---
What it looks like`,
  palette:
    `Generate 6-color palette. Output:
---NAME---
Name
---COLORS---
#hex|Name|Use
(6 lines)
---MOOD---
Mood`,
  css:
    'Generate one stunning CSS visual effect. Output only CSS code block using .mz-el class.',
  image:
    'Enhance this image description into a detailed DALL-E 3 prompt. Output only the enhanced prompt.',
}

const PLACEHOLDERS = [
  'Make a glowing neon animation...',
  'Generate a sunset color palette...',
  'Create a particle effect...',
  'Help me with CSS gradient...',
]

export default function FloatingAI() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { chat, generateImage, getConfig, activeProvider } = useAI()

  const [open,     setOpen]     = useState(false)
  const [mode,     setMode]     = useState('chat')
  const [msgs,     setMsgs]     = useState([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [result,   setResult]   = useState(null)
  const [phIdx,    setPhIdx]    = useState(0)

  const msgsEndRef = useRef(null)
  const inputRef   = useRef(null)
  const phTimer    = useRef(null)

  // Hide on certain routes
  const isHidden = HIDDEN_ROUTES.some(r => pathname.startsWith(r))
  if (isHidden) return null

  const cfg    = getConfig(activeProvider)
  const hasKey = cfg.apiKey || cfg.noKeyRequired

  // Rotate placeholder
  useEffect(() => {
    phTimer.current = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000)
    return () => clearInterval(phTimer.current)
  }, [])

  // Scroll to bottom
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    if (!hasKey) { setShowKeys(true); return }

    setMsgs(m => [...m, { role:'user', content:text, id:Date.now() }])
    setInput('')
    setLoading(true)
    setResult(null)

    try {
      if (mode === 'image') {
        const enhanced = await chat([
          { role:'system', content: SYSTEM.image },
          { role:'user',   content: text }
        ]).catch(() => text)
        const url = await generateImage(enhanced, { size:'1024x1024' })
        setMsgs(m => [...m, { role:'assistant', content:'Image generated!', imageURL:url, id:Date.now() }])
        setResult({ type:'image', url })
        return
      }

      const history = msgs.slice(-6).map(m => ({ role:m.role, content:m.content }))
      const reply   = await chat([
        { role:'system', content: SYSTEM[mode] || SYSTEM.chat },
        ...history,
        { role:'user',   content: text }
      ])

      setMsgs(m => [...m, { role:'assistant', content:reply, id:Date.now() }])

      // Parse structured
      if (mode === 'animation') {
        const css = reply.match(/---CSS---\s*\n([\s\S]*?)(?:---|$)/)?.[1]?.trim()
        const ttl = reply.match(/---TITLE---\s*\n(.*?)\n/)?.[1]?.trim()
        if (css) setResult({ type:'animation', css, title: ttl || 'Animation' })
      }
      if (mode === 'palette') {
        const blk = reply.match(/---COLORS---\s*\n([\s\S]*?)(?:---|$)/)?.[1] || ''
        const colors = blk.trim().split('\n')
          .map(l => { const [h,n] = l.split('|'); return { hex:h?.trim(), name:n?.trim() } })
          .filter(c => c.hex?.startsWith('#'))
        const name = reply.match(/---NAME---\s*\n(.*?)\n/)?.[1]?.trim()
        const mood = reply.match(/---MOOD---\s*\n([\s\S]*?)$/)?.[1]?.trim()
        if (colors.length) setResult({ type:'palette', colors, name, mood })
      }
      if (mode === 'css') {
        const css = reply.match(/```(?:css)?\n?([\s\S]+?)```/)?.[1]
        if (css) setResult({ type:'css', css })
      }
    } catch (e) {
      setMsgs(m => [...m, { role:'assistant', content:`⚠️ ${e.message}`, id:Date.now(), isErr:true }])
    } finally {
      setLoading(false)
    }
  }, [input, mode, loading, hasKey, chat, generateImage, msgs])

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const copyText = t => navigator.clipboard.writeText(t)

  const previewHTML = css => `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a12;display:flex;align-items:center;justify-content:center;height:100vh;}
    .mz-el{width:90px;height:90px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:14px;}
    ${css}
  </style></head><body><div class="mz-el"></div></body></html>`

  return (
    <>
      {/* ── FAB button ─────────────────────────────────── */}
      <button className={`fai-fab ${open ? 'is-open' : ''} ${loading ? 'is-loading' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="AI Assistant">
        <span className="fai-fab-icon">{open ? '✕' : '🧠'}</span>
        {loading && <span className="fai-fab-pulse"/>}
      </button>

      {/* ── Panel ──────────────────────────────────────── */}
      {open && (
        <div className="fai-panel">

          {/* Header */}
          <div className="fai-head">
            <span className="fai-head-title">🧠 AI Assistant</span>
            <div className="fai-head-right">
              <span className={`fai-status ${hasKey ? 'ok' : 'no'}`}>
                {hasKey ? `● ${activeProvider}` : '○ No key'}
              </span>
              <button className="settings-close" style={{ width:26, height:26, fontSize:13 }}
                onClick={() => setShowKeys(true)} title="API Keys">🔑</button>
              <button className="settings-close" style={{ width:26, height:26 }}
                onClick={() => { setOpen(false); navigate('/ai-studio') }} title="Open full AI Studio">⛶</button>
            </div>
          </div>

          {/* Mode seg control — My UI Design pattern */}
          <div className="seg-control fai-seg" style={{ '--seg-cols': 5 }}>
            {MODES.map(m => (
              <button key={m.id}
                className={`seg-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => { setMode(m.id); setResult(null) }}>
                <span className="seg-title">{m.icon}</span>
                <span className="seg-meta">{m.label}</span>
              </button>
            ))}
          </div>

          {/* No key */}
          {!hasKey && (
            <div className="fai-nokey">
              <span>🔑 API key connect karo</span>
              <button className="primary" style={{ fontSize:11, padding:'5px 14px' }}
                onClick={() => setShowKeys(true)}>Setup</button>
            </div>
          )}

          {/* Messages */}
          {hasKey && (
            <div className="fai-msgs">
              {msgs.length === 0 && (
                <div className="fai-empty">
                  <span style={{ fontSize:32 }}>{MODES.find(m=>m.id===mode)?.icon}</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>
                    {MODES.find(m=>m.id===mode)?.label}
                  </span>
                </div>
              )}
              {msgs.map(msg => (
                <div key={msg.id} className={`chat-msg ${msg.role}`}
                  style={{ gap:8 }}>
                  <div className="chat-msg-avatar" style={{ width:26, height:26, fontSize:12 }}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="chat-msg-body">
                    <div className="chat-msg-content" style={{ fontSize:12, padding:'8px 12px' }}>
                      {msg.imageURL
                        ? <img src={msg.imageURL} alt="" style={{ maxWidth:'100%', borderRadius:8 }}/>
                        : msg.content
                      }
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg assistant" style={{ gap:8 }}>
                  <div className="chat-msg-avatar" style={{ width:26, height:26, fontSize:12 }}>🤖</div>
                  <div className="typing-dots"><span/><span/><span/></div>
                </div>
              )}
              <div ref={msgsEndRef}/>
            </div>
          )}

          {/* Result card */}
          {result && (
            <div className="fai-result-card">
              {/* Animation */}
              {result.type === 'animation' && (
                <>
                  <div className="fai-result-title">{result.title}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    <button className="ghost" style={{ fontSize:11 }}
                      onClick={() => copyText(result.css)}>⧉ Copy CSS</button>
                    <button className="ghost" style={{ fontSize:11 }}
                      onClick={() => {
                        const f = document.createElement('iframe')
                        f.srcdoc = previewHTML(result.css)
                        f.style.cssText = 'width:100%;height:140px;border:none;border-radius:8px;margin-top:6px'
                        f.sandbox = 'allow-scripts'
                        document.querySelector('.fai-result-card').appendChild(f)
                      }}>▶ Preview</button>
                  </div>
                </>
              )}
              {/* Palette */}
              {result.type === 'palette' && (
                <>
                  <div className="fai-result-title">{result.name}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:4 }}>
                    {result.colors.map((c,i) => (
                      <div key={i} style={{ textAlign:'center', cursor:'pointer' }}
                        onClick={() => copyText(c.hex)}>
                        <div style={{
                          width:32, height:32, borderRadius:7,
                          background:c.hex, border:'1px solid rgba(255,255,255,.1)',
                          margin:'0 auto'
                        }}/>
                        <div style={{ fontSize:9, color:'var(--text-muted)', fontFamily:'var(--mono)' }}>
                          {c.hex}
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.mood && <p className="hint" style={{ marginTop:6 }}>✨ {result.mood}</p>}
                </>
              )}
              {/* CSS */}
              {result.type === 'css' && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button className="ghost" style={{ fontSize:11 }}
                    onClick={() => copyText(result.css)}>⧉ Copy CSS</button>
                </div>
              )}
            </div>
          )}

          {/* Composer — My UI Design ChatComposer pattern */}
          {hasKey && (
            <div className="chat-composer" style={{ borderTop:'1px solid var(--border)', padding:'8px 10px' }}>
              <div className="chat-composer-inner">
                <textarea ref={inputRef}
                  className="chat-composer-textarea"
                  style={{ minHeight:48, maxHeight:100, fontSize:12 }}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  disabled={loading}
                  rows={2}
                  placeholder={PLACEHOLDERS[phIdx]}
                />
                <div className="chat-composer-footer">
                  <div className="chat-composer-tools">
                    {msgs.length > 0 && (
                      <button className="chat-composer-tool-btn" onClick={() => { setMsgs([]); setResult(null) }}
                        title="Clear chat">🗑</button>
                    )}
                  </div>
                  <button className="chat-composer-send"
                    onClick={send}
                    disabled={!input.trim() || loading}>
                    {loading ? <span className="icon-spin">⟳</span> : '↑'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showKeys && <APIKeyManager onClose={() => setShowKeys(false)}/>}
    </>
  )
}

