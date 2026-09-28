// src/hooks/useAnimations.js
// ============================================================
// MIGRATION NOTE (Aug 2026): animations + categories used to live in
// Firestore. They now live as JSON files in this repo, under
// public/animations/, and are pushed there by the Admin panel via
// /api/admin-animations (see that file + api/_lib/github.js).
//
// Every function below keeps its ORIGINAL name and return shape on
// purpose — Gallery, Home, AnimationDetail, Favorites, Compare,
// Wallpaper, Playground, Submit and Admin all import these and none of
// them needed to change because of this migration.
//
// Firestore is still used for: community submissions and changelog
// entries — unrelated to this migration, unchanged. (View counters were
// removed entirely — Aug 2026 — this file no longer touches Firestore
// for animation reads/writes at all.)
// ============================================================

import { db, auth } from '../firebase'

export function generateTags(title='', description='') {
  const text = (title+' '+description).toLowerCase()
  const words = text.match(/[a-zA-Z0-9]+/g)||[]
  return [...new Set(words.filter(w=>w.length>1))]
}

// ─── Reading animation data (GitHub-hosted static JSON) ───────
async function fetchManifest() {
  const res = await fetch('/animations/manifest.json')
  if (!res.ok) throw new Error('Could not load animations (manifest.json ' + res.status + ')')
  return res.json()
}

export async function getAnimations() {
  return fetchManifest()
}

export async function getAnimationById(docId) {
  const manifest = await fetchManifest()
  return manifest.find(a => a.docId === docId) || null
}

export async function searchByTag(tag) {
  const needle = (tag || '').toLowerCase().trim()
  const manifest = await fetchManifest()
  return manifest.filter(a => Array.isArray(a.tags) && a.tags.includes(needle))
}

// ─── Writing animation data (goes through the secure Admin API,
//     which commits to GitHub — see api/admin-animations.js) ───────
async function callAdminAPI(action, payload) {
  const user = auth.currentUser
  if (!user) throw new Error('You must be signed in as admin to do this')
  const idToken = await user.getIdToken()

  const res = await fetch('/api/admin-animations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ action, payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export async function saveAnimation(animation) {
  const tags = generateTags(animation.title, animation.description)
  const data = await callAdminAPI('saveAnimation', {
    docId:       animation.docId || null,
    title:       animation.title || '',
    description: animation.description || '',
    category:    animation.category || 'Background',
    previewBg:   animation.previewBg || '#0a0a0f',
    cssCode:     animation.cssCode || '',
    jsCode:      animation.jsCode || '',
    tags,
  })
  return data.docId // same return shape as before: just the id
}

export async function deleteAnimation(docId) {
  await callAdminAPI('deleteAnimation', { docId })
}

export async function getCategories() {
  try {
    const res = await fetch('/animations/categories.json')
    if (!res.ok) throw new Error('not found')
    const cats = await res.json()
    return cats.length > 0
      ? [...cats].sort((a,b) => (a.order||0)-(b.order||0))
      : [{docId:'background',name:'Background',order:0},{docId:'front',name:'Front',order:1}]
  } catch {
    return [{docId:'background',name:'Background',order:0},{docId:'front',name:'Front',order:1}]
  }
}

export async function saveCategory(cat) {
  await callAdminAPI('saveCategory', { docId: cat.docId || null, name: cat.name, order: cat.order || 0 })
}

export async function deleteCategory(docId) {
  await callAdminAPI('deleteCategory', { docId })
}
