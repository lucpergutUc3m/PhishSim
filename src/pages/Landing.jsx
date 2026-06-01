import { Link } from 'react-router-dom'
import { UserPlus, ClipboardList, Mail, BarChart2, LucideEye } from 'lucide-react'

const steps = [
  { icon: ClipboardList, title: 'Regístrate', desc: 'Rellena el formulario con tus datos y únete a la simulación.' },
  { icon: Mail,          title: 'Recibe el reto', desc: 'Te llegará un correo simulado de phishing. ¿Sabrás detectarlo?' },
  { icon: BarChart2,     title: 'Consulta tu evolución', desc: 'Entra con tu email y ve cómo has respondido a cada campaña.' },
]

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero-section">
        <h1>
          ¿Reconocerías un <span className="accent">phishing</span>?
        </h1>
        <p className="hero-sub">
          Participa en nuestra campaña de concienciación. Aprende a detectar
          correos maliciosos de forma segura y lúdica.
        </p>
        <div className="hero-ctas">
          <Link to="/registro" className="btn btn-primary btn-lg">
            <UserPlus size={18} />
            Quiero participar
          </Link>
          <Link to="/resultados" className="btn btn-outline btn-lg">
            <LucideEye size={18} />
            Ver mis resultados
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.title} className="step-card">
              <div className="step-num">
                <s.icon size={20} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-bottom">
        <h2>Es gratis, es anónimo, es formativo.</h2>
        <Link to="/registro" className="btn btn-primary btn-lg">
          <UserPlus size={18} />
          Empezar ahora
        </Link>
      </section>
    </div>
  )
}
