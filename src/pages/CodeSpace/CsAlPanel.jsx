// ============================================================
// CsAIPanel.jsx  –  Phase 2: AI Assistant (CodeSpace-only)
//
// Deliberately reuses the app's existing BYOK AI system
// (src/ai/providers/AIProviderContext.jsx) instead of building a second
// one: same encrypted vault, same provider list (Anthropic / OpenAI /
// Gemini / Ollama / any OpenAI-compatible custom endpoint — which already
// covers OpenRouter-style aggregators), same `chat()` call. Nothing new
// to configure, nothing new to trust.
//
// Scope (Phase 2 — the rest of the original AI list follows in 2.x):
//   chat about the open file · Explain · Find bugs · Refactor
//   · Generate tests · Commit message for changed files
// ============================================================
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useAI } from '../../ai/providers/AIProviderContext.jsx'

const SYSTEM_PROMPT =
  'You are a concise, precise coding assistant embedded inside CodeSpace, ' +
  'a browser-based IDE. Give direct, actionable answers — skip preamble. ' +
  'When you include code, use a single fenced code block with a language tag.'

function buildQuickActions(fileName, fileContent, dirtyFiles) {
  const snippet = (fileContent || '').slice(0, 6000)
  const ref = fileName ? `File: ${fileName}` : 'No file is currently open.'
  return [
    { id: 'explain', label: '💡 Explain', needsFile: true,
      prompt: `Explain what this code does — clearly, in a few short paragraphs.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'bugs', label: '🐞 Find bugs', needsFile: true,
      prompt: `Review this code for bugs, edge cases, and correctness issues. List each with a one-line fix.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'refactor', label: '🛠 Refactor', needsFile: true,
      prompt: `Suggest a cleaner version of this code (readability/structure, same behavior). Show the revised code and explain the key changes briefly.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'tests', label: '🧪 Tests', needsFile: true,
      prompt: `Write unit tests for this code, covering the main cases and at least one edge case. Pick a sensible test framework for the language.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'commit', label: '📝 Commit msg', needsFile: false,
      prompt: dirtyFiles.length
        ? `Write a concise, conventional-commits-style commit message for these changed files:\n\n${dirtyFiles.map(f => `— ${f}`).join('\n')}\n\nCode:\n${snippet ? '```\n' + snippet + '\n```' : '(no active file content available)'}`
        : `No files are currently marked as changed. Ask the user what they changed, in one short sentence.` },
  ]
}

function parseSegments(content) {
  const segments = []
  const re = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0, m
  while ((m = re.exec(content))) {
    if (m.index > last) segments.push({ type: 'text', content: content.slice(last, m.index) })
    segments.push({ type: 'code', lang: m[1] || '', content: m[2] })
    last = re.lastIndex
  }
  if (last < content.length) segments.push({ type: 'text', content: content.slice(last) })
  return segments.length ? segments : [{ type: 'text', content }]
}

function CodeBlock({ lang, content }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(content).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div className="csai-code">
      <div className="csai-code-bar">
        <span>{lang || 'code'}</span>
        <button onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <pre><code>{content}</code></pre>
    </div>
  )
}

function Message({ msg }) {
  const segments = useMemo(() => parseSegments(msg.content), [msg.content])
  return (
    <div className={`csai-msg csai-msg-${msg.role} ${msg.isError ? 'csai-msg-error' : ''}`}>
      <div className="csai-msg-role">{msg.role === 'user' ? 'You' : '✨ AI'}</div>
      <div className="csai-msg-body">
        {segments.map((s, i) => s.type === 'code'
          ? <CodeBlock key={i} lang={s.lang} content={s.content} />
          : <p key={i}>{s.content}</p>
        )}
      </div>
    </div>
  )
}

export default function CsAIPanel({ activeFile, fileContent, dirtyFiles = [] }) {
  const {
    chat, isLoading, activeProvider, activeModel, AI_PROVIDERS,
    configs, vaultExists, vaultUnlocked,
  } = useAI()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const hasProvider = Object.values(configs || {}).some(c => c?.enabled)
  const ready = hasProvider && (!vaultExists || vaultUnlocked)

  const send = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    const next = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    try {
      const reply = await chat([
        { role: 'system', content: SYSTEM_PROMPT },
        ...next.map(m => ({ role: m.role, content: m.content })),
      ])
      setMessages(m => [...m, { role: 'assistant', content: reply || '(empty response)' }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `⚠ ${e.message}`, isError: true }])
    }
  }, [messages, isLoading, chat])

  const actions = buildQuickActions(activeFile, fileContent, dirtyFiles)

  if (!ready) {
    return (
      <div className="csai-empty">
        <div className="csai-empty-icon">✨</div>
        <p>{hasProvider ? 'Unlock your vault to use your saved AI key.' : 'Connect an AI provider to use the assistant.'}</p>
        <p className="csai-empty-sub">Uses the same key vault as AI Studio — nothing new to set up there.</p>
      </div>
    )
  }

  return (
    <div className="csai-panel">
      <div className="csai-header">
        <span>✨ AI Assistant</span>
        <span className="csai-model-chip">{AI_PROVIDERS[activeProvider]?.icon} {activeModel}</span>
      </div>

      <div className="csai-actions">
        {actions.map(a => (
          <button key={a.id} className="csai-chip" disabled={isLoading || (a.needsFile && !activeFile)}
            onClick={() => send(a.prompt)}>{a.label}</button>
        ))}
      </div>

      <div className="csai-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="csai-hint">
            {activeFile ? `Ask about "${activeFile}", or tap a quick action above.` : 'Open a file, or just ask a coding question.'}
          </div>
        )}
        {messages.map((m, i) => <Message key={i} msg={m} />)}
        {isLoading && (
          <div className="csai-typing"><span /><span /><span /></div>
        )}
      </div>

      <form className="csai-inputrow" onSubmit={e => { e.preventDefault(); send(input) }}>
        <textarea
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask about your code…" rows={1}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
        />
        <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send">➤</button>
      </form>
    </div>
  )
}
