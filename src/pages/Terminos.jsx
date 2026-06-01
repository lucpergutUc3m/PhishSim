import { Link } from 'react-router-dom'

const LAST_UPDATED = '27 de mayo de 2026'

export default function Terminos() {
  return (
    <div className="page legal-page">
      <div className="legal-header">
        <Link to="/" className="back-link">← Volver</Link>
        <h1>Términos, condiciones y política de privacidad</h1>
        <p className="muted">Última actualización: {LAST_UPDATED}</p>
      </div>

      <div className="legal-body">

        <Section title="1. Identificación y propósito">
          <p>
            Esta plataforma ha sido desarrollada en el marco de un <strong>Trabajo Fin de Máster
            (TFM)</strong> de la Universidad Carlos III de Madrid (UC3M), con el objetivo de
            investigar la concienciación de la sociedad ante ataques de <em>phishing</em> mediante
            simulaciones controladas y con fines exclusivamente educativos y académicos.
          </p>
          <p>
            <strong>Responsable del tratamiento:</strong> Lucía Pérez Gutiérrez — alumno de la UC3M
            (<a href="mailto:100560335@alumnos.uc3m.es">100560335@alumnos.uc3m.es</a>).
          </p>
        </Section>

        <Section title="2. Naturaleza de la simulación">
          <p>
            Al participar, recibirás uno o varios correos electrónicos y/o mensajes SMS que
            imitan técnicas reales de <em>phishing</em>. <strong>Ninguna acción realizada durante
            la simulación tendrá consecuencias reales</strong>: no se realizarán cargos, no se
            accederá a cuentas reales ni se causará ningún perjuicio.
          </p>
          <p>
            El objetivo es medir y mejorar tu capacidad de detección. Al finalizar cada
            campaña recibirás información formativa sobre cómo identificar este tipo de
            ataques.
          </p>
        </Section>

        <Section title="3. Datos personales que se recogen">
          <table className="legal-table">
            <thead>
              <tr><th>Dato</th><th>Obligatorio</th><th>Finalidad</th></tr>
            </thead>
            <tbody>
              <tr><td>Nombre y apellidos</td><td>Sí</td><td>Identificación en la plataforma</td></tr>
              <tr><td>Correo electrónico</td><td>Sí</td><td>Envío de simulaciones y resultados</td></tr>
              <tr><td>Edad</td><td>Sí</td><td>Segmentación por grupo de edad (investigación)</td></tr>
              <tr><td>Cargo / ocupación</td><td>No</td><td>Análisis estadístico agregado</td></tr>
              <tr><td>Teléfono</td><td>No</td><td>Campañas de simulación SMS (si aplica)</td></tr>
            </tbody>
          </table>
          <p>
            No se recogen contraseñas reales, datos bancarios ni ninguna información
            sensible adicional.
          </p>
        </Section>

        <Section title="4. Base legitimadora del tratamiento">
          <p>
            El tratamiento de tus datos se basa en el <strong>consentimiento libre, específico,
            informado e inequívoco</strong> que prestas al marcar la casilla de aceptación
            durante el registro, de conformidad con el artículo 6.1.a del Reglamento General
            de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos
            Personales y garantía de los derechos digitales (LOPDGDD).
          </p>
          <p>
            Adicionalmente, el tratamiento está amparado por el interés legítimo de la
            investigación académica (art. 6.1.f RGPD y art. 89 RGPD relativo a fines
            científicos).
          </p>
        </Section>

        <Section title="5. Plazo de conservación">
          <p>
            Los datos se conservarán durante el período de realización del TFM y hasta
            su evaluación definitiva. Transcurrido ese plazo, los datos identificables
            serán <strong>anonimizados o eliminados</strong>. Los datos estadísticos
            agregados y anonimizados podrán conservarse con fines científicos.
          </p>
        </Section>

        <Section title="6. Cesión de datos a terceros">
          <p>
            Los datos <strong>no serán cedidos</strong> a terceros, salvo obligación legal.
            La plataforma utiliza GoPhish (software de código abierto) desplegado en
            servidores controlados exclusivamente por el responsable del tratamiento.
            No se utilizan servicios de terceros que impliquen transferencia internacional
            de datos.
          </p>
        </Section>

        <Section title="7. Tus derechos">
          <p>Puedes ejercer en cualquier momento los siguientes derechos:</p>
          <ul className="legal-list">
            <li><strong>Acceso</strong> — obtener confirmación de qué datos tuyos se tratan.</li>
            <li><strong>Rectificación</strong> — corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión</strong> — solicitar el borrado de tus datos ("derecho al olvido").</li>
            <li><strong>Oposición</strong> — oponerte al tratamiento en cualquier momento.</li>
            <li><strong>Portabilidad</strong> — recibir tus datos en formato estructurado.</li>
            <li><strong>Limitación</strong> — solicitar que se restrinja el tratamiento.</li>
            <li><strong>Retirar el consentimiento</strong> — sin que ello afecte a la licitud del tratamiento previo.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escribe a{' '}
            <a href="mailto:100560335@alumnos.uc3m.es">100560335@alumnos.uc3m.es</a>{' '}
            indicando el derecho que deseas ejercer y acreditando tu identidad.
          </p>
          <p>
            Si consideras que el tratamiento vulnera la normativa, puedes presentar
            una reclamación ante la{' '}
            <strong>Agencia Española de Protección de Datos (AEPD)</strong>{' '}
            en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
          </p>
        </Section>

        <Section title="8. Seguridad">
          <p>
            Se aplican medidas técnicas y organizativas adecuadas para proteger los
            datos personales frente a acceso no autorizado, pérdida o destrucción,
            incluyendo cifrado en tránsito (HTTPS) y acceso restringido a la base de datos.
          </p>
        </Section>

        <Section title="9. Participación voluntaria">
          <p>
            La participación es <strong>completamente voluntaria</strong> y puedes
            retirarte en cualquier momento sin ningún perjuicio, solicitando la eliminación
            de tus datos al correo indicado en el apartado 7.
          </p>
        </Section>

        <Section title="10. Modificaciones">
          <p>
            El responsable se reserva el derecho a actualizar estos términos. Cualquier
            cambio relevante será comunicado a los participantes por correo electrónico.
            La fecha de última actualización aparece al inicio de este documento.
          </p>
        </Section>

      </div>

      <div className="legal-footer">
        <Link to="/registro" className="btn btn-primary">Acepto y quiero registrarme →</Link>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-content">{children}</div>
    </section>
  )
}
