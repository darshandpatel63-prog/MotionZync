// src/pages/CodeSpace/GitHubContext.jsx
// ============================================================
// Phase 2 / Step 1 — Real GitHub connect (OAuth).
// Scope of this step: connect/disconnect + show the connected account.
// Pushing files to a repo is a separate, later step (see CODESPACE_MASTER_PROMPT.md).
//
// The user connects THEIR OWN GitHub account. We never see or store their
// repos — only an access token, encrypted at rest via the same vault used
// for AI provider keys (VaultContext.jsx / keyVault.js).
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useVault } from '../../ai/providers/VaultContext.jsx'

const STORAGE_KEY = 'mz_github_token_enc_v1'
const STATE_KEY   = 'mz_github_oauth_state' // sessionStorage — CSRF check for the OAuth redirect

const GitHubContext = createContext(null)
export const useGitHub = () => useContext(GitHubContext)

export function GitHubProvider({ children }) {
  const { vaultUnlocked, vaultExists, encryptValue, decryptValue } = useVault()

  const [tokenEnc, setTokenEnc] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null }
    catch { return null }
  })
  const [token, setToken]           = useState(null) // decrypted, memory-only
  const [user, setUser]             = useState(null) // { login, avatar_url, name, ... }
  const [connecting, setConnecting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    if (tokenEnc) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenEnc))
    else localStorage.removeItem(STORAGE_KEY)
  }, [tokenEnc])

  // Vault reset elsewhere (passphrase forgotten) → this ciphertext is dead too
  useEffect(() => {
    if (!vaultExists) { setTokenEnc(null); setToken(null); setUser(null) }
  }, [vaultExists])

  // Decrypt the stored token once the vault is unlocked
  useEffect(() => {
    if (!vaultUnlocked || !tokenEnc || token) return
    decryptValue(tokenEnc).then(setToken).catch(() => {})
  }, [vaultUnlocked, tokenEnc, token, decryptValue])

  // Once we have a live token, fetch the connected user's profile
  useEffect(() => {
    if (!token || user) return
    fetch('https://api.github.com/user', { headers: { Authorization: `token ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Invalid or revoked token'))))
      .then(setUser)
      .catch(() => { setToken(null); setTokenEnc(null) })
  }, [token, user])

  const connect = useCallback(() => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    if (!clientId) {
      setError('VITE_GITHUB_CLIENT_ID is not set — see install notes')
      return
    }
    const state = crypto.randomUUID()
    sessionStorage.setItem(STATE_KEY, state)
    const redirectUri = `${window.location.origin}/codespace`
    const authUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=repo` +
      `&state=${state}`
    window.location.href = authUrl
  }, [])

  const disconnect = useCallback(() => {
    setToken(null)
    setTokenEnc(null)
    setUser(null)
  }, [])

  // Call once on mount from wherever hosts the OAuth redirect (CodeSpace.jsx)
  const handleCallback = useCallback(async (code, state) => {
    setConnecting(true)
    setError('')
    try {
      const expected = sessionStorage.getItem(STATE_KEY)
      sessionStorage.removeItem(STATE_KEY)
      if (!state || state !== expected) {
        throw new Error('State mismatch — possible CSRF, connection aborted')
      }

      const res = await fetch('/api/github-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Token exchange failed')

      setToken(data.access_token)
      if (vaultUnlocked) {
        const enc = await encryptValue(data.access_token)
        setTokenEnc(enc)
      }
      // If the vault isn't unlocked yet, the token stays memory-only for this
      // session (won't survive a reload) — set up/unlock the vault in AI
      // Settings first if you want the GitHub connection to persist too.
    } catch (e) {
      setError(e.message || 'Connect failed')
    } finally {
      setConnecting(false)
    }
  }, [vaultUnlocked, encryptValue])

  // Phase 3 — authenticated GitHub API calls for other components (push,
  // repo list/create) without ever exposing the raw token to them.
  const authFetch = useCallback((path, opts = {}) => {
    if (!token) return Promise.reject(new Error('Not connected to GitHub'))
    const url = path.startsWith('http') ? path : `https://api.github.com${path}`
    return fetch(url, {
      ...opts,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
        ...(opts.headers || {}),
      },
    })
  }, [token])

  return (
    <GitHubContext.Provider value={{
      user, connected: !!token, connecting, error,
      connect, disconnect, handleCallback, authFetch,
      tokenPersisted: !!tokenEnc,
    }}>
      {children}
    </GitHubContext.Provider>
  )
}
