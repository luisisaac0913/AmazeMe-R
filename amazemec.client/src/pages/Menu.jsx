import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      img: 'https://m.media-amazon.com/images/I/714FNORosWL._AC_SX342_SY445_QL70_ML2_.jpg',
      tag: 'Decoración & Fiesta',
      title: 'DAHAN Guirnalda de Luces de Halloween, 20M 200 LED',
      desc: 'Crea un ambiente festivo y original con luces impermeables con 8 modos de iluminación ajustables para interiores y exteriores.'
    },
    {
      img: 'https://m.media-amazon.com/images/I/71Z6h+gWgnL._AC_SY300_SX300_QL70_ML2_.jpg',
      tag: 'Tecnología & Cine',
      title: 'Wanbo X7 Pro MAX Proyector 4K Portátil con Google TV',
      desc: 'Con 1500 lúmenes ANSI y Dolby Audio, ofrece imágenes nítidas y colores vivos incluso en exteriores para noches de cine inolvidables.'
    },
    {
      img: 'https://m.media-amazon.com/images/I/51zkNhKcjkL._AC_SY300_SX300_QL70_ML2_.jpg',
      tag: 'Cuidado Personal',
      title: 'Nautica Blue Eau de Toilette para Hombre, 100 ml',
      desc: 'Fragancia aromática acuática refrescante, clásica y distinguida, ideal para uso diario o regalo de aniversario.'
    }
  ];

  return (
    <div className="container my-4">
      {/* Hero Section */}
      <div className="p-4 p-md-5 mb-5 bg-white border hero-google text-center position-relative overflow-hidden">
        <div className="py-3 py-md-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3 text-dark">¿No sabes qué regalar?</h1>
          <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '620px', lineHeight: 1.6 }}>
            Responde nuestro cuestionario guiado de 9 preguntas y recibe recomendaciones perfectamente personalizadas para cualquier ocasión.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/cuestionario"
              className="btn btn-success btn-lg px-4 py-2 rounded-pill fw-medium shadow-sm d-inline-flex align-items-center gap-2"
            >
              <span>Comenzar Encuesta</span>
              <span className="material-symbols-outlined fs-5">arrow_forward</span>
            </Link>
            <a href="#comoFunciona" className="btn btn-outline-secondary btn-lg px-4 py-2 rounded-pill fw-medium">
              <span>Cómo funciona</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-5 text-center">
        <div className="col-6 col-md-4">
          <div className="card border rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-center mb-2">
              <span className="material-symbols-outlined text-success fs-2">verified</span>
            </div>
            <h3 className="display-6 fw-bold text-dark mb-1">+500</h3>
            <p className="text-muted small mb-0 fw-medium">Regalos acertados</p>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-center mb-2">
              <span className="material-symbols-outlined text-success fs-2">savings</span>
            </div>
            <h3 className="display-6 fw-bold text-dark mb-1">100%</h3>
            <p className="text-muted small mb-0 fw-medium">Ajustado a tu presupuesto</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-center mb-2">
              <span className="material-symbols-outlined text-success fs-2">timer</span>
            </div>
            <h3 className="display-6 fw-bold text-dark mb-1">0</h3>
            <p className="text-muted small mb-0 fw-medium">Minutos perdidos dudando</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-5 pt-3" id="comoFunciona">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-dark mb-1">¿Cómo funciona?</h2>
          <p className="text-muted small">El camino más fácil para acertar con cualquier obsequio</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4 movimiento_Seleccionado">
            <div className="card h-100 border rounded-4 text-center p-4 bg-white">
              <div className="d-flex justify-content-center mb-3">
                <span className="badge bg-success-subtle text-success rounded-circle p-2 fs-5">1</span>
              </div>
              <div className="mb-3">
                <img
                  src="/Images/Iconos/EncuestaImagen.png"
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '120px', objectFit: 'contain' }}
                  alt="Encuesta"
                />
              </div>
              <div className="card-body p-0">
                <h5 className="fw-bold mb-2 text-dark">1. Responde la encuesta</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Cuéntanos los gustos, personalidad y relación de esa persona especial.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 movimiento_Seleccionado">
            <div className="card h-100 border rounded-4 text-center p-4 bg-white">
              <div className="d-flex justify-content-center mb-3">
                <span className="badge bg-success-subtle text-success rounded-circle p-2 fs-5">2</span>
              </div>
              <div className="mb-3">
                <img
                  src="/Images/Iconos/ProcesandoEncuestaImagen.png"
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '120px', objectFit: 'contain' }}
                  alt="Análisis"
                />
              </div>
              <div className="card-body p-0">
                <h5 className="fw-bold mb-2 text-dark">2. Nosotros analizamos</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Procesamos los datos para seleccionar opciones que encajen a la perfección.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 movimiento_Seleccionado">
            <div className="card h-100 border rounded-4 text-center p-4 bg-white">
              <div className="d-flex justify-content-center mb-3">
                <span className="badge bg-success-subtle text-success rounded-circle p-2 fs-5">3</span>
              </div>
              <div className="mb-3">
                <img
                  src="/Images/Iconos/RecompensaEncuestaImagen.png"
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '120px', objectFit: 'contain' }}
                  alt="Recompensas"
                />
              </div>
              <div className="card-body p-0">
                <h5 className="fw-bold mb-2 text-dark">3. Gana recompensas</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Acumula Amazings con tus compras para canjear dinero en futuros regalos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Carousel */}
      <div className="mb-5">
        <div className="card border rounded-4 p-4 p-lg-5 bg-white">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-1 text-success small fw-medium mb-1">
              <span className="material-symbols-outlined fs-5">storefront</span>
              <span>Recomendaciones destacadas</span>
            </div>
            <h2 className="h3 fw-bold text-dark">Productos más recomendados</h2>
            <p className="text-muted small mb-0">Ideas comprobadas por usuarios satisfechos</p>
          </div>

          <div className="position-relative">
            <div className="rounded-4 border bg-white p-4 p-md-5">
              <div className="row align-items-center justify-content-center mx-auto" style={{ minHeight: '260px', maxWidth: '920px' }}>
                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                  <img
                    src={slides[currentSlide].img}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                    alt={slides[currentSlide].title}
                  />
                </div>
                <div className="col-12 col-md-7 d-flex flex-column justify-content-center text-start px-md-4">
                  <span className="text-success fw-bold small text-uppercase mb-2 align-self-start" style={{ letterSpacing: '0.5px' }}>
                    {slides[currentSlide].tag}
                  </span>
                  <h4 className="fw-bold text-dark mb-2">{slides[currentSlide].title}</h4>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    {slides[currentSlide].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel navigation controls */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`btn btn-sm rounded-circle p-1 ${currentSlide === idx ? 'btn-success' : 'btn-outline-secondary'}`}
                  style={{ width: '12px', height: '12px' }}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand & Video Section */}
      <div className="card border rounded-4 p-4 p-lg-5 mb-5 bg-white">
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src="/Images/Iconos/Amazeme_logo.png"
            alt="AmazeMe Logo"
            width="44"
            height="44"
            className="rounded-3 shadow-sm"
          />
          <h2 className="h3 fw-bold text-dark mb-0">
            ¡Bienvenido a Amaze<span className="brand-accent">Me</span>!
          </h2>
        </div>
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden border">
              <iframe
                src="https://www.youtube-nocookie.com/embed/yExkhFPVblo"
                title="Video explicativo"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col-lg-6">
            <h4 className="fw-bold mb-3 text-dark">Innovación en la búsqueda de regalos</h4>
            <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
              En Amaze<span className="brand-accent">Me</span> convertimos la indecisión de regalar en una experiencia guiada y certera. Hemos integrado un algoritmo de búsqueda que procesa gustos, personalidad y presupuesto para entregarte opciones con disponibilidad inmediata en catálogo digital.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
              Además, incorporamos el módulo de recompensas con acumulación automática de <strong className="text-success fw-bold">Amazings</strong> en cada compra confirmada.
            </p>
            <div className="row g-2 pt-1">
              <div className="col-sm-6">
                <div className="d-flex align-items-center text-secondary small gap-2">
                  <span className="material-symbols-outlined text-success fs-5">shield</span>
                  <span>Cifrado y privacidad segura</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center text-secondary small gap-2">
                  <span className="material-symbols-outlined text-success fs-5">bolt</span>
                  <span>Filtro de entrega inmediata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Promo Card */}
      <div className="card border rounded-4 p-4 p-lg-5 mb-5 bg-white">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <h2 className="h3 fw-bold text-dark mb-3">
              Tus compras generan <span className="brand-accent">recompensas</span>
            </h2>
            <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
              ¡Al comprar con nosotros siempre ganas! Por cada compra concretada a través de nuestros enlaces afiliados recibirás un porcentaje del total en moneda de fidelidad llamada <strong className="text-success fw-bold">Amazings</strong>.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
              Resuelves el regalo perfecto para la ocasión y además acumulas saldo directo para reducir el costo de tus próximas adquisiciones.
            </p>
            <Link
              to="/recompensas"
              className="btn btn-outline-success rounded-pill px-4 fw-medium d-inline-flex align-items-center gap-2"
            >
              <span>Consultar Recompensas</span>
              <span className="material-symbols-outlined fs-6">arrow_forward</span>
            </Link>
          </div>
          <div className="col-lg-5 text-center">
            <img
              src="/Images/Iconos/Amazings.png"
              className="img-fluid rounded-4"
              style={{ maxHeight: '220px', objectFit: 'contain' }}
              alt="Amazings"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mb-4">
        <div className="card border rounded-4 p-4 p-lg-5 bg-white">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-1 text-success small fw-medium mb-1">
              <span className="material-symbols-outlined fs-5">help</span>
              <span>Centro de Ayuda</span>
            </div>
            <h2 className="h3 fw-bold text-dark">Preguntas frecuentes</h2>
            <p className="text-muted small mb-0">Respuestas rápidas a las dudas más comunes</p>
          </div>

          <div className="accordion accordion-flush" id="SPreguntas">
            <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-medium text-dark"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPrivacidad"
                >
                  Privacidad y uso de información
                </button>
              </h2>
              <div id="faqPrivacidad" className="accordion-collapse collapse" data-bs-parent="#SPreguntas">
                <div className="accordion-body text-muted small bg-white">
                  Consulta nuestro apartado de{' '}
                  <Link to="/privacidad" className="fw-medium text-success text-decoration-none">
                    política de privacidad
                  </Link>{' '}
                  para conocer con claridad qué datos recopila la plataforma y cómo se mantienen protegidos.
                </div>
              </div>
            </div>

            <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-medium text-dark"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqAmazings"
                >
                  ¿Cómo funcionan los Amazings?
                </button>
              </h2>
              <div id="faqAmazings" className="accordion-collapse collapse" data-bs-parent="#SPreguntas">
                <div className="accordion-body text-muted small bg-white">
                  Los Amazings son los puntos de recompensa de AmazeMe. Cada compra confirmada te entrega un porcentaje que podrás ver reflejado en tu cuenta para canjear en la pestaña de{' '}
                  <Link to="/recompensas" className="fw-medium text-success text-decoration-none">
                    Recompensas
                  </Link>.
                </div>
              </div>
            </div>

            <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-medium text-dark"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqDatos"
                >
                  ¿Qué datos solicita AmazeMe para operar?
                </button>
              </h2>
              <div id="faqDatos" className="accordion-collapse collapse" data-bs-parent="#SPreguntas">
                <div className="accordion-body text-muted small bg-white">
                  Únicamente solicitamos tu nombre de usuario, correo electrónico y una contraseña encriptada de forma segura para gestionar tus favoritos y tu balance acumulado de puntos.
                </div>
              </div>
            </div>

            <div className="accordion-item border rounded-3 overflow-hidden">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fw-medium text-dark"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqCompras"
                >
                  ¿Cómo se registran las compras?
                </button>
              </h2>
              <div id="faqCompras" className="accordion-collapse collapse" data-bs-parent="#SPreguntas">
                <div className="accordion-body text-muted small bg-white">
                  Las compras se vinculan a través de los enlaces recomendados por la plataforma. Te sugerimos revisar las condiciones en el módulo de Recompensas antes de realizar tus transacciones.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

