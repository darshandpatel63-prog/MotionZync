// api/admin-animations.js
// ============================================================
// Called ONLY by the Admin panel (Admin.jsx), authenticated with the
// admin's Firebase ID token. This is what replaced writing to Firestore:
// every save/delete here becomes exactly one Git commit, which Vercel
// then auto-deploys.
//
// Body: { action: 'saveAnimation'|'deleteAnimation'|'saveCategory'|'deleteCategory', payload: {...} }
// Header: Authorization: Bearer <Firebase ID token>
//
// Required environment variables (Vercel dashboard only, never in the repo):
//   GITHUB_TOKEN         fine-grained PAT, Contents: Read & write, scoped
//                        to this one repo only
//   GITHUB_REPO_OWNER    e.g. "yourusername"
//   GITHUB_REPO_NAME     e.g. "MotionZync"
//   GITHUB_REPO_BRANCH   e.g. "main"  (optional, defaults to main)
//   + the FIREBASE_* / ADMIN_EMAIL vars documented in _lib/firebase-admin.js
// ============================================================

import { requireAdmin } from './_lib/firebase-admin.js'
import { getFileJSON, pushFiles } from './_lib/github.js'
import { slugify, folderify, uniqueSlug } from './_lib/slug.js'
import { buildSitemapXML } from './_lib/sitemap.js'

const MANIFEST_PATH = 'public/animations/manifest.json'
const CATEGORIES_PATH = 'public/animations/categories.json'
const SITEMAP_PATH = 'public/sitemap-new.xml'

function repoConfig() {
  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  const branch = process.env.GITHUB_REPO_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  if (!owner || !repo || !token) {
    const err = new Error('Server is missing GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME')
    err.status = 500
    throw err
  }
  return { owner, repo, branch, token }
}

function animationPath(folder, slug) {
  return `public/animations/${folder}/${slug}.json`
}

function findFolder(categories, categoryName) {
  const cat = categories.find(c => c.name === categoryName)
  return cat ? cat.folder : folderify(categoryName)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await requireAdmin(req)
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message })
  }

  const { action, payload } = req.body || {}
  if (!action) return res.status(400).json({ error: 'Missing action' })

  try {
    const cfg = repoConfig()
    const [manifest, categories] = await Promise.all([
      getFileJSON(cfg.token, { owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, filePath: MANIFEST_PATH }).then(d => d || []),
      getFileJSON(cfg.token, { owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, filePath: CATEGORIES_PATH }).then(d => d || []),
    ])

    let result
    if (action === 'saveAnimation') result = await saveAnimation(cfg, manifest, categories, payload)
    else if (action === 'deleteAnimation') result = await deleteAnimation(cfg, manifest, categories, payload)
    else if (action === 'saveCategory') result = await saveCategory(cfg, manifest, categories, payload)
    else if (action === 'deleteCategory') result = await deleteCategory(cfg, manifest, categories, payload)
    else return res.status(400).json({ error: `Unknown action: ${action}` })

    return res.status(200).json(result)
  } catch (err) {
    console.error('[admin-animations]', err)
    return res.status(err.status || 500).json({ error: err.message || 'Something went wrong' })
  }
}

