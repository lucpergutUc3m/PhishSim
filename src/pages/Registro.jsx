import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/client'



const STEPS = ['Datos personales', 'Confirmación']

const INITIAL = {
  nombre: '',
  email: '',
  edad: '',
  cargo: '',
  telefono: '',
  acepta: false,
}

function splitName(nombre) {
  const parts = nombre.trim().split(/\s+/)
  const first_name = parts[0] ?? ''
  const last_name = parts.slice(1).join(' ') || '-'
  return { first_name, last_name }
}

function ageGroup(edad) {
  if (edad <= 24) return '18-24'
  if (edad <= 35) return '25-35'
  if (edad <= 50) return '36-50'
  if (edad <= 60) return '51-60'
  return '60+'
}

export default function Registro() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [apiError, setApiError] = useState(null)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email no válido'
    const edad = Number(form.edad)
    if (!form.edad || edad < 18 || edad > 110) e.edad = 'Debe ser entre 18 y 110'
    if (!form.acepta) e.acepta = 'Debes aceptar para continuar'
    return e
  }

  function nextStep() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(1)
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setApiError(null)
    const { first_name, last_name } = splitName(form.nombre)
    try {
      const res = await registerUser({
        first_name,
        last_name,
        email: form.email,
        edad: Number(form.edad),
        position: form.cargo || undefined,
        telefono: form.telefono || undefined,
      })
      setApiResponse(res)
      setDone(true)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="page-centered">
        <div className="success-card">
          <div className="success-icon">+</div>
          <h2>¡Registro completado!</h2>
          <p>
            Hola <strong>{form.nombre.split(' ')[0]}</strong>, te hemos añadido al
            grupo <strong>{apiResponse?.group_name ?? apiResponse?.age_group}</strong>. Recibirás el reto en{' '}
            <strong>{form.email}</strong>.
          </p>
          <Link to="/resultados" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Ver mis resultados más adelante →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-centered">
      <div className="form-card">
        <div className="form-header">
          <h1>Únete a la simulación</h1>
          <div className="stepper">
            {STEPS.map((s, i) => (
              <span key={s} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                {i < step ? 'v' : i + 1}
              </span>
            ))}
          </div>
        </div>

        {step === 0 && (
          <form className="form-body" onSubmit={(e) => { e.preventDefault(); nextStep() }}>
            <Field
              label="Nombre completo *"
              placeholder="Ana García"
              value={form.nombre}
              onChange={(v) => set('nombre', v)}
              error={errors.nombre}
            />
            <Field
              label="Correo electrónico *"
              type="email"
              placeholder="ana@example.com"
              value={form.email}
              onChange={(v) => set('email', v)}
              error={errors.email}
            />
            <Field
              label="Edad *"
              type="number"
              placeholder="25"
              min={18}
              max={110}
              value={form.edad}
              onChange={(v) => set('edad', v)}
              error={errors.edad}
            />
            <Field
              label="Cargo / Ocupación"
              placeholder="Estudiante, Ingeniero, Jubilado…"
              value={form.cargo}
              onChange={(v) => set('cargo', v)}
            />
            <Field
              label="Teléfono (opcional)"
              type="tel"
              placeholder="+34 600 000 000"
              value={form.telefono}
              onChange={(v) => set('telefono', v)}
            />
            <label className={`checkbox-row ${errors.acepta ? 'error' : ''}`}>
              <input
                type="checkbox"
                checked={form.acepta}
                onChange={(e) => set('acepta', e.target.checked)}
              />
              <span>
                He leído y acepto los{' '}
                <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                  términos y condiciones
                </Link>
                , incluyendo el tratamiento de mis datos personales con fines
                de investigación académica y la realización de simulaciones de
                phishing sobre mi correo y/o teléfono.
              </span>
            </label>
            {errors.acepta && <span className="field-error">{errors.acepta}</span>}
            <button type="submit" className="btn btn-primary btn-full">
              Continuar →
            </button>
          </form>
        )}

        {step === 1 && (
          <form className="form-body" onSubmit={submit}>
            <div className="confirm-block">
              <h3>Confirma tus datos</h3>
              <dl className="confirm-list">
                <dt>Nombre</dt><dd>{form.nombre}</dd>
                <dt>Email</dt><dd>{form.email}</dd>
                <dt>Edad</dt><dd>{form.edad} años → grupo <strong>{ageGroup(Number(form.edad))}</strong></dd>
                {form.cargo && <><dt>Cargo</dt><dd>{form.cargo}</dd></>}
                {form.telefono && <><dt>Teléfono</dt><dd>{form.telefono}</dd></>}
              </dl>
            </div>
            {apiError && <div className="alert alert-error">{apiError}</div>}
            <div className="btn-row">
              <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>
                ← Editar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registrando…' : 'Confirmar registro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, type = 'text', placeholder, value, onChange, error, min, max }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
