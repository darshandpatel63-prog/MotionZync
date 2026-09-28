// src/ai/providers/keyVault.js
// ============================================================
// Local, passphrase-based encryption for AI provider API keys.
// Used by MotionZync's local API-key vault.
//
// HONEST SCOPE — read this before trusting it:
//   - Keys are encrypted at rest (AES-GCM) with a key derived (PBKDF2) from a
//     passphrase the user sets. The passphrase itself is NEVER stored anywhere.
//   - This protects against: reading raw localStorage (devtools/back-ups),
//     browser extensions that read storage but can't run code on this page,
//     casual device/profile access.
//   - This does NOT protect against an active XSS attack running on this page
//     WHILE the vault is unlocked (the decrypted keys live in memory then).
//     No client-only, no-backend scheme can fully solve that — the iframe
//     origin-isolation fix (Step 3) closes the biggest XSS avenue for this app.
//   - Forgetting the passphrase = keys are unrecoverable by design (no backdoor).
//     resetVault() lets the user start over if that happens.
// ============================================================

const SALT_KEY   = 'mz_vault_salt_v1'
const CHECK_KEY  = 'mz_vault_check_v1'
const CHECK_TEXT = 'motionzync-vault-ok'

function b64encode(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function b64decode(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

async function deriveKey(passphrase, saltB64) {
  const salt = b64decode(saltB64)
  const baseKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/** Encrypt plain text with an already-derived CryptoKey. Returns a JSON-safe payload. */
export async function encryptWithKey(plainText, cryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(plainText)
  )
  return { iv: b64encode(iv), data: b64encode(cipher) }
}

/** Decrypt a payload produced by encryptWithKey(). Throws if the key/passphrase is wrong. */
export async function decryptWithKey(payload, cryptoKey) {
  const iv   = b64decode(payload.iv)
  const data = b64decode(payload.data)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data)
  return new TextDecoder().decode(plain)
}

/** Has the user ever set up a vault on this device/browser? */
export function hasVault() {
  return !!localStorage.getItem(SALT_KEY)
}

/** First-time setup: choose a passphrase, get back the derived CryptoKey (keep it in memory only). */
export async function createVault(passphrase) {
  if (!passphrase || passphrase.length < 4) {
    throw new Error('Passphrase must be at least 4 characters')
  }
  const saltB64 = b64encode(crypto.getRandomValues(new Uint8Array(16)))
  localStorage.setItem(SALT_KEY, saltB64)
  const key = await deriveKey(passphrase, saltB64)
  const check = await encryptWithKey(CHECK_TEXT, key)
  localStorage.setItem(CHECK_KEY, JSON.stringify(check))
  return key
}

/** Unlock an existing vault. Throws 'Wrong passphrase' if it doesn't match. */
export async function unlockVault(passphrase) {
  const saltB64 = localStorage.getItem(SALT_KEY)
  if (!saltB64) throw new Error('No vault set up yet')
  const key = await deriveKey(passphrase, saltB64)
  let check
  try { check = JSON.parse(localStorage.getItem(CHECK_KEY) || 'null') } catch { check = null }
  if (!check) throw new Error('Vault data missing — try resetting it')
  try {
    const decoded = await decryptWithKey(check, key)
    if (decoded !== CHECK_TEXT) throw new Error()
  } catch {
    throw new Error('Wrong passphrase')
  }
  return key
}

/** Forgot passphrase / start over. This permanently discards any encrypted keys. */
export function resetVault() {
  localStorage.removeItem(SALT_KEY)
  localStorage.removeItem(CHECK_KEY)
}
