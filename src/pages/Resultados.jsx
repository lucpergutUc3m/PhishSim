import { useState, useEffect } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { getUserResults } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react'

const STATUS_LABELS = {
  'Clicked Link':   'Hizo clic',
  'Submitted Data': 'Datos capturados',
  'Email Reported': 'Reportado',
  'No Clicked':     'No caíste ✓',
}

const STATUS_COLOR = {
  'Clicked Link':   '#ef4444',
  'Submitted Data': '#dc2626',
  'Email Reported': '#22c55e',
  'No Clicked':     '#22c55e',
}

function isExpired(r) {
  if (r.status !== 'Email Sent' && r.status !== 'Email Opened') return false
  if (!r.time) return false
  return (Date.now() - new Date(r.time).getTime()) / 3_600_000 >= 24
}

function resolveStatus(r) {
  if (r.reported) return 'Email Reported'
  if (r.status === 'Clicked Link' || r.status === 'Submitted Data' || r.status === 'Email Reported') return r.status
  if (isExpired(r)) return 'No Clicked'
  return null
}

function score(results = []) {
  let s = 0
  for (const r of results) {
    const st = resolveStatus(r)
    if (st === 'No Clicked')     s = Math.min(100, s + 10)
    if (st === 'Email Reported') s = Math.min(100, s + 20)
    if (st === 'Clicked Link')   s = Math.max(0, s - 30)
    if (st === 'Submitted Data') s = Math.max(0, s - 40)
  }
  return s
}

function radarData(results = []) {
  const count = (key) => results.filter((r) => resolveStatus(r) === key).length
  return [
    { subject: 'Detectados',  A: count('Email Reported') * 10 },
    { subject: 'No cayeron',  A: count('No Clicked') * 10 },
    { subject: 'No datos',    A: 10 - count('Submitted Data') * 5 },
    { subject: 'Sin clic',    A: (count('Email Reported') + count('No Clicked')) * 5 },
    { subject: 'Alerta',      A: count('Email Reported') * 5 },
  ]
}

