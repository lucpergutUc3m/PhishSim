const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000) // 15 s máximo

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(err.detail ?? 'Error del servidor')
    }
    return res.json()
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('La petición tardó demasiado. Inténtalo de nuevo.', { cause: e })
    throw e
  } finally {
    clearTimeout(timer)
  }
}

// Auth
export const login = (username, password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const checkSession = () => request('/api/auth/me')

export const logout = () =>
  request('/api/auth/logout', { method: 'POST' })

// Auth participantes
export const participantLogin = (email, password) =>
  request('/api/auth/participant/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const checkParticipantSession = () => request('/api/auth/participant/me')

export const participantLogout = () =>
  request('/api/auth/participant/logout', { method: 'POST' })

export const updateParticipant = (data) =>
  request('/api/auth/participant/profile', { method: 'PUT', body: JSON.stringify(data) })

export const deleteParticipant = () =>
  request('/api/auth/participant/delete', { method: 'DELETE' })

export const forgotPassword = (email) =>
  request('/api/auth/participant/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })

export const resetPassword = (token, password) =>
  request('/api/auth/participant/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) })

// Public registration — backend handles the full GoPhish flow
export const registerUser = (data) =>
  request('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// User results — POST para que el email no aparezca en logs/URL
export const getUserResults = (email) =>
  request('/api/user/results', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

export const reportCampaign = ({ email, brand }) =>
  request('/api/user/report', { method: 'POST', body: JSON.stringify({ email, brand }) })

// Admin — groups
export const getGroups = () => request('/api/gophish/groups')
export const updateGroup = (id, targets, phones) =>
  request(`/api/gophish/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ targets, phones }),
  })
export const createGroup = (name, targets) =>
  request('/api/gophish/groups', {
    method: 'POST',
    body: JSON.stringify({ name, targets }),
  })

// Admin — classify
export const classifyUsers = (users) =>
  request('/api/classify-users', {
    method: 'POST',
    body: JSON.stringify({ users }),
  })

// Admin — campaigns summary
export const getCampaigns = () => request('/api/gophish/campaigns')

// Admin — all registered users
export const getAllUsers = () => request('/api/users')
