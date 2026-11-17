import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, subirFotoPerfil } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawReturnUrl = searchParams.get('returnUrl') || '/';
  const returnUrl = rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//') ? rawReturnUrl : '/';
  const ultimaRespuestaId = searchParams.get('ultimaRespuestaId') || null;

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [fotoArchivo, establecerFotoArchivo] = useState(null);
  const [vistaPreviaFoto, establecerVistaPreviaFoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const manejarSeleccionFoto = (evento) => {
    setError(null);
    const archivo = evento.target.files?.[0];
    if (!archivo) {
      establecerFotoArchivo(null);
      establecerVistaPreviaFoto(null);
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Formato de foto no admitido. Usa JPG, PNG o WEBP.');
      establecerFotoArchivo(null);
      establecerVistaPreviaFoto(null);
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setError('La foto de perfil no debe superar los 2 MB.');
      establecerFotoArchivo(null);
      establecerVistaPreviaFoto(null);
      return;
    }

    establecerFotoArchivo(archivo);
    const lector = new FileReader();
    lector.onload = () => establecerVistaPreviaFoto(lector.result);
    lector.readAsDataURL(archivo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !email.trim() || !contraseña || !confirmarContraseña) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (nombre.trim().length > 50) {
      setError('El nombre de usuario no puede superar los 50 caracteres.');
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
      if (fotoArchivo) {
        await subirFotoPerfil(fotoArchivo);
      }
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
                <label htmlFor="registerEmail" className="form-label small fw-semibold text-secondary">Correo electrónico</label>
                <input
                  id="registerEmail"
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerNombre" className="form-label small fw-semibold text-secondary">Nombre de usuario</label>
                <input
                  id="registerNombre"
                  type="text"
                  className="form-control"
                  placeholder="Elige un nombre de usuario"
                  maxLength={50}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label small fw-semibold text-secondary">Contraseña</label>
                <div className="input-group">
                  <input
                    id="registerPassword"
                    type={mostrarPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Crea una contraseña segura"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-inline-flex align-items-center px-3"
                    style={{ borderRadius: '0 8px 8px 0' }}
                    onClick={() => setMostrarPassword((prev) => !prev)}
                    aria-label={mostrarPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                  >
                    <span className="material-symbols-outlined fs-5">
                      {mostrarPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <div className="form-text small text-muted">
                  Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial.
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="registerConfirmPassword" className="form-label small fw-semibold text-secondary">Confirmar contraseña</label>
                <input
                  id="registerConfirmPassword"
                  type={mostrarPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Repite tu contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <span className="form-label small fw-semibold text-secondary d-block mb-2">
                  Foto de perfil (opcional)
                </span>
                <div className="d-flex align-items-center gap-3">
                  <div className="user-avatar-circle flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                    {vistaPreviaFoto ? (
                      <img src={vistaPreviaFoto} alt="Vista previa" className="w-100 h-100 object-fit-cover rounded-circle" />
                    ) : (
                      <span className="material-symbols-outlined fs-4">person</span>
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <label
                      htmlFor="registerFotoInput"
                      className="btn btn-outline-success btn-sm rounded-pill px-3 mb-0 d-inline-flex align-items-center gap-1"
                    >
                      <span className="material-symbols-outlined fs-6">add_a_photo</span>
                      <span>{fotoArchivo ? 'Cambiar foto' : 'Añadir foto de perfil'}</span>
                    </label>
                    <input
                      id="registerFotoInput"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="d-none"
                      onChange={manejarSeleccionFoto}
                    />
                    {fotoArchivo && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        onClick={() => {
                          establecerFotoArchivo(null);
                          establecerVistaPreviaFoto(null);
                        }}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
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

