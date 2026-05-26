import { createContext, useContext, useState, useCallback } from 'react'
import { TOKEN_KEY, SESSION_KEY, saveToStorage, getFromStorage, removeFromStorage } from '../services/storage'
import * as api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getFromStorage(SESSION_KEY))
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = !!(token && session)

  const login = useCallback(async (documento, password) => {
    const data = await api.login(documento, password)

    const tok = data.datos.token
    const usr = data.datos.usuario

    const sessionData = {
      id_usuario: usr.id_usuario,
      nombre:     usr.nombre,
      apellido:   usr.apellido,
      documento:  usr.documento,
      correo:     usr.correo,
      rol:        usr.rol,
      id_tecnico: usr.rol === 'tecnico' ? usr.id_perfil : null,
      id_cliente: usr.rol === 'cliente' ? usr.id_perfil : null,
      loginTime:  new Date().toISOString(),
    }

    localStorage.setItem(TOKEN_KEY, tok)
    saveToStorage(SESSION_KEY, sessionData)

    setToken(tok)
    setSession(sessionData)

    return sessionData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    removeFromStorage(SESSION_KEY)
    setToken(null)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ session, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
