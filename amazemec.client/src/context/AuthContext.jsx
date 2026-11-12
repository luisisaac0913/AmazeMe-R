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

  const login = async (identificador, contraseña, ultimaRespuestaId = null) => {
    const payload = { identificador, contraseña };
    if (ultimaRespuestaId) payload.ultimaRespuestaId = ultimaRespuestaId;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Usuario o contraseña incorrectos.');
    }

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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear la cuenta.');
    }

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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar perfil.');
    }
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al cambiar contraseña.');
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
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
