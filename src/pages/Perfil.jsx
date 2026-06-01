import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateParticipant, deleteParticipant as apiDeleteParticipant } from '../api/client'
import { Save, Trash2, LogOut, ArrowLeft, CheckCircle } from 'lucide-react'

function splitName(nombre) {
  const parts = nombre.trim().split(/\s+/)
  return {
    first_name: parts[0] ?? '',
    last_name: parts.slice(1).join(' ') || '-',
  }
}

export default function Perfil() {
  const { user, participantLogout, refreshParticipant } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/resultados')
  }, [user, navigate])

  const [form, setForm] = useState({
    nombre: [user?.first_name, user?.last_name].filter(Boolean).join(' '),
    email: user?.email ?? '',
    cargo: user?.position ?? '',
    telefono: user?.telefono ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setSaveOk(false)
    setSaveError(null)
  }

  function validate() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email no válido'
    return e
  }

  async function handleSave(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true); setSaveError(null); setSaveOk(false)
    const { first_name, last_name } = splitName(form.nombre)
    try {
      await updateParticipant({ first_name, last_name, email: form.email, position: form.cargo || undefined, telefono: form.telefono || undefined })
      await refreshParticipant()
      setSaveOk(true)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true); setDeleteError(null)
    try {
      await apiDeleteParticipant()
      await participantLogout()
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  if (!user) return null

  return (
    <div className="page-centered">
      <div className="form-card" style={{ maxWidth: 500 }}>
        <div className="form-header">
          <Link to="/resultados" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginBottom: '.75rem' }}>
            <ArrowLeft size={14} /> Volver
          </Link>
          <h1>Mi perfil</h1>
          <p>Actualiza tus datos personales.</p>
        </div>

        <form className="form-body" onSubmit={handleSave}>
          <div className="field">
            <label>Nombre completo *</label>
            <input
              type="text"
              placeholder="Ana García"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="field">
            <label>Correo electrónico *</label>
            <input
              type="email"
              placeholder="ana@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Cargo / Ocupación</label>
            <input
              type="text"
              placeholder="Estudiante, Ingeniero, Jubilado…"
              value={form.cargo}
              onChange={(e) => set('cargo', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input
              type="tel"
              placeholder="+34 600 000 000"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
            />
          </div>

          {saveOk && (
            <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <CheckCircle size={15} /> Perfil actualizado correctamente.
            </div>
          )}
          {saveError && <div className="alert alert-error">{saveError}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            <Save size={15} /> {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>

        <div className="danger-zone">
          <h3>Sesión y cuenta</h3>
          <button
            type="button"
            className="btn btn-outline btn-full"
            onClick={async () => { await participantLogout(); navigate('/') }}
          >
            <LogOut size={15} /> Cerrar sesión
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              className="btn btn-danger btn-full"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={15} /> Darme de baja
            </button>
          ) : (
            <div className="delete-confirm">
              <p style={{ color: '#fca5a5', fontSize: '.9rem', marginBottom: '1rem' }}>
                Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.
              </p>
              {deleteError && <div className="alert alert-error" style={{ marginBottom: '.75rem' }}>{deleteError}</div>}
              <div className="btn-row">
                <button type="button" className="btn btn-outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                  <Trash2 size={14} /> {deleting ? 'Eliminando…' : 'Confirmar baja'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
