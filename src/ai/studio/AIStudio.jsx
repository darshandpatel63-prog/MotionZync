// src/ai/studio/AIStudio.jsx — v3.1
// My UI Design EntryShell + ChatPane pattern — MotionZync dark
// Now includes: AgentPicker, DesignSkills, DesignSystems, FilePreview
// Mobile + Desktop both perfect — NO lazy loading

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAI } from '../providers/AIProviderContext.jsx'
import APIKeyManager from '../settings/APIKeyManager.jsx'
import AgentPicker from '../components/AgentPicker/AgentPicker.jsx'
import DesignSkillsPanel, { DESIGN_SKILLS } from '../skills/DesignSkillsPanel.jsx'
import DesignSystemsPanel, { DESIGN_SYSTEMS } from '../systems/DesignSystemsPanel.jsx'
import DesignFilePreview from '../preview/DesignFilePreview.jsx'
import './AIStudio.css'

// ── Nav tools ──────────────────────────────────────────
const TOOLS = [
  { id:'chat',       icon:'💬', label:'Chat',       desc:'Creative AI assistant' },
  { id:'animation',  icon:'🎬', label:'Animate',    desc:'CSS animation generator' },
  { id:'image',      icon:'🖼', label:'Image',      desc:'Text to image generation' },
  { id:'css',        icon:'✨', label:'Effects',    desc:'CSS effects + live preview' },
  { id:'palette',    icon:'🎨', label:'Colors',     desc:'AI color palette generator' },
  { id:'code',       icon:'💻', label:'Code',       desc:'Code assistant' },
  { id:'storyboard', icon:'📋', label:'Story',      desc:'Storyboard from idea' },
  { id:'3d',         icon:'🌎', label:'3D',         desc:'3D scene + Three.js code' },
  { id:'skills',     icon:'⚡', label:'Skills',     desc:'134 design skill templates' },
  { id:'systems',    icon:'🎨', label:'Systems',    desc:'152 design system presets' },
  { id:'preview',    icon:'📂', label:'Preview',    desc:'Design file viewer' },
]

const SYSTEM = {
  chat:       'You are a creative AI assistant for MotionZync. Help with digital art, animation, CSS, design. Be concise, creative, helpful.',
  animation:  `Generate CSS animation. Output exactly:
---TITLE---
Name
---CSS---
.mz-el{...}@keyframes name{...}
---DESCRIPTION---
One line description`,
  image:      'Enhance this image description into a vivid, detailed DALL-E 3 prompt. Output only the enhanced prompt.',
  css:        'Generate a stunning CSS visual effect using .mz-el class. Output only the CSS in a ```css code block.',
  palette:    `Generate 6-color palette. Output exactly:
---NAME---
Palette name
---COLORS---
#hex|ColorName|UseCase
(6 lines total)
---MOOD---
One line mood`,
  code:       'You are an expert frontend developer. Write clean, production-ready code with brief explanations.',
  storyboard: 'You are a professional film director. Create detailed shot-by-shot storyboards with camera angles, composition, lighting.',
  '3d':       'You are a Three.js expert. Describe 3D scenes and generate complete Three.js code when asked.',
  skills:     'You are an expert designer. Generate detailed, production-ready design content based on the skill template provided.',
  systems:    'You are a design system expert. Generate UI/UX content that perfectly matches the specified design system style, colors, and principles.',
}

const QUICK = {
  chat:       ['Help me design a UI layout', 'Explain CSS blend modes', 'Animation ideas for landing page'],
  animation:  ['Glowing neon ring pulse', 'Glitch text distortion', 'Liquid blob morphing'],
  image:      ['Cyberpunk city night', 'Abstract purple galaxy', 'Minimal product mockup'],
  css:        ['Glassmorphism card', 'Neon glow button', 'Animated gradient background'],
  palette:    ['Ocean depth palette', 'Neon cyberpunk colors', 'Warm sunset UI palette'],
  code:       ['Canvas particle system', 'Smooth parallax scroll', 'CSS grid masonry layout'],
  storyboard: ['Tech product reveal ad', 'Action movie chase', 'App onboarding video'],
  '3d':       ['Rotating crystal scene', 'Neon grid floor', 'Floating UI elements 3D'],
  skills:     ['Select a skill from the panel →'],
  systems:    ['Select a design system from the panel →'],
  preview:    ['Drop a file or paste SVG/CSS/HTML content'],
}

// ── Live CSS preview iframe ─────────────────────────────
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
      {show && <iframe className="ais-preview-frame" srcDoc={src} sandbox="allow-scripts" title="preview"/>}
    </div>
  )
}

