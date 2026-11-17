import { Link } from 'react-router-dom';

export default function Privacidad() {
  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: '1000px' }}>
      {/* HEADER */}
      <div className="mb-5">
        <div className="d-inline-flex align-items-center gap-2 text-secondary small fw-medium mb-2 bg-light border px-3 py-1 rounded-pill">
          <span className="material-symbols-outlined fs-6">verified_user</span>
          <span>Centro de Privacidad y Protección de Datos</span>
        </div>
        <h1 className="display-6 fw-bold text-dark mb-2">Política de Privacidad</h1>
        <p className="text-muted">
          Última actualización: Abril 2026 • Transparencia total sobre cómo recopilamos, usamos y protegemos tu información.
        </p>
      </div>

      <div className="row g-4">
        {/* SIDEBAR NAVIGATION */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="sticky-top" style={{ top: '90px' }}>
            <div className="nav flex-column nav-pills gap-1 small">
              <a className="nav-link text-dark fw-medium rounded-pill px-3 py-2 nav-legal-link" href="#responsable">
                1. Responsable y Datos
              </a>
              <a className="nav-link text-dark fw-medium rounded-pill px-3 py-2 nav-legal-link" href="#finalidad">
                2. Uso de Información
              </a>
              <a className="nav-link text-dark fw-medium rounded-pill px-3 py-2 nav-legal-link" href="#cookies">
                3. Cookies y Almacenamiento
              </a>
              <a className="nav-link text-dark fw-medium rounded-pill px-3 py-2 nav-legal-link" href="#seguridad">
                4. Seguridad y Encriptación
              </a>
              <a className="nav-link text-dark fw-medium rounded-pill px-3 py-2 nav-legal-link" href="#derechos">
                5. Tus Derechos ARCO
              </a>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-lg-9">
          <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
            {/* 1 */}
            <section id="responsable" className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary fs-4">person_pin</span>
                <h2 className="h5 fw-bold text-dark mb-0">1. Responsable del Tratamiento y Datos Recopilados</h2>
              </div>
              <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>
                En <strong>AmazeMe</strong> valoramos profundamente tu confianza y nos comprometemos a proteger tus datos personales. Al utilizar nuestra plataforma, únicamente recopilamos la información estrictamente necesaria para brindarte una experiencia personalizada y segura:
              </p>
              <ul className="text-muted small ps-3 mb-0" style={{ lineHeight: 1.8 }}>
                <li>
                  <strong>Datos de Identificación de Cuenta:</strong> Nombre de usuario y correo electrónico proporcionados voluntariamente al registrarte.
                </li>
                <li>
                  <strong>Credenciales de Acceso:</strong> Contraseña almacenada exclusivamente bajo hash criptográfico irreversible (BCrypt). Nunca conocemos ni guardamos tu contraseña en texto plano.
                </li>
                <li>
                  <strong>Preferencias de Regalo (Cuestionarios):</strong> Respuestas sobre personalidad, pasatiempos, ocasión, presupuesto y edad del destinatario para calcular las mejores recomendaciones.
                </li>
                <li>
                  <strong>Actividad de Fidelidad:</strong> Registro de compras vinculadas a tu cuenta y balance acumulado de puntos <em>Amazings</em> (incluyendo el límite de 1 Amazing diario por encuesta gratuita y el 5% en Amazings sobre compras confirmadas).
                </li>
              </ul>
            </section>

            <hr className="border-light-subtle my-4" />

            {/* 2 */}
            <section id="finalidad" className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary fs-4">query_stats</span>
                <h2 className="h5 fw-bold text-dark mb-0">2. Finalidad del Tratamiento de Datos</h2>
              </div>
              <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>
                La información que nos confías se utiliza única y exclusivamente para las siguientes finalidades operativas dentro de la plataforma:
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-1">Personalización de Regalos</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Procesar tus respuestas del cuestionario para mostrarte artículos ideales sin tener que repetir tus preferencias.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-1">Gestión de Recompensas</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Acreditar, calcular y canjear tus puntos Amazings por bonos y beneficios dentro de la plataforma.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-1">Seguridad de Sesión</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Mantener tu sesión iniciada de manera segura y proteger tu cuenta contra accesos no autorizados.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-1">Cero Venta a Terceros</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Nunca vendemos, alquilamos ni comercializamos tu correo electrónico o perfil con anunciantes externos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-light-subtle my-4" />

            {/* 3 */}
            <section id="cookies" className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary fs-4">cookie</span>
                <h2 className="h5 fw-bold text-dark mb-0">3. Uso de Cookies y Almacenamiento Local</h2>
              </div>
              <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>
                AmazeMe utiliza cookies estrictamente necesarias y almacenamiento del navegador para operar correctamente y respetar tus preferencias de privacidad. Al ingresar por primera vez, mostramos un aviso de cookies donde puedes aceptar todas o conservar solo las esenciales:
              </p>

              <div className="table-responsive">
                <table className="table table-sm table-bordered small text-muted align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre / Tecnología</th>
                      <th>Tipo</th>
                      <th>Propósito</th>
                      <th>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>.AmazeMec.Auth</code>
                      </td>
                      <td>Cookie Esencial (HttpOnly)</td>
                      <td>Autenticación de usuario, seguridad de sesión y acceso al panel de recompensas.</td>
                      <td>Sesión / 7 días</td>
                    </tr>
                    <tr>
                      <td>
                        <code>.AmazeMec.Session</code>
                      </td>
                      <td>Cookie Esencial (HttpOnly)</td>
                      <td>Resguarda temporalmente el bono pendiente de encuesta antes de iniciar sesión o registrarte.</td>
                      <td>30 minutos</td>
                    </tr>
                    <tr>
                      <td>
                        <code>AmazeMe_CookiesAccepted</code>
                      </td>
                      <td>LocalStorage / Cookie</td>
                      <td>Guarda tu preferencia sobre el aviso de cookies para no volver a molestarte.</td>
                      <td>1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-light border d-flex align-items-start gap-2 mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
                <span className="material-symbols-outlined text-secondary fs-5 mt-1">info</span>
                <div>
                  <strong>Almacenamiento para invitados:</strong> Si completas un cuestionario sin iniciar sesión, guardamos temporalmente tu bono pendiente (1 Amazing diario) en la sesión del servidor para que puedas acreditarlo si decides crear tu cuenta o iniciar sesión en ese momento.
                </div>
              </div>
            </section>

            <hr className="border-light-subtle my-4" />

            {/* 4 */}
            <section id="seguridad" className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary fs-4">shield_lock</span>
                <h2 className="h5 fw-bold text-dark mb-0">4. Seguridad de la Información y Encriptación</h2>
              </div>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>
                Implementamos múltiples capas de defensa técnica para resguardar tus datos:
                <br />• <strong>Encriptación de Contraseñas:</strong> Todas las claves pasan por un algoritmo adaptativo <em>BCrypt</em> con sal aleatoria antes de guardarse en nuestra base de datos.
                <br />• <strong>Tráfico Cifrado (HTTPS / TLS):</strong> La comunicación entre tu dispositivo y nuestros servidores viaja encriptada.
                <br />• <strong>Cabeceras de Protección HTTP:</strong> Aplicamos políticas de seguridad estrictas (<code>X-Frame-Options</code>, <code>X-Content-Type-Options</code>, <code>HSTS</code> y <code>CSP</code>) para prevenir ataques XSS y Clickjacking.
              </p>
            </section>

            <hr className="border-light-subtle my-4" />

            {/* 5 */}
            <section id="derechos">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary fs-4">gavel</span>
                <h2 className="h5 fw-bold text-dark mb-0">5. Tus Derechos (Acceso, Rectificación, Cancelación y Oposición)</h2>
              </div>
              <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>
                Como usuario titular de tus datos, tienes pleno derecho en cualquier momento a:
              </p>
              <ul className="text-muted small ps-3 mb-4" style={{ lineHeight: 1.8 }}>
                <li>
                  <strong>Acceder</strong> a los datos personales que tenemos asociados a tu cuenta.
                </li>
                <li>
                  <strong>Rectificar</strong> o actualizar tu nombre de usuario o dirección de correo electrónico desde{' '}
                  <Link to="/perfil" className="text-dark fw-medium text-decoration-underline">
                    tu perfil
                  </Link>
                  .
                </li>
                <li>
                  <strong>Cancelar o Eliminar</strong> permanentemente tu cuenta junto con tu historial de puntos y respuestas directamente desde{' '}
                  <Link to="/perfil" className="text-dark fw-medium text-decoration-underline">
                    Mi Perfil
                  </Link>{' '}
                  o mediante solicitud por correo.
                </li>
                <li>
                  <strong>Oponerte</strong> al uso de almacenamiento local borrando las cookies desde la configuración de tu navegador.
                </li>
              </ul>

              <div className="p-3 bg-light border rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <h6 className="fw-bold text-dark mb-1">¿Tienes dudas sobre tu privacidad?</h6>
                  <p className="text-muted small mb-0">
                    Contáctanos directamente enviando un correo a{' '}
                    <a href="mailto:amazeme@gmail.com" className="fw-bold text-dark text-decoration-underline">
                      amazeme@gmail.com
                    </a>{' '}
                    o a través de nuestro{' '}
                    <Link to="/quejas" className="fw-bold text-dark text-decoration-underline">
                      buzón de quejas
                    </Link>
                    .
                  </p>
                </div>
                <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 text-nowrap">
                  Volver al Inicio
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
