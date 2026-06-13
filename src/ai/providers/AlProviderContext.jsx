// src/ai/providers/AIProviderContext.jsx
// BYOK (Bring Your Own Key) — multi-provider AI system
// Supports: Anthropic, OpenAI, Google Gemini, Ollama, Custom endpoint
// Keys stored ONLY in localStorage — never sent to any server except the chosen provider

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// ─── Provider definitions ─────────────────────────────────────
export const AI_PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🔬',
    baseURL: 'https://api.anthropic.com/v1',
    models: [
      { id:'claude-opus-4-5',    label:'Claude Opus 4.5',   ctx:200000 },
      { id:'claude-sonnet-4-5',  label:'Claude Sonnet 4.5', ctx:200000 },
      { id:'claude-haiku-4-5',   label:'Claude Haiku 4.5',  ctx:200000 },
    ],
    defaultModel: 'claude-sonnet-4-5',
    keyPlaceholder: 'sk-ant-api...',
    keyDocs: 'https://console.anthropic.com/settings/keys',
    imageModel: null,
    supportsVision: true,
    supportsStreaming: true,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    baseURL: 'https://api.openai.com/v1',
    models: [
      { id:'gpt-4o',       label:'GPT-4o',        ctx:128000 },
      { id:'gpt-4o-mini',  label:'GPT-4o Mini',   ctx:128000 },
      { id:'gpt-4-turbo',  label:'GPT-4 Turbo',   ctx:128000 },
      { id:'o1-preview',   label:'o1 Preview',    ctx:128000 },
      { id:'o1-mini',      label:'o1 Mini',       ctx:128000 },
    ],
    defaultModel: 'gpt-4o',
    keyPlaceholder: 'sk-...',
    keyDocs: 'https://platform.openai.com/api-keys',
    imageModel: 'dall-e-3',
    supportsVision: true,
    supportsStreaming: true,
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '💎',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      { id:'gemini-2.0-flash-exp', label:'Gemini 2.0 Flash',  ctx:1000000 },
      { id:'gemini-1.5-pro',       label:'Gemini 1.5 Pro',    ctx:2000000 },
      { id:'gemini-1.5-flash',     label:'Gemini 1.5 Flash',  ctx:1000000 },
    ],
    defaultModel: 'gemini-1.5-flash',
    keyPlaceholder: 'AIza...',
    keyDocs: 'https://aistudio.google.com/app/apikey',
    imageModel: 'imagen-3.0-generate-001',
    supportsVision: true,
    supportsStreaming: true,
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    icon: '🦙',
    baseURL: 'http://localhost:11434/api',
    models: [
      { id:'llama3.2', label:'Llama 3.2', ctx:128000 },
      { id:'qwen2.5',  label:'Qwen 2.5',  ctx:128000 },
      { id:'mistral',  label:'Mistral',   ctx:32000  },
      { id:'codellama',label:'CodeLlama', ctx:16000  },
      { id:'phi3',     label:'Phi-3',     ctx:128000 },
    ],
    defaultModel: 'llama3.2',
    keyPlaceholder: 'No key needed for local',
    keyDocs: 'https://ollama.com',
    imageModel: null,
    supportsVision: false,
    supportsStreaming: true,
    noKeyRequired: true,
  },
  custom: {
    id: 'custom',
    name: 'Custom Endpoint',
    icon: '⚙️',
    baseURL: '',
    models: [{ id:'custom-model', label:'Custom Model', ctx:16000 }],
    defaultModel: 'custom-model',
    keyPlaceholder: 'Your API key...',
    keyDocs: '',
    imageModel: null,
    supportsVision: false,
    supportsStreaming: false,
    isCustom: true,
  },
}

const STORAGE_KEY = 'mz_ai_providers_v1'

// ─── Context ──────────────────────────────────────────────────
const AIContext = createContext(null)
export const useAI = () => useContext(AIContext)

