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
      <h5 className="fw-bold text-dark mb-3">
        Datos Personales
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
      <h5 className="fw-bold text-dark mb-3">
        Seguridad y Contraseña
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
      <h5 className="fw-bold text-danger mb-2">
        Eliminar cuenta
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

function FotoPerfilCard({ usuario, alSubirFoto, alEliminarFoto }) {
  const [archivoSeleccionado, establecerArchivoSeleccionado] = useState(null);
  const [vistaPrevia, establecerVistaPrevia] = useState(null);
  const [exito, establecerExito] = useState(null);
  const [error, establecerError] = useState(null);
  const [cargando, establecerCargando] = useState(false);

  const manejarCambioArchivo = (evento) => {
    establecerError(null);
    establecerExito(null);
    const archivo = evento.target.files?.[0];
    if (!archivo) {
      establecerArchivoSeleccionado(null);
      establecerVistaPrevia(null);
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      establecerError('Formato no admitido. Selecciona una imagen JPG, PNG o WEBP.');
      establecerArchivoSeleccionado(null);
      establecerVistaPrevia(null);
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      establecerError('La imagen no debe superar los 2 MB.');
      establecerArchivoSeleccionado(null);
      establecerVistaPrevia(null);
      return;
    }

    establecerArchivoSeleccionado(archivo);
    const lector = new FileReader();
    lector.onload = () => establecerVistaPrevia(lector.result);
    lector.readAsDataURL(archivo);
  };

  const manejarSubida = async (evento) => {
    evento.preventDefault();
    if (!archivoSeleccionado) {
      establecerError('Selecciona una imagen antes de guardar.');
      return;
    }

    establecerCargando(true);
    establecerError(null);
    establecerExito(null);
    try {
      await alSubirFoto(archivoSeleccionado);
      establecerExito('Foto de perfil actualizada con éxito.');
      establecerArchivoSeleccionado(null);
      establecerVistaPrevia(null);
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  const manejarEliminacion = async () => {
    establecerCargando(true);
    establecerError(null);
    establecerExito(null);
    try {
      await alEliminarFoto();
      establecerExito('Foto de perfil eliminada.');
      establecerArchivoSeleccionado(null);
      establecerVistaPrevia(null);
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  const imagenActual = vistaPrevia || usuario?.fotoPerfil;

  return (
    <div className="card border rounded-4 p-4 p-md-5 mb-4 bg-white shadow-sm">
      <h5 className="fw-bold text-dark mb-3">
        Foto de Perfil
      </h5>

      {exito && (
        <div className="alert alert-success alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">check_circle</span>
          <div>{exito}</div>
          <button type="button" className="btn-close" onClick={() => establecerExito(null)}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => establecerError(null)}></button>
        </div>
      )}

      <form onSubmit={manejarSubida}>
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-3">
          <div className="user-avatar-circle flex-shrink-0" style={{ width: '80px', height: '80px' }}>
            {imagenActual ? (
              <img src={imagenActual} alt={usuario?.nombre || 'Perfil'} className="w-100 h-100 object-fit-cover rounded-circle" />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>person</span>
            )}
          </div>
          <div className="w-100">
            <label htmlFor="perfilFotoInput" className="form-label small fw-semibold text-secondary">
              Seleccionar imagen (JPG, PNG o WEBP, máximo 2 MB)
            </label>
            <input
              id="perfilFotoInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="form-control"
              onChange={manejarCambioArchivo}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 flex-wrap">
          {usuario?.fotoPerfil && (
            <button
              type="button"
              disabled={cargando}
              className="btn btn-outline-danger rounded-pill px-4"
              onClick={manejarEliminacion}
            >
              Quitar foto
            </button>
          )}
          <button
            type="submit"
            disabled={cargando || !archivoSeleccionado}
            className="btn btn-success rounded-pill px-4 text-white shadow-sm d-inline-flex align-items-center gap-2"
          >
            {cargando ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              <span>Guardar Foto</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Perfil() {
  const { user, updateProfile, changePassword, deleteAccount, subirFotoPerfil, eliminarFotoPerfil } = useAuth();

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="user-avatar-circle" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
              {user?.fotoPerfil ? (
                <img src={user.fotoPerfil} alt={user.nombre} className="w-100 h-100 object-fit-cover rounded-circle" />
              ) : (
                <span className="material-symbols-outlined fs-3">person</span>
              )}
            </div>
            <div>
              <h1 className="h3 fw-bold text-dark mb-0">Perfil</h1>
              <p className="text-muted small mb-0">Administra tu información personal y opciones de seguridad</p>
            </div>
          </div>

          <FotoPerfilCard usuario={user} alSubirFoto={subirFotoPerfil} alEliminarFoto={eliminarFotoPerfil} />
          <PerfilDatosForm key={user?.id || 'guest'} user={user} onUpdate={updateProfile} />
          <PasswordForm onChangePassword={changePassword} />
          <EliminarCuentaCard onDelete={deleteAccount} />
        </div>
      </div>
    </div>
  );
}
