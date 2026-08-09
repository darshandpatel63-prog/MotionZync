// ============================================================
// gh-push.js  –  Phase 3: real push to GitHub
//
// Uses the Git Data API (blobs → tree → commit → ref) instead of the
// simpler Contents API on purpose: Contents API means one commit PER
// FILE, which is not how a real push works and would flood the repo's
// history. This does one commit for the whole batch, same as `git push`.
// ============================================================
import { importZipFile } from './cs-storage.js'

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

export async function cloneRepo(authFetch, { owner, repo, branch, onProgress }) {
  onProgress?.('Downloading repository…')
  const res = await authFetch(`/repos/${owner}/${repo}/zipball/${branch}`)
  if (!res.ok) {
    const d = await res.json().catch(() => ({}))
    throw new Error(d.message || 'Could not download repository')
  }
  const blob = await res.blob()
  onProgress?.('Unpacking files…')
  const files = await importZipFile(blob)
  const count = Object.keys(files).length
  if (!count) throw new Error('This repo appears to be empty on that branch.')
  return files
}
