import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Función para configurar el token en axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      if (token) {
        // Configurar token en axios
        setAuthToken(token);

        // Leer usuario de forma segura
        try {
          const userStr = localStorage.getItem("user");
          if (userStr && userStr !== "undefined" && userStr !== "null") {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
          } else {
            // Si no hay usuario válido, limpiamos el token también
            localStorage.removeItem("token");
            setAuthToken(null);
            setToken(null);
          }
        } catch (error) {
          // Si hay error, limpiamos todo
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setAuthToken(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = (userData, newToken) => {
    // Guardar en localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Configurar axios
    setAuthToken(newToken);

    // Actualizar estado
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpiar axios
    setAuthToken(null);

    // Actualizar estado
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
