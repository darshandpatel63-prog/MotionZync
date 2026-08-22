// ============================================================
// gh-push.js  –  Phase 3: real push to GitHub
//
// Uses the Git Data API (blobs → tree → commit → ref) instead of the
// simpler Contents API on purpose: Contents API means one commit PER
// FILE, which is not how a real push works and would flood the repo's
// history. This does one commit for the whole batch, same as `git push`.
// ============================================================

function b64EncodeUnicode(str) {
  // btoa() only handles Latin1 — this round-trip makes it UTF-8 safe
  return btoa(unescape(encodeURIComponent(str ?? '')))
}

export async function listRepos(authFetch) {
  const res = await authFetch('/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator')
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Could not list repositories')
  return data
}

export async function createRepo(authFetch, name, isPrivate = false) {
  const res = await authFetch('/user/repos', {
    method: 'POST',
    body: JSON.stringify({ name, private: isPrivate, auto_init: true, description: 'Built with CodeSpace' }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Could not create repository (name may already be taken)')
  return data
}

export async function pushFiles(authFetch, { owner, repo, branch = 'main', files, message, onProgress }) {
  const base = `/repos/${owner}/${repo}`
  const paths = Object.keys(files).filter(p => files[p] != null)
  if (!paths.length) throw new Error('Nothing to push — the project has no files.')

  onProgress?.('Reading branch…')
  let parentSha = null, baseTreeSha = null
  const refRes = await authFetch(`${base}/git/ref/heads/${branch}`)
  if (refRes.ok) {
    const refData = await refRes.json()
    parentSha = refData.object.sha
    const commitRes = await authFetch(`${base}/git/commits/${parentSha}`)
    const commitData = await commitRes.json()
    if (!commitRes.ok) throw new Error(commitData.message || 'Could not read latest commit')
    baseTreeSha = commitData.tree.sha
  } else if (refRes.status !== 404) {
    const d = await refRes.json().catch(() => ({}))
    throw new Error(d.message || 'Could not read branch')
  }
  // 404 → brand-new/empty repo: no parent commit, no base tree — that's fine.

  const blobs = []
  for (let i = 0; i < paths.length; i++) {
    onProgress?.(`Uploading ${paths[i]} (${i + 1}/${paths.length})`)
    const res = await authFetch(`${base}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: b64EncodeUnicode(files[paths[i]]), encoding: 'base64' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Could not upload ${paths[i]}`)
    blobs.push({ path: paths[i], mode: '100644', type: 'blob', sha: data.sha })
  }

  onProgress?.('Creating tree…')
  const treeBody = { tree: blobs }
  if (baseTreeSha) treeBody.base_tree = baseTreeSha
  const treeRes = await authFetch(`${base}/git/trees`, { method: 'POST', body: JSON.stringify(treeBody) })
  const treeData = await treeRes.json()
  if (!treeRes.ok) throw new Error(treeData.message || 'Could not create tree')

  onProgress?.('Creating commit…')
  const commitRes = await authFetch(`${base}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeData.sha, parents: parentSha ? [parentSha] : [] }),
  })
  const commitData = await commitRes.json()
  if (!commitRes.ok) throw new Error(commitData.message || 'Could not create commit')

  onProgress?.('Updating branch…')
  const updateRes = parentSha
    ? await authFetch(`${base}/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commitData.sha }) })
    : await authFetch(`${base}/git/refs`, { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitData.sha }) })
  if (!updateRes.ok) {
    const d = await updateRes.json().catch(() => ({}))
    throw new Error(d.message || 'Could not update branch')
  }

  return {
    commitSha: commitData.sha,
    fileCount: paths.length,
    url: `https://github.com/${owner}/${repo}/commit/${commitData.sha}`,
  }
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(escape(atob(str.replace(/\n/g, ''))))
}

export const MAX_CLONE_FILES = 150

export async function cloneRepo(authFetch, { owner, repo, branch, onProgress }) {
  onProgress?.('Reading file list…')
  const refRes = await authFetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`)
  const refData = await refRes.json()
  if (!refRes.ok) throw new Error(refData.message || 'Could not read branch')

  const treeRes = await authFetch(`/repos/${owner}/${repo}/git/trees/${refData.object.sha}?recursive=1`)
  const treeData = await treeRes.json()
  if (!treeRes.ok) throw new Error(treeData.message || 'Could not read repo contents')
  if (treeData.truncated) throw new Error('This repo is too large to read even its file list in one go.')

  const entries = treeData.tree.filter(t => t.type === 'blob')
  if (!entries.length) throw new Error('This repo has no files on that branch.')
  if (entries.length > MAX_CLONE_FILES) {
    const err = new Error(`This repo has ${entries.length} files — too many for direct import.`)
    err.tooLarge = true
    err.fileCount = entries.length
    throw err
  }

  const files = {}
  let done = 0
  await Promise.all(entries.map(async (entry) => {
    const res = await authFetch(`/repos/${owner}/${repo}/git/blobs/${entry.sha}`)
    done++
    onProgress?.(`Downloading files… (${done}/${entries.length})`)
    if (!res.ok) return
    const data = await res.json()
    try {
      files[entry.path] = data.encoding === 'base64' ? b64DecodeUnicode(data.content) : data.content
    } catch {
      files[entry.path] = '' // binary file (image, font, etc.) — CodeSpace edits text files only
    }
  }))
  return files
}

// For repos over the direct-import limit: GitHub's own web download works
// via the user's normal logged-in browser session (no CORS/token issues at
// all, since it never goes through our OAuth token) — they download here,
// then bring it back in with the existing "📦 Import ZIP" button, which
// already creates a new project from any ZIP and is proven reliable.
export function githubZipDownloadUrl(owner, repo, branch) {
  return `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`
}