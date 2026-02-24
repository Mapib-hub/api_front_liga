import { Link, Outlet, useLocation } from "react-router-dom";
import "../assets/css/layout.css";

const Layout = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

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
              className={`admin-nav-link ${isActive("/temporadas")}`}
            >
              <span>📆</span> Temporadas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/instituciones"
              className={`admin-nav-link ${isActive("/instituciones")}`}
            >
              <span>🏛️</span> Instituciones
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fixture"
              className={`admin-nav-link ${isActive("/fixture")}`}
            >
              <span>⚔️</span> Fixture
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fechas"
              className={`admin-nav-link ${isActive("/fechas")}`}
            >
              <span>📅</span> Fechas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/series"
              className={`admin-nav-link ${isActive("/series")}`}
            >
              <span>🏆</span> Series
            </Link>
          </li>
          <li>
            <Link
              to="/admin/noticias"
              className={`admin-nav-link ${isActive("/noticias")}`}
            >
              <span>📰</span> Noticias
            </Link>
          </li>
          <li>
            <Link
              to="/admin/jugadores"
              className={`admin-nav-link ${isActive("/jugadores")}`}
            >
              <span>👥</span> Jugadores
            </Link>
          </li>
          <li>
            <Link
              to="/admin/goleadores"
              className={`admin-nav-link ${isActive("/goleadores")}`}
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
          <button className="btn-logout">Cerrar Sesión</button>
        </header>

        {/* Aquí se renderizan las páginas */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
