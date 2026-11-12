import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './pages/Menu';
import Cuestionario from './pages/Cuestionario';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Recompensas from './pages/Recompensas';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Navigate to="/" replace />} />
          <Route path="/cuestionario" element={<Cuestionario />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}