// src/components/AuthGuard/AuthGuard.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './AuthGuard.css'

export default function AuthGuard({ children, fallback }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="ag-loading">
        <div className="ag-spinner"/>
        <span>Checking session...</span>
      </div>
    )
  }

  if (!user) {
    return fallback || <AuthRequired />
  }

  return children
}

function AuthRequired() {
  return (
    <div className="ag-wall">
      <div className="ag-card">
        <div className="ag-icon">🔒</div>
        <h2 className="ag-title">Sign In Required</h2>
        <p className="ag-desc">
          Create a free account to access AI Studio and 3D Animation features.
          All other features work without an account.
        </p>
        <Navigate to="/" replace/>
      </div>
    </div>
  )
}

