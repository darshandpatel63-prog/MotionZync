// ============================================================
// CsAIPanel.jsx  –  Phase 2: AI Assistant, Phase 2.1: Agent mode
//
// Reuses the app's existing BYOK AI system (src/ai/providers) — same
// encrypted vault, same provider list, same chat() call. Nothing new to
// configure, nothing new to trust. Vault unlock / provider connect can
// now be done right here (no more "go set it up elsewhere").
//
// Agent mode: the model gets 5 tools (list/read/write/delete files, run a
// terminal command) via a plain-text protocol — a ```tool fenced JSON
// block — so it works with ANY provider/model the user has configured,
// not just ones with native function-calling. "Build a whole app" falls
// out of this for free: it's just write_file called several times in a
// loop, same as a human would do it file by file.
// ============================================================
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useAI, AI_PROVIDERS } from '../../ai/providers/AIProviderContext.jsx'
import { getConfig, setConfig } from './cs-storage.js'

const MAX_AGENT_STEPS = 12

const AGENT_SYSTEM_PROMPT = `You are an AI coding agent embedded inside CodeSpace, a browser IDE. \
You can read and edit the user's ENTIRE project, create new files and folders, and run terminal commands. \
Everything happens locally in their browser — nothing leaves this project.

To use a tool, reply with ONLY one fenced code block tagged "tool" containing a single JSON object, and nothing else in that message:
\`\`\`tool
{"tool":"list_files"}
\`\`\`
\`\`\`tool
{"tool":"read_file","path":"src/App.js"}
\`\`\`
\`\`\`tool
{"tool":"write_file","path":"src/App.js","content":"...full new file content..."}
\`\`\`
\`\`\`tool
{"tool":"delete_file","path":"src/old.js"}
\`\`\`
\`\`\`tool
{"tool":"run_command","command":"ls"}
\`\`\`

After a tool call you'll get the result and can call another tool, or give your final answer in plain text (no tool block) once done. write_file always sends the COMPLETE file content, never a diff or partial snippet. For a multi-file task ("build a todo app"), don't ask for permission on routine steps — plan briefly in one short message, then create the files one by one until it's finished. Keep replies concise.`

const CHAT_SYSTEM_PROMPT =
  'You are a concise, precise coding assistant embedded inside CodeSpace, ' +
  'a browser-based IDE. Give direct, actionable answers — skip preamble. ' +
  'When you include code, use a single fenced code block with a language tag.'

