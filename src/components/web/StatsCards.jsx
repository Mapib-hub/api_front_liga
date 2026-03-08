// components/web/StatsCards.jsx
import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../../api";
import "../../assets/css/web/StatsCards.css";

const StatsCards = ({ stats }) => {
  const [instituciones, setInstituciones] = useState([]);

  // Datos de estadísticas (después vendrán de la API)
  const estadisticas = {
    partidosJugados: 143,
    deportistas: 1000,
    goles: 1000,
    asociacion: "ANFA Maule",
  };

  // Cargar instituciones al montar el componente
  useEffect(() => {
    api
      .get("/instituciones")
      .then((res) => {
        setInstituciones(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error cargando instituciones:", err);
      });
  }, []);

  return (
    <div className="container mb-4">
      {/* TARJETA PRINCIPAL (INSTITUCIONES) */}
      <div className="stats-card">
        <div className="stats-row">
          {/* LADO IZQUIERDO - TEXTOS */}
          <div className="stats-left">
            <h3 className="stats-titulo">
              {stats.instituciones || 12} Instituciones
            </h3>
            <h4 className="stats-subtitulo">
              {stats.series || 8} Series Totales
            </h4>
            <p className="stats-texto">
              {stats.infantiles || 3} Infantiles | {stats.adultos || 5} Adultos
            </p>
          </div>

          {/* LADO DERECHO - LOGOS */}
          <div className="stats-right">
            {instituciones.map((inst) => (
              <a
                key={inst.id}
                href={`/instituciones/${inst.slug}`}
                className="logo-link"
              >
                <div className="logo-contenedor" title={inst.nombre}>
                  <img
                    src={`${BASE_URL}${inst.logo_path}`}
                    alt={inst.nombre}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 👇 NUEVO - TARJETAS DE ESTADÍSTICAS */}
      <div className="stats-mini-grid">
        {/* Partidos Jugados */}
        <div className="stats-mini-card">
          <span className="stats-mini-numero">
            +{estadisticas.partidosJugados}
          </span>
          <span className="stats-mini-label">Partidos Jugados</span>
        </div>

        {/* Deportistas */}
        <div className="stats-mini-card">
          <span className="stats-mini-numero">
            +{estadisticas.deportistas.toLocaleString()}
          </span>
          <span className="stats-mini-label">Deportistas</span>
        </div>

        {/* Goles Convertidos */}
        <div className="stats-mini-card">
          <span className="stats-mini-numero">
            +{estadisticas.goles.toLocaleString()}
          </span>
          <span className="stats-mini-label">Goles Convertidos</span>
        </div>

        {/* Asociación */}
        <div className="stats-mini-card">
          <span className="stats-mini-texto">Asociados a</span>
          <span className="stats-mini-destacado">
            {estadisticas.asociacion}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