// ── Palette display ─────────────────────────────────────
function PaletteCard({ data }) {
  const [copied, setCopied] = useState(null)
  return (
    <div className="ais-palette">
      <strong style={{ fontSize:12, color:'var(--purple)' }}>{data.name}</strong>
      <div className="ais-swatches">
        {data.colors.map((c, i) => (
          <div key={i} className="ais-swatch"
            onClick={() => { navigator.clipboard.writeText(c.hex); setCopied(i); setTimeout(() => setCopied(null), 1500) }}>
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

// ── Single message ──────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === 'user'
  const cssMatch = msg.content?.match(/```css\n?([\s\S]+?)```/)
  const formatted = (msg.content || '')
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return (
    <div className={`chat-msg ${isUser ? 'user' : 'assistant'}`}>
      <div className="chat-msg-avatar">{isUser ? '👤' : '🤖'}</div>
      <div className="chat-msg-body">
        <div className="chat-msg-content">
          <div dangerouslySetInnerHTML={{ __html: formatted }}/>
          {msg.imageURL && (
            <img src={msg.imageURL} alt="Generated" className="ais-img"
              onClick={() => window.open(msg.imageURL, '_blank')}/>
          )}
          {msg.paletteData && <PaletteCard data={msg.paletteData}/>}
          {cssMatch && <LivePreview css={cssMatch[1]}/>}
          {msg.animData && (
            <div className="ais-anim-card">
              <strong style={{ fontSize:12, color:'var(--purple)' }}>{msg.animData.title}</strong>
              <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                <button className="ghost" style={{ fontSize:11 }}
                  onClick={() => navigator.clipboard.writeText(msg.animData.css)}>⧉ Copy CSS</button>
                <LivePreview css={msg.animData.css}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main AIStudio ───────────────────────────────────────
export default function AIStudio() {
  const navigate  = useNavigate()
  const { chat, generateImage, getConfig, activeProvider, isLoading } = useAI()

  const [tool,     setTool]     = useState('chat')
  const [messages, setMessages] = useState({})
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [navOpen,  setNavOpen]  = useState(false)
  // Design Skills/Systems active selection
  const [activeSkill,  setActiveSkill]  = useState(null)
  const [activeSystem, setActiveSystem] = useState(null)

  const msgsEndRef = useRef(null)
  const textaRef   = useRef(null)

  const cfg    = getConfig(activeProvider)
  const hasKey = cfg.apiKey || cfg.noKeyRequired
  const toolMsgs = messages[tool] || []
  const currentTool = TOOLS.find(t => t.id === tool)

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, tool])

  const addMsg = useCallback((msg) => {
    setMessages(prev => ({ ...prev, [tool]: [...(prev[tool] || []), msg] }))
  }, [tool])

  // When skill selected → prefill input with prompt
  const onSkillSelect = (skill) => {
    setActiveSkill(skill)
    const systemContext = activeSystem
      ? `\n\nUse ${activeSystem.name} design system style: primary color ${activeSystem.primary}, bg ${activeSystem.bg}, fonts: ${activeSystem.fonts.heading}.`
      : ''
    setInput(skill.prompt + systemContext)
    setTool('chat')
    setNavOpen(false)
    setTimeout(() => textaRef.current?.focus(), 200)
  }

  // When design system selected → note it
  const onSystemSelect = (sys) => {
    setActiveSystem(sys)
    addMsg({
      role: 'assistant',
      content: `✅ **${sys.name}** design system selected!\n\nColors: Primary ${sys.primary} | BG ${sys.bg} | Text ${sys.text}\nFonts: ${sys.fonts.heading} / ${sys.fonts.body}\n${sys.description}\n\nAb koi bhi skill ya prompt use karsho to **${sys.name}** style ma generate thashe!`,
      id: Date.now()
    })
    setTool('chat')
    setNavOpen(false)
  }

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    if (!hasKey) { setShowKeys(true); return }

    setInput('')
    setError('')
    setSending(true)
    addMsg({ role:'user', content:text, id:Date.now() })

    try {
      // Build system prompt — add design system context if selected
      let sysPrompt = SYSTEM[tool] || SYSTEM.chat
      if (activeSystem) {
        sysPrompt += `\n\nDesign System Context: ${activeSystem.name}\n- Primary: ${activeSystem.primary}\n- Background: ${activeSystem.bg}\n- Text: ${activeSystem.text}\n- Fonts: ${activeSystem.fonts.heading}\n- Style: ${activeSystem.description}`
      }

      if (tool === 'image') {
        const enhanced = await chat([
          { role:'system', content:SYSTEM.image },
          { role:'user',   content:text }
        ]).catch(() => text)
        const url = await generateImage(enhanced, { size:'1024x1024' })
        addMsg({ role:'assistant', content:'Generated!', imageURL:url, id:Date.now() })
        return
      }

      const history = toolMsgs.slice(-8).map(m => ({ role:m.role, content:m.content }))
      const reply   = await chat([
        { role:'system', content:sysPrompt },
        ...history,
        { role:'user', content:text }
      ])

      let extra = {}
      if (tool === 'animation' || (tool === 'skills' && activeSkill?.tags?.includes('animation'))) {
        const css = reply.match(/---CSS---\s*\n([\s\S]*?)(?:---|$)/)?.[1]?.trim()
        const ttl = reply.match(/---TITLE---\s*\n(.*?)\n/)?.[1]?.trim()
        if (css) extra.animData = { title:ttl||'Animation', css }
      }
      if (tool === 'palette') {
        const blk    = reply.match(/---COLORS---\s*\n([\s\S]*?)(?:---|$)/)?.[1] || ''
        const colors = blk.trim().split('\n')
          .map(l => { const [h,n] = l.split('|'); return { hex:h?.trim(), name:n?.trim() } })
          .filter(c => c.hex?.startsWith('#'))
        const name   = reply.match(/---NAME---\s*\n(.*?)\n/)?.[1]?.trim()
        const mood   = reply.match(/---MOOD---\s*\n([\s\S]*?)$/)?.[1]?.trim()
        if (colors.length) extra.paletteData = { name:name||'Palette', colors, mood }
      }

      addMsg({ role:'assistant', content:reply, id:Date.now(), ...extra })
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }, [input, tool, sending, hasKey, chat, generateImage, toolMsgs, addMsg, activeSystem, activeSkill])

  const onKeyDown = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const clearChat = () => setMessages(prev => ({ ...prev, [tool]:[] }))
  const switchTool = id => { setTool(id); setNavOpen(false); setError('') }

  const isSpecialPanel = tool === 'skills' || tool === 'systems' || tool === 'preview'

  return (
    <div className="ais-root">

      {/* ── Topbar ───────────────────────────────────── */}
      <div className="ais-topbar">
        <button className="ais-back" onClick={() => navigate(-1)}>‹</button>
        <span className="ais-brand">🧠 AI Studio</span>

        {/* Mobile hamburger */}
        <button className="ais-nav-toggle" onClick={() => setNavOpen(o => !o)}>
          {navOpen ? '✕' : '☰'}
        </button>

        <div className="ais-topbar-right">
          {/* Agent Picker — My UI Design pattern */}
          <AgentPicker onOpen={() => setShowKeys(true)}/>
          <button className="ghost" style={{ fontSize:12, padding:'5px 12px' }}
            onClick={() => setShowKeys(true)}>🔑</button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="ais-body">

        {/* Nav rail — My UI Design EntryNavRail */}
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
          {/* Active design system indicator */}
          {activeSystem && (
            <div className="ais-sys-indicator" title={activeSystem.name}>
              <div className="ais-sys-dot" style={{ background:activeSystem.primary }}/>
              <span>{activeSystem.name}</span>
              <button onClick={() => setActiveSystem(null)} title="Clear">✕</button>
            </div>
          )}
        </nav>

        {/* ── Special panels (Skills / Systems / Preview) ── */}
        {isSpecialPanel && (
          <div className="ais-special-panel">
            {tool === 'skills'  && <DesignSkillsPanel  onSelectSkill={onSkillSelect}/>}
            {tool === 'systems' && <DesignSystemsPanel onSelectSystem={onSystemSelect}/>}
            {tool === 'preview' && <DesignFilePreview/>}
          </div>
        )}

        {/* ── Chat pane ─────────────────────────────── */}
        {!isSpecialPanel && (
          <div className="chat-pane">

            {/* Chat header */}
            <div className="ais-chat-head">
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="ais-tool-icon">{currentTool?.icon}</span>
                <strong>{currentTool?.label}</strong>
                <span className="hint">{currentTool?.desc}</span>
                {activeSystem && (
                  <span className="ais-sys-chip" style={{ background:activeSystem.primary + '30', color:activeSystem.primary, border:`1px solid ${activeSystem.primary}50` }}>
                    {activeSystem.name}
                  </span>
                )}
              </div>
              {toolMsgs.length > 0 && (
                <button className="ghost" style={{ fontSize:11, padding:'4px 10px' }}
                  onClick={clearChat}>Clear</button>
              )}
            </div>

            {/* No key */}
            {!hasKey && (
              <div className="ais-no-key">
                <div style={{ fontSize:36 }}>🔑</div>
                <strong>API Key chahiye</strong>
                <p className="hint">Connect your AI provider to start</p>
                <button className="primary" onClick={() => setShowKeys(true)}>Setup API Key</button>
              </div>
            )}

            {/* Messages */}
            {hasKey && (
              <div className="chat-messages">
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

            {/* Composer */}
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
                      tool==='image'     ? 'Describe the image...' :
                      tool==='animation' ? 'Describe the animation...' :
                      tool==='palette'   ? 'Describe your color mood...' :
                      activeSystem       ? `Ask in ${activeSystem.name} style...` :
                      'Ask anything creative...'
                    }
                  />
                  <div className="chat-composer-footer">
                    <div className="chat-composer-tools">
                      {activeSkill && (
                        <span style={{ fontSize:10, color:'var(--purple)', background:'var(--accent-tint)', padding:'2px 8px', borderRadius:'var(--radius-pill)' }}>
                          ⚡ {activeSkill.label}
                          <button style={{ marginLeft:4, fontSize:10, color:'var(--text-muted)' }}
                            onClick={() => { setActiveSkill(null); setInput('') }}>✕</button>
                        </span>
                      )}
                      {!activeSkill && (
                        <span style={{ fontSize:11, color:'var(--text-faint)' }}>Enter ↵</span>
                      )}
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
        )}
      </div>

      {showKeys && <APIKeyManager onClose={() => setShowKeys(false)}/>}
      {navOpen && <div className="ais-nav-overlay" onClick={() => setNavOpen(false)}/>}
    </div>
  )
          }
      
