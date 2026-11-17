import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PerfilDatosForm({ user, onUpdate }) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await onUpdate(nombre, email);
      setSuccess('Tus datos han sido actualizados con éxito.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 mb-4 bg-white shadow-sm">
      <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <span className="material-symbols-outlined text-success">badge</span>
        <span>Datos Personales</span>
      </h5>

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">check_circle</span>
          <div>{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="perfilNombre" className="form-label small fw-semibold text-secondary">Nombre de usuario</label>
          <input
            id="perfilNombre"
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="perfilEmail" className="form-label small fw-semibold text-secondary">Correo electrónico</label>
          <input
            id="perfilEmail"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success rounded-pill px-4 text-white shadow-sm d-inline-flex align-items-center gap-2"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordForm({ onChangePassword }) {
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [contraseñaNueva, setContraseñaNueva] = useState('');
  const [confirmarContraseñaNueva, setConfirmarContraseñaNueva] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!contraseñaActual || !contraseñaNueva || !confirmarContraseñaNueva) {
      setError('Por favor completa todos los campos de contraseña.');
      return;
    }

    if (contraseñaNueva !== confirmarContraseñaNueva) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[._%+\-!@#$&*])[a-zA-Z0-9._%+\-!@#$&*]{8,128}$/;
    if (!passRegex.test(contraseñaNueva)) {
      setError('La nueva contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial.');
      return;
    }

    setLoading(true);

    try {
      await onChangePassword(contraseñaActual, contraseñaNueva, confirmarContraseñaNueva);
      setSuccess('Contraseña actualizada con éxito.');
      setContraseñaActual('');
      setContraseñaNueva('');
      setConfirmarContraseñaNueva('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 mb-4 bg-white shadow-sm">
      <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <span className="material-symbols-outlined text-success">lock</span>
        <span>Seguridad y Contraseña</span>
      </h5>

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">check_circle</span>
          <div>{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="perfilPassActual" className="form-label small fw-semibold text-secondary">Contraseña actual</label>
          <input
            id="perfilPassActual"
            type="password"
            className="form-control"
            value={contraseñaActual}
            onChange={(e) => setContraseñaActual(e.target.value)}
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="perfilPassNueva" className="form-label small fw-semibold text-secondary">Nueva contraseña</label>
          <input
            id="perfilPassNueva"
            type="password"
            className="form-control"
            value={contraseñaNueva}
            onChange={(e) => setContraseñaNueva(e.target.value)}
            placeholder="Mínimo 8 caracteres con mayúscula, número y símbolo"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="perfilPassConfirm" className="form-label small fw-semibold text-secondary">Confirmar nueva contraseña</label>
          <input
            id="perfilPassConfirm"
            type="password"
            className="form-control"
            value={confirmarContraseñaNueva}
            onChange={(e) => setConfirmarContraseñaNueva(e.target.value)}
            placeholder="Repite la nueva contraseña"
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-outline-success rounded-pill px-4 fw-medium d-inline-flex align-items-center gap-2"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status"></div>
            ) : (
              <span>Actualizar Contraseña</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function EliminarCuentaCard({ onDelete }) {
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);
  const [textoConfirmacion, setTextoConfirmacion] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    if (textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR') {
      setError('Escribe ELIMINAR para confirmar la baja definitiva.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onDelete();
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="card border border-danger-subtle rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <h5 className="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
        <span className="material-symbols-outlined">delete_forever</span>
        <span>Eliminar cuenta</span>
      </h5>
      <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
        Conforme a tus derechos de cancelación (ARCO), puedes eliminar permanentemente tu cuenta, tu historial de cuestionarios, compras y puntos Amazings. Esta acción no se puede deshacer.
      </p>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {!confirmando ? (
        <button
          type="button"
          className="btn btn-outline-danger rounded-pill px-4"
          onClick={() => setConfirmando(true)}
        >
          Solicitar eliminación de cuenta
        </button>
      ) : (
        <div className="p-3 bg-light rounded-3 border">
          <label htmlFor="confirmarEliminarCuenta" className="form-label small fw-semibold text-dark">
            Escribe <strong>ELIMINAR</strong> para confirmar:
          </label>
          <input
            id="confirmarEliminarCuenta"
            type="text"
            className="form-control mb-3"
            placeholder="ELIMINAR"
            value={textoConfirmacion}
            onChange={(e) => setTextoConfirmacion(e.target.value)}
          />
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-3"
              disabled={loading}
              onClick={() => {
                setConfirmando(false);
                setTextoConfirmacion('');
                setError(null);
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger rounded-pill px-4"
              disabled={loading}
              onClick={handleEliminar}
            >
              {loading ? 'Eliminando...' : 'Eliminar definitivamente'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Perfil() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="user-avatar-circle" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
              <span className="material-symbols-outlined fs-3">person</span>
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-0">Cuenta de AmazeMe</h1>
              <p className="text-muted small mb-0">Administra tu información personal y opciones de seguridad</p>
            </div>
          </div>

          <PerfilDatosForm key={user?.id || 'guest'} user={user} onUpdate={updateProfile} />
          <PasswordForm onChangePassword={changePassword} />
          <EliminarCuentaCard onDelete={deleteAccount} />
        </div>
      </div>
    </div>
  );
}
