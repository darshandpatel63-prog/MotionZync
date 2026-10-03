// api/_lib/firebase-admin.js
// ============================================================
// Why this file exists: the Admin panel is already gated client-side by
// AuthGuard.jsx (checks VITE_ADMIN_EMAIL). That's fine for the UI, but
// it does NOT protect the API route itself — anyone who discovers the
// URL could POST straight to /api/admin-animations and write to the
// repo, bypassing the React app entirely.
//
// So the API route independently re-checks identity server-side using
// the Firebase Admin SDK: it verifies the Firebase ID token the client
// sends, and confirms the email on that token matches ADMIN_EMAIL. This
// runs on the server with a Firebase *service account*, which is a
// different credential from the app's normal public Firebase config.
//
// Required environment variables (Vercel → Project → Settings →
// Environment Variables — NOT in the repo, NOT prefixed with VITE_):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY      (paste exactly as downloaded — including
//                              the literal \n sequences; this file
//                              converts them to real newlines below)
//   ADMIN_EMAIL               (the one Google account allowed to write)
// ============================================================

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function ensureAdminApp() {
  if (getApps().length) return getApps()[0]

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Server is missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY')
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

/**
 * Verifies the Authorization: Bearer <Firebase ID token> header sent by the
 * Admin panel and confirms it belongs to ADMIN_EMAIL.
 * Throws an Error with a `.status` (401/403/500) on any failure — the
 * route handler catches this and returns the matching HTTP response.
 */
export function getAdminDb() {
  ensureAdminApp()
  return getFirestore()
}

export async function requireAuthenticatedUser(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!idToken) {
    const err = new Error('Missing Authorization header')
    err.status = 401
    throw err
  }

  ensureAdminApp()

  try {
    return await getAuth().verifyIdToken(idToken)
  } catch {
    const err = new Error('Your sign-in has expired — please log in again')
    err.status = 401
    throw err
  }
}

export async function requireAdmin(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!idToken) {
    const err = new Error('Missing Authorization header')
    err.status = 401
    throw err
  }

  ensureAdminApp()

  let decoded
  try {
    decoded = await getAuth().verifyIdToken(idToken)
  } catch {
    const err = new Error('Your sign-in has expired — please log in again')
    err.status = 401
    throw err
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || decoded.email !== adminEmail) {
    const err = new Error('This account is not authorized to publish')
    err.status = 403
    throw err
  }

  return decoded
}
