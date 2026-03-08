import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Volvemos a axios
import { BASE_URL } from "../api"; // ✅ Solo importamos BASE_URL
import { useAuth } from "../context/AuthContext";
import "../assets/css/admin/login.css";

// ✅ BASE_URL viene sin /api (desde tu .env)
const API_BASE_URL = BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);

      // ✅ Usamos axios con BASE_URL (sin /api)
      const response = await axios.post(
        `${API_BASE_URL}/admin/login/autenticar`,
        formDataToSend,
      );

      if (response.data.status) {
        login(response.data.user, response.data.token);
        navigate("/admin");
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || "Error de conexión con el servidor";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">⚽</span>
            <span className="logo-text">LIGA ADMIN</span>
          </div>
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa tus credenciales para acceder al panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                <span style={{ marginLeft: "10px" }}>Verificando...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Sistema de Gestión Ligafut © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
