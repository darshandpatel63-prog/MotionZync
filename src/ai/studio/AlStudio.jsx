// src/ai/studio/AIStudio.jsx
// Complete AI Creative Studio
// Features: Chat, Text-to-Image, Text-to-Animation, Drawing Assist, Auto-color, Upscale, BG Remove
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAI } from '../providers/AIProviderContext.jsx'
import APIKeyManager from '../settings/APIKeyManager.jsx'
import './AIStudio.css'

// ─── AI Tool definitions ──────────────────────────────────────
const AI_TOOLS = [
  { id:'chat',       icon:'💬', label:'AI Chat',           desc:'Chat with AI for creative help, code, ideas' },
  { id:'image',      icon:'🎨', label:'Text → Image',      desc:'Generate images from text prompts' },
  { id:'animation',  icon:'🎬', label:'Text → Animation',  desc:'Generate CSS/JS animations from description' },
  { id:'css',        icon:'✨', label:'CSS Generator',     desc:'Generate CSS effects and animations' },
  { id:'draw',       icon:'✏️', label:'Drawing Assist',    desc:'AI help for drawing and composition' },
  { id:'color',      icon:'🌈', label:'Color Palette',     desc:'Generate color palettes from prompts' },
  { id:'code',       icon:'💻', label:'Code Assistant',    desc:'Write, fix and explain code' },
  { id:'storyboard', icon:'📋', label:'Storyboard',        desc:'Generate storyboard from story idea' },
  { id:'3d',         icon:'🌎', label:'3D Scene',          desc:'Generate 3D scene description and code' },
  { id:'music',      icon:'🎵', label:'Sound Design',      desc:'Generate audio/sound effect descriptions' },
]

const SYSTEM_PROMPTS = {
  chat:       'You are a creative AI assistant helping with digital art, animation, and design. Be concise, helpful and creative.',
  image:      'You are an expert at writing image generation prompts. Create detailed, vivid, professional prompts for AI image generators.',
  animation:  'You are an expert CSS and JavaScript animation developer. Generate clean, production-ready animation code. Always wrap CSS in <style> tags and JS in <script> tags.',
  css:        'You are an expert CSS developer. Generate stunning visual effects, animations and styling. Output clean CSS code wrapped in <style> tags with a live preview HTML structure.',
  draw:       'You are a professional drawing instructor and concept artist. Help users with composition, technique, color theory and creative direction.',
  color:      'You are a color theory expert and designer. Generate beautiful, harmonious color palettes. Always output colors in HEX format with names and use cases.',
  code:       'You are an expert frontend developer specializing in React, Canvas, WebGL and creative coding. Write clean, modern, well-commented code.',
  storyboard: 'You are a professional storyboard artist and director. Create detailed shot-by-shot storyboards with camera angles, composition, and scene descriptions.',
  '3d':       'You are a 3D scene designer and Three.js expert. Describe 3D scenes in detail and generate Three.js code when asked.',
  music:      'You are a sound designer and composer. Describe sound effects, music compositions and audio concepts for animations and games.',
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`ais-msg ${isUser?'user':'assistant'}`}>
      <div className="ais-msg-avatar">{isUser?'👤':'🤖'}</div>
      <div className="ais-msg-body">
        <div className="ais-msg-content"
          dangerouslySetInnerHTML={{__html: formatMessage(msg.content)}}/>
        {msg.imageURL && (
          <img src={msg.imageURL} alt="Generated" className="ais-msg-image"
            onClick={()=>window.open(msg.imageURL,'_blank')}/>
        )}
        {msg.cssCode && <CSSPreview code={msg.cssCode}/>}
      </div>
    </div>
  )
}

