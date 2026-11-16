/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comprobar si hay sesión activa al montar
  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (response.ok && active) {
          const data = await response.json();
          setUser(data);
        } else if (active) {
          setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  const parseAuthResponse = async (response, fallbackError) => {
    if (response.status === 429) {
      throw new Error('Demasiados intentos. Por favor espera un momento e inténtalo de nuevo.');
    }

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
      throw new Error(data?.error || validationError || fallbackError);
    }

    return data;
  };

  const login = async (identificador, contraseña, ultimaRespuestaId = null) => {
    const payload = { identificador, contraseña };
    if (ultimaRespuestaId) payload.ultimaRespuestaId = ultimaRespuestaId;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await parseAuthResponse(response, 'Usuario o contraseña incorrectos.');
    setUser(data);
    return data;
  };

  const register = async (nombre, email, contraseña, confirmarContraseña, ultimaRespuestaId = null) => {
    const payload = { nombre, email, contraseña, confirmarContraseña };
    if (ultimaRespuestaId) payload.ultimaRespuestaId = ultimaRespuestaId;

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await parseAuthResponse(response, 'Error al crear la cuenta.');
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (nombre, email) => {
    const response = await fetch('/api/auth/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, email })
    });
    const data = await parseAuthResponse(response, 'Error al actualizar perfil.');
    setUser(data);
    return data;
  };

  const changePassword = async (contraseñaActual, contraseñaNueva, confirmarContraseñaNueva) => {
    const response = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ contraseñaActual, contraseñaNueva, confirmarContraseñaNueva })
    });
    return await parseAuthResponse(response, 'Error al cambiar contraseña.');
  };

  const deleteAccount = async () => {
    const response = await fetch('/api/auth/cuenta', {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await parseAuthResponse(response, 'Error al eliminar la cuenta.');
    setUser(null);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
