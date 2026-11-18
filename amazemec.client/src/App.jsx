import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './pages/Menu';
import Cuestionario from './pages/Cuestionario';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Recompensas from './pages/Recompensas';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import Quejas from './pages/Quejas';
import Foro from './pages/Foro';
import { inicializarAnalitica, registrarVistaPagina } from './utils/analitica';

export default function App() {
  const ubicacion = useLocation();
  const rutaNormalizada = ubicacion.pathname.toLowerCase();
  const esRutaAuth = rutaNormalizada === '/entrar' || rutaNormalizada === '/registrar';

  useEffect(() => {
    inicializarAnalitica();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    registrarVistaPagina(ubicacion.pathname + ubicacion.search);
  }, [ubicacion.pathname, ubicacion.search]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!esRutaAuth && <Navbar />}
      <main className={`flex-grow-1 ${esRutaAuth ? 'd-flex align-items-center justify-content-center bg-light' : ''}`}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Navigate to="/" replace />} />
          <Route path="/cuestionario" element={<Cuestionario />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recompensas"
            element={
              <ProtectedRoute>
                <Recompensas />
              </ProtectedRoute>
            }
          />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/quejas" element={<Quejas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!esRutaAuth && <Footer />}
      <CookieConsent />
    </div>
  );
}