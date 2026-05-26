import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Equivalente al guard.js original.
 * - Si no hay sesión → redirige a /
 * - Si hay sesión pero el rol no coincide → redirige al panel correcto
 */
export default function PrivateRoute({ children, rol }) {
  const { isAuthenticated, session } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (rol && session.rol !== rol) {
    const destino = session.rol === 'tecnico' ? '/tecnico' : '/cliente'
    return <Navigate to={destino} replace />
  }

  return children
}
