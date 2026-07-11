// src/ai/settings/APIKeyManager.jsx
// My UI Design SettingsDialog pattern → MotionZync BYOK
// Mobile + Desktop both work perfectly
// Updated (Phase 1 / Step 2): gated behind a passphrase vault — see keyVault.js.
// Saved keys are now encrypted at rest. Everything else (test/use/delete) works
// exactly as before once the vault is unlocked for this session.

import { useState } from 'react'
import { useAI, AI_PROVIDERS } from '../providers/AIProviderContext.jsx'
import './APIKeyManager.css'

const NAV_ITEMS = [
  { id:'anthropic', icon:'🔬', label:'Anthropic',      sub:'Claude models' },
  { id:'openai',    icon:'🤖', label:'OpenAI',         sub:'GPT + DALL-E'  },
  { id:'gemini',    icon:'💎', label:'Google Gemini',  sub:'Gemini models' },
  { id:'ollama',    icon:'🦙', label:'Ollama',         sub:'Local / Free'  },
  { id:'custom',    icon:'⚙️', label:'Custom API',     sub:'Any endpoint'  },
]

// ── NEW: passphrase gate (setup / migrate / unlock) ──────────────────
function VaultGate({ mode, busy, error, resetArmed, onSubmit, onReset }) {
  const [pass, setPass]       = useState('')
  const [confirm, setConfirm] = useState('')
  const isSetup   = mode === 'setup' || mode === 'migrate'
  const mismatch  = isSetup && confirm.length > 0 && pass !== confirm

  return (
    <div className="vault-gate">
      <div className="vault-gate-icon">🔒</div>
      <h3 className="vault-gate-title">
        {mode === 'setup'   && 'AI keys ને encrypt કરવા passphrase બનાવો'}
        {mode === 'migrate' && 'Existing key ને secure કરવા passphrase બનાવો'}
        {mode === 'unlock'  && 'Vault locked છે — passphrase નાખો'}
      </h3>
      <p className="vault-gate-hint">
        {isSetup
          ? 'આ passphrase ક્યાંય save નથી થતું — ફક્ત તમારી પાસે જ રહેશે. ભૂલી જાઓ તો Reset કરવું પડશે (saved keys ફરી નાખવી પડશે).'
          : 'Browser/tab reload પછી ફરી નાખવું પડે છે — keys ને સુરક્ષિત રાખવા માટે.'}
      </p>

      <div className="vault-gate-field">
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Passphrase"
          autoFocus
          autoComplete="new-password"
          onKeyDown={e => e.key === 'Enter' && !isSetup && pass && onSubmit(pass)}
        />
      </div>

      {isSetup && (
        <div className="vault-gate-field">
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Passphrase ફરી નાખો"
            autoComplete="new-password"
            onKeyDown={e => e.key === 'Enter' && !mismatch && pass && confirm && onSubmit(pass)}
          />
        </div>
      )}

      {mismatch && <div className="vault-gate-mismatch">બંને passphrase સરખા નથી</div>}
      {error && <div className="vault-gate-mismatch">{error}</div>}

      <button
        className="primary vault-gate-submit"
        disabled={busy || !pass || (isSetup && (!confirm || mismatch))}
        onClick={() => onSubmit(pass)}
      >
        {busy ? '⏳ ...' : (isSetup ? '🔒 Secure Keys' : '🔓 Unlock')}
      </button>

      {mode === 'unlock' && (
        <button className="vault-gate-forgot" onClick={onReset}>
          {resetArmed ? '⚠️ ફરી click કરો — બધી saved keys delete થશે' : 'Passphrase ભૂલી ગયા? Reset vault'}
        </button>
      )}
    </div>
  )
}

