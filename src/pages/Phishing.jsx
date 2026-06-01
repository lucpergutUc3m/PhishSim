import { Link } from 'react-router-dom'
import { ShieldAlert, Mail, MousePointerClick, Eye, Flag, LogIn, AlertTriangle } from 'lucide-react'

const TIPS = [
  {
    icon: <Mail size={22} />,
    title: 'Verifica el remitente',
    text: 'Comprueba la dirección real del email, no solo el nombre. Los atacantes falsifican nombres pero no el dominio.',
  },
  {
    icon: <MousePointerClick size={22} />,
    title: 'No hagas clic sin revisar',
    text: 'Pasa el cursor sobre los enlaces antes de pulsar. La URL real aparece en la barra de estado del navegador.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Examina la URL',
    text: 'Los sitios de phishing imitan dominios legítimos (paypa1.com, arnazon.com). Confirma cada letra antes de introducir datos.',
  },
  {
    icon: <Flag size={22} />,
    title: 'Reporta lo sospechoso',
    text: 'Si recibes algo inusual, repórtalo de inmediato. Alertar a tiempo puede evitar que otros caigan en la misma trampa.',
  },
]

export default function Phishing() {
  return (
    <div className="phish-page">

      {/* ── Hero ── */}
      <section className="phish-hero">
        <div className="phish-hero-icon">
          <ShieldAlert size={52} />
        </div>
        <h1 className="phish-hero-title">¡Has caído en una<br />simulación de phishing!</h1>
        <p className="phish-hero-sub">
          Esto era una prueba controlada. No se han comprometido datos reales,
          pero tu acción ha quedado registrada para el estudio de concienciación.
        </p>
      </section>

      {/* ── Qué pasó ── */}
      <section className="phish-what">
        <div className="phish-what-inner">
          <div className="phish-what-item">
            <span className="phish-step">1</span>
            <p>Recibiste un email o SMS de simulación diseñado para parecer legítimo</p>
          </div>
          <div className="phish-what-sep" />
          <div className="phish-what-item">
            <span className="phish-step">2</span>
            <p>Hiciste clic en un enlace o introdujiste datos en la página falsa</p>
          </div>
          <div className="phish-what-sep" />
          <div className="phish-what-item">
            <span className="phish-step">3</span>
            <p>Tu respuesta ha sido registrada para ayudarte a mejorar tu nivel de alerta</p>
          </div>
        </div>
      </section>

      {/* ── Consejos ── */}
      <section className="phish-tips-section">
        <div className="phish-tips-inner">
          <div className="phish-section-header">
            <AlertTriangle size={20} />
            <h2>Cómo detectar el phishing</h2>
          </div>
          <div className="phish-tips-grid">
            {TIPS.map((t) => (
              <div key={t.title} className="phish-tip-card">
                <div className="phish-tip-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="phish-cta">
        <div className="phish-cta-inner">
          <h2>¿Quieres ver tu evolución?</h2>
          <p>Inicia sesión para consultar tu historial de campañas y seguir mejorando tu nivel de alerta ante el phishing.</p>
          <Link to="/resultados" className="btn btn-primary btn-lg">
            <LogIn size={18} /> Ver mis resultados
          </Link>
        </div>
      </section>

    </div>
  )
}
