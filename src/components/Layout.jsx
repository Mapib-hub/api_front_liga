import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Importa axios
import { useAuth } from "../context/AuthContext"; // Importa tu hook de autenticación
import "../assets/css/admin/layout.css";

const Layout = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active-link" : "");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Opcional: Avisar al servidor para que destruya la sesión PHP
      const API_BASE_URL = "https://api.asofutbolsanjavier.cl";
      await axios.get(`${API_BASE_URL}/admin/logout`);
    } catch (e) {
      console.log("Sesión ya cerrada en el servidor");
    } finally {
      // 2. Limpiar LocalStorage y headers de Axios (Lo que hace tu AuthContext)
      logout();

      // 3. Mandar al usuario de vuelta al inicio
      navigate("/admin/login");
    }
  };
  return (
    <div className="admin-wrapper">
      {/* MENU LATERAL */}
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">LIGA ADMIN</span>
        </div>

        <ul className="admin-menu">
          <li>
            <Link
              to="/admin"
              className={`admin-nav-link ${isActive("/admin")}`}
            >
              <span>📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/temporadas"
              className={`admin-nav-link ${isActive("/admin/temporadas")}`}
            >
              <span>📆</span> Temporadas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/instituciones"
              className={`admin-nav-link ${isActive("/admin/instituciones")}`}
            >
              <span>🏛️</span> Instituciones
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fixture"
              className={`admin-nav-link ${isActive("/admin/fixture")}`}
            >
              <span>⚔️</span> Fixture
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fechas"
              className={`admin-nav-link ${isActive("/admin/fechas")}`}
            >
              <span>📅</span> Fechas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/series"
              className={`admin-nav-link ${isActive("/admin/series")}`}
            >
              <span>🏆</span> Series
            </Link>
          </li>
          <li>
            <Link
              to="/admin/noticias"
              className={`admin-nav-link ${isActive("/admin/noticias")}`}
            >
              <span>📰</span> Noticias
            </Link>
          </li>
          <li>
            <Link
              to="/admin/jugadores"
              className={`admin-nav-link ${isActive("/admin/jugadores")}`}
            >
              <span>👥</span> Jugadores
            </Link>
          </li>
          <li>
            <Link
              to="/admin/goleadores"
              className={`admin-nav-link ${isActive("/admin/goleadores")}`}
            >
              <span>⚽</span> Goles
            </Link>
          </li>
        </ul>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-info">
            <span className="status-indicator"></span>
            <span>
              Panel de Control · <strong>Administrador</strong>
            </span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </header>

        {/* Aquí se renderizan las páginas */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
