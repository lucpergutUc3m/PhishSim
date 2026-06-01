import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPassword } from '../api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await forgotPassword(email)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="page-centered">
        <div className="form-card" style={{ maxWidth: 420 }}>
          <div className="form-header" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(34,197,94,.12)', border: '2px solid rgba(34,197,94,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86efac',
              }}>
                <CheckCircle size={28} />
              </div>
            </div>
            <h1 style={{ textAlign: 'center' }}>Revisa tu correo</h1>
            <p style={{ textAlign: 'center', marginTop: '.5rem' }}>
              Si <strong style={{ color: 'var(--text)' }}>{email}</strong> está registrado,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
          </div>
          <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            <Link to="/resultados" className="btn btn-primary btn-full">Volver al inicio de sesión</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-centered">
      <div className="form-card" style={{ maxWidth: 420 }}>
        <div className="form-header">
          <Link to="/resultados" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginBottom: '.75rem' }}>
            <ArrowLeft size={14} /> Volver
          </Link>
          <h1>Restablecer contraseña</h1>
          <p>Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
        </div>
        <form className="form-body" onSubmit={handleSubmit}>
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
                required
                autoFocus
              />
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>
      </div>
    </div>
  )
}
