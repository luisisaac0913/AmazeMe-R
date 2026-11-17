import { useState } from 'react';
import { Link } from 'react-router-dom';
import { inicializarAnalitica } from '../utils/analitica';

const COOKIE_KEY = 'AmazeMe_CookiesAccepted';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(COOKIE_KEY);
    } catch {
      return true;
    }
  });

  const handleDecision = (tipo) => {
    try {
      localStorage.setItem(COOKIE_KEY, tipo);
      document.cookie = `${COOKIE_KEY}=${tipo}; path=/; max-age=31536000; SameSite=Lax`;
      if (tipo === 'all') {
        inicializarAnalitica();
      }
    } catch {
      setVisible(false);
      return;
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="cookieConsentPopup" className="position-fixed bottom-0 start-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="card border rounded-4 p-4 bg-white shadow-lg">
          <div className="row align-items-center gy-3">
            <div className="col-12 col-md-8 text-start">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary fs-5">cookie</span>
                <h6 className="fw-bold text-dark mb-0">
                  Privacidad y Cookies en AmazeMe
                </h6>
              </div>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                Usamos cookies esenciales para mantener tu sesión, proteger tu cuenta y recordar tus respuestas de la encuesta. Consulta nuestra{' '}
                <Link to="/privacidad" className="text-dark fw-medium text-decoration-underline">
                  política de privacidad
                </Link>
                .
              </p>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-md-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-medium"
                onClick={() => handleDecision('essential')}
              >
                Solo esenciales
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm rounded-pill px-4 fw-medium text-white shadow-sm"
                onClick={() => handleDecision('all')}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

