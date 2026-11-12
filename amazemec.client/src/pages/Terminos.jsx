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
          <h5 className="fw-bold text-dark">2. Servicio de Recomendación</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            AmazeMe proporciona sugerencias de regalos personalizadas basadas en las respuestas suministradas por el usuario en el cuestionario guiado. Dichas recomendaciones son de carácter orientativo.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">3. Programa de Puntos y Recompensas (Amazings)</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Los puntos denominados <em>Amazings</em> se otorgan mediante promociones activas, finalización de encuestas y compras elegibles en comercios afiliados. Los puntos no tienen valor monetario transferible fuera de la plataforma y están sujetos a las políticas de caducidad y canje vigentes.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">4. Cuenta de Usuario</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Eres responsable de mantener la confidencialidad de tu contraseña y de restringir el acceso a tu dispositivo para evitar accesos no autorizados a tu cuenta de recompensas.
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