function buildQuickActions(fileName, fileContent, dirtyFiles) {
  const snippet = (fileContent || '').slice(0, 6000)
  const ref = fileName ? `File: ${fileName}` : 'No file is currently open.'
  return [
    { id: 'explain', label: '💡 Explain', needsFile: true, agent: false,
      prompt: `Explain what this code does — clearly, in a few short paragraphs.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'bugs', label: '🐞 Find bugs', needsFile: true, agent: false,
      prompt: `Review this code for bugs, edge cases, and correctness issues. List each with a one-line fix.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'refactor', label: '🛠 Refactor', needsFile: true, agent: true,
      prompt: `Refactor this file for readability/structure (same behavior). Use write_file to save the improved version, then briefly explain the key changes.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'tests', label: '🧪 Tests', needsFile: true, agent: true,
      prompt: `Write unit tests for this file. Create a suitable test file with write_file (pick a sensible name/framework for the language), covering the main cases and at least one edge case.\n\n${ref}\n\`\`\`\n${snippet}\n\`\`\`` },
    { id: 'commit', label: '📝 Commit msg', needsFile: false, agent: false,
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

function extractToolCall(reply) {
  const m = /```tool\s*\n?([\s\S]*?)```/.exec(reply || '')
  if (!m) return null
  try { return JSON.parse(m[1].trim()) } catch { return null }
}

const TOOL_LABEL = {
  list_files:   p => `📂 Listing project files`,
  read_file:    p => `📖 Reading ${p.path}`,
  write_file:   p => `✍️ Writing ${p.path}`,
  delete_file:  p => `🗑 Deleting ${p.path}`,
  run_command:  p => `⌨️ Running: ${p.command}`,
}

function CodeBlock({ lang, content }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }
  return (
    <div className="csai-code">
      <div className="csai-code-bar"><span>{lang || 'code'}</span><button onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button></div>
      <pre><code>{content}</code></pre>
    </div>
  )
}

function ToolChip({ msg }) {
  return (
    <div className={`csai-tool-chip csai-tool-${msg.status}`}>
      <span className="csai-tool-icon">{msg.status === 'running' ? '⏳' : msg.status === 'error' ? '⚠' : '✓'}</span>
      <span className="csai-tool-label">{msg.label}</span>
    </div>
  )
}

function Message({ msg }) {
  if (msg.kind === 'tool') return <ToolChip msg={msg} />
  const segments = useMemo(() => parseSegments(msg.content), [msg.content])
  return (
    <div className={`csai-msg csai-msg-${msg.role} ${msg.isError ? 'csai-msg-error' : ''}`}>
      <div className="csai-msg-role">{msg.role === 'user' ? 'You' : '✨ AI'}</div>
      <div className="csai-msg-body">
        {segments.map((s, i) => s.type === 'code' ? <CodeBlock key={i} lang={s.lang} content={s.content} /> : <p key={i}>{s.content}</p>)}
      </div>
      {msg.canRetry && <button className="csai-retry" onClick={msg.onRetry}>↻ Retry</button>}
    </div>
  )
}

// ── Inline vault + provider setup (so this never has to send anyone away) ──
function SetupInline({ needsVaultCreate, needsVaultUnlock, needsProvider }) {
  const { setupVault, unlockVault, saveConfig, setActiveProvider, setActiveModel } = useAI()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [providerId, setProviderId] = useState('anthropic')
  const [apiKey, setApiKey] = useState('')

  async function doVault(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      if (needsVaultCreate) {
        if (pw.length < 6) throw new Error('Use at least 6 characters')
        if (pw !== pw2) throw new Error("Passwords don't match")
        await setupVault(pw)
      } else {
        await unlockVault(pw)
      }
    } catch (e2) { setErr(e2.message || 'Something went wrong') }
    setBusy(false)
  }

  function doProvider(e) {
    e.preventDefault()
    if (!apiKey.trim()) { setErr('Enter an API key'); return }
    const p = AI_PROVIDERS[providerId]
    saveConfig(providerId, { apiKey: apiKey.trim(), enabled: true, selectedModel: p.defaultModel })
    setActiveProvider(providerId)
    setActiveModel(p.defaultModel)
  }

  if (needsVaultCreate || needsVaultUnlock) {
    return (
      <form className="csai-setup" onSubmit={doVault}>
        <div className="csai-empty-icon">🔒</div>
        <p>{needsVaultCreate ? 'Create a vault password to store your AI key encrypted on this device.' : 'Enter your vault password to unlock your saved AI key.'}</p>
        <input type="password" placeholder="Vault password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
        {needsVaultCreate && <input type="password" placeholder="Confirm password" value={pw2} onChange={e => setPw2(e.target.value)} />}
        {err && <div className="csai-setup-err">{err}</div>}
        <button type="submit" disabled={busy}>{busy ? '...' : needsVaultCreate ? 'Create vault' : 'Unlock'}</button>
      </form>
    )
  }
  return (
    <form className="csai-setup" onSubmit={doProvider}>
      <div className="csai-empty-icon">✨</div>
      <p>Connect an AI provider to use the assistant.</p>
      <select value={providerId} onChange={e => setProviderId(e.target.value)}>
        {Object.values(AI_PROVIDERS).map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
      </select>
      <input type="password" placeholder={AI_PROVIDERS[providerId]?.keyPlaceholder || 'API key'} value={apiKey} onChange={e => setApiKey(e.target.value)} />
      {err && <div className="csai-setup-err">{err}</div>}
      <button type="submit">Save & Connect</button>
      {AI_PROVIDERS[providerId]?.keyDocs && (
        <a className="csai-empty-link" href={AI_PROVIDERS[providerId].keyDocs} target="_blank" rel="noreferrer">Get an API key →</a>
      )}
    </form>
  )
}

export default function CsAIPanel({
  activeFile, fileContent, dirtyFiles = [], projectId,
  onListFiles, onReadFile, onWriteFile, onDeleteFile, onRunCommand,
}) {
  const { chat, isLoading, activeProvider, activeModel, configs, vaultExists, vaultUnlocked } = useAI()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const listRef = useRef(null)
  const stopRef = useRef(false)
  const storeKey = `aiChat:${projectId || 'default'}`

  // Load persisted chat for this project (Fix: chat used to vanish on refresh)
  useEffect(() => {
    let cancelled = false
    setLoaded(false)
    getConfig(storeKey, []).then(saved => { if (!cancelled) { setMessages(saved || []); setLoaded(true) } })
    return () => { cancelled = true }
  }, [storeKey])

  // Persist on every change (debounced lightly via microtask batching is enough — small payloads)
  useEffect(() => { if (loaded) setConfig(storeKey, messages) }, [messages, loaded, storeKey])

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, running])

  const hasProvider = Object.values(configs || {}).some(c => c?.enabled)
  const needsVaultCreate = !vaultExists
  const needsVaultUnlock = vaultExists && !vaultUnlocked
  const ready = hasProvider && vaultUnlocked

  const addMsg = useCallback((m) => setMessages(prev => [...prev, { id: Math.random().toString(36).slice(2), ...m }]), [])
  const updateMsg = useCallback((id, patch) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m)), [])

  const executeTool = useCallback(async (call) => {
    try {
      switch (call.tool) {
        case 'list_files':  return (onListFiles?.() || []).join('\n') || '(empty project)'
        case 'read_file': {
          const c = onReadFile?.(call.path)
          return c == null ? `Error: "${call.path}" does not exist.` : c
        }
        case 'write_file':
          onWriteFile?.(call.path, call.content ?? '')
          return `Saved ${call.path} (${(call.content || '').length} chars).`
        case 'delete_file':
          onDeleteFile?.(call.path)
          return `Deleted ${call.path}.`
        case 'run_command':
          return (await onRunCommand?.(call.command)) || '(no output)'
        default:
          return `Error: unknown tool "${call.tool}".`
      }
    } catch (e) { return `Error: ${e.message}` }
  }, [onListFiles, onReadFile, onWriteFile, onDeleteFile, onRunCommand])

  const runAgentLoop = useCallback(async (apiHistory) => {
    setRunning(true); stopRef.current = false
    let convo = apiHistory
    for (let step = 0; step < MAX_AGENT_STEPS; step++) {
      if (stopRef.current) { addMsg({ role: 'assistant', content: 'Stopped.', isError: true }); break }
      let reply
      try {
        reply = await chat([{ role: 'system', content: AGENT_SYSTEM_PROMPT }, ...convo])
      } catch (e) {
        addMsg({ role: 'assistant', content: `⚠ ${e.message}`, isError: true, canRetry: true, onRetry: () => runAgentLoop(convo) })
        break
      }
      const call = extractToolCall(reply)
      if (!call) { addMsg({ role: 'assistant', content: reply || '(empty response)' }); break }

      const label = (TOOL_LABEL[call.tool] || (() => call.tool))(call)
      const toolMsgId = Math.random().toString(36).slice(2)
      setMessages(prev => [...prev, { id: toolMsgId, kind: 'tool', label, status: 'running' }])

      const result = await executeTool(call)
      const failed = /^Error:/.test(result)
      updateMsg(toolMsgId, { status: failed ? 'error' : 'done' })

      convo = [...convo, { role: 'assistant', content: reply }, { role: 'user', content: `Tool result:\n${result}` }]

      if (step === MAX_AGENT_STEPS - 1) {
        addMsg({ role: 'assistant', content: `⚠ Stopped after ${MAX_AGENT_STEPS} steps to avoid a runaway loop — say "continue" if the task isn't finished.`, isError: true })
      }
    }
    setRunning(false)
  }, [chat, addMsg, updateMsg, executeTool])

  const send = useCallback(async (text, agentMode = true) => {
    const trimmed = (text || '').trim()
    if (!trimmed || isLoading || running) return
    addMsg({ role: 'user', content: trimmed })
    setInput('')
    const history = [...messages, { role: 'user', content: trimmed }]
      .map(m => m.kind === 'tool' ? null : { role: m.role, content: m.content })
      .filter(Boolean)
    if (agentMode) {
      await runAgentLoop(history)
    } else {
      try {
        const reply = await chat([{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...history])
        addMsg({ role: 'assistant', content: reply || '(empty response)' })
      } catch (e) {
        addMsg({ role: 'assistant', content: `⚠ ${e.message}`, isError: true, canRetry: true, onRetry: () => send(trimmed, agentMode) })
      }
    }
  }, [messages, isLoading, running, addMsg, chat, runAgentLoop])

  const actions = buildQuickActions(activeFile, fileContent, dirtyFiles)
  const busy = isLoading || running

  if (!ready) {
    return (
      <div className="csai-empty">
        <SetupInline needsVaultCreate={needsVaultCreate} needsVaultUnlock={needsVaultUnlock} needsProvider={!hasProvider} />
        <p className="csai-empty-sub">Same vault as AI Studio — nothing new to set up twice.</p>
      </div>
    )
  }

  return (
    <div className="csai-panel">
      <div className="csai-header">
        <span>✨ AI Assistant <span className="csai-agent-badge">agent</span></span>
        <span className="csai-model-chip">{AI_PROVIDERS[activeProvider]?.icon} {activeModel}</span>
      </div>

      <div className="csai-actions">
        {actions.map(a => (
          <button key={a.id} className="csai-chip" disabled={busy || (a.needsFile && !activeFile)}
            onClick={() => send(a.prompt, a.agent)}>{a.label}</button>
        ))}
      </div>

      <div className="csai-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="csai-hint">
            I can read/edit any file in this project, create new ones, and run terminal commands. Try "add a footer component" or tap a quick action above.
          </div>
        )}
        {messages.map(m => <Message key={m.id} msg={m} />)}
        {busy && <div className="csai-typing"><span /><span /><span /></div>}
      </div>

      <form className="csai-inputrow" onSubmit={e => { e.preventDefault(); send(input, true) }}>
        {running && <button type="button" className="csai-stop" onClick={() => { stopRef.current = true }}>■ Stop</button>}
        <textarea
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask, or tell me to build/change something…" rows={1}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input, true) } }}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send">➤</button>
      </form>
    </div>
  )
}
