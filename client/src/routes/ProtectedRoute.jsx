import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContextValue'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, token } = useContext(AuthContext)

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
