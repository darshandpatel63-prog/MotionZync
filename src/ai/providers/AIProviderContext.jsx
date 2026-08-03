// src/ai/providers/AIProviderContext.jsx
// BYOK — Multi-provider AI system
// Fixed (Phase 1 / Step 1): Anthropic calls were missing 'anthropic-dangerous-direct-browser-access'
//   header (blocked by CORS in both dev + prod) + model IDs were outdated. Both fixed here.
// Fixed (Phase 1 / Step 2): API keys are now encrypted at rest (AES-GCM, passphrase-derived
//   key via PBKDF2 — see keyVault.js). Plaintext legacy keys auto-migrate on first unlock.
// Refactored (Phase 2): vault state moved to VaultContext.jsx (shared with GitHubContext) —
//   this file now only holds AI-specific config + uses useVault() for encryption.
// Added: deleteConfig() — user can delete any saved API key

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useVault } from './VaultContext.jsx'

export const AI_PROVIDERS = {
  anthropic: {
    id: 'anthropic', name: 'Anthropic', icon: '🔬', freeTextModel: true,
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
    modelDocs: 'https://docs.claude.com/en/docs/about-claude/models/overview',
    imageModel: null, supportsVision: true, supportsStreaming: true,
  },
  openai: {
    id: 'openai', name: 'OpenAI', icon: '🤖', freeTextModel: true,
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
    modelDocs: 'https://platform.openai.com/docs/models',
    imageModel: 'dall-e-3', supportsVision: true, supportsStreaming: true,
  },
  gemini: {
    id: 'gemini', name: 'Google Gemini', icon: '💎', freeTextModel: true,
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
    modelDocs: 'https://ai.google.dev/gemini-api/docs/models',
    imageModel: null, supportsVision: true, supportsStreaming: true,
    // imageModel intentionally null — generateImage() doesn't route Gemini's
    // native image models yet (it's hardcoded to OpenAI); see audit item #12.
  },
  ollama: {
    id: 'ollama', name: 'Ollama (Local)', icon: '🦙', freeTextModel: true,
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
    modelDocs: 'https://ollama.com/library',
    imageModel: null, supportsVision: false, supportsStreaming: true, noKeyRequired: true,
  },
  custom: {
    // Fixed (Phase 2 / Step 2): this used to force a single fixed "custom-model"
    // ID via a locked dropdown — couldn't actually be used for HuggingFace,
    // OpenRouter, Together, Groq, etc. Now a free-text model field (see
    // freeTextModel below) + a starter presets list for common ones.
    id: 'custom', name: 'Any OpenAI-Compatible API', icon: '⚙️',
    baseURL: '',
    freeTextModel: true,
    models: [
      { id:'meta-llama/Llama-3.3-70B-Instruct:novita', label:'HuggingFace: Llama 3.3 70B (novita)' },
      { id:'deepseek-ai/DeepSeek-R1:together',          label:'HuggingFace: DeepSeek R1 (together)' },
      { id:'openai/gpt-oss-120b:cerebras',               label:'HuggingFace: gpt-oss-120b (cerebras)' },
      { id:'meta-llama/llama-3.3-70b-instruct',          label:'OpenRouter: Llama 3.3 70B' },
      { id:'llama-3.3-70b-versatile',                    label:'Groq: Llama 3.3 70B' },
    ],
    defaultModel: '',
    modelPlaceholder: 'e.g. deepseek-ai/DeepSeek-R1:together',
    keyPlaceholder: 'Your API key...',
    keyDocs: '',
    modelDocs: 'https://huggingface.co/docs/inference-providers',
    modelDocsLabel: 'HF Inference Providers docs ↗',
    imageModel: null, supportsVision: false, supportsStreaming: false, isCustom: true,
  },
}

const STORAGE_KEY = 'mz_ai_providers_v1'
const AIContext   = createContext(null)
export const useAI = () => useContext(AIContext)

