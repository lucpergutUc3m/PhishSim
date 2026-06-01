import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, logout as apiLogout, checkSession } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin]   = useState(false)
  const [username, setUsername] = useState(null)
  const [ready, setReady]       = useState(false)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  // Al montar, verifica si hay cookie válida y obtiene el usuario
  useEffect(() => {
    checkSession()
      .then((data) => {
        setIsAdmin(true)
        setUsername(data.username ?? data.user ?? null)
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setReady(true))
  }, [])

  const login = useCallback(async (user, password) => {
    setLoading(true)
    setError(null)
    try {
      await apiLogin(user, password)
      // Cookie ya puesta por el backend; pedimos los datos del usuario
      const me = await checkSession()
      setIsAdmin(true)
      setUsername(me.username ?? me.user ?? user)
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch (_) {
      // aunque falle, limpiamos el estado local
    }
    setIsAdmin(false)
    setUsername(null)
  }, [])

  if (!ready) return null

  return (
    <AuthContext.Provider value={{ isAdmin, username, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
