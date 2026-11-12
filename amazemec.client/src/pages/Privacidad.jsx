import { Link } from 'react-router-dom';

export default function Privacidad() {
  return (
    <div className="container my-5" style={{ maxWidth: '840px' }}>
      <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
        <h1 className="h2 fw-bold text-dark mb-3">Política de Privacidad y Protección de Datos</h1>
        <p className="text-muted small mb-4">Última actualización: Noviembre 2026</p>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">1. Información que Recopilamos</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            En AmazeMe recopilamos únicamente los datos necesarios para operar el servicio:
          </p>
          <ul className="text-muted" style={{ lineHeight: 1.6 }}>
            <li><strong>Datos de Cuenta:</strong> Nombre de usuario, correo electrónico y contraseña cifrada con algoritmo BCrypt.</li>
            <li><strong>Datos de Cuestionarios:</strong> Relación, ocasión, edad, pasatiempos, preferencias y presupuesto para calcular recomendaciones.</li>
            <li><strong>Datos de Recompensas:</strong> Puntos Amazings acumulados y canjes realizados.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">2. Cifrado y Seguridad</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Todas las comunicaciones viajan a través de canales protegidos por <strong>HTTPS / TLS 1.3</strong> y las contraseñas nunca se almacenan en texto claro. La base de datos cuenta con cifrado en reposo TDE (Transparent Data Encryption).
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">3. Cookies y Sesiones</h5>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            Utilizamos cookies técnicas protegidas con indicadores <code>HttpOnly</code>, <code>SameSite</code> y <code>Secure</code> exclusivamente para mantener tu autenticación activa y gestionar tus puntos temporales de forma segura.
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
