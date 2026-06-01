import { useState, useEffect } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import { getUserResults } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react'

const STATUS_LABELS = {
  'Email Sent': 'Enviado',
  'Email Opened': 'Abierto',
  'Clicked Link': 'Hizo clic',
  'Submitted Data': 'Datos capturados',
  'Email Reported': 'Reportado',
}

const STATUS_COLOR = {
  'Email Sent': '#6b7280',
  'Email Opened': '#f59e0b',
  'Clicked Link': '#ef4444',
  'Submitted Data': '#dc2626',
  'Email Reported': '#22c55e',
}

function score(results = []) {
  let s = 100
  for (const r of results) {
    if (r.status === 'Clicked Link') s -= 30
    if (r.status === 'Submitted Data') s -= 40
    if (r.status === 'Email Reported') s += 20
  }
  return Math.max(0, Math.min(100, s))
}

function radarData(results = []) {
  const count = (key) => results.filter((r) => r.status === key).length
  return [
    { subject: 'Detectados', A: count('Email Reported') * 10 },
    { subject: 'Sin clic', A: results.filter((r) => r.status === 'Email Sent' || r.status === 'Email Opened').length * 10 },
    { subject: 'Apertura', A: 10 - count('Email Opened') * 2 },
    { subject: 'No datos', A: 10 - count('Submitted Data') * 5 },
    { subject: 'Alerta', A: count('Email Reported') * 5 },
  ]
}

export default function Resultados() {
  const { user, participantLogin, participantLogout, loading: authLoading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  // Si hay sesión activa, carga los resultados automáticamente
  useEffect(() => {
    if (!user) return
    if (!user.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetchError('DEBUG campos recibidos: ' + JSON.stringify(Object.keys(user)))
      return
    }
    setFetching(true)
    getUserResults(user.email)
      .then(setData)
      .catch((e) => setFetchError(e.message))
      .finally(() => setFetching(false))
  }, [user])

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
              ¿Aún no participas?{' '}
              <a href="/registro" style={{ color: 'var(--accent-light)' }}>Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    )
  }

  // ── Cargando resultados ───────────────────────────────────────────────
  if (fetching) {
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
  const puntuacion = data ? score(data.results) : null
  const barData = data
    ? Object.keys(STATUS_LABELS).map((k) => ({
        name: STATUS_LABELS[k],
        value: (data.results ?? []).filter((r) => r.status === k).length,
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
        <button className="btn btn-outline btn-sm results-change-btn" onClick={participantLogout}>
          <RefreshCw size={13} /> Cerrar sesión
        </button>
      </div>

      {fetchError && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{fetchError}</div>}

      {!fetchError && !data?.results?.length && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          Todavía no tienes campañas registradas.
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
              <RadarChart data={radarData(data.results)}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="result-card wide">
            <h2>Historial de campañas</h2>
            {data.results?.length ? (
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
                    {data.results.map((r, i) => (
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
                            style={{ background: STATUS_COLOR[r.status] + '33', color: STATUS_COLOR[r.status] }}>
                            {STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </td>
                        <td>{r.time ? new Date(r.time).toLocaleDateString('es-ES') : '-'}</td>
                      </tr>
                    ))}
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
