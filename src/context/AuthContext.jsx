import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const ciAdminEmail = import.meta.env.MODE === 'ci' ? import.meta.env.VITE_CI_ADMIN_EMAIL : ''
  const ciUser = ciAdminEmail ? {
    email: ciAdminEmail,
    displayName: 'CI Admin',
    photoURL: '',
    getIdToken: async () => 'ci-browser-test-token',
  } : null
  const [user, setUser] = useState(ciUser)
  const [loading, setLoading] = useState(!!ciUser ? false : true)

  useEffect(() => {
    if (ciUser) return undefined
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u); setLoading(false)
    })
    return unsub
  }, [])

  const login  = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  // VITE_ADMIN_EMAIL env variable ma tamaro Gmail nakho
  const isAdmin = !!user && user.email === import.meta.env.VITE_ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

