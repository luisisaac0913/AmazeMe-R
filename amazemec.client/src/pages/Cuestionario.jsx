import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generarRecomendaciones } from '../utils/recomendaciones';

const MENSAJES_ANALISIS = [
    'Analizando personalidad, gustos y ocasión...',
    'Filtrando opciones ajustadas a tu presupuesto...',
    'Calculando tiempos de entrega disponibles...',
    'Seleccionando las mejores recomendaciones para ti...'
];

export default function Cuestionario() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [indiceMensaje, establecerIndiceMensaje] = useState(0);
    const [progresoAnalisis, establecerProgresoAnalisis] = useState(15);
    const [recomendaciones, establecerRecomendaciones] = useState([]);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

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

    const getTodayLocalISO = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const handleFechaChange = (e) => {
        const val = e.target.value;
        let diasCalculados = 7;
        if (val) {
            const [y, m, d] = val.split('-').map(Number);
            const targetDate = new Date(y, m - 1, d);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const diffTime = targetDate - today;
            diasCalculados = Math.max(1, Math.min(31, Math.round(diffTime / (1000 * 60 * 60 * 24))));
        }
        setFormData((prev) => ({
            ...prev,
            fechaLimite: val,
            dias: diasCalculados
        }));
    };

    const compartirEnForo = (productoEspecifico = null) => {
        const ocasionTexto = formData.ocasion?.trim() || 'Ocasión especial';
        const lineasResultados = [
            productoEspecifico
                ? `¡Hola comunidad! AmazeMe me recomendó "${productoEspecifico.nombre}" ($${productoEspecifico.precio} MXN) tras completar el cuestionario y quiero saber qué opinan:`
                : '¡Hola comunidad! Acabo de completar el cuestionario de AmazeMe y estas fueron algunas de mis recomendaciones principales:',
            '',
            `• Relación: ${formData.relacion}`,
            `• Edad aproximada: ${formData.edad} años`,
            `• Ocasión: ${ocasionTexto}`,
            `• Pasatiempos: ${formData.pasatiempos?.trim() || 'No especificado'}`,
            `• Personalidad: ${formData.personalidad?.trim() || 'No especificado'}`,
            `• Presupuesto estimado: $${formData.presupuesto}`,
            `• Días disponibles: ${formData.dias} días`
        ];

        if (formData.objetoQuerido?.trim()) {
            lineasResultados.push(`• Le gustaría: ${formData.objetoQuerido.trim()}`);
        }
        if (formData.objetoNoquerido?.trim()) {
            lineasResultados.push(`• Evitar: ${formData.objetoNoquerido.trim()}`);
        }

        if (productoEspecifico) {
            lineasResultados.push(
                '',
                `Producto recomendado: ${productoEspecifico.nombre} (${productoEspecifico.coincidencia}% de coincidencia • ${productoEspecifico.razon}).`
            );
        } else if (recomendaciones.length > 0) {
            lineasResultados.push('', 'Top recomendaciones sugeridas:');
            recomendaciones.slice(0, 5).forEach((item, indice) => {
                lineasResultados.push(`${indice + 1}. ${item.nombre} — $${item.precio} MXN (${item.coincidencia}% match)`);
            });
        }

        lineasResultados.push('', '¿Qué opinan de estas opciones o cuál elegirían ustedes?');

        navigate('/foro', {
            state: {
                borradorForo: {
                    titulo: productoEspecifico
                        ? `¿Qué opinan de "${productoEspecifico.nombre}" para ${formData.relacion}?`
                        : `Mis recomendaciones para ${formData.relacion} (${ocasionTexto})`,
                    categoria: 'Recomendación',
                    regaloMencionado: productoEspecifico?.nombre || formData.objetoQuerido?.trim() || '',
                    contenido: lineasResultados.join('\n')
                }
            }
        });
    };

    const progressPercent = typeof step === 'number' ? Math.round((step / 9) * 100) : 100;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        establecerIndiceMensaje(0);
        establecerProgresoAnalisis(15);

        const temporizadorMensajes = setInterval(() => {
            establecerIndiceMensaje((previo) => (previo + 1) % MENSAJES_ANALISIS.length);
            establecerProgresoAnalisis((previo) => Math.min(92, previo + 22));
        }, 750);

        const esperaMinima = new Promise((resolver) => setTimeout(resolver, 3000));

        try {
            const [response] = await Promise.all([
                fetch('/api/cuestionario', {
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
                }),
                esperaMinima
            ]);

            const rawText = await response.text();
            let data = null;
            if (rawText) {
                try {
                    data = JSON.parse(rawText);
                } catch {
                    data = null;
                }
            }

            if (!response.ok) {
                const validationError =
                    data?.errors && typeof data.errors === 'object'
                        ? Object.values(data.errors).flat().find(Boolean)
                        : null;
                throw new Error(data?.error || validationError || 'Error al guardar el cuestionario.');
            }

            establecerProgresoAnalisis(100);
            establecerRecomendaciones(generarRecomendaciones(formData));
            setResultado(data);

            if (data.esAnonimo && data.mostrarModalPendientes) {
                setMostrarModal(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            clearInterval(temporizadorMensajes);
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
                            min={getTodayLocalISO()}
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
                        <div className="py-5">
                            <div className="google-spinner"></div>
                            <h4 className="fw-bold mb-2 text-dark">Procesando respuestas...</h4>
                            <p className="text-success fw-medium small mb-3">
                                {MENSAJES_ANALISIS[indiceMensaje]}
                            </p>
                            <div className="progress mx-auto mb-3" style={{ maxWidth: '380px', height: '8px' }}>
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                    role="progressbar"
                                    style={{ width: `${progresoAnalisis}%` }}
                                ></div>
                            </div>
                            <p className="text-muted small mb-0" style={{ maxWidth: '420px', margin: '0 auto' }}>
                                Estamos cruzando criterios de personalidad, ocasión y presupuesto para encontrar tus regalos ideales.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="py-3">
                            <span className="material-symbols-outlined text-danger" style={{ fontSize: '64px' }}>
                                error
                            </span>
                            <h4 className="fw-bold mb-2 text-dark">No se pudo guardar el cuestionario</h4>
                            <p className="text-muted mb-4">{error}</p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => {
                                        setError(null);
                                        setStep('Rmn');
                                    }}
                                >
                                    Volver al Resumen
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success rounded-pill px-4 text-white"
                                    onClick={() => handleSubmit()}
                                >
                                    Reintentar
                                </button>
                            </div>
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
                                    <span>+{resultado.puntosGanados} {resultado.puntosGanados === 1 ? 'Amazing acreditado' : 'Amazings acreditados'} a tu cuenta</span>
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                                <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
                                    Ir al Inicio
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-outline-success rounded-pill px-4 d-inline-flex align-items-center gap-2"
                                    onClick={() => compartirEnForo()}
                                >
                                    <span className="material-symbols-outlined fs-6">share</span>
                                    <span>Compartir en el Foro</span>
                                </button>
                                {user ? (
                                    <Link to="/recompensas" className="btn btn-success rounded-pill px-4 text-white">
                                        Ver mis Recompensas
                                    </Link>
                                ) : (
                                    <button
                                        className="btn btn-success rounded-pill px-4 text-white"
                                        onClick={() => setMostrarModal(true)}
                                    >
                                        Reclamar 1 Amazing
                                    </button>
                                )}
                            </div>

                            {recomendaciones.length > 0 && (
                                <div className="text-start pt-4 border-top">
                                    <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center gap-2 mb-3">
                                        <div>
                                            <h5 className="fw-bold text-dark mb-1">
                                                {recomendaciones.length} Regalos Recomendados para ti
                                            </h5>
                                            <p className="text-muted small mb-0">
                                                Ordenados por compatibilidad con tu encuesta y presupuesto
                                            </p>
                                        </div>
                                        <span className="badge bg-success text-white align-self-start align-self-sm-center">
                                            {recomendaciones.length} opciones
                                        </span>
                                    </div>

                                    <div className="row g-3">
                                        {recomendaciones.map((producto, indice) => (
                                            <div
                                                key={producto.id}
                                                className="col-12 col-md-6 tarjeta-recomendacion"
                                                style={{ animationDelay: `${Math.min(indice * 45, 900)}ms` }}
                                            >
                                                <div className="card h-100 border rounded-4 p-3 bg-white shadow-sm d-flex flex-column justify-content-between">
                                                    <div>
                                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    className="user-avatar-circle flex-shrink-0"
                                                                    style={{ width: '40px', height: '40px' }}
                                                                >
                                                                    <span className="material-symbols-outlined fs-5">
                                                                        {producto.icono}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="badge bg-light border text-secondary small">
                                                                        {producto.categoria}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="badge bg-success-subtle text-success">
                                                                {producto.coincidencia}% match
                                                            </span>
                                                        </div>

                                                        <h6 className="fw-bold text-dark mb-1">{producto.nombre}</h6>
                                                        <p className="text-muted small mb-2">{producto.razon}</p>

                                                        <div className="d-flex justify-content-between align-items-center small mb-3">
                                                            <span className="fw-bold text-dark fs-6">
                                                                ${producto.precio} MXN
                                                            </span>
                                                            <span className="text-muted d-inline-flex align-items-center gap-1">
                                                                <span className="material-symbols-outlined text-success" style={{ fontSize: '16px' }}>
                                                                    star
                                                                </span>
                                                                <span>{producto.calificacion}</span>
                                                                <span>• {producto.entrega}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <a
                                                            href={producto.enlaceAmazon}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-success btn-sm rounded-pill flex-grow-1 text-white d-inline-flex align-items-center justify-content-center gap-1"
                                                        >
                                                            <span>Ver opción</span>
                                                            <span className="material-symbols-outlined fs-6">open_in_new</span>
                                                        </a>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success btn-sm rounded-pill px-3 d-inline-flex align-items-center justify-content-center gap-1"
                                                            onClick={() => compartirEnForo(producto)}
                                                            aria-label={`Compartir ${producto.nombre} en el foro`}
                                                        >
                                                            <span className="material-symbols-outlined fs-6">forum</span>
                                                            <span>Foro</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* MODAL 1 AMAZING PENDIENTE */}
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
                                    aria-label="Cerrar"
                                    onClick={() => setMostrarModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center py-4">
                                <div className="mb-3 text-success fs-5 fw-bold">
                                    <span className="material-symbols-outlined align-middle me-1 fs-4">stars</span>
                                    <span>+1 Amazing listo para ti</span>
                                </div>
                                <h5 className="text-dark fw-bold mb-2">
                                    Tienes <span className="text-success">1 Amazing</span> pendiente por reclamar
                                </h5>
                                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                                    Crea una cuenta o inicia sesión ahora mismo para abonar este punto diario a tu balance de fidelidad y combinarlo con tus compras para canjear recompensas.
                                </p>
                            </div>
                            <div className="modal-footer border-0 pt-0 d-flex justify-content-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => setMostrarModal(false)}
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