export default function Resultados() {
  const { user, participantLogin, participantLogout, loading: authLoading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [data, setData] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Carga inicial y en cada refresco (manual o por polling)
  useEffect(() => {
    if (!user?.email) return
    let cancelled = false
    getUserResults(user.email)
      .then(d  => { if (!cancelled) { setData(d); setFetchError(null) } })
      .catch(e => { if (!cancelled) setFetchError(e.message) })
    return () => { cancelled = true }
  }, [user?.email, refreshTrigger])

  // Polling cada 30 s
  useEffect(() => {
    if (!user?.email) return
    const id = setInterval(() => setRefreshTrigger(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [user?.email])

  async function handleLogin(e) {
    e.preventDefault()
    await participantLogin(email, password)
    setPassword('')
  }

  // ── Sin sesión: formulario de login ───────────────────────────────────
  if (!user) {
    return (
      <div className="page-centered">
        <div className="form-card" style={{ maxWidth: 400 }}>
          <div className="form-header">
            <div className="results-login-brand">
              <span className="nav-logo-mark" style={{ width: 36, height: 36, fontSize: '.8rem', borderRadius: 10 }}>PS</span>
              <span className="results-login-brand-name">PhishSim</span>
            </div>
            <h1 style={{ marginTop: '1.25rem' }}>Iniciar sesión</h1>
            <p>Accede con tu cuenta para ver tus resultados.</p>
          </div>
          <form className="form-body" onSubmit={handleLogin}>
            {authError && <div className="alert alert-error">{authError}</div>}
            <div className="field">
              <label>Correo electrónico</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div className="field">
              <label>Contraseña</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPass((s) => !s)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
              {authLoading ? <Loader2 size={16} className="results-spinner-icon" style={{ width: 16, height: 16 }} /> : <LogIn size={16} />}
              {authLoading ? 'Entrando…' : 'Entrar'}
            </button>
            <p className="muted" style={{ textAlign: 'center', fontSize: '.82rem' }}>
              <a href="/forgot-password" style={{ color: 'var(--muted)' }}>¿Olvidaste tu contraseña?</a>
            </p>
            <p className="muted" style={{ textAlign: 'center', fontSize: '.82rem' }}>
              ¿Aún no participas?{' '}
              <a href="/registro" style={{ color: 'var(--accent-light)' }}>Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    )
  }

  // ── Cargando resultados ───────────────────────────────────────────────
  if (!data && !fetchError) {
    return (
      <div className="page-centered">
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} className="results-spinner-icon" />
          <p className="muted" style={{ marginTop: '1.25rem' }}>Cargando tus resultados…</p>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────
  const visible = (data?.results ?? []).filter((r) => resolveStatus(r) !== null)

  const puntuacion = data ? score(visible) : null
  const barData = data
    ? Object.keys(STATUS_LABELS).map((k) => ({
        name: STATUS_LABELS[k],
        value: visible.filter((r) => resolveStatus(r) === k).length,
        fill: STATUS_COLOR[k],
      }))
    : []

  const initial = (user.first_name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email

  return (
    <div className="page results-page">
      <div className="results-user-header">
        <div className="results-user-avatar">{initial}</div>
        <div className="results-user-info">
          <h1>Mi evolución</h1>
          <span className="muted">{name} · {user.email}</span>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setRefreshTrigger(t => t + 1)}
          title="Actualizar resultados"
        >
          <RefreshCw size={13} />
        </button>
        <button className="btn btn-outline btn-sm results-change-btn" onClick={participantLogout}>
          Cerrar sesión
        </button>
      </div>

      {fetchError && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{fetchError}</div>}

      {!fetchError && data && !visible.length && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          Todavía no has interactuado con ninguna campaña.
        </div>
      )}

      {data && (
        <div className="results-grid">
          <div className="result-card score-card">
            <h2>Puntuación de concienciación</h2>
            <div className={`score-circle ${puntuacion >= 70 ? 'good' : puntuacion >= 40 ? 'medium' : 'bad'}`}>
              {puntuacion}
            </div>
            <p className="score-tip">
              {puntuacion >= 70
                ? '¡Excelente! Estás muy alerta ante el phishing.'
                : puntuacion >= 40
                ? 'Bien, pero hay margen de mejora. ¡Sigue practicando!'
                : 'Atención: has caído en varias trampas. Consulta los consejos.'}
            </p>
          </div>

          <div className="result-card">
            <h2>Perfil de respuesta</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData(visible)}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="result-card wide">
            <h2>Historial de campañas</h2>
            {visible.length ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <table className="results-table">
                  <thead>
                    <tr><th>Campaña</th><th>Canal</th><th>Estado</th><th>Fecha</th></tr>
                  </thead>
                  <tbody>
                    {visible.map((r, i) => {
                      const st = resolveStatus(r)
                      return (
                        <tr key={i}>
                          <td>{r.campaign ?? '-'}</td>
                          <td>
                            <span className="status-badge"
                              style={r.type === 'sms'
                                ? { background: '#0ea5e933', color: '#38bdf8' }
                                : { background: '#6366f133', color: '#818cf8' }}>
                              {r.type === 'sms' ? 'SMS' : 'Email'}
                            </span>
                          </td>
                          <td>
                            <span className="status-badge"
                              style={{ background: STATUS_COLOR[st] + '33', color: STATUS_COLOR[st] }}>
                              {STATUS_LABELS[st] ?? st}
                            </span>
                          </td>
                          <td>{r.time ? new Date(r.time).toLocaleDateString('es-ES') : '-'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="muted">Todavía no has recibido ninguna campaña.</p>
            )}
          </div>

          <div className="result-card tips-card">
            <h2>Consejos para ti</h2>
            <ul className="tips-list">
              <li>Verifica siempre el remitente antes de hacer clic.</li>
              <li>Pasa el cursor sobre los enlaces antes de abrirlos.</li>
              <li>Reporta cualquier correo sospechoso a tu equipo de seguridad.</li>
              <li>No introduzcas credenciales en páginas que lleguen por email.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
