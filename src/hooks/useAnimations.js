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

import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore'
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

// ─── Submissions (unchanged — still Firestore) ──────────────────────
export async function submitAnimation(data) {
  const tags = generateTags(data.title, data.description)
  const submission = {
    title:          data.title || '',
    description:    data.description || '',
    category:       data.category || 'Background',
    previewBg:      data.previewBg || '#0a0a0f',
    cssCode:        data.cssCode || '',
    jsCode:         data.jsCode || '',
    tags,
    submitterName:  data.submitterName || '',
    submitterEmail: data.submitterEmail || '',
    status:         'pending',
    submittedAt:    new Date(),
  }
  const ref = await addDoc(collection(db, 'submissions'), submission)
  return ref.id
}

export async function getSubmissions(status = 'all') {
  const snap = await getDocs(collection(db, 'submissions'))
  const all = snap.docs.map(d => ({ ...d.data(), docId: d.id }))
  const filtered = status === 'all' ? all : all.filter(s => s.status === status)
  filtered.sort((a, b) => {
    const ta = a.submittedAt?.seconds ? a.submittedAt.seconds : (new Date(a.submittedAt).getTime()/1000)
    const tb = b.submittedAt?.seconds ? b.submittedAt.seconds : (new Date(b.submittedAt).getTime()/1000)
    return tb - ta
  })
  return filtered
}

// approveSubmission calls saveAnimation() above — since that now pushes to
// GitHub instead of Firestore, approving a submission automatically goes
// through the new pipeline too. Nothing else here needed to change.
export async function approveSubmission(submission, adminNote = '') {
  const animId = await saveAnimation({
    title:       submission.title,
    description: submission.description,
    category:    submission.category,
    previewBg:   submission.previewBg,
    cssCode:     submission.cssCode,
    jsCode:      submission.jsCode,
  })
  try {
    await updateDoc(doc(db, 'submissions', submission.docId), {
      status:     'approved',
      adminNote:  adminNote || '',
      approvedAt: new Date(),
      animationId: animId,
    })
  } catch(_) {}
  return animId
}

export async function deleteSubmission(docId) {
  await deleteDoc(doc(db, 'submissions', docId))
}

// ─── Changelog (unchanged — still Firestore) ────────────────────────
export async function getChangelogs() {
  const snap = await getDocs(collection(db, 'changelogs'))
  const all  = snap.docs.map(d => ({ ...d.data(), docId: d.id }))
  all.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date||0) - new Date(a.date||0)
  })
  return all
}

export async function saveChangelog(entry) {
  const data = {
    version:  entry.version  || 'v1.0',
    title:    entry.title    || '',
    date:     entry.date     || new Date().toISOString().split('T')[0],
    type:     entry.type     || 'feature',
    items:    Array.isArray(entry.items) ? entry.items : [],
    pinned:   entry.pinned   || false,
    updatedAt: new Date(),
  }
  if (entry.docId) {
    await updateDoc(doc(db, 'changelogs', entry.docId), data)
    return entry.docId
  } else {
    data.createdAt = new Date()
    const ref = await addDoc(collection(db, 'changelogs'), data)
    return ref.id
  }
}

export async function deleteChangelog(docId) {
  await deleteDoc(doc(db, 'changelogs', docId))
}
