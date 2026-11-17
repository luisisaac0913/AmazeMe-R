import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SECCIONES_PERFIL = [
  { id: 'foto', titulo: 'Foto de Perfil' },
  { id: 'datos', titulo: 'Datos Personales' },
  { id: 'seguridad', titulo: 'Seguridad y Contraseña' },
  { id: 'opiniones', titulo: 'Mis Opiniones' },
  { id: 'eliminar', titulo: 'Eliminar Cuenta', peligrosa: true }
];

function PerfilDatosForm({ usuario, alActualizar }) {
  const [nombre, establecerNombre] = useState(usuario?.nombre || '');
  const [email, establecerEmail] = useState(usuario?.email || '');
  const [exito, establecerExito] = useState(null);
  const [error, establecerError] = useState(null);
  const [cargando, establecerCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    establecerError(null);
    establecerExito(null);
    establecerCargando(true);

    try {
      await alActualizar(nombre, email);
      establecerExito('Tus datos han sido actualizados con éxito.');
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <h2 className="h5 fw-bold text-dark mb-3">Datos Personales</h2>

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

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="perfilNombre" className="form-label small fw-semibold text-secondary">
            Nombre de usuario
          </label>
          <input
            id="perfilNombre"
            type="text"
            className="form-control"
            value={nombre}
            onChange={(evento) => establecerNombre(evento.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="perfilEmail" className="form-label small fw-semibold text-secondary">
            Correo electrónico
          </label>
          <input
            id="perfilEmail"
            type="email"
            className="form-control"
            value={email}
            onChange={(evento) => establecerEmail(evento.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={cargando}
            className="btn btn-success rounded-pill px-4 text-white shadow-sm d-inline-flex align-items-center gap-2"
          >
            {cargando ? (
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

function PasswordForm({ alCambiarPassword }) {
  const [contraseñaActual, establecerContraseñaActual] = useState('');
  const [contraseñaNueva, establecerContraseñaNueva] = useState('');
  const [confirmarContraseñaNueva, establecerConfirmarContraseñaNueva] = useState('');
  const [exito, establecerExito] = useState(null);
  const [error, establecerError] = useState(null);
  const [cargando, establecerCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    establecerError(null);
    establecerExito(null);

    if (!contraseñaActual || !contraseñaNueva || !confirmarContraseñaNueva) {
      establecerError('Por favor completa todos los campos de contraseña.');
      return;
    }

    if (contraseñaNueva !== confirmarContraseñaNueva) {
      establecerError('Las nuevas contraseñas no coinciden.');
      return;
    }

    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[._%+\-!@#$&*])[a-zA-Z0-9._%+\-!@#$&*]{8,128}$/;
    if (!regexPassword.test(contraseñaNueva)) {
      establecerError('La nueva contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial.');
      return;
    }

    establecerCargando(true);

    try {
      await alCambiarPassword(contraseñaActual, contraseñaNueva, confirmarContraseñaNueva);
      establecerExito('Contraseña actualizada con éxito.');
      establecerContraseñaActual('');
      establecerContraseñaNueva('');
      establecerConfirmarContraseñaNueva('');
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <h2 className="h5 fw-bold text-dark mb-3">Seguridad y Contraseña</h2>

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

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="perfilPassActual" className="form-label small fw-semibold text-secondary">
            Contraseña actual
          </label>
          <input
            id="perfilPassActual"
            type="password"
            className="form-control"
            value={contraseñaActual}
            onChange={(evento) => establecerContraseñaActual(evento.target.value)}
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="perfilPassNueva" className="form-label small fw-semibold text-secondary">
            Nueva contraseña
          </label>
          <input
            id="perfilPassNueva"
            type="password"
            className="form-control"
            value={contraseñaNueva}
            onChange={(evento) => establecerContraseñaNueva(evento.target.value)}
            placeholder="Mínimo 8 caracteres con mayúscula, número y símbolo"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="perfilPassConfirm" className="form-label small fw-semibold text-secondary">
            Confirmar nueva contraseña
          </label>
          <input
            id="perfilPassConfirm"
            type="password"
            className="form-control"
            value={confirmarContraseñaNueva}
            onChange={(evento) => establecerConfirmarContraseñaNueva(evento.target.value)}
            placeholder="Repite la nueva contraseña"
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={cargando}
            className="btn btn-outline-success rounded-pill px-4 fw-medium d-inline-flex align-items-center gap-2"
          >
            {cargando ? (
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

function FotoPerfilCard({ usuario, alSubirFoto, alEliminarFoto }) {
  const [imagenCargada, establecerImagenCargada] = useState(null);
  const [zoom, establecerZoom] = useState(1);
  const [desplazamientoX, establecerDesplazamientoX] = useState(0);
  const [desplazamientoY, establecerDesplazamientoY] = useState(0);
  const [exito, establecerExito] = useState(null);
  const [error, establecerError] = useState(null);
  const [cargando, establecerCargando] = useState(false);
  const referenciaLienzo = useRef(null);

  const dibujarRecorteEnLienzo = (lienzo, imagen, escala, posX, posY, tamano) => {
    const contexto = lienzo.getContext('2d');
    if (!contexto || !imagen) return;

    lienzo.width = tamano;
    lienzo.height = tamano;
    contexto.clearRect(0, 0, tamano, tamano);

    const escalaBase = Math.max(tamano / imagen.width, tamano / imagen.height);
    const escalaFinal = escalaBase * escala;
    const anchoDibujado = imagen.width * escalaFinal;
    const altoDibujado = imagen.height * escalaFinal;

    const rangoX = Math.max(0, (anchoDibujado - tamano) / 2);
    const rangoY = Math.max(0, (altoDibujado - tamano) / 2);

    const x = (tamano - anchoDibujado) / 2 + (posX / 100) * rangoX;
    const y = (tamano - altoDibujado) / 2 + (posY / 100) * rangoY;

    contexto.drawImage(imagen, x, y, anchoDibujado, altoDibujado);
  };

  useEffect(() => {
    if (imagenCargada && referenciaLienzo.current) {
      dibujarRecorteEnLienzo(referenciaLienzo.current, imagenCargada, zoom, desplazamientoX, desplazamientoY, 160);
    }
  }, [imagenCargada, zoom, desplazamientoX, desplazamientoY]);

  const manejarCambioArchivo = (evento) => {
    establecerError(null);
    establecerExito(null);
    const archivo = evento.target.files?.[0];
    if (!archivo) {
      establecerImagenCargada(null);
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      establecerError('Formato no admitido. Selecciona una imagen JPG, PNG o WEBP.');
      establecerImagenCargada(null);
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      establecerError('La imagen original no debe superar los 5 MB.');
      establecerImagenCargada(null);
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        establecerZoom(1);
        establecerDesplazamientoX(0);
        establecerDesplazamientoY(0);
        establecerImagenCargada(imagen);
      };
      imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  };

  const manejarSubida = async (evento) => {
    evento.preventDefault();
    if (!imagenCargada) {
      establecerError('Selecciona una imagen antes de guardar.');
      return;
    }

    establecerCargando(true);
    establecerError(null);
    establecerExito(null);
    try {
      const lienzoSalida = document.createElement('canvas');
      dibujarRecorteEnLienzo(lienzoSalida, imagenCargada, zoom, desplazamientoX, desplazamientoY, 256);

      const blob = await new Promise((resolver) =>
        lienzoSalida.toBlob((resultado) => resolver(resultado), 'image/png')
      );

      if (!blob) {
        throw new Error('No se pudo procesar el recorte de la imagen.');
      }

      const archivoRecortado = new File([blob], 'perfil.png', { type: 'image/png' });
      await alSubirFoto(archivoRecortado);
      establecerExito('Foto de perfil actualizada con éxito.');
      establecerImagenCargada(null);
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
      establecerImagenCargada(null);
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <h2 className="h5 fw-bold text-dark mb-3">Foto de Perfil</h2>

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
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          <div className="user-avatar-circle flex-shrink-0" style={{ width: '160px', height: '160px' }}>
            {imagenCargada ? (
              <canvas ref={referenciaLienzo} className="w-100 h-100 rounded-circle" />
            ) : usuario?.fotoPerfil ? (
              <img src={usuario.fotoPerfil} alt={usuario.nombre} className="w-100 h-100 object-fit-cover rounded-circle" />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>person</span>
            )}
          </div>

          <div className="w-100 text-center text-md-start">
            <span className="form-label small fw-semibold text-secondary d-block mb-2">
              Foto de perfil (JPG, PNG o WEBP)
            </span>
            <label
              htmlFor="perfilFotoInput"
              className="btn btn-outline-success btn-sm rounded-pill px-3 mb-3 d-inline-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined fs-6">add_a_photo</span>
              <span>{imagenCargada ? 'Elegir otra imagen' : 'Seleccionar imagen'}</span>
            </label>
            <input
              id="perfilFotoInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="d-none"
              onChange={manejarCambioArchivo}
            />

            {imagenCargada && (
              <div className="p-3 bg-light rounded-3 border">
                <div className="mb-2">
                  <label htmlFor="controlZoom" className="form-label small fw-semibold text-secondary d-flex justify-content-between mb-1">
                    <span>Acercar / Tamaño</span>
                    <span>{zoom.toFixed(1)}x</span>
                  </label>
                  <input
                    id="controlZoom"
                    type="range"
                    className="form-range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(evento) => establecerZoom(parseFloat(evento.target.value))}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="controlPosX" className="form-label small fw-semibold text-secondary mb-1">
                    Posición horizontal
                  </label>
                  <input
                    id="controlPosX"
                    type="range"
                    className="form-range"
                    min="-100"
                    max="100"
                    step="1"
                    value={desplazamientoX}
                    onChange={(evento) => establecerDesplazamientoX(parseInt(evento.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="controlPosY" className="form-label small fw-semibold text-secondary mb-1">
                    Posición vertical
                  </label>
                  <input
                    id="controlPosY"
                    type="range"
                    className="form-range"
                    min="-100"
                    max="100"
                    step="1"
                    value={desplazamientoY}
                    onChange={(evento) => establecerDesplazamientoY(parseInt(evento.target.value, 10))}
                  />
                </div>
              </div>
            )}
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
            disabled={cargando || !imagenCargada}
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

function MisOpinionesCard() {
  const [opiniones, establecerOpiniones] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(null);
  const [eliminandoId, establecerEliminandoId] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarMisOpiniones() {
      try {
        const respuesta = await fetch('/api/foro/mias', { credentials: 'include' });
        const datos = await respuesta.json().catch(() => null);
        if (!respuesta.ok) {
          throw new Error(datos?.error || 'No se pudieron cargar tus opiniones.');
        }
        if (activo) {
          establecerOpiniones(Array.isArray(datos) ? datos : []);
        }
      } catch (err) {
        if (activo) establecerError(err.message);
      } finally {
        if (activo) establecerCargando(false);
      }
    }

    cargarMisOpiniones();

    return () => {
      activo = false;
    };
  }, []);

  const manejarEliminar = async (idPublicacion) => {
    if (eliminandoId === idPublicacion) return;
    establecerEliminandoId(idPublicacion);
    establecerError(null);
    try {
      const respuesta = await fetch(`/api/foro/${idPublicacion}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo eliminar la opinión.');
      }
      establecerOpiniones((previas) => previas.filter((item) => item.id !== idPublicacion));
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerEliminandoId(null);
    }
  };

  return (
    <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h2 className="h5 fw-bold text-dark mb-0">Mis Opiniones en el Foro</h2>
        <Link to="/foro" className="btn btn-success btn-sm rounded-pill px-3 text-white">
          Ir al Foro
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => establecerError(null)}></button>
        </div>
      )}

      {cargando ? (
        <div className="py-4 text-center">
          <div className="google-spinner"></div>
        </div>
      ) : opiniones.length === 0 ? (
        <div className="p-4 bg-light rounded-4 text-center">
          <p className="text-muted small mb-3">Todavía no has publicado ninguna opinión en el foro.</p>
          <Link to="/foro" className="btn btn-outline-success rounded-pill px-4">
            Publicar mi primera opinión
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {opiniones.map((opinion) => (
            <div key={opinion.id} className="p-3 border rounded-4 bg-light">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <h3 className="h6 fw-bold text-dark mb-1">{opinion.titulo}</h3>
                  <div className="d-flex flex-wrap gap-2 align-items-center small text-muted">
                    <span className="badge bg-white border text-secondary">{opinion.categoria}</span>
                    <span>{new Date(opinion.fechaCreacion).toLocaleDateString()}</span>
                    <span>{opinion.calificacion}/5 estrellas</span>
                    <span>{opinion.totalLikes} likes</span>
                    <span>{opinion.totalComentarios} comentarios</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={eliminandoId === opinion.id}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 text-nowrap"
                  onClick={() => manejarEliminar(opinion.id)}
                >
                  {eliminandoId === opinion.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
              {opinion.regaloMencionado && (
                <p className="small text-dark fw-medium mb-1">Regalo: {opinion.regaloMencionado}</p>
              )}
              <p className="small text-muted mb-2">{opinion.contenido}</p>
              {opinion.imagenUrl && (
                <img
                  src={opinion.imagenUrl}
                  alt={opinion.titulo}
                  className="img-fluid rounded-3 border"
                  style={{ maxHeight: '160px', objectFit: 'contain' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EliminarCuentaCard({ alEliminar }) {
  const navegar = useNavigate();
  const [confirmando, establecerConfirmando] = useState(false);
  const [textoConfirmacion, establecerTextoConfirmacion] = useState('');
  const [error, establecerError] = useState(null);
  const [cargando, establecerCargando] = useState(false);

  const manejarEliminar = async () => {
    if (textoConfirmacion.trim().toUpperCase() !== 'ELIMINAR') {
      establecerError('Escribe ELIMINAR para confirmar la baja definitiva.');
      return;
    }

    establecerCargando(true);
    establecerError(null);
    try {
      await alEliminar();
      navegar('/');
    } catch (err) {
      establecerError(err.message);
      establecerCargando(false);
    }
  };

  return (
    <div className="card border border-danger-subtle rounded-4 p-4 p-md-5 bg-white shadow-sm">
      <h2 className="h5 fw-bold text-danger mb-2">Eliminar cuenta</h2>
      <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
        Conforme a tus derechos de cancelación (ARCO), puedes eliminar permanentemente tu cuenta, tu historial de cuestionarios, compras, publicaciones y puntos Amazings. Esta acción no se puede deshacer.
      </p>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => establecerError(null)}></button>
        </div>
      )}

      {!confirmando ? (
        <button
          type="button"
          className="btn btn-outline-danger rounded-pill px-4"
          onClick={() => establecerConfirmando(true)}
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
            onChange={(evento) => establecerTextoConfirmacion(evento.target.value)}
          />
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-3"
              disabled={cargando}
              onClick={() => {
                establecerConfirmando(false);
                establecerTextoConfirmacion('');
                establecerError(null);
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger rounded-pill px-4"
              disabled={cargando}
              onClick={manejarEliminar}
            >
              {cargando ? 'Eliminando...' : 'Eliminar definitivamente'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Perfil() {
  const { user: usuario, updateProfile, changePassword, deleteAccount, subirFotoPerfil, eliminarFotoPerfil } = useAuth();
  const [seccionActiva, establecerSeccionActiva] = useState('foto');

  return (
    <div className="container my-5" style={{ maxWidth: '1040px' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="user-avatar-circle" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
          {usuario?.fotoPerfil ? (
            <img src={usuario.fotoPerfil} alt={usuario.nombre} className="w-100 h-100 object-fit-cover rounded-circle" />
          ) : (
            <span className="material-symbols-outlined fs-3">person</span>
          )}
        </div>
        <div>
          <h1 className="h3 fw-bold text-dark mb-0">Perfil</h1>
          <p className="text-muted small mb-0">Administra tu información personal, opiniones y seguridad</p>
        </div>
      </div>

      <div className="row g-4">
        <aside className="col-12 col-lg-3">
          <div className="card border rounded-4 p-2 bg-white shadow-sm">
            <nav className="nav flex-row flex-lg-column flex-wrap gap-1" aria-label="Secciones de perfil">
              {SECCIONES_PERFIL.map((seccion) => {
                const estaActiva = seccionActiva === seccion.id;
                return (
                  <button
                    key={seccion.id}
                    type="button"
                    onClick={() => establecerSeccionActiva(seccion.id)}
                    className={`btn btn-sm text-start rounded-3 px-3 py-2 fw-medium border-0 ${
                      estaActiva
                        ? seccion.peligrosa
                          ? 'bg-danger text-white'
                          : 'bg-success text-white'
                        : seccion.peligrosa
                          ? 'text-danger bg-transparent'
                          : 'text-dark bg-transparent'
                    }`}
                  >
                    {seccion.titulo}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="col-12 col-lg-9">
          {seccionActiva === 'foto' && (
            <FotoPerfilCard usuario={usuario} alSubirFoto={subirFotoPerfil} alEliminarFoto={eliminarFotoPerfil} />
          )}
          {seccionActiva === 'datos' && (
            <PerfilDatosForm key={usuario?.id || 'invitado'} usuario={usuario} alActualizar={updateProfile} />
          )}
          {seccionActiva === 'seguridad' && (
            <PasswordForm alCambiarPassword={changePassword} />
          )}
          {seccionActiva === 'opiniones' && <MisOpinionesCard />}
          {seccionActiva === 'eliminar' && <EliminarCuentaCard alEliminar={deleteAccount} />}
        </section>
      </div>
    </div>
  );
}