function formatMessage(text) {
  return text
    .replace(/```([\s\S]*?)```/g,'<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n/g,'<br/>')
}

function CSSPreview({ code }) {
  const iframeRef = useRef(null)
  const [show, setShow] = useState(false)
  return (
    <div className="ais-css-preview-wrap">
      <button className="ais-css-preview-btn" onClick={()=>setShow(s=>!s)}>
        {show?'Hide Preview':'▶ Live Preview'}
      </button>
      {show && (
        <iframe ref={iframeRef} className="ais-css-preview-frame"
          srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
            body{background:#0a0a12;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
            ${code}</style></head><body><div class="demo-element">Demo</div></body></html>`}
          sandbox="allow-scripts"/>
      )}
    </div>
  )
}

export default function AIStudio() {
  const navigate = useNavigate()
  const { chat, generateImage, getConfig, activeProvider, isLoading } = useAI()
  const [tool, setTool] = useState('chat')
  const [messages, setMessages] = useState({ chat:[], image:[], animation:[], css:[], draw:[], color:[], code:[], storyboard:'', '3d':'', music:'' })
  const [input, setInput] = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const msgsEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, tool])

  const cfg = getConfig(activeProvider)
  const hasKey = cfg.apiKey || cfg.noKeyRequired

  const getMsgs = () => Array.isArray(messages[tool]) ? messages[tool] : []
  const setMsgs = (updater) => setMessages(prev => ({
    ...prev,
    [tool]: typeof updater === 'function' ? updater(prev[tool] || []) : updater
  }))

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || generating) return
    if (!hasKey) { setShowKeys(true); return }
    setError('')

    const userMsg = { role:'user', content:text, id:Date.now() }
    setMsgs(prev => [...(prev||[]), userMsg])
    setInput('')
    setGenerating(true)

    try {
      if (tool === 'image') {
        // Image generation
        const enhancePrompt = await chat([
          { role:'system', content:SYSTEM_PROMPTS.image },
          { role:'user', content:`Enhance this image prompt for DALL-E 3: "${text}"` }
        ]).catch(()=>text)

        const imageURL = await generateImage(enhancePrompt||text, {
          size:'1024x1024', quality:'standard'
        })
        setMsgs(prev=>[...(prev||[]),{
          role:'assistant', content:`Generated image for: "${text}"`,
          imageURL, id:Date.now()
        }])
      } else {
        // Text-based tools
        const history = getMsgs().slice(-10).map(m=>({role:m.role, content:m.content}))
        const sysPrompt = SYSTEM_PROMPTS[tool] || SYSTEM_PROMPTS.chat

        const reply = await chat([
          { role:'system', content:sysPrompt },
          ...history,
          { role:'user', content:text }
        ])

        // Extract CSS for live preview
        const cssMatch = reply.match(/<style>([\s\S]*?)<\/style>/)
        const cssCode = cssMatch?.[1]

        setMsgs(prev=>[...(prev||[]),{
          role:'assistant', content:reply, cssCode, id:Date.now()
        }])
      }
    } catch(e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }, [input, tool, generating, hasKey, chat, generateImage, getMsgs, setMsgs])

  const onKeyDown = (e) => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const clearChat = () => setMsgs([])

  const currentTool = AI_TOOLS.find(t=>t.id===tool)
  const toolMsgs = getMsgs()

  // Quick prompts per tool
  const QUICK_PROMPTS = {
    chat:      ['Help me design a logo concept', 'Explain blend modes', 'Give me color palette ideas for ocean theme'],
    image:     ['Cyberpunk city at night, neon lights, rain', 'Minimalist logo for tech startup', 'Abstract watercolor art, purple and cyan'],
    animation: ['Glowing neon border animation', 'Floating particle effect', 'Text typewriter with cursor effect'],
    css:       ['Premium glassmorphism card', 'Gradient text animation', 'Neon glow button hover effect'],
    draw:      ['Composition tips for portrait', 'How to draw dynamic poses', 'Color theory for digital art'],
    color:     ['Cyberpunk neon palette', 'Warm sunset palette for UI', 'Ocean depth color system'],
    code:      ['Canvas confetti animation', 'Smooth scroll animation React', 'WebGL gradient background'],
    storyboard:['Action movie chase scene', 'Romantic comedy meet-cute', 'Sci-fi space exploration opening'],
  }

  return (
    <div className="ais-root">

      {/* ── Top Bar ── */}
      <header className="ais-topbar">
        <button className="ais-back" onClick={()=>navigate(-1)}>‹</button>
        <span className="ais-logo">🧠 AI Studio</span>
        <div className="ais-topbar-right">
          <div className={`ais-provider-badge ${hasKey?'connected':''}`}
            onClick={()=>setShowKeys(true)}>
            {AI_TOOLS.find(()=>true)&&cfg&&(
              <>
                <span>{hasKey?'🟢':'🔴'}</span>
                <span>{activeProvider}</span>
                <span className="ais-model-name">{cfg.selectedModel}</span>
              </>
            )}
          </div>
          <button className="ais-key-btn" onClick={()=>setShowKeys(true)}>
            🔑 API Keys
          </button>
        </div>
      </header>

      <div className="ais-body">

        {/* ── Tool Sidebar ── */}
        <nav className="ais-tools-nav">
          {AI_TOOLS.map(t=>(
            <button key={t.id}
              className={`ais-tool-btn ${tool===t.id?'active':''}`}
              onClick={()=>setTool(t.id)}
              title={t.desc}>
              <span className="ais-tool-icon">{t.icon}</span>
              <span className="ais-tool-label">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Main Chat Area ── */}
        <div className="ais-main">
          {/* Tool Header */}
          <div className="ais-tool-header">
            <span className="ais-tool-h-icon">{currentTool?.icon}</span>
            <div>
              <div className="ais-tool-h-name">{currentTool?.label}</div>
              <div className="ais-tool-h-desc">{currentTool?.desc}</div>
            </div>
            {toolMsgs.length>0 && (
              <button className="ais-clear-btn" onClick={clearChat}>Clear</button>
            )}
          </div>

          {/* No key warning */}
          {!hasKey && (
            <div className="ais-no-key">
              <div className="ais-no-key-icon">🔑</div>
              <p>Connect your AI API key to start</p>
              <button onClick={()=>setShowKeys(true)}>Setup API Key</button>
            </div>
          )}

          {/* Messages */}
          {hasKey && (
            <div className="ais-messages">
              {toolMsgs.length===0 && (
                <div className="ais-welcome">
                  <div className="ais-welcome-icon">{currentTool?.icon}</div>
                  <h3>{currentTool?.label}</h3>
                  <p>{currentTool?.desc}</p>
                  {QUICK_PROMPTS[tool] && (
                    <div className="ais-quick-prompts">
                      {QUICK_PROMPTS[tool].map((qp,i)=>(
                        <button key={i} className="ais-qp-btn"
                          onClick={()=>{setInput(qp);inputRef.current?.focus()}}>
                          {qp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {toolMsgs.map(msg=><ChatMessage key={msg.id} msg={msg}/>)}
              {generating && (
                <div className="ais-msg assistant">
                  <div className="ais-msg-avatar">🤖</div>
                  <div className="ais-typing">
                    <span/><span/><span/>
                  </div>
                </div>
              )}
              {error && <div className="ais-error">⚠️ {error}</div>}
              <div ref={msgsEndRef}/>
            </div>
          )}

          {/* Input area */}
          {hasKey && (
            <div className="ais-input-area">
              <textarea ref={inputRef}
                className="ais-textarea"
                rows={2}
                placeholder={
                  tool==='image' ? 'Describe the image you want to generate...'
                  : tool==='animation' ? 'Describe the animation effect...'
                  : 'Ask anything creative...'
                }
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={generating}
              />
              <button className="ais-send-btn"
                onClick={handleSend}
                disabled={!input.trim()||generating}>
                {generating
                  ? <span className="ais-spin">⏳</span>
                  : tool==='image' ? '🎨 Generate'
                  : '↑ Send'
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* API Key Manager modal */}
      {showKeys && <APIKeyManager onClose={()=>setShowKeys(false)}/>}
    </div>
  )
                                            }
    
