import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { resetPassword } from '../api/client'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  if (!token) {
    return (
      <div className="page-centered">
        <div className="form-card" style={{ maxWidth: 420 }}>
          <div className="form-header" style={{ paddingBottom: '2rem' }}>
            <h1>Enlace no válido</h1>
            <p>Este enlace de restablecimiento no es válido o ha caducado.</p>
          </div>
          <div style={{ padding: '0 2rem 2rem' }}>
            <Link to="/forgot-password" className="btn btn-primary btn-full">Solicitar nuevo enlace</Link>
          </div>
        </div>
      </div>
    )
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
            <h1 style={{ textAlign: 'center' }}>Contraseña actualizada</h1>
            <p style={{ textAlign: 'center', marginTop: '.5rem' }}>
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
          <div style={{ padding: '0 2rem 2rem' }}>
            <Link to="/resultados" className="btn btn-primary btn-full">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true); setError(null)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-centered">
      <div className="form-card" style={{ maxWidth: 420 }}>
        <div className="form-header">
          <h1>Nueva contraseña</h1>
          <p>Elige una contraseña segura de al menos 8 caracteres.</p>
        </div>
        <form className="form-body" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nueva contraseña</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                required
                autoFocus
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPass((s) => !s)} tabIndex={-1}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="field">
            <label>Confirmar contraseña</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(null) }}
                style={{ paddingLeft: '2.4rem' }}
                required
              />
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Guardando…' : 'Establecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
