import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 👈 IMPORTAR useParams
import axios from "axios";
import SerieCard from "../../components/admin/SerieCard";
import "../../assets/css/fixture.css";

const API_URL = "http://192.168.1.250/api_backend/admin/fixture";
const SERIES_URL = "http://192.168.1.250/api_backend/admin/series";
const FECHAS_URL = "http://192.168.1.250/api_backend/admin/fechas";

const Fixture = () => {
  const navigate = useNavigate();
  const { fechaId: fechaIdUrl } = useParams(); // 👈 OBTENER FECHA DE LA URL

  const [series, setSeries] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Cuando cambia la URL o se cargan las fechas, actualizar la selección
  useEffect(() => {
    if (fechas.length > 0) {
      // Si hay fecha en la URL, usarla. Si no, usar la primera
      const fechaInicial = fechaIdUrl
        ? parseInt(fechaIdUrl)
        : fechas[0]?.id || null;

      if (fechaInicial && fechaInicial !== fechaSeleccionada) {
        setFechaSeleccionada(fechaInicial);
      }
    }
  }, [fechas, fechaIdUrl]);

  useEffect(() => {
    if (fechaSeleccionada) {
      fetchPartidos(fechaSeleccionada);
      // Actualizar la URL cuando cambia la fecha seleccionada
      navigate(`/admin/fixture/${fechaSeleccionada}`, { replace: true });
    }
  }, [fechaSeleccionada]);

  const fetchInitialData = async () => {
    try {
      const [resSeries, resFechas] = await Promise.all([
        axios.get(SERIES_URL),
        axios.get(FECHAS_URL),
      ]);

      setSeries(resSeries.data || []);
      setFechas(resFechas.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const fetchPartidos = async (fechaId) => {
    try {
      console.log("🔍 Cargando partidos para fecha ID:", fechaId);
      console.log("URL:", `${API_URL}/${fechaId}`);

      const res = await axios.get(`${API_URL}/${fechaId}`);
      console.log("✅ Respuesta:", res.data);

      setPartidos(res.data.duelos || []);
    } catch (error) {
      console.error("❌ Error al cargar partidos:", error);
    }
  };

  const verFixtureSerie = (serieId) => {
    navigate(`/admin/fixture/serie/${serieId}`);
  };

  const crearFechaPrincipal = () => {
    navigate("/admin/fixture/nueva-fecha-completa");
  };

  const crearPartidoUnico = () => {
    navigate("/admin/fixture/partidoUnico");
  };

  const verPartidosEspeciales = () => {
    navigate("/admin/fixture/especiales");
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando fixture...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="fixture-header">
        <h2>⚽ Gestión de Fixture</h2>
        <div className="db-indicator">
          <span className="db-dot"></span>
          <span>
            BASE DE DATOS ACTIVA: <strong>ASOFUTBOL</strong>
          </span>
        </div>
      </div>

      {/* Panel Maestro */}
      <div className="maestro-panel">
        <button
          onClick={crearFechaPrincipal}
          className="maestro-btn maestro-btn-primary"
        >
          <span className="maestro-icon">1️⃣</span>
          <div>
            <strong>Crear Fecha Principal</strong>
            <small>Cruce de Instituciones</small>
          </div>
        </button>

        <button
          onClick={crearPartidoUnico}
          className="maestro-btn maestro-btn-warning"
        >
          <span className="maestro-icon">3️⃣</span>
          <div>
            <strong>Crear Partido Único</strong>
            <small>Amistosos / Liguilla</small>
          </div>
        </button>

        <button
          onClick={verPartidosEspeciales}
          className="maestro-btn maestro-btn-light"
        >
          <span className="maestro-icon">4️⃣</span>
          <div>
            <strong>Partidos Especiales</strong>
            <small>Amistosos / Liguillas / Copas</small>
          </div>
        </button>
      </div>

      {/* Grid de Series */}
      <div className="series-section">
        <h3 className="series-section-title">
          <span className="badge-2">2️⃣</span>
          Elegir Serie para ver Fixture y Resultados
        </h3>

        <div className="series-grid-mini">
          {series.map((serie) => (
            <SerieCard
              key={serie.id}
              nombre={serie.nombre}
              onClick={() => verFixtureSerie(serie.id)}
            />
          ))}
        </div>
      </div>

      {/* Selector de Fechas y Tabla */}
      <div className="fechas-section">
        <h4>Navegación Principal de Fechas</h4>

        <select
          className="fecha-select"
          value={fechaSeleccionada || ""}
          onChange={(e) => setFechaSeleccionada(parseInt(e.target.value))}
        >
          {fechas.map((fecha) => (
            <option key={fecha.id} value={fecha.id}>
              {fecha.nombre_fecha}{" "}
              {fecha.estado === "pendiente" ? "⏳ [Sugerida]" : ""}
            </option>
          ))}
        </select>

        <div className="partidos-table-container">
          <table className="partidos-table">
            <thead>
              <tr>
                <th>Local</th>
                <th></th>
                <th>Visitante</th>
                <th>Estadio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidos.length > 0 ? (
                partidos.map((partido, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{partido.local}</td>
                    <td className="text-center">
                      <span className="vs-badge">VS</span>
                    </td>
                    <td className="fw-bold">{partido.visitante}</td>
                    <td>{partido.estadio || "No asignado"}</td>
                    <td>
                      <div className="acciones-partido">
                        <button className="btn-icon-small" title="Editar">
                          ✏️
                        </button>
                        <button
                          className="btn-series"
                          onClick={() =>
                            navigate(
                              `/admin/fixture/generar-jornada/${partido.id}`,
                            )
                          }
                        >
                          <span>🔗</span> Series
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center empty-state">
                    No hay partidos para esta fecha.
                    <button className="btn-crear-partidos">
                      Crear Partidos
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fixture;
