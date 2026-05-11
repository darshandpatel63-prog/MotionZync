/**
 * useAnimations.js
 * Firestore CRUD for animations and categories
 * 
 * Firestore structure:
 *   animations/{docId}: { id, title, description, category, previewBg, cssCode, jsCode, tags[], createdAt }
 *   categories/{docId}: { name, order }
 */
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, getDoc
} from 'firebase/firestore'
import { db } from '../firebase'

// Auto-generate hashtags from title + description
export function generateTags(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase()
  const words = text.match(/[a-zA-Z0-9\u0A80-\u0AFF]+/g) || []
  return [...new Set(words.filter(w => w.length > 1))]
}

// ── ANIMATIONS ────────────────────────────────────────────────────

export async function getAnimations() {
  const snap = await getDocs(query(collection(db, 'animations'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }))
}

export async function getAnimationsByCategory(category) {
  const q = query(collection(db, 'animations'), where('category', '==', category))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }))
}

export async function searchByTag(tag) {
  const q = query(collection(db, 'animations'), where('tags', 'array-contains', tag.toLowerCase().trim()))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }))
}

export async function getAnimationById(docId) {
  const snap = await getDoc(doc(db, 'animations', docId))
  if (!snap.exists()) return null
  return { ...snap.data(), docId: snap.id }
}

export async function saveAnimation(animation) {
  const tags = generateTags(animation.title, animation.description)
  const data = {
    title:       animation.title || '',
    description: animation.description || '',
    category:    animation.category || 'Background',
    previewBg:   animation.previewBg || '#0a0a0f',
    cssCode:     animation.cssCode || '',
    jsCode:      animation.jsCode || '',
    tags,
    updatedAt:   new Date()
  }

  if (animation.docId) {
    await updateDoc(doc(db, 'animations', animation.docId), data)
    return animation.docId
  } else {
    data.createdAt = new Date()
    const ref = await addDoc(collection(db, 'animations'), data)
    return ref.id
  }
}

export async function deleteAnimation(docId) {
  await deleteDoc(doc(db, 'animations', docId))
}

// ── CATEGORIES ────────────────────────────────────────────────────

export async function getCategories() {
  const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')))
  const cats = snap.docs.map(d => ({ ...d.data(), docId: d.id }))
  // Always include default categories first
  return cats.length > 0 ? cats : [
    { docId: 'bg', name: 'Background', order: 0 },
    { docId: 'fr', name: 'Front',      order: 1 }
  ]
}

export async function saveCategory(cat) {
  const data = { name: cat.name, order: cat.order || 0 }
  if (cat.docId && cat.docId.length > 5) {
    await updateDoc(doc(db, 'categories', cat.docId), data)
  } else {
    await addDoc(collection(db, 'categories'), data)
  }
}

export async function deleteCategory(docId) {
  await deleteDoc(doc(db, 'categories', docId))
}
