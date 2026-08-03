// src/ai/providers/VaultContext.jsx
// ============================================================
// Shared passphrase vault (Phase 2 refactor).
// Previously this state lived only inside AIProviderContext (Phase 1 / Step 2).
// Pulled out here so GitHubContext (and anything else that needs to store a
// secret) can share the SAME unlock state — one passphrase, not one per feature.
// The actual crypto is still in keyVault.js; this just holds React state +
// the derived key in memory.
// ============================================================
import { createContext, useContext, useState, useRef, useCallback } from 'react'
import {
  hasVault, createVault, unlockVault as unlockVaultKey,
  encryptWithKey, decryptWithKey, resetVault as resetVaultStorage,
} from './keyVault.js'

const VaultContext = createContext(null)
export const useVault = () => useContext(VaultContext)

export function VaultProvider({ children }) {
  const vaultKeyRef = useRef(null) // derived CryptoKey — memory only, never persisted
  const [vaultExists,   setVaultExists]   = useState(() => hasVault())
  const [vaultUnlocked, setVaultUnlocked] = useState(false)

  const setupVault = useCallback(async (passphrase) => {
    const key = await createVault(passphrase)
    vaultKeyRef.current = key
    setVaultExists(true)
    setVaultUnlocked(true)
    return key
  }, [])

  const unlockVault = useCallback(async (passphrase) => {
    const key = await unlockVaultKey(passphrase) // throws 'Wrong passphrase' if invalid
    vaultKeyRef.current = key
    setVaultUnlocked(true)
    return key
  }, [])

  const lockVault = useCallback(() => {
    vaultKeyRef.current = null
    setVaultUnlocked(false)
  }, [])

  const resetVault = useCallback(() => {
    resetVaultStorage()
    vaultKeyRef.current = null
    setVaultExists(false)
    setVaultUnlocked(false)
  }, [])

  const encryptValue = useCallback(async (plainText) => {
    if (!vaultKeyRef.current) throw new Error('Vault is locked')
    return encryptWithKey(plainText, vaultKeyRef.current)
  }, [])

  const decryptValue = useCallback(async (payload) => {
    if (!vaultKeyRef.current) throw new Error('Vault is locked')
    return decryptWithKey(payload, vaultKeyRef.current)
  }, [])

  return (
    <VaultContext.Provider value={{
      vaultExists, vaultUnlocked,
      setupVault, unlockVault, lockVault, resetVault,
      encryptValue, decryptValue,
    }}>
      {children}
    </VaultContext.Provider>
  )
}
