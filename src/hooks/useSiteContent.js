import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
export async function getSiteContent(key) {
  const snap = await getDoc(doc(db, 'siteContent', key))
  return snap.exists() ? snap.data() : null
}
export async function setSiteContent(key, data) {
  await setDoc(doc(db, 'siteContent', key), { ...data, updatedAt: new Date() })
}
export const defaultContent = {
  heroTitle: 'Create & Explore Beautiful Animations',
  heroSubtitle: 'Free live CSS & JavaScript animation playground. 100+ ready-made animations with real-time preview.',
  contactEmail: 'wealthkavach1@gmail.com',
  footerTagline: 'Live animation playground for everyone',
  enableWallpaper: true,
  enableCourse: true,
  announcementText: '',
  showAnnouncement: false,
}

