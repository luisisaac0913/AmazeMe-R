import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS_FORO = ['Todas', 'Regalo recibido', 'Recomendación', 'Experiencia', 'Duda'];

export default function Foro() {
  const { user: usuario } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const borradorInicial = ubicacion.state?.borradorForo || null;

  const [publicaciones, establecerPublicaciones] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(null);
  const [categoriaActiva, establecerCategoriaActiva] = useState('Todas');
  const [orden, establecerOrden] = useState('recientes');
  const [busqueda, establecerBusqueda] = useState('');
  const [mostrarFormulario, establecerMostrarFormulario] = useState(Boolean(borradorInicial));

  const [titulo, establecerTitulo] = useState(borradorInicial?.titulo || '');
  const [contenido, establecerContenido] = useState(borradorInicial?.contenido || '');
  const [regaloMencionado, establecerRegaloMencionado] = useState(borradorInicial?.regaloMencionado || '');
  const [categoriaNueva, establecerCategoriaNueva] = useState(borradorInicial?.categoria || 'Regalo recibido');
  const [calificacion, establecerCalificacion] = useState(5);
  const [imagenesArchivos, establecerImagenesArchivos] = useState([]);
  const [vistasPreviasImagenes, establecerVistasPreviasImagenes] = useState([]);
  const [enviando, establecerEnviando] = useState(false);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const [hayMas, establecerHayMas] = useState(false);
  const [cargandoMas, establecerCargandoMas] = useState(false);

  const [comentariosAbiertos, establecerComentariosAbiertos] = useState({});
  const [textoComentarios, establecerTextoComentarios] = useState({});
  const [enviandoComentarioId, establecerEnviandoComentarioId] = useState(null);
  const [eliminandoComentarioId, establecerEliminandoComentarioId] = useState(null);
  const [likeEnProcesoId, establecerLikeEnProcesoId] = useState(null);
  const [eliminandoId, establecerEliminandoId] = useState(null);

  const cargarPublicaciones = async (
    cat = categoriaActiva,
    ord = orden,
    busq = busqueda,
    paginaSolicitada = 1,
    acumular = false
  ) => {
    if (acumular) {
      establecerCargandoMas(true);
    } else {
      establecerCargando(true);
    }
    establecerError(null);
    try {
      const parametros = new URLSearchParams();
      if (cat && cat !== 'Todas') parametros.set('categoria', cat);
      if (ord) parametros.set('orden', ord);
      if (busq.trim()) parametros.set('busqueda', busq.trim());
      parametros.set('pagina', String(paginaSolicitada));
      parametros.set('tamanoPagina', '10');

      const respuesta = await fetch(`/api/foro?${parametros.toString()}`, {
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudieron cargar las publicaciones del foro.');
      }
      const lista = Array.isArray(datos)
        ? datos
        : Array.isArray(datos?.publicaciones)
          ? datos.publicaciones
          : [];

      establecerPublicaciones((previas) => (acumular ? [...previas, ...lista] : lista));
      establecerPaginaActual(datos?.pagina || paginaSolicitada);
      establecerHayMas(Boolean(datos?.hayMas));
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerCargando(false);
      establecerCargandoMas(false);
    }
  };

  useEffect(() => {
    cargarPublicaciones(categoriaActiva, orden, busqueda, 1, false);
  }, [categoriaActiva, orden]);

  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    cargarPublicaciones(categoriaActiva, orden, busqueda, 1, false);
  };

  const leerArchivoComoDataUrl = (archivo) =>
    new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onload = () => resolver(lector.result);
      lector.onerror = () => rechazar(new Error('No se pudo leer una de las imágenes.'));
      lector.readAsDataURL(archivo);
    });

  const comprimirImagen = (archivo) =>
    new Promise((resolver) => {
      const url = URL.createObjectURL(archivo);
      const imagen = new Image();
      imagen.onload = () => {
        const ladoMaximo = 1280;
        const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height));
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(imagen.width * escala);
        lienzo.height = Math.round(imagen.height * escala);
        const contexto = lienzo.getContext('2d');
        contexto.fillStyle = '#ffffff';
        contexto.fillRect(0, 0, lienzo.width, lienzo.height);
        contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        URL.revokeObjectURL(url);
        lienzo.toBlob(
          (blob) => {
            if (!blob || blob.size >= archivo.size) {
              resolver(archivo);
              return;
            }
            const nombre = archivo.name.replace(/\.[^.]+$/, '') + '.jpg';
            resolver(new File([blob], nombre, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.8
        );
      };
      imagen.onerror = () => {
        URL.revokeObjectURL(url);
        resolver(archivo);
      };
      imagen.src = url;
    });

  const manejarSeleccionImagenes = async (evento) => {
    establecerError(null);
    const seleccionados = Array.from(evento.target.files || []);
    evento.target.value = '';
    if (seleccionados.length === 0) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const combinados = [...imagenesArchivos];
    const nuevasVistas = [...vistasPreviasImagenes];

    for (const original of seleccionados) {
      if (combinados.length >= 4) {
        establecerError('Puedes adjuntar máximo 4 fotos por publicación.');
        break;
      }
      if (!tiposPermitidos.includes(original.type)) {
        establecerError('Formato no admitido. Usa JPG, PNG o WEBP.');
        continue;
      }
      const archivo = await comprimirImagen(original);
      if (archivo.size > 3 * 1024 * 1024) {
        establecerError('Cada imagen debe pesar máximo 3 MB.');
        continue;
      }
      const vista = await leerArchivoComoDataUrl(archivo);
      combinados.push(archivo);
      nuevasVistas.push(vista);
    }

    establecerImagenesArchivos(combinados);
    establecerVistasPreviasImagenes(nuevasVistas);
  };

  const quitarImagen = (indice) => {
    establecerImagenesArchivos((previas) => previas.filter((_, i) => i !== indice));
    establecerVistasPreviasImagenes((previas) => previas.filter((_, i) => i !== indice));
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
      imagenesArchivos.forEach((archivo) => formulario.append('imagenes', archivo));

      const respuesta = await fetch('/api/foro', {
        method: 'POST',
        credentials: 'include',
        body: formulario
      });

      if (respuesta.status === 429) {
        throw new Error('Has publicado muy rápido. Espera un momento antes de intentarlo de nuevo.');
      }

      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo crear la publicación.');
      }

      establecerPublicaciones((previas) => [datos, ...previas]);
      establecerTitulo('');
      establecerContenido('');
      establecerRegaloMencionado('');
      establecerCalificacion(5);
      establecerImagenesArchivos([]);
      establecerVistasPreviasImagenes([]);
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
      if (respuesta.status === 429) {
        throw new Error('Has comentado muy rápido. Espera un momento antes de enviar otro comentario.');
      }
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

  const manejarEliminarComentario = async (idPublicacion, idComentario) => {
    if (eliminandoComentarioId === idComentario) return;

    establecerEliminandoComentarioId(idComentario);
    try {
      const respuesta = await fetch(`/api/foro/comentarios/${idComentario}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(datos?.error || 'No se pudo eliminar el comentario.');
      }
      establecerPublicaciones((previas) =>
        previas.map((pub) =>
          pub.id === idPublicacion
            ? {
                ...pub,
                totalComentarios: Math.max(0, pub.totalComentarios - 1),
                comentarios: pub.comentarios.filter((c) => c.id !== idComentario)
              }
            : pub
        )
      );
    } catch (err) {
      establecerError(err.message);
    } finally {
      establecerEliminandoComentarioId(null);
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
                multiple
                className="form-control"
                onChange={manejarSeleccionImagenes}
                disabled={imagenesArchivos.length >= 4}
              />
              <small className="text-muted d-block mt-1">
                Puedes subir hasta 4 fotos ({imagenesArchivos.length}/4 seleccionadas, máx. 3 MB cada una).
              </small>
              {vistasPreviasImagenes.length > 0 && (
                <div className="row g-2 mt-2">
                  {vistasPreviasImagenes.map((vista, indice) => (
                    <div key={indice} className="col-6 col-sm-3">
                      <div className="position-relative border rounded-3 p-1 bg-white h-100 d-flex flex-column align-items-center justify-content-between">
                        <img
                          src={vista}
                          alt={`Vista previa ${indice + 1}`}
                          className="img-fluid rounded-2 w-100"
                          style={{ height: '120px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill mt-2 w-100"
                          onClick={() => quitarImagen(indice)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
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
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIAS_FORO.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                  categoriaActiva === cat ? 'btn-success text-white' : 'btn-outline-secondary'
                }`}
                onClick={() => establecerCategoriaActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8 col-lg-9">
              <form className="d-flex gap-2" onSubmit={manejarBusqueda}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar regalo o tema..."
                  value={busqueda}
                  onChange={(evento) => establecerBusqueda(evento.target.value)}
                />
                <button type="submit" className="btn btn-outline-secondary rounded-pill px-4 text-nowrap">
                  Buscar
                </button>
              </form>
            </div>
            <div className="col-12 col-md-4 col-lg-3">
              <select
                aria-label="Ordenar publicaciones"
                className="form-select"
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
            const imagenesPublicacion = Array.isArray(pub.imagenes) && pub.imagenes.length > 0
              ? pub.imagenes
              : pub.imagenUrl
                ? [pub.imagenUrl]
                : [];
            return (
              <article key={pub.id} className="card border rounded-4 p-3 p-md-4 bg-white shadow-sm">
                <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
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
                      <div className="min-w-0">
                        <div className="fw-bold text-dark text-truncate">{pub.autorNombre}</div>
                        <small className="text-muted">
                          {new Date(pub.fechaCreacion).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    {pub.esPropia && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1 d-inline-flex align-items-center d-sm-none flex-shrink-0"
                        disabled={eliminandoId === pub.id}
                        onClick={() => manejarEliminarPublicacion(pub.id)}
                        aria-label="Eliminar publicación"
                      >
                        <span className="material-symbols-outlined fs-6">delete</span>
                      </button>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap justify-content-start justify-content-sm-end">
                    <span className="badge bg-light border text-secondary">{pub.categoria}</span>
                    <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>star</span>
                      <span>{pub.calificacion}/5</span>
                    </span>
                    {pub.esPropia && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1 d-none d-sm-inline-flex align-items-center"
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

                {imagenesPublicacion.length === 1 && (
                  <div className="mb-3 bg-light rounded-3 border text-center overflow-hidden p-2">
                    <img
                      src={imagenesPublicacion[0]}
                      alt={pub.titulo}
                      loading="lazy"
                      className="img-fluid rounded-2"
                      style={{ maxHeight: '360px', objectFit: 'contain' }}
                    />
                  </div>
                )}
                {imagenesPublicacion.length > 1 && (
                  <div className="row g-2 mb-3">
                    {imagenesPublicacion.map((imgSrc, indice) => (
                      <div
                        key={indice}
                        className={imagenesPublicacion.length === 2 ? 'col-6' : 'col-6 col-md-3'}
                      >
                        <div className="bg-light rounded-3 border overflow-hidden p-1 h-100 d-flex align-items-center justify-content-center">
                          <img
                            src={imgSrc}
                            alt={`${pub.titulo} ${indice + 1}`}
                            loading="lazy"
                            className="img-fluid rounded-2 w-100"
                            style={{ height: '190px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    ))}
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
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted">
                                  {new Date(comentario.fechaCreacion).toLocaleDateString()}
                                </small>
                                {comentario.esPropio && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm rounded-pill px-2 py-0 d-inline-flex align-items-center"
                                    disabled={eliminandoComentarioId === comentario.id}
                                    onClick={() => manejarEliminarComentario(pub.id, comentario.id)}
                                    aria-label="Eliminar comentario"
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="small text-muted mb-0">{comentario.contenido}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {usuario ? (
                      <form className="d-flex flex-column flex-sm-row gap-2" onSubmit={(evento) => manejarEnviarComentario(evento, pub.id)}>
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
                          className="btn btn-success btn-sm rounded-pill px-3 text-white text-nowrap align-self-end align-self-sm-auto"
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
          {hayMas && (
            <div className="text-center pt-2">
              <button
                type="button"
                className="btn btn-outline-success rounded-pill px-4"
                disabled={cargandoMas}
                onClick={() => cargarPublicaciones(categoriaActiva, orden, busqueda, paginaActual + 1, true)}
              >
                {cargandoMas ? 'Cargando más...' : 'Cargar más opiniones'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

