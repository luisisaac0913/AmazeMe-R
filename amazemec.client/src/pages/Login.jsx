import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnUrl = searchParams.get('returnUrl') || '/';
  const ultimaRespuestaId = searchParams.get('ultimaRespuestaId') || null;

  const [identificador, setIdentificador] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [puntosReclamadosMsg, setPuntosReclamadosMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identificador.trim() || !contraseña) {
      setError('Rellene todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await login(identificador, contraseña, ultimaRespuestaId ? parseInt(ultimaRespuestaId) : null);
      if (data.puntosReclamados) {
        setPuntosReclamadosMsg(`¡Has reclamado tus ${data.puntosReclamados} Amazings pendientes con éxito!`);
        setTimeout(() => {
          navigate(returnUrl);
        }, 1200);
      } else {
        navigate(returnUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card google-auth-card p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
                <img
                  src="/Images/Iconos/Amazeme_logo.png"
                  alt="AmazeMe"
                  width="36"
                  height="36"
                  className="d-inline-block rounded-2"
                />
                <span className="fs-4 fw-bold text-dark">
                  Amaze<span className="brand-accent">Me</span>
                </span>
              </Link>
              <h1 className="h3 fw-normal text-dark mt-2 mb-1">Iniciar sesión</h1>
              <p className="text-muted small mb-0">Usa tu cuenta de AmazeMe</p>
            </div>

            {puntosReclamadosMsg && (
              <div className="alert alert-success alert-dismissible fade show mb-3 d-flex align-items-center gap-2" role="alert">
                <span className="material-symbols-outlined fs-5">stars</span>
                <div>{puntosReclamadosMsg}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2" role="alert">
                <span className="material-symbols-outlined fs-5">error</span>
                <div>{error}</div>
                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Usuario o correo electrónico</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa tu usuario o correo"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Link
                  to={`/registrar?returnUrl=${encodeURIComponent(returnUrl)}${ultimaRespuestaId ? `&ultimaRespuestaId=${ultimaRespuestaId}` : ''}`}
                  className="text-success small fw-medium text-decoration-none"
                >
                  Crear cuenta
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success rounded-pill px-4 py-2 text-white shadow-sm d-inline-flex align-items-center gap-2"
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                  ) : (
                    <span>Siguiente</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

