import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnUrl = searchParams.get('returnUrl') || '/';
  const ultimaRespuestaId = searchParams.get('ultimaRespuestaId') || null;

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !email.trim() || !contraseña || !confirmarContraseña) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud)\.(com|es|com\.mx|net|org)$/i;
    if (!emailRegex.test(email.trim())) {
      setError('El correo es inválido o el proveedor no es admitido (usa Gmail, Outlook, Hotmail, Yahoo o iCloud).');
      return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[._%+\-!@#$&*])[a-zA-Z0-9._%+\-!@#$&*]{8,128}$/;
    if (!passRegex.test(contraseña)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial [._%+-!@#$&*]');
      return;
    }

    setLoading(true);

    try {
      await register(
        nombre.trim(),
        email.trim(),
        contraseña,
        confirmarContraseña,
        ultimaRespuestaId ? parseInt(ultimaRespuestaId) : null
      );
      navigate(returnUrl);
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
              <Link to="/entrar" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
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
              <h1 className="h3 fw-normal text-dark mt-2 mb-1">Crea tu cuenta</h1>
              <p className="text-muted small mb-0">Empieza a descubrir regalos y ganar recompensas</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show small mb-3 d-flex align-items-center gap-2" role="alert">
                <span className="material-symbols-outlined fs-6">error</span>
                <div>{error}</div>
                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Elige un nombre de usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Crea una contraseña segura"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
                <div className="form-text small text-muted">
                  Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial.
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repite tu contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Link
                  to={`/entrar?returnUrl=${encodeURIComponent(returnUrl)}${ultimaRespuestaId ? `&ultimaRespuestaId=${ultimaRespuestaId}` : ''}`}
                  className="text-success small fw-medium text-decoration-none"
                >
                  ¿Ya tienes cuenta?
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success rounded-pill px-4 py-2 text-white shadow-sm d-inline-flex align-items-center gap-2"
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                  ) : (
                    <span>Registrarse</span>
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

