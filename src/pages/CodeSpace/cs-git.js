// ============================================================
// cs-git.js  –  Browser-based Git simulation
// Simulates commit/branch/diff/merge inside browser storage
// ============================================================

import { genId } from './cs-storage.js'

// ── Simple diff algorithm ─────────────────────────────────────
export function diffLines(oldText, newText) {
  const oldLines = (oldText || '').split('\n')
  const newLines = (newText || '').split('\n')
  const result   = []

  // LCS-based diff (simplified Myers diff)
  const m = oldLines.length
  const n = newLines.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = oldLines[i-1] === newLines[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1])

  // Backtrack
  let i = m, j = n
  const ops = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i-1] === newLines[j-1]) {
      ops.push({ type: 'same', line: oldLines[i-1], oldNo: i, newNo: j })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.push({ type: 'add', line: newLines[j-1], newNo: j })
      j--
    } else {
      ops.push({ type: 'del', line: oldLines[i-1], oldNo: i })
      i--
    }
  }
  ops.reverse()

  // Build unified diff chunks
  let chunk = null
  for (const op of ops) {
    if (op.type !== 'same') {
      if (!chunk || result[result.length - 1] !== chunk) {
        chunk = { ops: [] }
        result.push(chunk)
      }
      chunk.ops.push(op)
    } else {
      if (chunk && chunk.ops.length > 0) {
        chunk.ops.push(op)  // context line
        if (chunk.ops.filter(o => o.type === 'same').length >= 3) {
          chunk = null
        }
      }
    }
  }

  return result
}

// ── GitRepo class ─────────────────────────────────────────────
export class GitRepo {
  constructor(projectId, storage) {
    this.projectId = projectId
    this.storage   = storage  // { get, set } async KV on IndexedDB
    this.KEY = `git:${projectId}`
  }

  async _load() {
    const raw = await this.storage.get(this.KEY)
    if (raw) return raw
    // Initialize fresh repo
    return {
      HEAD:     'main',
      branches: {
        main: { name: 'main', commitId: null, protected: true }
      },
      commits:  {},
      stash:    [],
      tags:     {},
      remotes:  {},
    }
  }

  async _save(repo) {
    await this.storage.set(this.KEY, repo)
  }

  async status(currentFiles, baseFiles) {
    const changes = []
    const allKeys = new Set([...Object.keys(currentFiles), ...Object.keys(baseFiles)])
    for (const path of allKeys) {
      const cur  = currentFiles[path] ?? null
      const base = baseFiles[path]   ?? null
      if (cur === null)  changes.push({ path, status: 'deleted' })
      else if (base === null) changes.push({ path, status: 'new' })
      else if (cur !== base)  changes.push({ path, status: 'modified' })
    }
    return changes
  }

  async commit(files, message, author = 'You') {
    const repo     = await this._load()
    const branch   = repo.HEAD
    const parentId = repo.branches[branch]?.commitId || null

    const id = genId()
    repo.commits[id] = {
      id,
      message,
      author,
      ts:      Date.now(),
      files:   { ...files },
      parent:  parentId,
      branch,
    }
    repo.branches[branch] = { ...repo.branches[branch], commitId: id }
    await this._save(repo)
    return id
  }

  async log(branch) {
    const repo = await this._load()
    const br   = branch || repo.HEAD
    const commits = []
    let cid = repo.branches[br]?.commitId
    while (cid && repo.commits[cid]) {
      commits.push(repo.commits[cid])
      cid = repo.commits[cid].parent
    }
    return commits
  }

  async checkout(branchName, createNew = false, baseFiles = null) {
    const repo = await this._load()
    if (createNew) {
      if (repo.branches[branchName]) throw new Error(`Branch '${branchName}' already exists`)
      const parentCommitId = repo.branches[repo.HEAD]?.commitId
      repo.branches[branchName] = { name: branchName, commitId: parentCommitId }
    } else {
      if (!repo.branches[branchName]) throw new Error(`Branch '${branchName}' not found`)
    }
    repo.HEAD = branchName
    await this._save(repo)
    // Return files from branch tip commit
    const br  = repo.branches[branchName]
    const cid = br.commitId
    if (cid && repo.commits[cid]) return { ...repo.commits[cid].files }
    return baseFiles || {}
  }

  async getBranches() {
    const repo = await this._load()
    return { branches: repo.branches, HEAD: repo.HEAD }
  }

  async deleteBranch(name) {
    const repo = await this._load()
    if (repo.HEAD === name) throw new Error("Cannot delete the current branch")
    if (repo.branches[name]?.protected) throw new Error("Cannot delete protected branch")
    delete repo.branches[name]
    await this._save(repo)
  }

  async stashPush(files, message = '') {
    const repo = await this._load()
    repo.stash.unshift({ id: genId(), files: { ...files }, message, ts: Date.now() })
    await this._save(repo)
  }

  async stashPop() {
    const repo = await this._load()
    if (!repo.stash.length) throw new Error('No stash entries')
    const entry = repo.stash.shift()
    await this._save(repo)
    return entry.files
  }

  async getStash() {
    const repo = await this._load()
    return repo.stash
  }

  async merge(sourceBranch, currentFiles) {
    const repo = await this._load()
    const src  = repo.branches[sourceBranch]
    const dst  = repo.branches[repo.HEAD]
    if (!src) throw new Error(`Branch '${sourceBranch}' not found`)

    const srcFiles = src.commitId ? { ...repo.commits[src.commitId].files } : {}
    const dstFiles = dst.commitId ? { ...repo.commits[dst.commitId].files } : {}

    // Three-way merge (simplified)
    const merged    = { ...dstFiles }
    const conflicts = []

    for (const [path, srcContent] of Object.entries(srcFiles)) {
      const dstContent = dstFiles[path]
      if (dstContent === undefined) {
        merged[path] = srcContent   // New file from source
      } else if (dstContent === srcContent) {
        // Same — no conflict
      } else {
        // Conflict
        conflicts.push(path)
        merged[path] = `<<<<<<< HEAD\n${dstContent}\n=======\n${srcContent}\n>>>>>>> ${sourceBranch}`
      }
    }

    return { merged, conflicts }
  }

  async diff(commitId1, commitId2) {
    const repo = await this._load()
    const a = commitId1 ? repo.commits[commitId1]?.files || {} : {}
    const b = commitId2 ? repo.commits[commitId2]?.files || {} : {}
    const result = {}
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const path of allKeys) {
      if (a[path] !== b[path]) {
        result[path] = diffLines(a[path] || '', b[path] || '')
      }
    }
    return result
  }

  async blame(path, files) {
    // Simplified blame — returns per-line last-modified commit
    const repo     = await this._load()
    const branch   = repo.HEAD
    const commits  = []
    let cid = repo.branches[branch]?.commitId
    while (cid && repo.commits[cid]) {
      commits.push(repo.commits[cid])
      cid = repo.commits[cid].parent
    }

    const currentContent = files[path] || ''
    const lines = currentContent.split('\n')
    return lines.map((line, i) => {
      const c = commits.find(c => c.files[path]?.includes(line))
      return { line, lineNo: i + 1, commit: c || null }
    })
  }
  }
      