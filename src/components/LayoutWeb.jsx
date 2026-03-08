import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../api";
import { Outlet, Link } from "react-router-dom";
import FooterWeb from "../pages/web/FooterWeb.jsx";
import "../assets/css/web/LayoutWeb.css";

const LayoutWeb = () => {
  const [jornada, setJornada] = useState({
    estado: "",
    titulo: "",
    detalle: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/fechas/proxima")
      .then((res) => {
        // 🔥 IMPORTANTE: Los datos vienen en res.data.data
        const fecha = res.data.data;

        if (fecha) {
          setJornada({
            estado: fecha.estado === "pendiente" ? "confirmada" : "suspendida",
            titulo:
              fecha.estado === "pendiente"
                ? "JORNADA CONFIRMADA"
                : "JORNADA SUSPENDIDA",
            detalle: fecha.nombre_fecha || "Próxima fecha por definir",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error en API:", err);
        setJornada({
          estado: "suspendida",
          titulo: "ERROR DE CONEXIÓN",
          detalle: "No se pudo cargar la información de la jornada",
        });
        setLoading(false);
      });
  }, []);
  // Simulación de estado de jornada (esto puede venir de props o context)

  return (
    <div className="web-publica">
      <header className="web-header">
        {/* BLOQUE DE ALERTA: Logo a la izquierda, Texto al centro */}
        <div className={`jornada-banner ${jornada.estado}`}>
          <img
            src={`${BASE_URL}/uploads/logos/asociacion.png`} // ← CORREGIDO
            alt="Logo ASOFUT"
            className="logo-institucional"
          />
          <div className="jornada-info">
            <h2>{jornada.titulo}</h2>
            <p>{jornada.detalle}</p>
          </div>
        </div>

        {/* NAVBAR: Fondo oscuro con letras verde neón */}
        <nav className="navbar-web">
          <div className="nav-links-wrapper">
            <Link to="/" className="link-neon">
              INICIO
            </Link>
            <Link to="/fixture-completo" className="link-neon">
              FIXTURE
            </Link>
            <Link to="/noticias" className="link-neon">
              NOTICIAS
            </Link>
            <Link to="/instituciones" className="link-neon">
              INSTITUCIONES
            </Link>
            <Link to="/nosotros" className="link-neon">
              NOSOTROS
            </Link>
          </div>
        </nav>
      </header>

      <main className="container pt-4">
        <Outlet />
      </main>

      <FooterWeb />
    </div>
  );
};

export default LayoutWeb;
