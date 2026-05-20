import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, getDoc, increment
} from 'firebase/firestore'
import { db } from '../firebase'

// ─── Existing functions (unchanged) ─────────────────────────────────────────

export function generateTags(title='', description='') {
  const text = (title+' '+description).toLowerCase()
  const words = text.match(/[a-zA-Z0-9]+/g)||[]
  return [...new Set(words.filter(w=>w.length>1))]
}

export async function getAnimations() {
  const snap = await getDocs(query(collection(db,'animations'), orderBy('createdAt','desc')))
  return snap.docs.map(d=>({...d.data(), docId:d.id}))
}

export async function getAnimationById(docId) {
  const snap = await getDoc(doc(db,'animations',docId))
  return snap.exists() ? {...snap.data(), docId:snap.id} : null
}

export async function searchByTag(tag) {
  const snap = await getDocs(query(collection(db,'animations'), where('tags','array-contains',tag.toLowerCase().trim())))
  return snap.docs.map(d=>({...d.data(), docId:d.id}))
}

export async function saveAnimation(animation) {
  const tags = generateTags(animation.title, animation.description)
  const data = {
    title:       animation.title||'',
    description: animation.description||'',
    category:    animation.category||'Background',
    previewBg:   animation.previewBg||'#0a0a0f',
    cssCode:     animation.cssCode||'',
    jsCode:      animation.jsCode||'',
    tags,
    updatedAt: new Date()
  }
  if (animation.docId) {
    await updateDoc(doc(db,'animations',animation.docId), data)
    return animation.docId
  } else {
    data.createdAt = new Date()
    data.views = 0
    const ref = await addDoc(collection(db,'animations'), data)
    return ref.id
  }
}

export async function deleteAnimation(docId) {
  await deleteDoc(doc(db,'animations',docId))
}

export async function incrementView(docId) {
  try { await updateDoc(doc(db,'animations',docId), {views: increment(1)}) } catch(_) {}
}

export async function getCategories() {
  const snap = await getDocs(query(collection(db,'categories'), orderBy('order','asc')))
  return snap.docs.length>0
    ? snap.docs.map(d=>({...d.data(),docId:d.id}))
    : [{docId:'bg',name:'Background',order:0},{docId:'fr',name:'Front',order:1}]
}

export async function saveCategory(cat) {
  const data = { name:cat.name, order:cat.order||0 }
  if (cat.docId && cat.docId.length>5) await updateDoc(doc(db,'categories',cat.docId),data)
  else await addDoc(collection(db,'categories'),data)
}

export async function deleteCategory(docId) {
  await deleteDoc(doc(db,'categories',docId))
}


// ─── NEW: User Submissions ────────────────────────────────────────────────────

/**
 * User thi animation submit karavo
 * Firestore 'submissions' collection ma saves with status: 'pending'
 * Firestore Rules ma add karjo:
 *   match /submissions/{doc} {
 *     allow read: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
 *     allow create: if true;
 *     allow update, delete: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
 *   }
 */
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
    status:         'pending',    // pending | approved | rejected
    submittedAt:    new Date(),
    adminNote:      '',
  }
  const ref = await addDoc(collection(db, 'submissions'), submission)
  return ref.id
}

/**
 * Admin: all submissions fetch (status filter optional)
 * status: 'all' | 'pending' | 'approved' | 'rejected'
 */
export async function getSubmissions(status = 'all') {
  let q
  if (status === 'all') {
    q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'))
  } else {
    q = query(
      collection(db, 'submissions'),
      where('status', '==', status),
      orderBy('submittedAt', 'desc')
    )
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }))
}

/**
 * Admin: submission approve karo → animations collection ma copy thase
 * Returns the new animation docId
 */
export async function approveSubmission(submission, adminNote = '') {
  // 1. Animations collection ma save karo
  const animId = await saveAnimation({
    title:       submission.title,
    description: submission.description,
    category:    submission.category,
    previewBg:   submission.previewBg,
    cssCode:     submission.cssCode,
    jsCode:      submission.jsCode,
  })
  // 2. Submission status update karo
  await updateDoc(doc(db, 'submissions', submission.docId), {
    status:    'approved',
    adminNote: adminNote || '',
    reviewedAt: new Date(),
    animationId: animId,
  })
  return animId
}

/**
 * Admin: submission reject karo
 */
export async function rejectSubmission(docId, adminNote = '') {
  await updateDoc(doc(db, 'submissions', docId), {
    status:    'rejected',
    adminNote: adminNote || '',
    reviewedAt: new Date(),
  })
}

/**
 * Admin: submission delete karo (permanently)
 */
export async function deleteSubmission(docId) {
  await deleteDoc(doc(db, 'submissions', docId))
                 }
