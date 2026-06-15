// src/ai/studio/AIStudio.jsx
// My UI Design EntryShell + ChatPane pattern → MotionZync AI Studio
// Mobile + Desktop both work perfectly — NO lazy loading

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAI } from '../providers/AIProviderContext.jsx'
import APIKeyManager from '../settings/APIKeyManager.jsx'
import './AIStudio.css'

/* ── Tool definitions ──────────────────────────────────── */
const TOOLS = [
  { id:'chat',       icon:'💬', label:'Chat',        desc:'Creative AI assistant' },
  { id:'animation',  icon:'🎬', label:'Animate',     desc:'CSS animation generator' },
  { id:'image',      icon:'🖼', label:'Image',       desc:'Text to image generation' },
  { id:'css',        icon:'✨', label:'Effects',     desc:'CSS effects + live preview' },
  { id:'palette',    icon:'🎨', label:'Colors',      desc:'AI color palette generator' },
  { id:'code',       icon:'💻', label:'Code',        desc:'Code assistant' },
  { id:'storyboard', icon:'📋', label:'Story',       desc:'Storyboard from idea' },
  { id:'3d',         icon:'🌎', label:'3D',          desc:'3D scene + Three.js code' },
]

/* ── System prompts ────────────────────────────────────── */
const SYSTEM = {
  chat:
    'You are a creative AI assistant for MotionZync. Help with digital art, animation, CSS, and creative design. Be concise, creative, and helpful.',
  animation:
    `You are an expert CSS animation developer. Generate stunning production-ready CSS animations.
Output format:
---TITLE---
Name
---CSS---
.mz-el { /* styles */ }
@keyframes name { /* keyframes */ }
---DESCRIPTION---
What it looks like`,
  image:
    'You are an expert image prompt writer for DALL-E 3. Enhance user description into a vivid, detailed, professional prompt. Output only the enhanced prompt, nothing else.',
  css:
    'You are a CSS effects expert. Generate a stunning single visual effect. Output only the CSS code in a ```css code block. Use .mz-el class.',
  palette:
    `Generate a beautiful 8-color palette.
Output EXACTLY:
---NAME---
Palette name
---COLORS---
#hex|ColorName|UseCase
(8 lines)
---MOOD---
Mood description`,
  code:
    'You are an expert frontend developer (React, Canvas, WebGL, CSS). Write clean, production-ready code with brief explanations.',
  storyboard:
    'You are a professional storyboard artist and film director. Create detailed shot-by-shot storyboards with camera angles, composition, lighting, and action.',
  '3d':
    'You are a Three.js expert and 3D scene designer. Describe 3D scenes and generate complete Three.js code when asked.',
}

/* ── Quick prompts per tool ────────────────────────────── */
const QUICK = {
  chat:       ['Help me design a UI layout', 'Explain blend modes', 'Creative animation ideas'],
  animation:  ['Glowing neon ring pulse', 'Glitch text effect', 'Liquid blob morphing'],
  image:      ['Cyberpunk city at night', 'Abstract purple galaxy art', 'Minimal logo design'],
  css:        ['Glassmorphism card effect', 'Neon glow button', 'Gradient mesh background'],
  palette:    ['Ocean depth palette', 'Neon cyberpunk colors', 'Warm sunset UI palette'],
  code:       ['Canvas particle system', 'Smooth scroll animation', 'CSS grid layout'],
  storyboard: ['Action movie chase scene', 'Tech product reveal ad', 'Sci-fi space opening'],
  '3d':       ['Rotating crystal scene', 'Low-poly mountain world', 'Neon grid floor'],
}

/* ── Preview iframe ────────────────────────────────────── */
function LivePreview({ css }) {
  const [show, setShow] = useState(false)
  const src = `<!DOCTYPE html><html><head><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a12;display:flex;align-items:center;justify-content:center;height:100vh;}
    .mz-el{width:100px;height:100px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:16px;}
    ${css}
  </style></head><body><div class="mz-el"></div></body></html>`

  return (
    <div className="ais-preview-wrap">
      <button className="ghost" style={{ fontSize:12 }} onClick={() => setShow(s => !s)}>
        {show ? 'Hide Preview' : '▶ Live Preview'}
      </button>
      {show && (
        <iframe className="ais-preview-frame" srcDoc={src} sandbox="allow-scripts" title="preview"/>
      )}
    </div>
  )
}

/* ── Color Palette card ────────────────────────────────── */
function PaletteCard({ data }) {
  const [copied, setCopied] = useState(null)
  return (
    <div className="ais-palette">
      <strong style={{ fontSize:12, color:'var(--purple)' }}>{data.name}</strong>
      <div className="ais-swatches">
        {data.colors.map((c, i) => (
          <div key={i} className="ais-swatch"
            onClick={() => {
              navigator.clipboard.writeText(c.hex)
              setCopied(i); setTimeout(() => setCopied(null), 1500)
            }}>
            <div className="ais-swatch-color" style={{ background: c.hex }}/>
            <span className="ais-swatch-hex">{copied === i ? '✓' : c.hex}</span>
            <span className="ais-swatch-name">{c.name}</span>
          </div>
        ))}
      </div>
      {data.mood && <p className="hint">✨ {data.mood}</p>}
    </div>
  )
}

