import { useState, useEffect, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getGroups, getAllUsers, getCampaigns } from '../api/client'

const GROUP_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

const MAX_ATTEMPTS = 5
const COOLDOWNS = [10, 30, 60] // segundos de espera tras 1er, 2º, 3er bloqueo

function LoginForm() {
  const { login, loading } = useAuth()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const [formError, setFormError] = useState(null)

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function submit(e) {
    e.preventDefault()
    if (cooldown > 0) return
    setFormError(null)
    const ok = await login(user, pass)
    if (!ok) {
      const next = attempts + 1
      setAttempts(next)
      if (next >= MAX_ATTEMPTS) {
        const wait = COOLDOWNS[Math.min(Math.floor(next / MAX_ATTEMPTS) - 1, COOLDOWNS.length - 1)]
        setCooldown(wait)
        setFormError(`Demasiados intentos. Espera ${wait} segundos.`)
      } else {
        setFormError(`Credenciales incorrectas. Intento ${next} de ${MAX_ATTEMPTS}.`)
      }
      setPass('')
    }
  }

  const blocked = cooldown > 0
  const btnLabel = loading ? 'Entrando…' : blocked ? `Bloqueado (${cooldown}s)` : 'Entrar'

  return (
    <div className="page-centered">
      <div className="form-card">
        <div className="form-header">
          <h1>Panel de administración</h1>
          <p className="muted">Acceso restringido</p>
        </div>
        <form className="form-body" onSubmit={submit}>
          <div className="field">
            <label>Usuario</label>
            <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" required disabled={blocked} />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" required disabled={blocked} />
          </div>
          {formError && <div className="alert alert-error">{formError}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading || blocked}>
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-value">{value ?? '—'}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  )
}

function GroupsPanel({ groups }) {
  const barData = (groups ?? []).map((g) => ({ name: g.name.replace('Grupo ', ''), value: g.count }))
  return (
    <div className="admin-card">
      <h2>Grupos de edad</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {barData.map((_, i) => <Cell key={i} fill={GROUP_COLORS[i % GROUP_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <table className="results-table" style={{ marginTop: '1rem' }}>
        <thead><tr><th>Grupo</th><th>Targets</th></tr></thead>
        <tbody>
          {(groups ?? []).map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td><strong>{g.count}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampaignsPanel({ campaigns }) {
  const STATUS_COLOR = {
    Completed: '#22c55e',
    'In Progress': '#6366f1',
    'In progress': '#6366f1',
    Created: '#f59e0b',
    Paused: '#94a3b8',
  }

  const pieData = Object.entries(
    (campaigns ?? []).reduce((acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <div className="admin-card wide">
      <h2>Campañas</h2>
      {pieData.length > 0 && (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLOR[entry.name] ?? GROUP_COLORS[i % GROUP_COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
      <table className="results-table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Campaña</th>
            <th>Estado</th>
            <th>Grupos</th>
            <th>Plantilla</th>
            <th>Lanzamiento</th>
          </tr>
        </thead>
        <tbody>
          {(campaigns ?? []).map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <span
                  className="status-badge"
                  style={{
                    background: (STATUS_COLOR[c.status] ?? '#6366f1') + '33',
                    color: STATUS_COLOR[c.status] ?? '#6366f1',
                  }}
                >
                  {c.status}
                </span>
              </td>
              <td>{(c.groups ?? []).join(', ') || '—'}</td>
              <td>{c.template ?? '—'}</td>
              <td>
                {c.launch_date ? new Date(c.launch_date).toLocaleDateString('es-ES') : '—'}
              </td>
            </tr>
          ))}
          {!campaigns?.length && (
            <tr><td colSpan={5} className="muted" style={{ textAlign: 'center' }}>Sin campañas</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function UsersPanel({ users }) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = (users ?? []).filter(
    (u) =>
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.gophish_group_name?.toLowerCase().includes(q)
  )

  return (
    <div className="admin-card wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Participantes registrados</h2>
        <input
          placeholder="Buscar por nombre, email o grupo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>
      <table className="results-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Edad</th>
            <th>Grupo edad</th>
            <th>Grupo GoPhish</th>
            <th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u, i) => (
            <tr key={i}>
              <td>{u.first_name} {u.last_name ?? ''}</td>
              <td>{u.email}</td>
              <td>{u.edad ?? '—'}</td>
              <td>{u.age_group ?? '—'}</td>
              <td>{u.gophish_group_name ?? '—'}</td>
              <td>{u.registered_at ? new Date(u.registered_at).toLocaleDateString('es-ES') : '—'}</td>
            </tr>
          ))}
          {!filtered.length && (
            <tr><td colSpan={6} className="muted" style={{ textAlign: 'center' }}>Sin resultados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState('overview')
  const [groups, setGroups] = useState(null)
  const [campaigns, setCampaigns] = useState(null)
  const [users, setUsers] = useState(null)
  const [loadErr, setLoadErr] = useState(null)

  const loadData = useCallback(async () => {
    setLoadErr(null)
    try {
      const [g, c, u] = await Promise.all([
        getGroups().catch(() => ({ groups: [] })),
        getCampaigns().catch(() => []),
        getAllUsers().catch(() => []),
      ])
      setGroups(g.groups ?? g)
      setCampaigns(Array.isArray(c) ? c : c.campaigns ?? [])
      setUsers(Array.isArray(u) ? u : u.users ?? [])
    } catch (e) {
      setLoadErr(e.message)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAdmin) loadData()
  }, [isAdmin, loadData])

  if (!isAdmin) return <LoginForm />

  const totalUsers = (groups ?? []).reduce((s, g) => s + g.count, 0)
  const totalCampaigns = campaigns?.length ?? 0
  const activeCampaigns = (campaigns ?? []).filter((c) =>
    c.status === 'In Progress' || c.status === 'In progress'
  ).length

  const TABS = [
    { id: 'overview', label: 'Resumen' },
    { id: 'campaigns', label: 'Campañas' },
    { id: 'users', label: 'Participantes' },
  ]

  return (
    <div className="page admin-page">
      <div className="admin-topbar">
        <h1>Panel de administración</h1>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <button className="tab-btn refresh" onClick={loadData} title="Actualizar">↻</button>
      </div>

      {loadErr && <div className="alert alert-error">{loadErr}</div>}

      {tab === 'overview' && (
        <>
          <div className="stats-row">
            <StatCard label="Participantes" value={totalUsers} />
            <StatCard label="Campañas" value={totalCampaigns} />
            <StatCard label="En curso" value={activeCampaigns} />
            <StatCard label="Grupos activos" value={groups?.length ?? '—'} />
          </div>
          <div className="admin-grid">
            <GroupsPanel groups={groups} />
          </div>
        </>
      )}

      {tab === 'campaigns' && <div className="admin-grid"><CampaignsPanel campaigns={campaigns} /></div>}

      {tab === 'users' && <div className="admin-grid"><UsersPanel users={users} /></div>}
    </div>
  )
}
