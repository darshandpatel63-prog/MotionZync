// src/ai/components/AgentPicker/AgentPicker.jsx
// My UI Design AgentPicker pattern — MotionZync dark theme
// Shows in AIStudio + FloatingAI — model/provider quick switch
// Mobile + Desktop both perfect

import { useState, useRef, useEffect } from 'react'
import { useAI, AI_PROVIDERS } from '../../providers/AIProviderContext.jsx'
import './AgentPicker.css'

/**
 * @typedef {Object} AgentPickerProps
 * @property {'compact'|'full'} [size] - compact = 1 line chip, full = dropdown card
 * @property {Function} [onOpen] - called when settings needed
 */
export default function AgentPicker({ size = 'compact', onOpen }) {
  const {
    getConfig, activeProvider, activeModel,
    setActiveProvider, setActiveModel, AI_PROVIDERS: providers, configs
  } = useAI()

  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = e => { if (!dropRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const cfg     = getConfig(activeProvider)
  const pInfo   = AI_PROVIDERS[activeProvider]
  const hasKey  = cfg.apiKey || pInfo?.noKeyRequired

  // Connected providers only
  const connectedProviders = Object.values(AI_PROVIDERS).filter(p => {
    const c = getConfig(p.id)
    return c.enabled || p.noKeyRequired
  })

  const selectProvider = (pid) => {
    const p = AI_PROVIDERS[pid]
    setActiveProvider(pid)
    setActiveModel(getConfig(pid).selectedModel || p.defaultModel)
    setOpen(false)
  }

  const selectModel = (pid, mid) => {
    setActiveProvider(pid)
    setActiveModel(mid)
    setOpen(false)
  }

  return (
    <div className={`ap-wrap ap-${size}`} ref={dropRef}>

      {/* ── Trigger chip ─────────────────────────── */}
      <button className={`ap-chip ${open ? 'open' : ''} ${!hasKey ? 'ap-chip-warn' : ''}`}
        onClick={() => setOpen(o => !o)}>
        <span className="ap-chip-icon">{pInfo?.icon || '🤖'}</span>
        <span className="ap-chip-label">
          {cfg.selectedModel || pInfo?.defaultModel || activeProvider}
        </span>
        <span className={`ap-dot ${hasKey ? 'green' : 'red'}`}/>
        <span className="ap-caret">{open ? '▲' : '▼'}</span>
      </button>

      {/* ── Dropdown ─────────────────────────────── */}
      {open && (
        <div className="ap-dropdown">

          {/* Connected providers */}
          {connectedProviders.length > 0 && connectedProviders.map(p => {
            const pc = getConfig(p.id)
            const isActive = activeProvider === p.id
            return (
              <div key={p.id} className={`ap-provider-group ${isActive ? 'is-active' : ''}`}>
                {/* Provider header */}
                <div className="ap-provider-head"
                  onClick={() => selectProvider(p.id)}>
                  <span className="ap-p-icon">{p.icon}</span>
                  <span className="ap-p-name">{p.name}</span>
                  {isActive && <span className="ap-active-dot"/>}
                </div>
                {/* Models list */}
                <div className="ap-models">
                  {p.models.map(m => (
                    <button key={m.id}
                      className={`ap-model-btn ${activeModel === m.id && isActive ? 'selected' : ''}`}
                      onClick={() => selectModel(p.id, m.id)}>
                      <span className="ap-model-name">{m.label}</span>
                      <span className="ap-model-ctx">{(m.ctx/1000).toFixed(0)}K</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {/* No connected providers */}
          {connectedProviders.length === 0 && (
            <div className="ap-empty">
              <span>🔑 Koi provider connected nathi</span>
            </div>
          )}

          {/* Add provider */}
          <div className="ap-footer">
            <button className="ghost ap-add-btn"
              onClick={() => { setOpen(false); onOpen?.() }}>
              + API Key Add Karo
            </button>
          </div>
        </div>
      )}
    </div>
  )
                                                 }
                
