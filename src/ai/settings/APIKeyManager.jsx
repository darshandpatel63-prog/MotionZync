// src/ai/settings/APIKeyManager.jsx
// BYOK settings — user enters their own API keys
// Keys stored only in browser localStorage

import { useState } from 'react'
import { useAI, AI_PROVIDERS } from '../providers/AIProviderContext.jsx'
import './APIKeyManager.css'

export default function APIKeyManager({ onClose }) {
  const { getConfig, saveConfig, testConnection, setActiveProvider, setActiveModel, isLoading } = useAI()
  const [selected, setSelected] = useState('openai')
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const cfg = getConfig(selected)
  const provider = AI_PROVIDERS[selected]

  const handleSave = (key, value) => {
    saveConfig(selected, { [key]: value })
  }

  const handleTest = async () => {
    setTesting(true); setTestResult(null)
    try {
      await testConnection(selected)
      setTestResult({ ok:true, msg:'✅ Connected successfully!' })
      setActiveProvider(selected)
      setActiveModel(cfg.selectedModel)
    } catch(e) {
      setTestResult({ ok:false, msg:`❌ ${e.message}` })
    } finally { setTesting(false) }
  }

  return (
    <div className="akm-overlay" onClick={e=>e.target===e.currentTarget&&onClose?.()}>
      <div className="akm-modal">

        {/* Header */}
        <div className="akm-header">
          <div>
            <h2 className="akm-title">🔑 AI API Settings</h2>
            <p className="akm-sub">Your keys are stored only in your browser. Never sent to our servers.</p>
          </div>
          <button className="akm-close" onClick={onClose}>✕</button>
        </div>

        <div className="akm-body">
          {/* Provider list */}
          <div className="akm-providers">
            {Object.values(AI_PROVIDERS).map(p => {
              const c = getConfig(p.id)
              return (
                <button key={p.id}
                  className={`akm-provider-btn ${selected===p.id?'active':''} ${c.enabled?'enabled':''}`}
                  onClick={()=>{setSelected(p.id);setTestResult(null)}}>
                  <span className="akm-p-icon">{p.icon}</span>
                  <span className="akm-p-name">{p.name}</span>
                  {c.enabled && <span className="akm-connected-dot"/>}
                </button>
              )
            })}
          </div>

          {/* Config panel */}
          <div className="akm-config">
            <div className="akm-config-head">
              <span>{provider.icon} {provider.name}</span>
              {cfg.enabled && <span className="akm-badge-ok">Connected</span>}
            </div>

            {/* API Key */}
            {!provider.noKeyRequired && (
              <div className="akm-field">
                <label className="akm-label">API Key</label>
                <div className="akm-key-wrap">
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="akm-input"
                    value={cfg.apiKey}
                    placeholder={provider.keyPlaceholder}
                    onChange={e=>handleSave('apiKey', e.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <button className="akm-show-btn" onClick={()=>setShowKey(s=>!s)}>
                    {showKey ? '🙈' : '👁'}
                  </button>
                </div>
                {provider.keyDocs && (
                  <a href={provider.keyDocs} target="_blank" rel="noreferrer" className="akm-docs-link">
                    Get API key ↗
                  </a>
                )}
              </div>
            )}

            {provider.noKeyRequired && (
              <div className="akm-info-box">
                <span>🦙 No API key needed — Ollama runs locally on your device.</span>
                <a href="https://ollama.com" target="_blank" rel="noreferrer" className="akm-docs-link">
                  Install Ollama ↗
                </a>
              </div>
            )}

            {/* Model selector */}
            <div className="akm-field">
              <label className="akm-label">Model</label>
              <select className="akm-select"
                value={cfg.selectedModel}
                onChange={e=>handleSave('selectedModel', e.target.value)}>
                {provider.models.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Custom base URL */}
            {provider.isCustom && (
              <div className="akm-field">
                <label className="akm-label">Endpoint URL</label>
                <input type="text" className="akm-input"
                  value={cfg.customBaseURL}
                  placeholder="https://your-api.com/v1"
                  onChange={e=>handleSave('customBaseURL', e.target.value)}/>
              </div>
            )}

            {/* Test connection */}
            <div className="akm-actions">
              <button className="akm-test-btn" onClick={handleTest} disabled={testing||isLoading}>
                {testing ? '⏳ Testing...' : '🔌 Test Connection'}
              </button>
              <button className="akm-save-btn" onClick={()=>{
                setActiveProvider(selected)
                setActiveModel(cfg.selectedModel)
                onClose?.()
              }}>Use This Provider</button>
            </div>

            {testResult && (
              <div className={`akm-result ${testResult.ok?'ok':'err'}`}>{testResult.msg}</div>
            )}

            {/* Privacy note */}
            <div className="akm-privacy">
              🔒 <strong>Privacy:</strong> Your API keys are encrypted and stored only in your browser's
              localStorage. They are never transmitted to our servers. All AI requests are made
              directly from your browser to the AI provider's API.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
                  }
                                          