// ────────────────────────────────────────────────────────────
async function saveAnimation(cfg, manifest, categories, payload = {}) {
  const { docId, title, description, category, previewBg, tags, cssCode, jsCode } = payload
  if (!title || !title.trim()) { const e = new Error('Title is required'); e.status = 400; throw e }
  if (!category) { const e = new Error('Category is required'); e.status = 400; throw e }

  const existingIndex = docId ? manifest.findIndex(a => a.docId === docId) : -1
  const isNew = existingIndex === -1
  const now = new Date().toISOString()
  const finalDocId = docId || `a-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  const folder = findFolder(categories, category)

  // Keep the slug stable across a plain edit; only regenerate on create or
  // when the category changed (the file is moving folders anyway).
  const sameCategoryEdit = !isNew && manifest[existingIndex].category === category
  const usedInTarget = new Set(
    manifest.filter((a, i) => a.category === category && i !== existingIndex).map(a => a.slug)
  )
  let slug = sameCategoryEdit ? manifest[existingIndex].slug : slugify(title)
  if (usedInTarget.has(slug)) slug = uniqueSlug(slug, usedInTarget)

  const entry = {
    docId: finalDocId,
    slug,
    title: title.trim(),
    description: (description || '').trim(),
    category,
    previewBg: previewBg || '#0a0a0a',
    tags: Array.isArray(tags) ? tags : [],
    cssCode: cssCode || '',
    jsCode: jsCode || '',
    createdAt: isNew ? now : (manifest[existingIndex].createdAt || now),
    updatedAt: now,
  }

  const deletions = []
  const updatedManifest = [...manifest]
  if (isNew) {
    updatedManifest.push(entry)
  } else {
    const old = manifest[existingIndex]
    if (old.category !== category || old.slug !== slug) {
      deletions.push(animationPath(findFolder(categories, old.category), old.slug))
    }
    updatedManifest[existingIndex] = entry
  }

  const files = {
    [animationPath(folder, slug)]: JSON.stringify(entry, null, 2),
    [MANIFEST_PATH]: JSON.stringify(updatedManifest, null, 2),
    [SITEMAP_PATH]: buildSitemapXML(updatedManifest, now.slice(0, 10)),
  }

  const push = await pushFiles(cfg.token, {
    owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, files, deletions,
    message: `${isNew ? 'Add' : 'Update'} animation: ${entry.title}`,
  })

  return { ok: true, docId: finalDocId, slug, commit: push.url }
}

// ────────────────────────────────────────────────────────────
async function deleteAnimation(cfg, manifest, categories, payload = {}) {
  const { docId } = payload
  const idx = manifest.findIndex(a => a.docId === docId)
  if (idx === -1) { const e = new Error('Animation not found'); e.status = 404; throw e }

  const removed = manifest[idx]
  const updatedManifest = manifest.filter((_, i) => i !== idx)
  const folder = findFolder(categories, removed.category)
  const now = new Date().toISOString()

  const push = await pushFiles(cfg.token, {
    owner: cfg.owner, repo: cfg.repo, branch: cfg.branch,
    files: {
      [MANIFEST_PATH]: JSON.stringify(updatedManifest, null, 2),
      [SITEMAP_PATH]: buildSitemapXML(updatedManifest, now.slice(0, 10)),
    },
    deletions: [animationPath(folder, removed.slug)],
    message: `Delete animation: ${removed.title}`,
  })

  return { ok: true, commit: push.url }
}

// ────────────────────────────────────────────────────────────
async function saveCategory(cfg, manifest, categories, payload = {}) {
  const cleanName = (payload.name || '').trim()
  if (!cleanName) { const e = new Error('Category name is required'); e.status = 400; throw e }

  const existingIndex = payload.docId ? categories.findIndex(c => c.docId === payload.docId) : -1
  const isNew = existingIndex === -1
  const updatedCategories = [...categories]
  let renamedFrom = null

  if (isNew) {
    const newDocId = slugify(cleanName) || `cat-${Date.now().toString(36)}`
    if (categories.some(c => c.docId === newDocId)) {
      const e = new Error('A category with a very similar name already exists'); e.status = 400; throw e
    }
    updatedCategories.push({
      docId: newDocId,
      name: cleanName,
      folder: folderify(cleanName), // fixed forever — renames never move files
      order: Number.isFinite(payload.order) ? payload.order : categories.length,
    })
  } else {
    const old = categories[existingIndex]
    if (old.name !== cleanName) renamedFrom = old.name
    updatedCategories[existingIndex] = {
      ...old,
      name: cleanName,
      order: Number.isFinite(payload.order) ? payload.order : old.order,
    }
  }

  const files = { [CATEGORIES_PATH]: JSON.stringify(updatedCategories, null, 2) }

  if (renamedFrom) {
    const folder = categories[existingIndex].folder
    const now = new Date().toISOString()
    const updatedManifest = manifest.map(a => {
      if (a.category !== renamedFrom) return a
      const updated = { ...a, category: cleanName, updatedAt: now }
      files[animationPath(folder, updated.slug)] = JSON.stringify(updated, null, 2)
      return updated
    })
    files[MANIFEST_PATH] = JSON.stringify(updatedManifest, null, 2)
    files[SITEMAP_PATH] = buildSitemapXML(updatedManifest, now.slice(0, 10))
  }

  const push = await pushFiles(cfg.token, {
    owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, files,
    message: renamedFrom ? `Rename category: ${renamedFrom} -> ${cleanName}` : (isNew ? `Add category: ${cleanName}` : `Update category: ${cleanName}`),
  })

  return { ok: true, commit: push.url }
}

// ────────────────────────────────────────────────────────────
async function deleteCategory(cfg, manifest, categories, payload = {}) {
  const cat = categories.find(c => c.docId === payload.docId)
  if (!cat) { const e = new Error('Category not found'); e.status = 404; throw e }

  const inUse = manifest.some(a => a.category === cat.name)
  if (inUse) {
    const e = new Error(`Can't delete "${cat.name}" — it still has animations in it. Move or delete those first.`)
    e.status = 400
    throw e
  }

  const updatedCategories = categories.filter(c => c.docId !== payload.docId)
  const push = await pushFiles(cfg.token, {
    owner: cfg.owner, repo: cfg.repo, branch: cfg.branch,
    files: { [CATEGORIES_PATH]: JSON.stringify(updatedCategories, null, 2) },
    message: `Delete category: ${cat.name}`,
  })

  return { ok: true, commit: push.url }
}
