import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  login as apiLogin, logout as apiLogout, checkSession,
  participantLogin as apiParticipantLogin, participantLogout as apiParticipantLogout,
  checkParticipantSession,
} from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin]   = useState(false)
  const [username, setUsername] = useState(null)
  const [user, setUser]         = useState(null)   // participante logueado
  const [ready, setReady]       = useState(false)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    Promise.all([
      checkSession()
        .then((d) => { setIsAdmin(true); setUsername(d.username ?? d.user ?? null) })
        .catch(() => {}),
      checkParticipantSession()
        .then((d) => setUser(d))
        .catch(() => {}),
    ]).finally(() => setReady(true))
  }, [])

  // ── Admin ──────────────────────────────────────────────────────────────
  const login = useCallback(async (user, password) => {
    setLoading(true); setError(null)
    try {
      await apiLogin(user, password)
      const me = await checkSession()
      setIsAdmin(true)
      setUsername(me.username ?? me.user ?? user)
      return true
    } catch (e) {
      setError(e.message); return false
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    try { await apiLogout() } catch { /* ignore logout error */ }
    setIsAdmin(false); setUsername(null)
  }, [])

  // ── Participante ───────────────────────────────────────────────────────
  const participantLogin = useCallback(async (email, password) => {
    setLoading(true); setError(null)
    try {
      await apiParticipantLogin(email, password)
      const me = await checkParticipantSession()
      setUser(me)
      return true
    } catch (e) {
      setError(e.message); return false
    } finally { setLoading(false) }
  }, [])

  const participantLogout = useCallback(async () => {
    try { await apiParticipantLogout() } catch { /* ignore logout error */ }
    setUser(null)
  }, [])

  if (!ready) return null

  return (
    <AuthContext.Provider value={{
      isAdmin, username, login, logout, error, loading,
      user, participantLogin, participantLogout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
