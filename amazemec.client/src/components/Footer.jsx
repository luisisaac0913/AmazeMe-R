import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer mt-auto py-4 bg-white border-top">
      <div className="container">
        <div className="row align-items-center gy-3 text-center text-md-start">
          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <img
                src="/Images/Iconos/Amazeme_logo.png"
                alt="AmazeMe"
                width="24"
                height="24"
                className="rounded"
              />
              <span className="fw-bold text-dark">
                Amaze<span className="brand-accent">Me</span>
              </span>
            </div>
            <p className="text-muted small mb-0">
              Recomendador inteligente de regalos impulsado por algoritmos de preferencias y recompensas.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small">
              <Link to="/privacidad" className="text-secondary text-decoration-none hover-link">
                Privacidad
              </Link>
              <span className="text-muted">&bull;</span>
              <Link to="/terminos" className="text-secondary text-decoration-none hover-link">
                Términos
              </Link>
              <span className="text-muted">&bull;</span>
              <span className="text-muted">&copy; {new Date().getFullYear()} AmazeMe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