export default function APIKeyManager({ onClose }) {
  const {
    getConfig, saveConfig, deleteConfig,
    testConnection, setActiveProvider, setActiveModel, isLoading,
    vaultExists, vaultUnlocked, needsMigration,
    setupVault, unlockVault, lockVault, resetVault,
  } = useAI()

  const [selected,    setSelected]    = useState('openai')
  const [showKey,     setShowKey]     = useState(false)
  const [testing,     setTesting]     = useState(false)
  const [testStatus,  setTestStatus]  = useState(null) // null | 'running' | 'success' | 'error'
  const [testMsg,     setTestMsg]     = useState('')
  const [confirmDel,  setConfirmDel]  = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [vaultBusy,   setVaultBusy]   = useState(false)
  const [vaultError,  setVaultError]  = useState('')
  const [resetArmed,  setResetArmed]  = useState(false)

  const cfg      = getConfig(selected)
  const provider = AI_PROVIDERS[selected]

  const handleSave = (key, value) => {
    setSaving(true)
    saveConfig(selected, { [key]: value })
    setTimeout(() => setSaving(false), 1200)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestStatus('running')
    setTestMsg('Testing connection...')
    try {
      await testConnection(selected)
      setTestStatus('success')
      setTestMsg(`✓ Connected to ${provider.name} successfully!`)
      setActiveProvider(selected)
      setActiveModel(cfg.selectedModel)
    } catch (e) {
      setTestStatus('error')
      setTestMsg(e.message || 'Connection failed')
    } finally {
      setTesting(false)
    }
  }

  const handleDelete = () => {
    if (!confirmDel) { setConfirmDel(true); return }
    deleteConfig(selected)
    setConfirmDel(false)
    setTestStatus('success')
    setTestMsg('API key deleted.')
  }

  const handleVaultSubmit = async (passphrase) => {
    setVaultBusy(true)
    setVaultError('')
    try {
      if (!vaultExists || needsMigration) await setupVault(passphrase)
      else await unlockVault(passphrase)
    } catch (e) {
      setVaultError(e.message || 'કંઈક ખોટું થયું, ફરી પ્રયત્ન કરો')
    } finally {
      setVaultBusy(false)
    }
  }

  const handleVaultReset = () => {
    if (!resetArmed) { setResetArmed(true); return }
    resetVault()
    setResetArmed(false)
    setVaultError('')
  }

  // ── Vault locked / needs setup / needs migration → gate screen ──────
  if (!vaultUnlocked) {
    let mode = 'unlock'
    if (needsMigration) mode = 'migrate'
    else if (!vaultExists) mode = 'setup'

    return (
      <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose?.()}>
        <div className="modal modal-settings" style={{ position:'relative' }}>
          <div className="settings-chrome">
            <span/>
            <button className="settings-close" onClick={onClose} title="Close">✕</button>
          </div>
          <div className="modal-head">
            <div className="modal-head-line">
              <span className="kicker">AI Configuration</span>
              <h2>API Key Settings</h2>
            </div>
          </div>
          <VaultGate
            mode={mode}
            busy={vaultBusy}
            error={vaultError}
            resetArmed={resetArmed}
            onSubmit={handleVaultSubmit}
            onReset={handleVaultReset}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="modal modal-settings" style={{ position:'relative' }}>

        {/* ── Chrome: lock + close + autosave ─────────────────── */}
        <div className="settings-chrome">
          <button className="ghost vault-lock-btn" onClick={lockVault} title="Lock vault">
            🔒 Lock
          </button>
          <span className={`settings-autosave ${saving ? 'is-saving' : ''}`}>
            {saving ? '⏳ Saving...' : ''}
          </span>
          <button className="settings-close" onClick={onClose} title="Close">✕</button>
        </div>

        {/* ── Header ───────────────────────────────────── */}
        <div className="modal-head">
          <div className="modal-head-line">
            <span className="kicker">AI Configuration</span>
            <h2>API Key Settings</h2>
            <p className="subtitle">
              Keys are encrypted with your passphrase and stored only in your browser — never sent to our servers.
            </p>
          </div>
        </div>

        {/* ── Body: sidebar + content ───────────────────── */}
        <div className="modal-body">

          {/* Sidebar — provider list */}
          <div className="settings-sidebar">
            {NAV_ITEMS.map(item => {
              const c = getConfig(item.id)
              return (
                <button key={item.id}
                  className={`settings-nav-item ${selected === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelected(item.id)
                    setTestStatus(null)
                    setConfirmDel(false)
                  }}>
                  <span className="nav-icon" style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.sub}</small>
                  </span>
                  {c.enabled && (
                    <span style={{
                      marginLeft:'auto', width:7, height:7,
                      borderRadius:'50%', background:'var(--green)', flexShrink:0
                    }}/>
                  )}
                </button>
              )
            })}
          </div>

          {/* Content — key setup */}
          <div className="settings-content">
            <div className="settings-section">

              {/* Provider header card */}
              <div className="settings-section-card">
                <div className="section-head">
                  <h3>{provider.icon} {provider.name}</h3>
                  <div className="section-head-actions">
                    {cfg.enabled
                      ? <span className="field-status-badge">● Connected</span>
                      : <span className="hint">Not connected</span>
                    }
                  </div>
                </div>

                {/* API Key input */}
                {!provider.noKeyRequired && (
                  <div className="field" style={{ marginTop: 12 }}>
                    <div className="field-label-row">
                      <label className="field-label">
                        API Key <span className="field-required">*</span>
                      </label>
                      {provider.keyDocs && (
                        <a href={provider.keyDocs} target="_blank"
                          rel="noreferrer" className="field-label-link">
                          Get key ↗
                        </a>
                      )}
                    </div>
                    <div className="field-row">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={cfg.apiKey}
                        placeholder={provider.keyPlaceholder}
                        onChange={e => handleSave('apiKey', e.target.value)}
                        autoComplete="off" spellCheck={false}
                      />
                      <button className="ghost"
                        onClick={() => setShowKey(s => !s)}
                        style={{ flexShrink: 0, padding: '0 12px' }}>
                        {showKey ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>
                )}

                {provider.noKeyRequired && (
                  <div className="hint" style={{ marginTop: 10, padding: '10px 0' }}>
                    🦙 No API key required — Ollama runs locally on your device.{' '}
                    <a href="https://ollama.com" target="_blank" rel="noreferrer">
                      Install Ollama ↗
                    </a>
                  </div>
                )}

                {/* Model selector */}
                <div className="field" style={{ marginTop: 14 }}>
                  <label className="field-label">Model</label>
                  <select value={cfg.selectedModel}
                    onChange={e => handleSave('selectedModel', e.target.value)}>
                    {provider.models.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.label}  ({(m.ctx / 1000).toFixed(0)}K ctx)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom endpoint */}
                {provider.isCustom && (
                  <div className="field" style={{ marginTop: 14 }}>
                    <label className="field-label">Endpoint URL</label>
                    <input type="text"
                      value={cfg.customBaseURL}
                      placeholder="https://your-api.com/v1"
                      onChange={e => handleSave('customBaseURL', e.target.value)}/>
                  </div>
                )}

                {/* Test + Use buttons */}
                <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap', alignItems:'center' }}>
                  <button className={`settings-test-btn ${testing ? 'loading' : ''}`}
                    onClick={handleTest}
                    disabled={testing || isLoading || (!cfg.apiKey && !provider.noKeyRequired)}>
                    {testing
                      ? <><span className="icon-spin">⟳</span> Testing...</>
                      : '🔌 Test Connection'
                    }
                  </button>
                  <button className="primary"
                    onClick={() => {
                      setActiveProvider(selected)
                      setActiveModel(cfg.selectedModel)
                      onClose?.()
                    }}>
                    ✓ Use {provider.name}
                  </button>
                </div>

                {/* Test status */}
                {testStatus && (
                  <div className={`settings-test-status ${testStatus}`}
                    style={{ marginTop: 10 }}>
                    {testMsg}
                  </div>
                )}
              </div>

              {/* ── Supported features ───────────────────── */}
              <div className="settings-section-card">
                <div className="section-head"><h3>Capabilities</h3></div>
                <div className="protocol-chips" style={{ marginTop: 8 }}>
                  <span className={`protocol-chip ${provider.supportsVision ? 'active' : ''}`}>
                    👁 Vision
                  </span>
                  <span className={`protocol-chip ${provider.supportsStreaming ? 'active' : ''}`}>
                    ⚡ Streaming
                  </span>
                  <span className={`protocol-chip ${provider.imageModel ? 'active' : ''}`}>
                    🎨 Image Gen
                  </span>
                  <span className={`protocol-chip ${provider.noKeyRequired ? 'active' : ''}`}>
                    🔓 Free / Local
                  </span>
                </div>
              </div>

              {/* ── Delete API Key ────────────────────────── */}
              {cfg.apiKey && !provider.noKeyRequired && (
                <div className="danger-zone">
                  <div className="danger-zone-label">⚠️ Danger Zone</div>
                  {!confirmDel ? (
                    <button className="danger-btn" onClick={handleDelete}>
                      🗑️ Delete API Key
                    </button>
                  ) : (
                    <div className="confirm-panel">
                      <strong>Delete API Key?</strong>
                      <p>
                        Tamari {provider.name} key remove thashe.
                        Aane anytime pachi add kari shakasho.
                      </p>
                      <div className="confirm-panel-btns">
                        <button className="confirm-yes" onClick={handleDelete}>Yes, Delete</button>
                        <button className="confirm-no"  onClick={() => setConfirmDel(false)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Privacy note ─────────────────────────── */}
              <div className="hint" style={{
                padding:'10px 14px', background:'var(--bg-subtle)',
                borderRadius:'var(--radius-sm)', border:'1px solid var(--border)',
                fontSize: 11, lineHeight: 1.6
              }}>
                🔒 <strong>Privacy:</strong> API keys are encrypted with your passphrase
                (AES-GCM) and saved only in your browser's localStorage. They never leave
                your device — all AI requests go directly from your browser to the AI
                provider's API. Lock the vault or delete your key anytime.
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
      }
        
