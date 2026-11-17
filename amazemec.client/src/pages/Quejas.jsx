import { useState } from 'react';
import { Link } from 'react-router-dom';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnpddbql';

export default function Quejas() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [motivo, setMotivo] = useState('Queja sobre el servicio');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError('Por favor completa tu nombre, correo electrónico y el detalle de tu queja.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          motivo,
          mensaje: mensaje.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.errors?.map((err) => err.message).join(', ');
        throw new Error(msg || 'No se pudo enviar tu queja. Inténtalo de nuevo más tarde.');
      }

      setEnviado(true);
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: '720px' }}>
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-dark mb-2">Buzón de Quejas y Sugerencias</h1>
        <p className="text-muted mb-0">
          Tu opinión nos ayuda a mejorar AmazeMe. Envíanos cualquier queja, inconformidad o reporte y te responderemos a la brevedad.
        </p>
      </div>

      <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
        {enviado ? (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-dark mb-2" style={{ fontSize: '48px' }}>
              mark_email_read
            </span>
            <h2 className="h4 fw-bold text-dark mb-2">Queja enviada correctamente</h2>
            <p className="text-muted small mb-4">
              Hemos recibido tu mensaje y lo revisaremos pronto. Si proporcionaste tu correo electrónico, nos pondremos en contacto contigo.
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => setEnviado(false)}
              >
                Enviar otra queja
              </button>
              <Link to="/" className="btn btn-dark rounded-pill px-4 text-white">
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-4 d-flex align-items-center gap-2" role="alert">
                <span className="material-symbols-outlined fs-5">error</span>
                <div>{error}</div>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setError(null)}></button>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="quejaNombre" className="form-label small fw-semibold text-secondary">
                Nombre completo
              </label>
              <input
                id="quejaNombre"
                type="text"
                className="form-control"
                placeholder="Tu nombre"
                maxLength={100}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="quejaEmail" className="form-label small fw-semibold text-secondary">
                Correo electrónico de contacto
              </label>
              <input
                id="quejaEmail"
                type="email"
                className="form-control"
                placeholder="ejemplo@correo.com"
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="quejaMotivo" className="form-label small fw-semibold text-secondary">
                Motivo
              </label>
              <select
                id="quejaMotivo"
                className="form-select"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              >
                <option value="Queja sobre el servicio">Queja sobre el servicio</option>
                <option value="Problema con recompensas o Amazings">Problema con recompensas o Amazings</option>
                <option value="Error técnico en la plataforma">Error técnico en la plataforma</option>
                <option value="Privacidad o datos personales">Privacidad o datos personales</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="quejaMensaje" className="form-label small fw-semibold text-secondary">
                Describe tu queja
              </label>
              <textarea
                id="quejaMensaje"
                rows={5}
                className="form-control"
                placeholder="Explica lo sucedido con el mayor detalle posible..."
                maxLength={2000}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark rounded-pill px-4 text-white d-inline-flex align-items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar queja</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

