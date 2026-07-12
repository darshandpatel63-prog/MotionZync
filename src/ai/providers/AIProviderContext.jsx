// src/ai/providers/AIProviderContext.jsx
// BYOK — Multi-provider AI system
// Fixed (Phase 1 / Step 1): Anthropic calls were missing 'anthropic-dangerous-direct-browser-access'
//   header (blocked by CORS in both dev + prod) + model IDs were outdated. Both fixed here.
// Fixed (Phase 1 / Step 2): API keys are now encrypted at rest (AES-GCM, passphrase-derived
//   key via PBKDF2 — see keyVault.js). Plaintext legacy keys auto-migrate on first unlock.
// Added: deleteConfig() — user can delete any saved API key

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import {
  hasVault, createVault, unlockVault as unlockVaultKey,
  encryptWithKey, decryptWithKey, resetVault as resetVaultStorage,
} from './keyVault.js'

export const AI_PROVIDERS = {
  anthropic: {
    id: 'anthropic', name: 'Anthropic', icon: '🔬',
    baseURL: 'https://api.anthropic.com/v1',
    models: [
      { id:'claude-opus-4-8',           label:'Claude Opus 4.8',   ctx:200000 },
      { id:'claude-sonnet-5',           label:'Claude Sonnet 5',   ctx:200000 },
      { id:'claude-haiku-4-5-20251001', label:'Claude Haiku 4.5',  ctx:200000 },
      { id:'claude-fable-5',            label:'Claude Fable 5',    ctx:200000 },
    ],
    defaultModel: 'claude-sonnet-5',
    keyPlaceholder: 'sk-ant-api...',
    keyDocs: 'https://console.anthropic.com/settings/keys',
    imageModel: null, supportsVision: true, supportsStreaming: true,
  },
  openai: {
    id: 'openai', name: 'OpenAI', icon: '🤖',
    baseURL: 'https://api.openai.com/v1',
    models: [
      { id:'gpt-4o',      label:'GPT-4o',        ctx:128000 },
      { id:'gpt-4o-mini', label:'GPT-4o Mini',   ctx:128000 },
      { id:'gpt-4-turbo', label:'GPT-4 Turbo',   ctx:128000 },
      { id:'o1-preview',  label:'o1 Preview',    ctx:128000 },
      { id:'o1-mini',     label:'o1 Mini',       ctx:128000 },
    ],
    defaultModel: 'gpt-4o',
    keyPlaceholder: 'sk-...',
    keyDocs: 'https://platform.openai.com/api-keys',
    imageModel: 'dall-e-3', supportsVision: true, supportsStreaming: true,
  },
  gemini: {
    id: 'gemini', name: 'Google Gemini', icon: '💎',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      // Fixed (Phase 1 / Step 4): gemini-1.5-* and gemini-2.0-* are ALL shut down
      // as of mid-2026 (confirmed via Google's own docs) — every request 404'd,
      // which is why "Test Connection" was failing. These are the current GA models.
      { id:'gemini-3.5-flash',      label:'Gemini 3.5 Flash',      ctx:1000000 },
      { id:'gemini-3.1-flash-lite', label:'Gemini 3.1 Flash-Lite', ctx:1000000 },
    ],
    defaultModel: 'gemini-3.5-flash',
    keyPlaceholder: 'AIza...',
    keyDocs: 'https://aistudio.google.com/app/apikey',
    imageModel: null, supportsVision: true, supportsStreaming: true,
    // imageModel intentionally null — generateImage() doesn't route Gemini's
    // native image models yet (it's hardcoded to OpenAI); see audit item #12.
  },
  ollama: {
    id: 'ollama', name: 'Ollama (Local)', icon: '🦙',
    baseURL: 'http://localhost:11434/api',
    models: [
      { id:'llama3.2',  label:'Llama 3.2',  ctx:128000 },
      { id:'qwen2.5',   label:'Qwen 2.5',   ctx:128000 },
      { id:'mistral',   label:'Mistral',    ctx:32000  },
      { id:'codellama', label:'CodeLlama',  ctx:16000  },
      { id:'phi3',      label:'Phi-3',      ctx:128000 },
    ],
    defaultModel: 'llama3.2',
    keyPlaceholder: 'No key needed for local',
    keyDocs: 'https://ollama.com',
    imageModel: null, supportsVision: false, supportsStreaming: true, noKeyRequired: true,
  },
  custom: {
    id: 'custom', name: 'Custom Endpoint', icon: '⚙️',
    baseURL: '',
    models: [{ id:'custom-model', label:'Custom Model', ctx:16000 }],
    defaultModel: 'custom-model',
    keyPlaceholder: 'Your API key...',
    keyDocs: '',
    imageModel: null, supportsVision: false, supportsStreaming: false, isCustom: true,
  },
}

