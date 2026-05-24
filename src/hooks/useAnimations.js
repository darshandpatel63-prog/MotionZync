import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, getDoc, increment
} from 'firebase/firestore'
import { db } from '../firebase'

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

// ─── Submissions ──────────────────────────────────────────────
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

export async function approveSubmission(submission) {
  const animId = await saveAnimation({
    title:       submission.title,
    description: submission.description,
    category:    submission.category,
    previewBg:   submission.previewBg,
    cssCode:     submission.cssCode,
    jsCode:      submission.jsCode,
  })
  return animId
}

export async function deleteSubmission(docId) {
  await deleteDoc(doc(db, 'submissions', docId))
}

// ─── Changelog ────────────────────────────────────────────────
// Firestore collection: 'changelogs'
// Fields: version, title, date, type, items[], pinned, createdAt

export async function getChangelogs() {
  const snap = await getDocs(collection(db, 'changelogs'))
  const all  = snap.docs.map(d => ({ ...d.data(), docId: d.id }))
  // Sort: pinned first, then by date desc
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
    type:     entry.type     || 'feature',  // feature | fix | update | announcement
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
      
