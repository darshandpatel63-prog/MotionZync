// ============================================================
// CsGitPanel.jsx  –  GitHub-style source control panel
// Added (Phase 2 / Step 1): real "GitHub" tab (OAuth connect/disconnect)
// ============================================================
import { useState, useEffect } from 'react'
import { diffLines } from './cs-git.js'
import { useGitHub } from './GitHubContext.jsx'
import { listRepos, createRepo, pushFiles, cloneRepo, githubZipDownloadUrl } from './gh-push.js'
import { getConfig, setConfig } from './cs-storage.js'

function CommitItem({ commit, isHead }) {
  const [open, setOpen] = useState(false)
  const date = new Date(commit.ts)
  const timeAgo = (() => {
    const sec = Math.floor((Date.now() - commit.ts) / 1000)
    if (sec < 60)   return `${sec}s ago`
    if (sec < 3600) return `${Math.floor(sec/60)}m ago`
    if (sec < 86400) return `${Math.floor(sec/3600)}h ago`
    return `${Math.floor(sec/86400)}d ago`
  })()

  return (
    <div className={`csgit-commit ${isHead ? 'csgit-head' : ''}`}>
      <div className="csgit-commit-dot" />
      <div className="csgit-commit-body" onClick={() => setOpen(o => !o)}>
        <div className="csgit-commit-header">
          <span className="csgit-commit-msg">{commit.message}</span>
          {isHead && <span className="csgit-head-badge">HEAD</span>}
        </div>
        <div className="csgit-commit-meta">
          <span className="csgit-commit-hash">{commit.id.slice(0, 7)}</span>
          <span className="csgit-commit-author">{commit.author}</span>
          <span className="csgit-commit-time" title={date.toLocaleString()}>{timeAgo}</span>
        </div>
      </div>
      {open && (
        <div className="csgit-commit-files">
          {Object.keys(commit.files || {}).map(f => (
            <div key={f} className="csgit-commit-file">
              <span className="csgit-file-dot">●</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DiffViewer({ path, chunks }) {
  if (!chunks?.length) return <div className="csgit-no-diff">No changes in this file</div>
  return (
    <div className="csgit-diff">
      {chunks.map((chunk, ci) => (
        <div key={ci} className="csgit-diff-chunk">
          {chunk.ops?.map((op, oi) => (
            <div key={oi} className={`csgit-diff-line csgit-diff-${op.type}`}>
              <span className="csgit-diff-sign">{op.type === 'add' ? '+' : op.type === 'del' ? '-' : ' '}</span>
              <span className="csgit-diff-linenum">
                {op.type === 'del' ? op.oldNo : op.newNo || ''}
              </span>
              <span className="csgit-diff-content">{op.line}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function RepoPush({ files, projectId, authFetch, onImportProject }) {
  const [repos, setRepos]           = useState([])
  const [reposLoading, setRLoading] = useState(true)
  const [selected, setSelected]     = useState(null)
  const [creating, setCreating]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [commitMsg, setCommitMsg]   = useState('Update from CodeSpace')
  const [pushing, setPushing]       = useState(false)
  const [progress, setProgress]     = useState('')
  const [result, setResult]         = useState(null)
  const [err, setErr]               = useState('')
  const [cloning, setCloning]       = useState(false)
  const [cloneProgress, setCloneProgress] = useState('')
  const [tooLarge, setTooLarge]     = useState(null)
  const storeKey = `githubRepo:${projectId || 'default'}`

  useEffect(() => {
    let cancelled = false
    listRepos(authFetch)
      .then(async list => {
        if (cancelled) return
        setRepos(list)
        const saved = await getConfig(storeKey, null)
        const match = saved && list.find(r => r.full_name === saved.full_name)
        if (match) setSelected(match)
      })
      .catch(e => setErr(e.message))
      .finally(() => !cancelled && setRLoading(false))
    return () => { cancelled = true }
  }, [authFetch, storeKey])

  function selectRepo(repo) {
    setSelected(repo); setResult(null); setErr(''); setTooLarge(null)
    setConfig(storeKey, { full_name: repo.full_name })
  }

  async function doCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setErr('')
    try {
      const repo = await createRepo(authFetch, newName.trim())
      setRepos(r => [repo, ...r])
      selectRepo(repo)
      setCreating(false); setNewName('')
    } catch (e2) { setErr(e2.message) }
  }

  async function doClone() {
    if (!selected || cloning) return
    setErr(''); setCloning(true); setTooLarge(null)
    try {
      const cloned = await cloneRepo(authFetch, {
        owner: selected.owner.login, repo: selected.name,
        branch: selected.default_branch || 'main',
        onProgress: setCloneProgress,
      })
      await onImportProject?.(selected.name, cloned)
    } catch (e2) {
      if (e2.tooLarge) {
        setTooLarge({ fileCount: e2.fileCount, url: githubZipDownloadUrl(selected.owner.login, selected.name, selected.default_branch || 'main') })
      } else {
        setErr(e2.message)
      }
    }
    setCloning(false); setCloneProgress('')
  }

  async function doPush() {
    if (!selected || pushing) return
    setPushing(true); setErr(''); setResult(null)
    try {
      const res = await pushFiles(authFetch, {
        owner: selected.owner.login, repo: selected.name,
        branch: selected.default_branch || 'main',
        files, message: commitMsg.trim() || 'Update from CodeSpace',
        onProgress: setProgress,
      })
      setResult(res)
    } catch (e2) { setErr(e2.message) }
    setPushing(false); setProgress('')
  }

  return (
    <div className="csgit-push">
      <div className="csgit-push-label">Repository</div>
      {reposLoading ? <div className="csgit-push-loading">Loading your repos…</div> : (
        <>
          <select className="csgit-push-select" value={selected?.full_name || ''}
            onChange={e => { const r = repos.find(x => x.full_name === e.target.value); if (r) selectRepo(r) }}>
            <option value="" disabled>Choose a repository…</option>
            {repos.map(r => <option key={r.id} value={r.full_name}>{r.full_name}{r.private ? ' 🔒' : ''}</option>)}
          </select>
          {!creating ? (
            <div className="csgit-push-repobtns">
              <button className="csgit-push-newrepo" onClick={() => setCreating(true)}>＋ Create new repository</button>
              {selected && (
                <button className="csgit-push-clonebtn" onClick={doClone} disabled={cloning}>
                  {cloning ? (cloneProgress || 'Importing…') : '⬇ Clone into new project'}
                </button>
              )}
            </div>
          ) : (
            <form className="csgit-push-createform" onSubmit={doCreate}>
              <input placeholder="repo-name" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setCreating(false)}>✕</button>
            </form>
          )}
        </>
      )}

      {selected && (
        <>
          <div className="csgit-push-label">Commit message</div>
          <input className="csgit-push-msg" value={commitMsg} disabled={pushing}
            onChange={e => setCommitMsg(e.target.value)} />
          <button className="csgit-push-btn" onClick={doPush} disabled={pushing}>
            {pushing ? (progress || 'Pushing…') : `⬆ Push to ${selected.full_name}`}
          </button>
        </>
      )}

      {result && (
        <div className="csgit-push-success">
          ✓ Pushed {result.fileCount} file{result.fileCount === 1 ? '' : 's'}.{' '}
          <a href={result.url} target="_blank" rel="noreferrer">View commit on GitHub ↗</a>
        </div>
      )}
      {tooLarge && (
        <div className="csgit-push-toolarge">
          <div>This repo has {tooLarge.fileCount} files — too many to import directly (max {150}).</div>
          <a className="csgit-push-dlbtn" href={tooLarge.url} target="_blank" rel="noreferrer">⬇ Download ZIP from GitHub</a>
          <div className="csgit-push-toolarge-sub">
            Then in the Explorer tab (📁), tap <b>📦 Import ZIP</b> and pick the downloaded file — it opens as a new project, any size.
          </div>
        </div>
      )}
      {err && <div className="csgit-github-error">⚠ {err}</div>}
    </div>
  )
}

export default function CsGitPanel({ files, git, projectName, projectId, onRestoreFiles, onImportProject }) {
  const { user, connected, connecting, error: githubError, connect, disconnect, authFetch } = useGitHub()
  const [tab,      setTab]      = useState('changes') // changes | log | branches | github
  const [commits,  setCommits]  = useState([])
  const [branches, setBranches] = useState({ branches: {}, HEAD: 'main' })
  const [changes,  setChanges]  = useState([])
  const [staged,   setStaged]   = useState({})
  const [commitMsg, setMsg]     = useState('')
  const [committing, setComm]   = useState(false)
  const [selectedFile, setFile] = useState(null)
  const [newBranch, setNewBr]   = useState('')
  const [creating, setCreating] = useState(false)
  const [stash,    setStash]    = useState([])

  async function loadAll() {
    if (!git) return
    const [log, br, st] = await Promise.all([
      git.log(),
      git.getBranches(),
      git.getStash(),
    ])
    setCommits(log)
    setBranches(br)
    setStash(st)

    // Compute changes vs last commit
    const lastCommit = log[0]
    const baseFiles  = lastCommit?.files || {}
    const cs         = await git.status(files, baseFiles)
    setChanges(cs)
  }

  useEffect(() => { loadAll() }, [files, git])

  async function doCommit() {
    if (!commitMsg.trim() || !git) return
    setComm(true)
    try {
      await git.commit(files, commitMsg.trim())
      setMsg('')
      setStaged({})
      await loadAll()
    } finally {
      setComm(false)
    }
  }

  async function doCheckout(branchName) {
    if (!git) return
    try {
      const restored = await git.checkout(branchName)
      onRestoreFiles?.(restored)
      await loadAll()
    } catch (e) {
      alert(e.message)
    }
  }

  async function doCreateBranch() {
    if (!newBranch.trim() || !git) return
    try {
      await git.checkout(newBranch.trim(), true, files)
      setNewBr('')
      setCreating(false)
      await loadAll()
    } catch (e) {
      alert(e.message)
    }
  }

  async function doStash() {
    if (!git) return
    await git.stashPush(files, 'Stash ' + new Date().toLocaleTimeString())
    await loadAll()
  }

  async function doStashPop() {
    if (!git) return
    try {
      const restored = await git.stashPop()
      onRestoreFiles?.(restored)
      await loadAll()
    } catch (e) { alert(e.message) }
  }

  // Get diff for selected file
  const [fileDiff, setFileDiff] = useState(null)
  useEffect(() => {
    if (!selectedFile || !git) { setFileDiff(null); return }
    async function computeDiff() {
      const lastCommit = commits[0]
      const base = lastCommit?.files?.[selectedFile] || ''
      const curr = files[selectedFile] || ''
      const chunks = diffLines(base, curr)
      setFileDiff(chunks)
    }
    computeDiff()
  }, [selectedFile, files, commits, git])

  const TABS = [
    { id: 'changes',  label: 'Changes',  badge: changes.length },
    { id: 'log',      label: 'Commits',  badge: commits.length },
    { id: 'branches', label: 'Branches', badge: Object.keys(branches.branches || {}).length },
    { id: 'github',   label: 'GitHub',   badge: 0 },
  ]

  const statusIcon = { new: '✦', modified: '●', deleted: '✕' }
  const statusColor = { new: '#4ade80', modified: '#fbbf24', deleted: '#f87171' }

  return (
    <div className="csgit-root">
      <div className="csgit-header">
        <span className="csgit-title">
          <span className="csgit-icon">⎇</span> SOURCE CONTROL
        </span>
        <span className="csgit-branch-badge">{branches.HEAD}</span>
      </div>

      <div className="csgit-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`csgit-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.badge > 0 && <span className="csgit-tab-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* CHANGES TAB */}
      {tab === 'changes' && (
        <div className="csgit-panel">
          {/* Commit area */}
          <div className="csgit-commit-area">
            <textarea
              className="csgit-msg-input"
              placeholder="Message (⌘Enter to commit)"
              value={commitMsg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') doCommit() }}
              rows={2}
            />
            <div className="csgit-commit-actions">
              <button className="csgit-stash-btn" onClick={doStash} title="Stash changes">📦 Stash</button>
              <button
                className="csgit-commit-btn"
                onClick={doCommit}
                disabled={!commitMsg.trim() || committing}
              >
                {committing ? '...' : '✓ Commit'}
              </button>
            </div>
          </div>

          {/* Changed files */}
          <div className="csgit-section-label">CHANGED FILES ({changes.length})</div>
          {changes.length === 0 ? (
            <div className="csgit-clean">✓ Working tree clean</div>
          ) : (
            <div className="csgit-changes">
              {changes.map(c => (
                <div
                  key={c.path}
                  className={`csgit-change-item ${selectedFile === c.path ? 'active' : ''}`}
                  onClick={() => setFile(selectedFile === c.path ? null : c.path)}
                >
                  <span style={{ color: statusColor[c.status] }}>{statusIcon[c.status]}</span>
                  <span className="csgit-change-path">{c.path}</span>
                  <span className="csgit-change-status" style={{ color: statusColor[c.status] }}>
                    {c.status[0].toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Diff viewer */}
          {selectedFile && fileDiff !== null && (
            <div className="csgit-diff-area">
              <div className="csgit-diff-title">
                <span>📄 {selectedFile}</span>
                <button onClick={() => setFile(null)}>✕</button>
              </div>
              <DiffViewer path={selectedFile} chunks={fileDiff} />
            </div>
          )}

          {/* Stash */}
          {stash.length > 0 && (
            <div className="csgit-stash-area">
              <div className="csgit-section-label">STASH ({stash.length})</div>
              {stash.map((s, i) => (
                <div key={s.id} className="csgit-stash-item">
                  <span className="csgit-stash-msg">{s.message || `stash@{${i}}`}</span>
                  {i === 0 && (
                    <button className="csgit-stash-pop" onClick={doStashPop}>Pop</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LOG TAB */}
      {tab === 'log' && (
        <div className="csgit-panel csgit-log">
          {commits.length === 0 ? (
            <div className="csgit-no-commits">
              <div>📋</div>
              <div>No commits yet</div>
              <div className="csgit-hint">Make a commit to start tracking history</div>
            </div>
          ) : (
            <div className="csgit-commit-list">
              <div className="csgit-commit-line" />
              {commits.map((c, i) => (
                <CommitItem key={c.id} commit={c} isHead={i === 0} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* BRANCHES TAB */}
      {tab === 'branches' && (
        <div className="csgit-panel">
          {/* New branch */}
          {creating ? (
            <div className="csgit-new-branch">
              <input
                className="csgit-branch-input"
                placeholder="Branch name..."
                value={newBranch}
                onChange={e => setNewBr(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') doCreateBranch()
                  if (e.key === 'Escape') setCreating(false)
                }}
                autoFocus
              />
              <button className="csgit-create-btn" onClick={doCreateBranch}>Create</button>
              <button className="csgit-cancel-btn" onClick={() => setCreating(false)}>✕</button>
            </div>
          ) : (
            <button className="csgit-new-branch-btn" onClick={() => setCreating(true)}>
              + New Branch
            </button>
          )}

          <div className="csgit-section-label">ALL BRANCHES</div>
          <div className="csgit-branch-list">
            {Object.values(branches.branches || {}).map(br => (
              <div
                key={br.name}
                className={`csgit-branch-item ${branches.HEAD === br.name ? 'active' : ''}`}
                onClick={() => branches.HEAD !== br.name && doCheckout(br.name)}
              >
                <span className="csgit-branch-icon">⎇</span>
                <span className="csgit-branch-name">{br.name}</span>
                {branches.HEAD === br.name && <span className="csgit-current-badge">current</span>}
                {br.protected && <span className="csgit-protected-badge">🔒</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* GITHUB TAB (Phase 2 / Step 1) */}
      {tab === 'github' && (
        <div className="csgit-panel csgit-github">
          {connecting ? (
            <div className="csgit-github-status">Connecting…</div>
          ) : connected ? (
            <>
              <div className="csgit-github-connected">
                {user?.avatar_url && <img src={user.avatar_url} alt="" className="csgit-github-avatar" />}
                <div className="csgit-github-who">
                  <div className="csgit-github-name">{user?.name || user?.login || '...'}</div>
                  {user?.login && <div className="csgit-github-login">@{user.login}</div>}
                </div>
                <button className="csgit-github-disconnect" onClick={disconnect}>Disconnect</button>
              </div>
              <RepoPush files={files} projectId={projectId} authFetch={authFetch} onImportProject={onImportProject} />
            </>
          ) : (
            <div className="csgit-github-connect">
              <div className="csgit-github-icon">⎇</div>
              <p>Connect your GitHub account to push this project to your own repo.</p>
              <button className="csgit-github-btn" onClick={connect}>🔗 Connect GitHub</button>
              {githubError && (
                <div className="csgit-github-error">⚠ {githubError}</div>
              )}
            </div>
          )}
          <div className="csgit-github-note">
            Push = one real commit for every changed file. Clone imports a repo (up to 150
            files) as a new project — bigger repos get a GitHub download link instead. Your
            current work is never touched. Everything talks directly to GitHub — nothing
            passes through our servers.
          </div>
        </div>
      )}
    </div>
  )
  }
    