const STORAGE_KEY = 'mz_ai_providers_v1'
const AIContext   = createContext(null)
export const useAI = () => useContext(AIContext)

export function AIProviderContext({ children }) {
  const [configs, setConfigs] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {} }
    catch { return {} }
  })
  const [activeProvider, setActiveProvider] = useState(
    () => localStorage.getItem('mz_ai_active_provider') || 'openai'
  )
  const [activeModel, setActiveModel] = useState(
    () => localStorage.getItem('mz_ai_active_model') || 'gpt-4o'
  )
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading,   setIsLoading]   = useState(false)

  // ── NEW (Phase 1 / Step 2): encrypted key vault ──────────────
  const [decryptedKeys, setDecryptedKeys] = useState({})       // in-memory only, never persisted
  const vaultKeyRef      = useRef(null)                         // derived CryptoKey, memory-only
  const [vaultExists,    setVaultExists]    = useState(() => hasVault())
  const [vaultUnlocked,  setVaultUnlocked]  = useState(false)
  const [needsMigration, setNeedsMigration] = useState(false)

  useEffect(() => {
    if (vaultUnlocked) { setNeedsMigration(false); return }
    const legacyFound = Object.values(configs).some(c => c && c.apiKey)
    setNeedsMigration(legacyFound)
  }, [configs, vaultUnlocked])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(configs)) }, [configs])
  useEffect(() => { localStorage.setItem('mz_ai_active_provider', activeProvider) }, [activeProvider])
  useEffect(() => { localStorage.setItem('mz_ai_active_model', activeModel) }, [activeModel])

  const getConfig = useCallback((providerId = activeProvider) => {
    const base  = AI_PROVIDERS[providerId]
    const saved = configs[providerId] || {}
    return {
      ...base,
      apiKey:        decryptedKeys[providerId]  || '',
      selectedModel: saved.selectedModel || base?.defaultModel || '',
      customBaseURL: saved.customBaseURL || base?.baseURL      || '',
      enabled:       saved.enabled       ?? false,
    }
  }, [configs, decryptedKeys, activeProvider])

  const saveConfig = useCallback((providerId, updates) => {
    if (Object.prototype.hasOwnProperty.call(updates, 'apiKey')) {
      const { apiKey, ...rest } = updates
      setDecryptedKeys(prev => ({ ...prev, [providerId]: apiKey }))
      if (vaultKeyRef.current) {
        encryptWithKey(apiKey, vaultKeyRef.current).then(enc => {
          setConfigs(prev => ({
            ...prev,
            [providerId]: { ...(prev[providerId] || {}), ...rest, apiKeyEnc: enc },
          }))
        })
      }
      if (Object.keys(rest).length) {
        setConfigs(prev => ({ ...prev, [providerId]: { ...(prev[providerId] || {}), ...rest } }))
      }
      return
    }
    setConfigs(prev => ({ ...prev, [providerId]: { ...(prev[providerId] || {}), ...updates } }))
  }, [])

  // ── NEW: Delete API key for a provider ──────────────────────
  const deleteConfig = useCallback((providerId) => {
    setConfigs(prev => {
      const next = { ...prev }
      if (next[providerId]) {
        const { apiKey, apiKeyEnc, ...rest } = next[providerId]
        next[providerId] = { ...rest, enabled: false }
      }
      return next
    })
    setDecryptedKeys(prev => {
      const next = { ...prev }
      delete next[providerId]
      return next
    })
    // If deleting active provider, reset to openai
    if (activeProvider === providerId) {
      setActiveProvider('openai')
      setActiveModel('gpt-4o')
    }
    setIsConnected(false)
  }, [activeProvider])

  // ── NEW (Phase 1 / Step 2): vault lifecycle ──────────────────
  const setupVault = useCallback(async (passphrase) => {
    const key = await createVault(passphrase)
    vaultKeyRef.current = key
    setVaultExists(true)

    // Migrate any legacy plaintext keys → encrypted, and warm the in-memory cache
    const nextDecrypted = {}
    const nextConfigs   = {}
    for (const [providerId, saved] of Object.entries(configs)) {
      if (saved?.apiKey) {
        nextDecrypted[providerId] = saved.apiKey
        const enc = await encryptWithKey(saved.apiKey, key)
        const { apiKey, ...rest } = saved
        nextConfigs[providerId] = { ...rest, apiKeyEnc: enc }
      } else {
        nextConfigs[providerId] = saved
      }
    }
    setDecryptedKeys(nextDecrypted)
    setConfigs(nextConfigs)
    setNeedsMigration(false)
    setVaultUnlocked(true)
  }, [configs])

  const unlockVault = useCallback(async (passphrase) => {
    const key = await unlockVaultKey(passphrase) // throws if wrong
    vaultKeyRef.current = key

    const nextDecrypted = {}
    for (const [providerId, saved] of Object.entries(configs)) {
      if (saved?.apiKeyEnc) {
        try { nextDecrypted[providerId] = await decryptWithKey(saved.apiKeyEnc, key) }
        catch { /* corrupted entry — user can re-enter this one key */ }
      } else if (saved?.apiKey) {
        nextDecrypted[providerId] = saved.apiKey // legacy — migrate below
      }
    }

    // Re-persist any legacy plaintext as encrypted now that we're unlocked
    const legacyIds = Object.entries(configs).filter(([, c]) => c?.apiKey).map(([id]) => id)
    if (legacyIds.length) {
      const nextConfigs = { ...configs }
      for (const providerId of legacyIds) {
        const enc = await encryptWithKey(nextDecrypted[providerId], key)
        const { apiKey, ...rest } = nextConfigs[providerId]
        nextConfigs[providerId] = { ...rest, apiKeyEnc: enc }
      }
      setConfigs(nextConfigs)
    }

    setDecryptedKeys(nextDecrypted)
    setNeedsMigration(false)
    setVaultUnlocked(true)
  }, [configs])

  const lockVault = useCallback(() => {
    vaultKeyRef.current = null
    setVaultUnlocked(false)
    setDecryptedKeys({})
  }, [])

  const resetVault = useCallback(() => {
    resetVaultStorage()
    vaultKeyRef.current = null
    setVaultExists(false)
    setVaultUnlocked(false)
    setDecryptedKeys({})
    // Passphrase is gone, so the ciphertext is unusable — clear it rather than keep dead weight
    setConfigs(prev => {
      const next = {}
      for (const [providerId, saved] of Object.entries(prev)) {
        const { apiKey, apiKeyEnc, ...rest } = saved || {}
        next[providerId] = { ...rest, enabled: false }
      }
      return next
    })
  }, [])

  const testConnection = useCallback(async (providerId) => {
    const cfg = getConfig(providerId)
    if (vaultExists && !vaultUnlocked && !cfg.noKeyRequired) {
      throw new Error('Vault locked — unlock it first to use your saved key')
    }
    if (!cfg.apiKey && !cfg.noKeyRequired) throw new Error('API key required')
    setIsLoading(true)
    try {
      if (providerId === 'anthropic') {
        const res = await fetch(`${cfg.customBaseURL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': cfg.apiKey,
            'anthropic-version': '2023-06-01',
            // Required for direct browser calls — without this Anthropic blocks the request (CORS).
            // Safe here because this is the user's OWN key, used only in their OWN browser session (BYOK).
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({ model: cfg.selectedModel, max_tokens: 10, messages: [{ role:'user', content:'Hi' }] })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'openai') {
        const res = await fetch(`${cfg.customBaseURL}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
          body: JSON.stringify({ model: cfg.selectedModel, max_tokens: 10, messages: [{ role:'user', content:'Hi' }] })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'gemini') {
        const res = await fetch(`${cfg.customBaseURL}/models/${cfg.selectedModel}:generateContent?key=${cfg.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text:'Hi' }] }] })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'ollama') {
        const res = await fetch(`${cfg.customBaseURL}/tags`)
        if (!res.ok) throw new Error('Ollama not running on localhost:11434')
      }
      saveConfig(providerId, { enabled: true })
      setIsConnected(true)
      return true
    } finally { setIsLoading(false) }
  }, [getConfig, saveConfig, vaultExists, vaultUnlocked])

  const chat = useCallback(async (messages, opts = {}) => {
    const providerId = opts.provider || activeProvider
    const cfg   = getConfig(providerId)
    const model = opts.model || cfg.selectedModel
    setIsLoading(true)
    try {
      if (providerId === 'anthropic') {
        const sys  = messages.find(m => m.role === 'system')
        const msgs = messages.filter(m => m.role !== 'system')
        const res = await fetch(`${cfg.customBaseURL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': cfg.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({ model, max_tokens: opts.maxTokens||4096, system: sys?.content, messages: msgs })
        })
        if (!res.ok) throw new Error(`Anthropic error ${res.status}`)
        const d = await res.json(); return d.content?.[0]?.text || ''
      }
      if (providerId === 'openai' || providerId === 'custom') {
        const res = await fetch(`${cfg.customBaseURL}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
          body: JSON.stringify({ model, max_tokens: opts.maxTokens||4096, messages })
        })
        if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
        const d = await res.json(); return d.choices?.[0]?.message?.content || ''
      }
      if (providerId === 'gemini') {
        const parts = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }]
        }))
        const res = await fetch(`${cfg.customBaseURL}/models/${model}:generateContent?key=${cfg.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ contents: parts, generationConfig: { maxOutputTokens: opts.maxTokens||4096 } })
        })
        if (!res.ok) throw new Error(`Gemini error ${res.status}`)
        const d = await res.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || ''
      }
      if (providerId === 'ollama') {
        const res = await fetch(`${cfg.customBaseURL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ model, stream: false, messages })
        })
        if (!res.ok) throw new Error(`Ollama error ${res.status}`)
        const d = await res.json(); return d.message?.content || ''
      }
      throw new Error(`Unknown provider: ${providerId}`)
    } finally { setIsLoading(false) }
  }, [activeProvider, getConfig])

  const generateImage = useCallback(async (prompt, opts = {}) => {
    const cfg = getConfig('openai')
    if (!cfg.apiKey) throw new Error('OpenAI key required for image generation')
    setIsLoading(true)
    try {
      const res = await fetch(`${cfg.customBaseURL}/images/generations`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${cfg.apiKey}` },
        body: JSON.stringify({
          model: opts.model || 'dall-e-3', prompt,
          n: opts.n||1, size: opts.size||'1024x1024',
          quality: opts.quality||'standard', style: opts.style||'vivid',
          response_format: 'b64_json',
        })
      })
      if (!res.ok) throw new Error(`Image gen error ${res.status}`)
      const d = await res.json()
      return d.data?.[0]?.b64_json ? `data:image/png;base64,${d.data[0].b64_json}` : d.data?.[0]?.url
    } finally { setIsLoading(false) }
  }, [getConfig])

  return (
    <AIContext.Provider value={{
      configs, activeProvider, activeModel, isConnected, isLoading, AI_PROVIDERS,
      getConfig, saveConfig, deleteConfig, testConnection,
      setActiveProvider, setActiveModel,
      chat, generateImage,
      // Phase 1 / Step 2 — encrypted key vault
      vaultExists, vaultUnlocked, needsMigration,
      setupVault, unlockVault, lockVault, resetVault,
    }}>
      {children}
    </AIContext.Provider>
  )
}

      
