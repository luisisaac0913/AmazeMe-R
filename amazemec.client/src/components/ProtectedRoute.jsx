import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="google-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/entrar?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
