import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS_FORO = ['Todas', 'Regalo recibido', 'Recomendación', 'Experiencia', 'Duda'];

export default function Foro() {
  const { user: usuario } = useAuth();
  const navegar = useNavigate();

  const [publicaciones, establecerPublicaciones] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(null);
  const [categoriaActiva, establecerCategoriaActiva] = useState('Todas');
  const [orden, establecerOrden] = useState('recientes');
  const [busqueda, establecerBusqueda] = useState('');
  const [mostrarFormulario, establecerMostrarFormulario] = useState(false);

  const [titulo, establecerTitulo] = useState('');
  const [contenido, establecerContenido] = useState('');
  const [regaloMencionado, establecerRegaloMencionado] = useState('');
  const [categoriaNueva, establecerCategoriaNueva] = useState('Regalo recibido');
  const [calificacion, establecerCalificacion] = useState(5);
  const [imagenArchivo, establecerImagenArchivo] = useState(null);
  const [vistaPreviaImagen, establecerVistaPreviaImagen] = useState(null);
  const [enviando, establecerEnviando] = useState(false);

  const [comentariosAbiertos, establecerComentariosAbiertos] = useState({});
  const [textoComentarios, establecerTextoComentarios] = useState({});
  const [enviandoComentarioId, establecerEnviandoComentarioId] = useState(null);
  const [likeEnProcesoId, establecerLikeEnProcesoId] = useState(null);
  const [eliminandoId, establecerEliminandoId] = useState(null);

  const cargarPublicaciones = async (cat = categoriaActiva, ord = orden, busq = busqueda) => {
    establecerCargando(true);
    establecerError(null);
    try {
      const parametros = new URLSearchParams();
      if (cat && cat !== 'Todas') parametros.set('categoria', cat);
      if (ord) parametros.set('orden', ord);
      if (busq.trim()) parametros.set('busqueda', busq.trim());

      const respuesta = await fetch(`/api/foro?${parametros.toString()}`, {
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudieron cargar las publicaciones del foro.');
      }
      establecerPublicaciones(Array.isArray(datos) ? datos : []);
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
    }
  };

  useEffect(() => {
    cargarPublicaciones(categoriaActiva, orden, busqueda);
  }, [categoriaActiva, orden]);

  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    cargarPublicaciones(categoriaActiva, orden, busqueda);
  };

  const manejarSeleccionImagen = (evento) => {
    establecerError(null);
    const archivo = evento.target.files?.[0];
    if (!archivo) {
      establecerImagenArchivo(null);
      establecerVistaPreviaImagen(null);
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      establecerError('Formato no admitido. Usa JPG, PNG o WEBP.');
      establecerImagenArchivo(null);
      establecerVistaPreviaImagen(null);
      return;
    }

    if (archivo.size > 3 * 1024 * 1024) {
      establecerError('La imagen no debe superar los 3 MB.');
      establecerImagenArchivo(null);
      establecerVistaPreviaImagen(null);
      return;
    }

    establecerImagenArchivo(archivo);
    const lector = new FileReader();
    lector.onload = () => establecerVistaPreviaImagen(lector.result);
    lector.readAsDataURL(archivo);
  };

  const manejarCrearPublicacion = async (evento) => {
    evento.preventDefault();
    if (!usuario) {
      navegar('/entrar?returnUrl=/foro');
      return;
    }

    if (!titulo.trim() || !contenido.trim()) {
      establecerError('Escribe un título y tu opinión antes de publicar.');
      return;
    }

    establecerEnviando(true);
    establecerError(null);
    try {
      const formulario = new FormData();
      formulario.append('titulo', titulo.trim());
      formulario.append('contenido', contenido.trim());
      if (regaloMencionado.trim()) formulario.append('regaloMencionado', regaloMencionado.trim());
      formulario.append('categoria', categoriaNueva);
      formulario.append('calificacion', String(Number(calificacion)));
      if (imagenArchivo) formulario.append('imagen', imagenArchivo);

      const respuesta = await fetch('/api/foro', {
        method: 'POST',
        credentials: 'include',
        body: formulario
      });

      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo crear la publicación.');
      }

      establecerPublicaciones((previas) => [datos, ...previas]);
      establecerTitulo('');
      establecerContenido('');
      establecerRegaloMencionado('');
      establecerCalificacion(5);
      establecerImagenArchivo(null);
      establecerVistaPreviaImagen(null);
      establecerMostrarFormulario(false);
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerEnviando(false);
    }
  };

  const manejarLike = async (idPublicacion) => {
    if (!usuario) {
      navegar('/entrar?returnUrl=/foro');
      return;
    }
    if (likeEnProcesoId === idPublicacion) return;

    establecerLikeEnProcesoId(idPublicacion);
    try {
      const respuesta = await fetch(`/api/foro/${idPublicacion}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo registrar tu like.');
      }

      establecerPublicaciones((previas) =>
        previas.map((pub) =>
          pub.id === idPublicacion
            ? { ...pub, totalLikes: datos.totalLikes, dioLike: datos.dioLike }
            : pub
        )
      );
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerLikeEnProcesoId(null);
    }
  };

  const alternarComentarios = (idPublicacion) => {
    establecerComentariosAbiertos((previos) => ({
      ...previos,
      [idPublicacion]: !previos[idPublicacion]
    }));
  };

  const manejarEnviarComentario = async (evento, idPublicacion) => {
    evento.preventDefault();
    if (!usuario) {
      navegar('/entrar?returnUrl=/foro');
      return;
    }

    const texto = (textoComentarios[idPublicacion] || '').trim();
    if (!texto) return;

    establecerEnviandoComentarioId(idPublicacion);
    try {
      const respuesta = await fetch(`/api/foro/${idPublicacion}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contenido: texto })
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo enviar el comentario.');
      }

      establecerPublicaciones((previas) =>
        previas.map((pub) =>
          pub.id === idPublicacion
            ? {
                ...pub,
                totalComentarios: pub.totalComentarios + 1,
                comentarios: [...pub.comentarios, datos]
              }
            : pub
        )
      );
      establecerTextoComentarios((previos) => ({ ...previos, [idPublicacion]: '' }));
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerEnviandoComentarioId(null);
    }
  };

  const manejarEliminarPublicacion = async (idPublicacion) => {
    if (eliminandoId === idPublicacion) return;

    establecerEliminandoId(idPublicacion);
    try {
      const respuesta = await fetch(`/api/foro/${idPublicacion}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo eliminar la publicación.');
      }
      establecerPublicaciones((previas) => previas.filter((pub) => pub.id !== idPublicacion));
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerEliminandoId(null);
    }
  };

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: '920px' }}>
      <div className="card border rounded-4 p-4 p-md-5 mb-4 bg-white shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="display-6 fw-bold text-dark mb-1">Foro de Opiniones</h1>
            <p className="text-muted mb-0">
              Comparte experiencias sobre los regalos recibidos, recomienda ideas y vota por tus favoritos.
            </p>
          </div>
          {usuario ? (
            <button
              type="button"
              className="btn btn-success rounded-pill px-4 text-white text-nowrap d-inline-flex align-items-center gap-2"
              onClick={() => establecerMostrarFormulario((previo) => !previo)}
            >
              <span className="material-symbols-outlined fs-5">
                {mostrarFormulario ? 'close' : 'edit_square'}
              </span>
              <span>{mostrarFormulario ? 'Cancelar' : 'Nueva opinión'}</span>
            </button>
          ) : (
            <Link
              to="/entrar?returnUrl=/foro"
              className="btn btn-success rounded-pill px-4 text-white text-nowrap d-inline-flex align-items-center gap-2"
            >
              <span className="material-symbols-outlined fs-5">login</span>
              <span>Inicia sesión para opinar</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => establecerError(null)}></button>
        </div>
      )}

      {mostrarFormulario && usuario && (
        <div className="card border rounded-4 p-4 p-md-5 mb-4 bg-white shadow-sm">
          <h2 className="h5 fw-bold text-dark mb-3">Publicar nueva opinión</h2>
          <form onSubmit={manejarCrearPublicacion}>
            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label htmlFor="foroTitulo" className="form-label small fw-semibold text-secondary">
                  Título
                </label>
                <input
                  id="foroTitulo"
                  type="text"
                  className="form-control"
                  placeholder="Ej. Excelente regalo para aniversario"
                  maxLength={120}
                  value={titulo}
                  onChange={(evento) => establecerTitulo(evento.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="foroCategoria" className="form-label small fw-semibold text-secondary">
                  Categoría
                </label>
                <select
                  id="foroCategoria"
                  className="form-select"
                  value={categoriaNueva}
                  onChange={(evento) => establecerCategoriaNueva(evento.target.value)}
                >
                  {CATEGORIAS_FORO.filter((cat) => cat !== 'Todas').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label htmlFor="foroRegalo" className="form-label small fw-semibold text-secondary">
                  Regalo recibido o recomendado (opcional)
                </label>
                <input
                  id="foroRegalo"
                  type="text"
                  className="form-control"
                  placeholder="Ej. Proyector portátil, Audífonos, Perfume..."
                  maxLength={120}
                  value={regaloMencionado}
                  onChange={(evento) => establecerRegaloMencionado(evento.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="foroCalificacion" className="form-label small fw-semibold text-secondary">
                  Calificación
                </label>
                <select
                  id="foroCalificacion"
                  className="form-select"
                  value={calificacion}
                  onChange={(evento) => establecerCalificacion(evento.target.value)}
                >
                  <option value={5}>5 estrellas - Excelente</option>
                  <option value={4}>4 estrellas - Muy bueno</option>
                  <option value={3}>3 estrellas - Bueno</option>
                  <option value={2}>2 estrellas - Regular</option>
                  <option value={1}>1 estrella - Malo</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="foroContenido" className="form-label small fw-semibold text-secondary">
                Tu experiencia u opinión
              </label>
              <textarea
                id="foroContenido"
                rows={4}
                className="form-control"
                placeholder="Cuéntale a la comunidad qué te pareció el regalo, su calidad o cómo reaccionó quien lo recibió..."
                maxLength={1500}
                value={contenido}
                onChange={(evento) => establecerContenido(evento.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="foroImagen" className="form-label small fw-semibold text-secondary">
                Foto del regalo (opcional, JPG/PNG/WEBP, máx. 3 MB)
              </label>
              <input
                id="foroImagen"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-control"
                onChange={manejarSeleccionImagen}
              />
              {vistaPreviaImagen && (
                <div className="mt-3 position-relative d-inline-block">
                  <img
                    src={vistaPreviaImagen}
                    alt="Vista previa"
                    className="img-fluid rounded-3 border"
                    style={{ maxHeight: '220px', objectFit: 'contain' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-pill mt-2 d-block"
                    onClick={() => {
                      establecerImagenArchivo(null);
                      establecerVistaPreviaImagen(null);
                    }}
                  >
                    Quitar imagen
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => establecerMostrarFormulario(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="btn btn-success rounded-pill px-4 text-white"
              >
                {enviando ? 'Publicando...' : 'Publicar opinión'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card border rounded-4 p-3 p-md-4 mb-4 bg-white shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6">
            <div className="d-flex flex-wrap gap-2">
              {CATEGORIAS_FORO.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${
                    categoriaActiva === cat ? 'btn-success text-white' : 'btn-outline-secondary'
                  }`}
                  onClick={() => establecerCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex gap-2 flex-column flex-sm-row">
              <form className="d-flex flex-grow-1 gap-2" onSubmit={manejarBusqueda}>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Buscar regalo o tema..."
                  value={busqueda}
                  onChange={(evento) => establecerBusqueda(evento.target.value)}
                />
                <button type="submit" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                  Buscar
                </button>
              </form>
              <select
                aria-label="Ordenar publicaciones"
                className="form-select form-select-sm"
                style={{ maxWidth: '170px' }}
                value={orden}
                onChange={(evento) => establecerOrden(evento.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="populares">Más gustadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="d-flex justify-content-center py-5">
          <div className="google-spinner"></div>
        </div>
      ) : publicaciones.length === 0 ? (
        <div className="card border rounded-4 p-5 bg-white text-center shadow-sm">
          <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: '48px' }}>
            forum
          </span>
          <h2 className="h5 fw-bold text-dark mb-1">Aún no hay publicaciones aquí</h2>
          <p className="text-muted small mb-0">
            Sé el primero en compartir tu opinión sobre un regalo recibido o recomendado.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {publicaciones.map((pub) => {
            const comentariosVisibles = Boolean(comentariosAbiertos[pub.id]);
            return (
              <article key={pub.id} className="card border rounded-4 p-4 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="user-avatar-circle flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                      {pub.autorFoto ? (
                        <img
                          src={pub.autorFoto}
                          alt={pub.autorNombre}
                          className="w-100 h-100 object-fit-cover rounded-circle"
                        />
                      ) : (
                        <span className="material-symbols-outlined fs-5">person</span>
                      )}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{pub.autorNombre}</div>
                      <small className="text-muted">
                        {new Date(pub.fechaCreacion).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                    <span className="badge bg-light border text-secondary">{pub.categoria}</span>
                    <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>star</span>
                      <span>{pub.calificacion}/5</span>
                    </span>
                    {pub.esPropia && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1 d-inline-flex align-items-center"
                        disabled={eliminandoId === pub.id}
                        onClick={() => manejarEliminarPublicacion(pub.id)}
                        aria-label="Eliminar publicación"
                      >
                        <span className="material-symbols-outlined fs-6">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="h5 fw-bold text-dark mb-2">{pub.titulo}</h2>

                {pub.regaloMencionado && (
                  <div className="mb-2">
                    <span className="badge bg-light border text-dark d-inline-flex align-items-center gap-1">
                      <span className="material-symbols-outlined fs-6 text-success">redeem</span>
                      <span>Regalo: {pub.regaloMencionado}</span>
                    </span>
                  </div>
                )}

                <p className="text-muted mb-3" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {pub.contenido}
                </p>

                {pub.imagenUrl && (
                  <div className="mb-3">
                    <img
                      src={pub.imagenUrl}
                      alt={pub.titulo}
                      className="img-fluid rounded-3 border"
                      style={{ maxHeight: '360px', objectFit: 'contain' }}
                    />
                  </div>
                )}

                <div className="d-flex align-items-center gap-2 pt-2 border-top">
                  <button
                    type="button"
                    disabled={likeEnProcesoId === pub.id}
                    onClick={() => manejarLike(pub.id)}
                    className={`btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 ${
                      pub.dioLike ? 'btn-success text-white' : 'btn-outline-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined fs-6">thumb_up</span>
                    <span>{pub.totalLikes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alternarComentarios(pub.id)}
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                  >
                    <span className="material-symbols-outlined fs-6">chat_bubble</span>
                    <span>{pub.totalComentarios} {pub.totalComentarios === 1 ? 'comentario' : 'comentarios'}</span>
                  </button>
                </div>

                {comentariosVisibles && (
                  <div className="mt-3 pt-3 border-top">
                    {pub.comentarios.length > 0 && (
                      <div className="d-flex flex-column gap-2 mb-3">
                        {pub.comentarios.map((comentario) => (
                          <div key={comentario.id} className="p-3 bg-light rounded-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <div className="d-flex align-items-center gap-2">
                                <div className="user-avatar-circle" style={{ width: '24px', height: '24px' }}>
                                  {comentario.autorFoto ? (
                                    <img
                                      src={comentario.autorFoto}
                                      alt={comentario.autorNombre}
                                      className="w-100 h-100 object-fit-cover rounded-circle"
                                    />
                                  ) : (
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                                  )}
                                </div>
                                <strong className="small text-dark">{comentario.autorNombre}</strong>
                              </div>
                              <small className="text-muted">
                                {new Date(comentario.fechaCreacion).toLocaleDateString()}
                              </small>
                            </div>
                            <p className="small text-muted mb-0">{comentario.contenido}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {usuario ? (
                      <form className="d-flex gap-2" onSubmit={(evento) => manejarEnviarComentario(evento, pub.id)}>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Escribe un comentario..."
                          maxLength={600}
                          value={textoComentarios[pub.id] || ''}
                          onChange={(evento) =>
                            establecerTextoComentarios((previos) => ({
                              ...previos,
                              [pub.id]: evento.target.value
                            }))
                          }
                          required
                        />
                        <button
                          type="submit"
                          disabled={enviandoComentarioId === pub.id}
                          className="btn btn-success btn-sm rounded-pill px-3 text-white text-nowrap"
                        >
                          {enviandoComentarioId === pub.id ? 'Enviando...' : 'Comentar'}
                        </button>
                      </form>
                    ) : (
                      <p className="small text-muted mb-0">
                        <Link to="/entrar?returnUrl=/foro" className="fw-medium text-success">
                          Inicia sesión
                        </Link>{' '}
                        para dejar un comentario.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