export function AIProviderContext({ children }) {
  const {
    vaultExists, vaultUnlocked, setupVault: vaultSetup, unlockVault: vaultUnlock,
    lockVault: vaultLock, encryptValue, decryptValue,
  } = useVault()

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

  const [decryptedKeys, setDecryptedKeys] = useState({}) // in-memory only, never persisted
  const [needsMigration, setNeedsMigration] = useState(false)

  useEffect(() => {
    if (vaultUnlocked) { setNeedsMigration(false); return }
    const legacyFound = Object.values(configs).some(c => c && c.apiKey)
    setNeedsMigration(legacyFound)
  }, [configs, vaultUnlocked])

  // If the vault gets reset (passphrase forgotten) elsewhere, our ciphertext is
  // now unusable — clear it out rather than keep dead, undecryptable weight.
  useEffect(() => {
    if (vaultExists) return
    setDecryptedKeys({})
    setConfigs(prev => {
      const hadAny = Object.values(prev).some(c => c?.apiKeyEnc || c?.apiKey)
      if (!hadAny) return prev
      const next = {}
      for (const [id, saved] of Object.entries(prev)) {
        const { apiKey, apiKeyEnc, ...rest } = saved || {}
        next[id] = { ...rest, enabled: false }
      }
      return next
    })
  }, [vaultExists])

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
      encryptValue(apiKey).then(enc => {
        setConfigs(prev => ({
          ...prev,
          [providerId]: { ...(prev[providerId] || {}), ...rest, apiKeyEnc: enc },
        }))
      }).catch(() => { /* vault locked — key stays memory-only until unlocked */ })
      if (Object.keys(rest).length) {
        setConfigs(prev => ({ ...prev, [providerId]: { ...(prev[providerId] || {}), ...rest } }))
      }
      return
    }
    setConfigs(prev => ({ ...prev, [providerId]: { ...(prev[providerId] || {}), ...updates } }))
  }, [encryptValue])

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
    if (activeProvider === providerId) {
      setActiveProvider('openai')
      setActiveModel('gpt-4o')
    }
    setIsConnected(false)
  }, [activeProvider])

  // ── Vault setup/unlock — AI-specific: also migrates legacy plaintext keys ──
  const setupVault = useCallback(async (passphrase) => {
    await vaultSetup(passphrase)
    const nextDecrypted = {}
    const nextConfigs   = {}
    for (const [providerId, saved] of Object.entries(configs)) {
      if (saved?.apiKey) {
        nextDecrypted[providerId] = saved.apiKey
        const enc = await encryptValue(saved.apiKey)
        const { apiKey, ...rest } = saved
        nextConfigs[providerId] = { ...rest, apiKeyEnc: enc }
      } else {
        nextConfigs[providerId] = saved
      }
    }
    setDecryptedKeys(nextDecrypted)
    setConfigs(nextConfigs)
    setNeedsMigration(false)
  }, [configs, vaultSetup, encryptValue])

  const unlockVault = useCallback(async (passphrase) => {
    await vaultUnlock(passphrase) // throws if wrong
    const nextDecrypted = {}
    for (const [providerId, saved] of Object.entries(configs)) {
      if (saved?.apiKeyEnc) {
        try { nextDecrypted[providerId] = await decryptValue(saved.apiKeyEnc) }
        catch { /* corrupted entry — user can re-enter this one key */ }
      } else if (saved?.apiKey) {
        nextDecrypted[providerId] = saved.apiKey // legacy — migrate below
      }
    }
    const legacyIds = Object.entries(configs).filter(([, c]) => c?.apiKey).map(([id]) => id)
    if (legacyIds.length) {
      const nextConfigs = { ...configs }
      for (const providerId of legacyIds) {
        const enc = await encryptValue(nextDecrypted[providerId])
        const { apiKey, ...rest } = nextConfigs[providerId]
        nextConfigs[providerId] = { ...rest, apiKeyEnc: enc }
      }
      setConfigs(nextConfigs)
    }
    setDecryptedKeys(nextDecrypted)
    setNeedsMigration(false)
  }, [configs, vaultUnlock, decryptValue, encryptValue])

  const lockVault = useCallback(() => {
    vaultLock()
    setDecryptedKeys({})
  }, [vaultLock])

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
      // Vault (shared with GitHubContext via VaultContext.jsx)
      vaultExists, vaultUnlocked, needsMigration,
      setupVault, unlockVault, lockVault,
    }}>
      {children}
    </AIContext.Provider>
  )
}
