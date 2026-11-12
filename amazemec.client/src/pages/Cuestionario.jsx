import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cuestionario() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1..9, 'pFinal', 'Rmn', 'pRecomendaciones'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    relacion: 'Familia',
    ocasion: '',
    edad: 25,
    pasatiempos: '',
    personalidad: '',
    objetoQuerido: '',
    objetoNoquerido: '',
    presupuesto: 500,
    fechaLimite: '',
    dias: 7
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelacionSelect = (valor) => {
    setFormData((prev) => ({ ...prev, relacion: valor }));
  };

  const handleFechaChange = (e) => {
    const val = e.target.value;
    let diasCalculados = 7;
    if (val) {
      const targetDate = new Date(val);
      const today = new Date();
      const diffTime = targetDate - today;
      diasCalculados = Math.max(1, Math.min(31, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
    }
    setFormData((prev) => ({
      ...prev,
      fechaLimite: val,
      dias: diasCalculados
    }));
  };

  const progressPercent = typeof step === 'number' ? Math.round((step / 9) * 100) : 100;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cuestionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          relacion: formData.relacion,
          edad: parseInt(formData.edad) || 18,
          ocasion: formData.ocasion || 'Ocasión especial',
          pasatiempos: formData.pasatiempos || 'General',
          personalidad: formData.personalidad || 'Alegre',
          objetoQuerido: formData.objetoQuerido || '',
          objetoNoquerido: formData.objetoNoquerido || '',
          presupuesto: parseFloat(formData.presupuesto) || 0,
          dias: parseInt(formData.dias) || 1
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el cuestionario.');
      }

      setResultado(data);

      if (data.esAnonimo && data.mostrarModalPendientes) {
        setMostrarModal(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '680px' }}>
      {/* Progress Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary small fw-medium">Progreso del cuestionario</span>
          <span className="small fw-semibold text-secondary">
            {typeof step === 'number' ? `Paso ${step} de 9` : 'Revisión final'}
          </span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* STEP 1: Relación */}
      {step === 1 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Qué relación tienes con esa persona?</h4>
            <small className="text-muted fw-medium">1 / 9</small>
          </div>
          <p className="text-muted small mb-4">
            Selecciona el vínculo que mejor describa a la persona para personalizar las sugerencias.
          </p>

          <div className="mb-4">
            <div className="row g-3 justify-content-center text-center">
              {[
                { id: 'Familia', label: 'Familia', img: '/Images/Iconos/Familia.jpeg' },
                { id: 'Amigos', label: 'Amigos', img: '/Images/Iconos/Amigos.jpeg' },
                { id: 'Pareja', label: 'Pareja', img: '/Images/Iconos/Pareja.jpeg' },
                { id: 'Trabajo', label: 'Trabajo', img: '/Images/Iconos/Trabajo.jpeg' }
              ].map((item) => (
                <div key={item.id} className="col-6 col-sm-3">
                  <div
                    className={`choice-card-google ${formData.relacion === item.id ? 'selected' : ''}`}
                    onClick={() => handleRelacionSelect(item.id)}
                  >
                    <div className="choice-icon-wrap">
                      <img src={item.img} className="w-100 h-100 object-fit-cover imgP" alt={item.label} />
                    </div>
                    <span className="choice-label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="row justify-content-center mt-3">
              <label className="text-center text-secondary small fw-medium">
                Opción elegida: <span className="text-success fw-bold">{formData.relacion}</span>
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end pt-2 border-top">
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(2)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Ocasión */}
      {step === 2 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Cuál es la ocasión?</h4>
            <small className="text-muted fw-medium">2 / 9</small>
          </div>
          <p className="text-muted small mb-4">Indica la celebración o motivo especial de este obsequio.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Motivo o evento</label>
            <input
              type="text"
              name="ocasion"
              value={formData.ocasion}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Cumpleaños, Aniversario, Graduación, Navidad..."
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(1)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(3)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Edad */}
      {step === 3 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Qué edad tiene aproximadamente?</h4>
            <small className="text-muted fw-medium">3 / 9</small>
          </div>
          <p className="text-muted small mb-4">La edad nos ayuda a calibrar la madurez y utilidad del obsequio.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Edad en años</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. 25"
              min="1"
              max="120"
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(2)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(4)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Pasatiempos */}
      {step === 4 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Cuál es su pasatiempo favorito?</h4>
            <small className="text-muted fw-medium">4 / 9</small>
          </div>
          <p className="text-muted small mb-4">¿Qué actividades o hobbies disfruta en su tiempo libre?</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Pasatiempos / Intereses</label>
            <input
              type="text"
              name="pasatiempos"
              value={formData.pasatiempos}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Lectura, Videojuegos, Cocina, Deporte, Jardinería..."
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(3)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(5)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Personalidad */}
      {step === 5 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Cómo describirías su personalidad?</h4>
            <small className="text-muted fw-medium">5 / 9</small>
          </div>
          <p className="text-muted small mb-4">Rasgos clave de su forma de ser que definan el estilo del regalo.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Rasgos de personalidad</label>
            <input
              type="text"
              name="personalidad"
              value={formData.personalidad}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Extrovertido, Analítico, Artístico, Minimalista, Aventurero..."
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(4)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(6)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Objeto Querido */}
      {step === 6 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Ha mencionado algo que quiera últimamente?</h4>
            <small className="text-muted fw-medium">6 / 9</small>
          </div>
          <p className="text-muted small mb-4">Algún deseo, comentario o pista que haya dejado caer recientemente.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Objeto o detalle deseado (opcional)</label>
            <input
              type="text"
              name="objetoQuerido"
              value={formData.objetoQuerido}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Unos auriculares, una mochila, un termo, un libro específico..."
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(5)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(7)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Objeto No Querido */}
      {step === 7 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Ha mencionado algo que no quiera?</h4>
            <small className="text-muted fw-medium">7 / 9</small>
          </div>
          <p className="text-muted small mb-4">Cosas que no le gustan o que ya tiene repetidas para evitar errores.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Cosas a descartar (opcional)</label>
            <input
              type="text"
              name="objetoNoquerido"
              value={formData.objetoNoquerido}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej. Ropa, adornos pequeños, cosas de color amarillo..."
            />
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(6)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(8)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Presupuesto */}
      {step === 8 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Cuál es el presupuesto estimado?</h4>
            <small className="text-muted fw-medium">8 / 9</small>
          </div>
          <p className="text-muted small mb-4">Ajustaremos los productos exactamente a tu capacidad de gasto.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Monto aproximado en moneda local</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                className="form-control"
                placeholder="500"
                min="0"
                step="10"
              />
            </div>
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(7)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep(9)}
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: Fecha Límite */}
      {step === 9 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-dark fw-bold">¿Para cuándo es el regalo?</h4>
            <small className="text-muted fw-medium">9 / 9</small>
          </div>
          <p className="text-muted small mb-4">Nos permite priorizar opciones con disponibilidad y entrega inmediata.</p>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Fecha límite de entrega</label>
            <input
              type="date"
              name="fechaLimite"
              value={formData.fechaLimite}
              onChange={handleFechaChange}
              className="form-control"
            />
            <small className="text-muted d-block mt-2">Días estimados para la entrega: {formData.dias} días</small>
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(8)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep('pFinal')}
            >
              <span>Revisar respuestas</span>
              <span className="material-symbols-outlined fs-6">check</span>
            </button>
          </div>
        </div>
      )}

      {/* COMPLETION SCREEN: pFinal */}
      {step === 'pFinal' && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm text-center">
          <div className="mb-3">
            <span className="material-symbols-outlined text-success" style={{ fontSize: '56px' }}>
              task_alt
            </span>
          </div>
          <h4 className="mb-2 text-dark fw-bold">¡Cuestionario completado!</h4>
          <p className="text-muted mb-4">Revisa un resumen de tus datos antes de calcular las mejores recomendaciones.</p>
          <div className="d-flex justify-content-between pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep(9)}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Modificar fecha</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => setStep('Rmn')}
            >
              <span>Ver Resumen</span>
              <span className="material-symbols-outlined fs-6">visibility</span>
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY SCREEN: Rmn */}
      {step === 'Rmn' && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm text-start">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-success">fact_check</span>
            <h4 className="mb-0 text-dark fw-bold">Resumen de respuestas</h4>
          </div>
          <p className="text-muted small mb-3">Verifica que la información capturada sea la correcta:</p>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Relación</label>
              <input value={formData.relacion} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Edad aproximada</label>
              <input value={`${formData.edad} años`} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Ocasión</label>
              <input value={formData.ocasion || 'No especificado'} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Pasatiempos</label>
              <input value={formData.pasatiempos || 'No especificado'} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Personalidad</label>
              <input value={formData.personalidad || 'No especificado'} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Objeto querido</label>
              <input value={formData.objetoQuerido || 'Ninguno'} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Objeto no querido</label>
              <input value={formData.objetoNoquerido || 'Ninguno'} className="form-control bg-light" readOnly />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-semibold text-secondary">Presupuesto</label>
              <input value={`$${formData.presupuesto}`} className="form-control bg-light" readOnly />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">Días estimados</label>
              <input value={`${formData.dias} días`} className="form-control bg-light" readOnly />
            </div>
          </div>

          <div className="d-flex justify-content-between pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={() => setStep('pFinal')}
            >
              <span className="material-symbols-outlined fs-6">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-inline-flex align-items-center gap-1"
              onClick={() => {
                setStep('pRecomendaciones');
                handleSubmit();
              }}
            >
              <span>Continuar y Guardar</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* PROCESSING & RECOMMENDATION SCREEN: pRecomendaciones */}
      {step === 'pRecomendaciones' && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm text-center">
          {loading ? (
            <div className="py-4">
              <div className="google-spinner"></div>
              <h4 className="fw-bold mb-2 text-dark">Procesando respuestas...</h4>
              <p className="text-muted small mb-0" style={{ maxWidth: '420px', margin: '0 auto' }}>
                Estamos calculando y cruzando los criterios de personalidad, ocasión y presupuesto para generar tus recomendaciones ideales.
              </p>
            </div>
          ) : (
            <div className="py-3">
              <span className="material-symbols-outlined text-success" style={{ fontSize: '64px' }}>
                check_circle
              </span>
              <h4 className="fw-bold mb-2 text-dark">¡Respuestas procesadas exitosamente!</h4>
              <p className="text-muted mb-4">{resultado?.mensaje}</p>

              {resultado?.puntosGanados > 0 && (
                <div className="alert alert-success d-inline-flex align-items-center gap-2 mb-4 px-4 py-2 rounded-pill">
                  <span className="material-symbols-outlined">stars</span>
                  <span>+{resultado.puntosGanados} Amazings acreditados a tu cuenta</span>
                </div>
              )}

              <div className="d-flex justify-content-center gap-3">
                <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
                  Ir al Inicio
                </Link>
                {user ? (
                  <Link to="/recompensas" className="btn btn-success rounded-pill px-4 text-white">
                    Ver mis Recompensas
                  </Link>
                ) : (
                  <button
                    className="btn btn-success rounded-pill px-4 text-white"
                    onClick={() => setMostrarModal(true)}
                  >
                    Reclamar 50 Amazings
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 50 AMAZINGS PENDIENTES (Exacto al de AmazeMe) */}
      {mostrarModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(32, 33, 36, 0.65)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded-4 p-4 bg-white shadow-lg">
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success fs-3">stars</span>
                  <h5 className="modal-title fw-bold text-dark">¡Cuestionario completado!</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setMostrarModal(false);
                    navigate('/');
                  }}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-3 text-success fs-5 fw-bold">
                  <span className="material-symbols-outlined align-middle me-1 fs-4">stars</span>
                  <span>+50 Amazings listos para ti</span>
                </div>
                <h5 className="text-dark fw-bold mb-2">
                  Tienes <span className="text-success">50 Amazings</span> pendientes por reclamar
                </h5>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Crea una cuenta o inicia sesión ahora mismo para abonar estos puntos a tu balance de fidelidad y canjearlos por dinero para futuras compras.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => {
                    setMostrarModal(false);
                    navigate('/');
                  }}
                >
                  Más tarde
                </button>
                <Link
                  to={`/entrar?returnUrl=/recompensas&ultimaRespuestaId=${resultado?.id || ''}`}
                  className="btn btn-success rounded-pill px-4 fw-medium text-white shadow-sm"
                  onClick={() => setMostrarModal(false)}
                >
                  Iniciar sesión para reclamar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

