// api/_lib/github.js
// ============================================================
// Server-side GitHub helper for the Admin panel's "push to GitHub"
// feature. Deliberately separate from src/pages/CodeSpace/gh-push.js:
// that one runs in the BROWSER with a per-user OAuth token (CodeSpace
// lets any signed-in visitor push to a repo of their own choosing).
// This one runs ONLY on the server, with a single fixed admin token
// (GITHUB_TOKEN) that never reaches the browser, and always targets
// the one repo configured in env vars.
//
// Same underlying technique though: the Git Data API (blobs → tree →
// commit → ref) so one Admin "Save" = exactly one commit, even when it
// touches multiple files (the animation file + manifest.json + maybe
// categories.json + sitemap-new.xml).
// ============================================================

const API = 'https://api.github.com'

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

/** Read + JSON-parse a file straight from GitHub. Returns null if it doesn't exist yet. */
export async function getFileJSON(token, { owner, repo, branch, filePath }) {
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
    { headers: headers(token) }
  )
  if (res.status === 404) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `GitHub: could not read ${filePath}`)
  const content = Buffer.from(data.content, 'base64').toString('utf8')
  return JSON.parse(content)
}

/**
 * Push (add/update) files and/or delete files, all in exactly one commit.
 * files: { "public/animations/Card/glow.json": "...text content..." }
 * deletions: ["public/animations/Card/old-one.json"]
 */
export async function pushFiles(token, { owner, repo, branch = 'main', files = {}, deletions = [], message }) {
  const base = `${API}/repos/${owner}/${repo}`
  const h = headers(token)
  const writePaths = Object.keys(files).filter(p => files[p] != null)
  if (!writePaths.length && !deletions.length) throw new Error('Nothing to commit.')

  // 1) Where does the branch point right now?
  let parentSha = null, baseTreeSha = null
  const refRes = await fetch(`${base}/git/ref/heads/${branch}`, { headers: h })
  if (refRes.ok) {
    const refData = await refRes.json()
    parentSha = refData.object.sha
    const commitRes = await fetch(`${base}/git/commits/${parentSha}`, { headers: h })
    const commitData = await commitRes.json()
    if (!commitRes.ok) throw new Error(commitData.message || 'GitHub: could not read latest commit')
    baseTreeSha = commitData.tree.sha
  } else if (refRes.status !== 404) {
    const d = await refRes.json().catch(() => ({}))
    throw new Error(d.message || `GitHub: could not read branch "${branch}"`)
  }

  // 2) Upload each new/changed file as a blob
  const treeEntries = []
  for (const p of writePaths) {
    const res = await fetch(`${base}/git/blobs`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ content: Buffer.from(files[p], 'utf8').toString('base64'), encoding: 'base64' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `GitHub: could not upload ${p}`)
    treeEntries.push({ path: p, mode: '100644', type: 'blob', sha: data.sha })
  }
  // 3) Mark deletions (sha:null removes that path from the tree)
  for (const p of deletions) {
    treeEntries.push({ path: p, mode: '100644', type: 'blob', sha: null })
  }

  // 4) New tree on top of the current one
  const treeBody = { tree: treeEntries }
  if (baseTreeSha) treeBody.base_tree = baseTreeSha
  const treeRes = await fetch(`${base}/git/trees`, { method: 'POST', headers: h, body: JSON.stringify(treeBody) })
  const treeData = await treeRes.json()
  if (!treeRes.ok) throw new Error(treeData.message || 'GitHub: could not create tree')

  // 5) Commit + move the branch pointer
  const commitRes = await fetch(`${base}/git/commits`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ message, tree: treeData.sha, parents: parentSha ? [parentSha] : [] }),
  })
  const commitData = await commitRes.json()
  if (!commitRes.ok) throw new Error(commitData.message || 'GitHub: could not create commit')

  const updateRes = parentSha
    ? await fetch(`${base}/git/refs/heads/${branch}`, { method: 'PATCH', headers: h, body: JSON.stringify({ sha: commitData.sha }) })
    : await fetch(`${base}/git/refs`, { method: 'POST', headers: h, body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitData.sha }) })
  if (!updateRes.ok) {
    const d = await updateRes.json().catch(() => ({}))
    throw new Error(d.message || 'GitHub: could not update branch')
  }

  return {
    commitSha: commitData.sha,
    url: `https://github.com/${owner}/${repo}/commit/${commitData.sha}`,
  }
}