/* ── Single chat message ───────────────────────────────── */
function Message({ msg }) {
  const isUser = msg.role === 'user'

  const renderContent = () => {
    const text = msg.content
    // CSS result with live preview
    const cssMatch = text.match(/```css\n?([\s\S]+?)```/)
    // Code block rendering
    const formatted = text
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: formatted }}/>
        {msg.imageURL && (
          <img src={msg.imageURL} alt="AI generated"
            className="ais-img" onClick={() => window.open(msg.imageURL, '_blank')}/>
        )}
        {msg.paletteData && <PaletteCard data={msg.paletteData}/>}
        {cssMatch && <LivePreview css={cssMatch[1]}/>}
        {msg.animData && (
          <div className="ais-anim-card">
            <strong style={{ fontSize:12, color:'var(--purple)' }}>{msg.animData.title}</strong>
            <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
              <button className="ghost" style={{ fontSize:11 }}
                onClick={() => navigator.clipboard.writeText(msg.animData.css)}>
                ⧉ Copy CSS
              </button>
              <LivePreview css={msg.animData.css}/>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={`chat-msg ${isUser ? 'user' : 'assistant'}`}>
      <div className="chat-msg-avatar">{isUser ? '👤' : '🤖'}</div>
      <div className="chat-msg-body">
        <div className="chat-msg-content">{renderContent()}</div>
      </div>
    </div>
  )
}