// ─── Provider Component ───────────────────────────────────────
export function AIProviderContext({ children }) {
  const [configs, setConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [activeProvider, setActiveProvider] = useState(() => {
    const saved = localStorage.getItem('mz_ai_active_provider')
    return saved || 'openai'
  })
  const [activeModel, setActiveModel] = useState(() => {
    const saved = localStorage.getItem('mz_ai_active_model')
    return saved || 'gpt-4o'
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ── Save to localStorage whenever configs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
  }, [configs])

  useEffect(() => {
    localStorage.setItem('mz_ai_active_provider', activeProvider)
  }, [activeProvider])

  useEffect(() => {
    localStorage.setItem('mz_ai_active_model', activeModel)
  }, [activeModel])

  // ── Get current provider config
  const getConfig = useCallback((providerId = activeProvider) => {
    const base = AI_PROVIDERS[providerId]
    const saved = configs[providerId] || {}
    return {
      ...base,
      apiKey: saved.apiKey || '',
      selectedModel: saved.selectedModel || base?.defaultModel || '',
      customBaseURL: saved.customBaseURL || base?.baseURL || '',
      enabled: saved.enabled ?? false,
    }
  }, [configs, activeProvider])

  // ── Save provider config
  const saveConfig = useCallback((providerId, updates) => {
    setConfigs(prev => ({
      ...prev,
      [providerId]: { ...(prev[providerId] || {}), ...updates }
    }))
  }, [])

  // ── Test connection
  const testConnection = useCallback(async (providerId) => {
    const cfg = getConfig(providerId)
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
          },
          body: JSON.stringify({
            model: cfg.selectedModel,
            max_tokens: 10,
            messages: [{ role:'user', content:'Hi' }]
          })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'openai') {
        const res = await fetch(`${cfg.customBaseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify({
            model: cfg.selectedModel,
            max_tokens: 10,
            messages: [{ role:'user', content:'Hi' }]
          })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'gemini') {
        const res = await fetch(
          `${cfg.customBaseURL}/models/${cfg.selectedModel}:generateContent?key=${cfg.apiKey}`,
          {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ contents:[{ parts:[{text:'Hi'}] }] })
          }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else if (providerId === 'ollama') {
        const res = await fetch(`${cfg.customBaseURL}/tags`)
        if (!res.ok) throw new Error('Ollama not running on localhost:11434')
      }
      saveConfig(providerId, { enabled: true })
      setIsConnected(true)
      return true
    } finally {
      setIsLoading(false)
    }
  }, [getConfig, saveConfig])

  // ── Chat completion (unified API)
  const chat = useCallback(async (messages, opts = {}) => {
    const providerId = opts.provider || activeProvider
    const cfg = getConfig(providerId)
    const model = opts.model || cfg.selectedModel
    setIsLoading(true)

    try {
      if (providerId === 'anthropic') {
        const systemMsg = messages.find(m=>m.role==='system')
        const chatMsgs  = messages.filter(m=>m.role!=='system')
        const res = await fetch(`${cfg.customBaseURL}/messages`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'x-api-key': cfg.apiKey,
            'anthropic-version':'2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: opts.maxTokens || 4096,
            system: systemMsg?.content,
            messages: chatMsgs.map(m=>({role:m.role,content:m.content})),
          })
        })
        if (!res.ok) throw new Error(`Anthropic error ${res.status}`)
        const data = await res.json()
        return data.content?.[0]?.text || ''
      }

      if (providerId === 'openai' || providerId === 'custom') {
        const res = await fetch(`${cfg.customBaseURL}/chat/completions`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${cfg.apiKey}`,
          },
          body: JSON.stringify({
            model,
            max_tokens: opts.maxTokens || 4096,
            messages: messages.map(m=>({role:m.role,content:m.content})),
          })
        })
        if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
        const data = await res.json()
        return data.choices?.[0]?.message?.content || ''
      }

      if (providerId === 'gemini') {
        const parts = messages.map(m=>({
          role: m.role==='assistant'?'model':'user',
          parts:[{text:m.content}]
        }))
        const res = await fetch(
          `${cfg.customBaseURL}/models/${model}:generateContent?key=${cfg.apiKey}`,
          {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ contents:parts, generationConfig:{ maxOutputTokens: opts.maxTokens||4096 } })
          }
        )
        if (!res.ok) throw new Error(`Gemini error ${res.status}`)
        const data = await res.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      }

      if (providerId === 'ollama') {
        const res = await fetch(`${cfg.customBaseURL}/chat`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model, stream:false,
            messages: messages.map(m=>({role:m.role,content:m.content}))
          })
        })
        if (!res.ok) throw new Error(`Ollama error ${res.status}`)
        const data = await res.json()
        return data.message?.content || ''
      }

      throw new Error(`Unknown provider: ${providerId}`)
    } finally {
      setIsLoading(false)
    }
  }, [activeProvider, getConfig])

  // ── Image generation (OpenAI DALL-E or Gemini Imagen)
  const generateImage = useCallback(async (prompt, opts = {}) => {
    const cfg = getConfig('openai')
    if (!cfg.apiKey) throw new Error('OpenAI key required for image generation')
    setIsLoading(true)
    try {
      const res = await fetch(`${cfg.customBaseURL}/images/generations`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model: opts.model || 'dall-e-3',
          prompt,
          n: opts.n || 1,
          size: opts.size || '1024x1024',
          quality: opts.quality || 'standard',
          style: opts.style || 'vivid',
          response_format: 'b64_json',
        })
      })
      if (!res.ok) throw new Error(`Image gen error ${res.status}`)
      const data = await res.json()
      return data.data?.[0]?.b64_json
        ? `data:image/png;base64,${data.data[0].b64_json}`
        : data.data?.[0]?.url
    } finally {
      setIsLoading(false)
    }
  }, [getConfig])

  return (
    <AIContext.Provider value={{
      configs, activeProvider, activeModel, isConnected, isLoading,
      AI_PROVIDERS,
      getConfig, saveConfig, testConnection,
      setActiveProvider, setActiveModel,
      chat, generateImage,
    }}>
      {children}
    </AIContext.Provider>
  )
}

