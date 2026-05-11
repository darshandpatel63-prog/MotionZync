import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

