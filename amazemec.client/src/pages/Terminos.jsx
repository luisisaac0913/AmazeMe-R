import { Link } from 'react-router-dom';

export default function Terminos() {
  return (
    <div className="container my-5" style={{ maxWidth: '840px' }}>
      <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
        <h1 className="h2 fw-bold text-dark mb-3">Términos y Condiciones de Uso</h1>
        <p className="text-muted small mb-4">Última actualización: Noviembre 2026</p>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">1. Aceptación de los Términos</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Al acceder y utilizar <strong>AmazeMe</strong>, aceptas cumplir y estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte, no debes utilizar la plataforma.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">2. Servicio de Recomendación y Enlaces Afiliados</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            AmazeMe proporciona sugerencias de regalos personalizadas basadas en las respuestas suministradas por el usuario en el cuestionario guiado. Dichas recomendaciones, así como los precios estimados en MXN, calificaciones y tiempos de envío mostrados, son de carácter orientativo y pueden variar al momento de consultar el producto en Amazon México u otros comercios afiliados. AmazeMe puede recibir una comisión por compras elegibles sin costo adicional para ti.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">3. Programa de Puntos y Recompensas (Amazings)</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Los puntos denominados <em>Amazings</em> se otorgan mediante promociones activas, finalización de encuestas (máximo 1 Amazing diario por encuesta gratuita) y compras elegibles confirmadas en comercios afiliados (5% en Amazings). Los puntos no tienen valor monetario transferible fuera de la plataforma y están sujetos a las políticas de caducidad y canje vigentes.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">4. Cuenta de Usuario y Reglas del Foro Comunitario</h5>
          <p className="text-muted mb-2" style={{ lineHeight: 1.6 }}>
            Eres responsable de mantener la confidencialidad de tu contraseña y de restringir el acceso a tu dispositivo para evitar accesos no autorizados a tu cuenta de recompensas.
          </p>
          <ul className="text-muted small ps-3 mb-0" style={{ lineHeight: 1.7 }}>
            <li>Para publicar, comentar o dar <em>Me gusta</em> en el Foro es obligatorio contar con una sesión iniciada.</li>
            <li>Toda publicación debe pertenecer a una categoría válida (<em>Regalo recibido</em>, <em>Recomendación</em>, <em>Experiencia</em> o <em>Duda</em>) y puede incluir hasta 4 fotografías (JPG, PNG o WEBP, máximo 3 MB cada una).</li>
            <li>Está prohibido publicar spam, lenguaje ofensivo, enlaces maliciosos o datos personales de terceros; la plataforma aplica límites automáticos de frecuencia para prevenir abusos.</li>
            <li>Puedes eliminar tus propias publicaciones o comentarios en cualquier momento desde el Foro o tu Perfil.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">5. Responsable Legal y Contacto</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            AmazeMe es operado por <strong>Luis Issac Olvera Morán</strong> (Gómez Palacio, Durango, México). Para más información sobre el tratamiento de datos consulta nuestra{' '}
            <Link to="/privacidad" className="text-dark fw-medium">Política de Privacidad</Link>{' '}
            o contáctanos mediante el <Link to="/quejas" className="text-dark fw-medium">Buzón de Quejas y Sugerencias</Link>.
          </p>
        </section>

        <div className="pt-3 border-top text-center">
          <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
