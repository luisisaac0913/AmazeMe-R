import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/entrar');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky-top bg-white">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <Link to="/" onClick={closeMenu} className="navbar-brand d-inline-flex align-items-center py-0 fw-bold fs-5 text-dark me-3">
            <img
              src="/Images/Iconos/Amazeme_logo.png"
              alt="AmazeMe"
              width="30"
              height="30"
              className="d-inline-block align-text-top me-2 rounded-2"
            />
            <span className="brand-title">
              Amaze<span className="brand-accent">Me</span>
            </span>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none p-1"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-controls="navMenuAmaze"
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined fs-2 text-dark">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navMenuAmaze">
            <ul className="navbar-nav ms-auto align-items-start align-items-lg-center gap-2 my-3 my-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                  end
                >
                  <span className="d-inline-flex align-items-center gap-1">
                    <span className="material-symbols-outlined fs-6">home</span>
                    <span>Inicio</span>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/cuestionario"
                  onClick={closeMenu}
                  className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  <span className="d-inline-flex align-items-center gap-1">
                    <span className="material-symbols-outlined fs-6">quiz</span>
                    <span>Cuestionario</span>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/foro"
                  onClick={closeMenu}
                  className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  <span className="d-inline-flex align-items-center gap-1">
                    <span className="material-symbols-outlined fs-6">forum</span>
                    <span>Foro</span>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/recompensas"
                  onClick={closeMenu}
                  className={({ isActive }) => `badge-recompensas text-decoration-none ${isActive ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined fs-6 me-1">stars</span>
                  <span>Recompensas</span>
                </NavLink>
              </li>

              {user ? (
                <>
                  <li className="nav-item ms-lg-2">
                    <NavLink
                      to="/perfil"
                      onClick={closeMenu}
                      className={({ isActive }) => `nav-link nav-link-custom nav-profile-pill d-inline-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
                      title="Mi Perfil"
                    >
                      <div className="user-avatar-circle nav-avatar-sm flex-shrink-0">
                        {user.fotoPerfil ? (
                          <img src={user.fotoPerfil} alt={user.nombre} className="w-100 h-100 object-fit-cover rounded-circle" />
                        ) : (
                          <span className="material-symbols-outlined fs-6">person</span>
                        )}
                      </div>
                      <span className="fw-medium nav-username-truncate">{user.nombre}</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 text-nowrap"
                    >
                      <span className="material-symbols-outlined fs-6">logout</span>
                      <span>Salir</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ms-lg-2">
                    <NavLink
                      to="/entrar"
                      onClick={closeMenu}
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 fw-medium text-nowrap"
                    >
                      Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/registrar"
                      onClick={closeMenu}
                      className="btn btn-success btn-sm rounded-pill px-3 py-1 fw-medium text-white shadow-sm text-nowrap"
                    >
                      Registrarse
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