/* ── Main AIStudio ─────────────────────────────────────── */
export default function AIStudio() {
  const navigate   = useNavigate()
  const { chat, generateImage, getConfig, activeProvider, isLoading } = useAI()

  const [tool,     setTool]     = useState('chat')
  const [messages, setMessages] = useState({})
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [navOpen,  setNavOpen]  = useState(false) // mobile nav drawer

  const msgsEndRef = useRef(null)
  const textaRef   = useRef(null)

  const cfg    = getConfig(activeProvider)
  const hasKey = cfg.apiKey || cfg.noKeyRequired
  const toolMsgs = messages[tool] || []
  const currentTool = TOOLS.find(t => t.id === tool)

  /* Auto-scroll */
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, tool])

  /* Add message to current tool */
  const addMsg = useCallback((msg) => {
    setMessages(prev => ({
      ...prev,
      [tool]: [...(prev[tool] || []), msg]
    }))
  }, [tool])

  /* Send */
  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    if (!hasKey) { setShowKeys(true); return }

    setInput('')
    setError('')
    setSending(true)

    addMsg({ role: 'user', content: text, id: Date.now() })

    try {
      /* ── Image generation ── */
      if (tool === 'image') {
        const enhanced = await chat([
          { role:'system', content: SYSTEM.image },
          { role:'user',   content: text }
        ]).catch(() => text)
        const url = await generateImage(enhanced, { size:'1024x1024' })
        addMsg({ role:'assistant', content:'Generated!', imageURL: url, id: Date.now() })
        return
      }

      /* ── Text generation ── */
      const history = toolMsgs.slice(-8).map(m => ({ role:m.role, content:m.content }))
      const reply   = await chat([
        { role:'system', content: SYSTEM[tool] || SYSTEM.chat },
        ...history,
        { role:'user',   content: text }
      ])

      /* Parse structured replies */
      let extra = {}

      if (tool === 'animation') {
        const title = reply.match(/---TITLE---\s*\n(.*?)\n/)?.[1]?.trim()
        const css   = reply.match(/---CSS---\s*\n([\s\S]*?)(?:---|$)/)?.[1]?.trim()
        if (css) extra.animData = { title: title || 'Animation', css }
      }

      if (tool === 'palette') {
        const name   = reply.match(/---NAME---\s*\n(.*?)\n/)?.[1]?.trim()
        const mood   = reply.match(/---MOOD---\s*\n([\s\S]*?)$/)?.[1]?.trim()
        const block  = reply.match(/---COLORS---\s*\n([\s\S]*?)(?:---|$)/)?.[1] || ''
        const colors = block.trim().split('\n').map(l => {
          const [hex, name, use] = l.split('|')
          return { hex: hex?.trim(), name: name?.trim(), use: use?.trim() }
        }).filter(c => c.hex?.startsWith('#'))
        if (colors.length) extra.paletteData = { name: name || 'Palette', colors, mood }
      }

      addMsg({ role:'assistant', content: reply, id: Date.now(), ...extra })

    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }, [input, tool, sending, hasKey, chat, generateImage, toolMsgs, addMsg])

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const clearChat = () => setMessages(prev => ({ ...prev, [tool]: [] }))

  const switchTool = (id) => {
    setTool(id)
    setNavOpen(false)
    setError('')
  }

  /* ─── RENDER ──────────────────────────────────────────── */
  return (
    <div className="ais-root">

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="ais-topbar">
        <button className="ais-back" onClick={() => navigate(-1)}>‹</button>
        <span className="ais-brand">🧠 AI Studio</span>

        {/* Mobile: hamburger to open tool nav */}
        <button className="ais-nav-toggle" onClick={() => setNavOpen(o => !o)}>
          {navOpen ? '✕' : '☰'}
        </button>

        <div className="ais-topbar-right">
          <button className="ais-provider-badge"
            onClick={() => setShowKeys(true)}>
            <span className={`ais-dot ${hasKey ? 'green' : 'red'}`}/>
            <span>{activeProvider}</span>
            <span className="ais-model-tag">{cfg.selectedModel}</span>
          </button>
          <button className="ghost" style={{ fontSize:12, padding:'5px 12px' }}
            onClick={() => setShowKeys(true)}>
            🔑 Keys
          </button>
        </div>
      </div>

      {/* ── Layout ──────────────────────────────────────── */}
      <div className="ais-body">

        {/* ── Nav rail — My UI Design EntryNavRail ─────── */}
        <nav className={`entry-nav-rail ${navOpen ? 'open' : ''}`}>
          {TOOLS.map(t => (
            <button key={t.id}
              className={`entry-nav-btn ${tool === t.id ? 'active' : ''}`}
              onClick={() => switchTool(t.id)}
              title={t.desc}>
              <span className="entry-nav-icon">{t.icon}</span>
              <span className="entry-nav-label">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Chat pane — My UI Design ChatPane ────────── */}
        <div className="chat-pane">

          {/* Chat header */}
          <div className="ais-chat-head">
            <div>
              <span className="ais-tool-icon">{currentTool?.icon}</span>
              <strong>{currentTool?.label}</strong>
              <span className="hint" style={{ marginLeft:6 }}>{currentTool?.desc}</span>
            </div>
            {toolMsgs.length > 0 && (
              <button className="ghost" style={{ fontSize:11, padding:'4px 10px' }}
                onClick={clearChat}>Clear</button>
            )}
          </div>

          {/* No key warning */}
          {!hasKey && (
            <div className="ais-no-key">
              <div style={{ fontSize:36 }}>🔑</div>
              <strong>API Key chahiye</strong>
              <p className="hint">Connect your AI provider to start</p>
              <button className="primary" onClick={() => setShowKeys(true)}>
                Setup API Key
              </button>
            </div>
          )}

          {/* Messages */}
          {hasKey && (
            <div className="chat-messages">
              {/* Welcome / quick prompts */}
              {toolMsgs.length === 0 && (
                <div className="ais-welcome">
                  <div className="ais-welcome-icon">{currentTool?.icon}</div>
                  <h3>{currentTool?.label}</h3>
                  <p className="hint">{currentTool?.desc}</p>
                  <div className="ais-quick-list">
                    {(QUICK[tool] || []).map((q, i) => (
                      <button key={i} className="ais-quick-btn"
                        onClick={() => { setInput(q); textaRef.current?.focus() }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {toolMsgs.map(msg => <Message key={msg.id} msg={msg}/>)}

              {sending && (
                <div className="chat-msg assistant">
                  <div className="chat-msg-avatar">🤖</div>
                  <div className="chat-msg-body">
                    <div className="typing-dots"><span/><span/><span/></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="settings-test-status error" style={{ margin:'0 4px' }}>
                  ⚠️ {error}
                </div>
              )}

              <div ref={msgsEndRef}/>
            </div>
          )}

          {/* ── Composer — My UI Design ChatComposer ──── */}
          {hasKey && (
            <div className="chat-composer">
              <div className="chat-composer-inner">
                <textarea ref={textaRef}
                  className="chat-composer-textarea"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={sending}
                  rows={2}
                  placeholder={
                    tool === 'image'     ? 'Describe the image you want...' :
                    tool === 'animation' ? 'Describe the animation effect...' :
                    tool === 'palette'   ? 'Describe your color mood...' :
                    'Ask anything creative...'
                  }
                />
                <div className="chat-composer-footer">
                  <div className="chat-composer-tools">
                    <span style={{ fontSize:11, color:'var(--text-faint)' }}>
                      Enter ↵ to send
                    </span>
                  </div>
                  <button className="chat-composer-send"
                    onClick={send}
                    disabled={!input.trim() || sending}>
                    {sending ? <span className="icon-spin">⟳</span> : '↑'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Key modal */}
      {showKeys && <APIKeyManager onClose={() => setShowKeys(false)}/>}

      {/* Mobile nav overlay */}
      {navOpen && (
        <div className="ais-nav-overlay" onClick={() => setNavOpen(false)}/>
      )}
    </div>
  )
              }
              
