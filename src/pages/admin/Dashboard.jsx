import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/dashboard.css";

const API_URL = "http://192.168.1.250/api_backend/admin/estadisticas";
const POSICIONES_API =
  "http://192.168.1.250/api_backend/api/estadisticas/posiciones";
const IMG_BASE = "http://192.168.1.250/api_backend/uploads/logos/";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [posiciones, setPosiciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchPosiciones();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setData(response.data);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    }
  };

  const fetchPosiciones = async () => {
    try {
      const seriesIds = [1, 2, 3, 4, 5, 6, 7, 8];
      const promesas = seriesIds.map((id) =>
        axios.get(`${POSICIONES_API}/${id}`),
      );

      const respuestas = await Promise.all(promesas);

      const datos = respuestas.map((res, index) => ({
        serie_id: index + 1,
        serie_nombre: res.data.serie || `Serie ${index + 1}`,
        color: getColorPorSerie(index + 1),
        top3: res.data.data?.slice(0, 3) || [],
      }));

      setPosiciones(datos);
    } catch (error) {
      console.error("Error cargando posiciones:", error);
      setPosiciones([]);
    } finally {
      setLoading(false);
    }
  };

  const getColorPorSerie = (id) => {
    const colores = {
      1: "#10b981",
      2: "#f59e0b",
      3: "#ef4444",
      4: "#3b82f6",
      5: "#8b5cf6",
      6: "#ec4899",
      7: "#14b8a6",
      8: "#f97316",
    };
    return colores[id] || "#10b981";
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-page">
        <div className="empty-state">No hay datos disponibles</div>
      </div>
    );
  }

  const maxGoles =
    data.golesPorFecha?.length > 0
      ? Math.max(...data.golesPorFecha.map((f) => parseInt(f.total_goles) || 0))
      : 1;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p className="dashboard-subtitle">
            Resumen de la temporada actual 📊
          </p>
        </div>
        <div className="temporada-badge">
          <span className="badge-icon">🏆</span>
          <span>Temporada {data.temporada_id === "2" ? "2026" : "Actual"}</span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="kpi-grid">
        {/* ... (tus KPIs igual) ... */}
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon">📅</div>
          <div className="kpi-content">
            <span className="kpi-value">{data.totalFechas}</span>
            <span className="kpi-label">Fechas totales</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-small">{data.FechasJugadas} jugadas</span>
            <span className="kpi-small">
              {data.FechasPendientes} pendientes
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-icon">⚽</div>
          <div className="kpi-content">
            <span className="kpi-value">{data.totalGoles}</span>
            <span className="kpi-label">Goles totales</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-small">
              ⌀ {(data.totalGoles / (data.partidosJugados || 1)).toFixed(2)} x
              partido
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-icon">📋</div>
          <div className="kpi-content">
            <span className="kpi-value">{data.totalPartidos}</span>
            <span className="kpi-label">Partidos</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-small">{data.partidosJugados} jugados</span>
            <span className="kpi-small">
              {data.partidosPendientes} pendientes
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-accent">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <span className="kpi-value">{data.porcentaje}%</span>
            <span className="kpi-label">Progreso</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${data.porcentaje}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Goles por serie (arriba) */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">⚽</span>
            Goles por Serie
          </h3>
          <span className="card-badge">Total: {data.totalGoles}</span>
        </div>
        <div className="card-body">
          {data.desgloseGoles?.map((g) => {
            const goles = parseInt(g.goles) || 0;
            const porcentaje =
              data.totalGoles > 0 ? (goles / data.totalGoles) * 100 : 0;
            return (
              <div key={g.nombre} className="serie-stats-item">
                <div className="serie-stats-header">
                  <span className="serie-name">{g.nombre}</span>
                  <span className="serie-goles">{goles} goles</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablas de Posiciones */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">🏆</span>
            Tablas de Posiciones
          </h3>
          <span className="card-badge">Top 3 por serie</span>
        </div>
        <div className="card-body">
          <div className="tablas-grid">
            {posiciones.map((tabla) => (
              <div key={tabla.serie_id} className="tabla-mini-card">
                <div
                  className="tabla-mini-header"
                  style={{
                    background: `linear-gradient(135deg, ${tabla.color}20, transparent)`,
                    borderBottomColor: tabla.color,
                  }}
                >
                  <span className="tabla-mini-titulo">
                    {tabla.serie_nombre}
                  </span>
                </div>
                <div className="tabla-mini-body">
                  {tabla.top3.length > 0 ? (
                    tabla.top3.map((equipo, idx) => (
                      <div key={equipo.id || idx} className="tabla-mini-row">
                        <div className="tabla-mini-pos">
                          <span className={`posicion-numero pos-${idx + 1}`}>
                            {idx + 1}
                          </span>
                        </div>
                        <div className="tabla-mini-equipo">
                          {equipo.escudo && (
                            <img
                              src={`${IMG_BASE}${equipo.escudo}`}
                              alt={equipo.nombre}
                              className="tabla-mini-escudo"
                            />
                          )}
                          <span className="tabla-mini-nombre">
                            {equipo.nombre}
                          </span>
                        </div>
                        <div className="tabla-mini-puntos">
                          <span className="puntos-badge">
                            {equipo.PTS || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="tabla-mini-empty">
                      <span className="empty-icon">📊</span>
                      <span>Sin datos</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de tendencia de goles */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">📊</span>
            Tendencia de Goles
          </h3>
        </div>
        <div className="card-body">
          <div className="grafico-container">
            {data.golesPorFecha?.map((f) => {
              const goles = parseInt(f.total_goles) || 0;
              const altura = maxGoles > 0 ? (goles / maxGoles) * 150 : 0;
              return (
                <div key={f.jornada} className="grafico-bar">
                  <div
                    className="grafico-bar-fill"
                    style={{ height: `${altura}px` }}
                  >
                    <span className="grafico-bar-value">{goles}</span>
                  </div>
                  <span className="grafico-bar-label">
                    {f.jornada.replace("Fecha ", "F")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
