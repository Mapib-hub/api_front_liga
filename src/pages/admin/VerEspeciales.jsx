import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/especiales.css";

// ✅ SOLO BASE_URL en todas las rutas
const API_URL = `${BASE_URL}admin/fixture/especiales`;
const IMG_BASE = `${BASE_URL}`;
//const IMG_BASE = `${BASE_URL}uploads/logos/`;

const Especiales = () => {
  const navigate = useNavigate();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEspeciales();
  }, []);

  const fetchEspeciales = async () => {
    try {
      // ✅ axios con URL completa
      const res = await axios.get(API_URL);
      setPartidos(res.data.partidos || []);
      setLoading(false);
    } catch (e) {
      console.error("Error cargando especiales", e);
      setLoading(false);
    }
  };

  const getFaseBadge = (fase) => {
    switch (fase) {
      case "Amistoso":
        return <span className="fase-badge amistoso">⚽ Amistoso</span>;
      case "Liguilla":
        return <span className="fase-badge liguilla">🏆 Liguilla</span>;
      case "Definición":
        return <span className="fase-badge definicion">⚡ Definición</span>;
      default:
        return <span className="fase-badge">{fase}</span>;
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "jugado":
        return <span className="badge-estado jugado">✅ Finalizado</span>;
      case "pendiente":
        return <span className="badge-estado pendiente">⏳ Pendiente</span>;
      case "suspendido":
        return <span className="badge-estado suspendido">🚫 Suspendido</span>;
      default:
        return <span className="badge-estado">{estado}</span>;
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha por definir";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando partidos especiales...</div>
      </div>
    );
  }

  return (
    <div className="admin-page especiales-page">
      {/* Header */}
      <div className="especiales-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div className="header-info">
          <h2>
            <span className="header-icon">⭐</span>
            Partidos Especiales y Amistosos
          </h2>
          <p className="header-description">
            Administra amistosos, liguillas y partidos de definición
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/fixture/partidoUnico")}
          className="btn-nuevo"
        >
          <span>➕</span> Nuevo Especial
        </button>
      </div>

      {/* Tabla de partidos especiales */}
      <div className="especiales-table-container">
        <table className="especiales-table">
          <thead>
            <tr>
              <th>Temporada / Fase</th>
              <th>Serie</th>
              <th className="text-center">Encuentro</th>
              <th className="text-center">Resultado</th>
              <th>Info / Estadio</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.length > 0 ? (
              partidos.map((p) => (
                <tr key={p.id} className="especial-row">
                  <td>
                    <div className="temporada-info">
                      <span className="temporada-nombre">
                        {p.temporada_nombre}
                      </span>
                      {getFaseBadge(p.fase)}
                    </div>
                  </td>
                  <td>
                    <span className="serie-nombre">{p.nombre_serie}</span>
                  </td>
                  <td className="text-center">
                    <div className="equipos-encuentro">
                      <div className="equipo-mini">
                        {p.escudo_local && (
                          <img
                            src={`${IMG_BASE}${p.escudo_local}`}
                            alt={p.nombre_local || p.nombre_local_libre}
                            className="equipo-escudo-mini"
                          />
                        )}
                        <span className="equipo-nombre-mini">
                          {p.nombre_local || p.nombre_local_libre || "Local"}
                        </span>
                      </div>

                      <span className="vs-mini">vs</span>

                      <div className="equipo-mini">
                        {p.escudo_visitante && (
                          <img
                            src={`${IMG_BASE}${p.escudo_visitante}`}
                            alt={p.nombre_visitante || p.nombre_visita_libre}
                            className="equipo-escudo-mini"
                          />
                        )}
                        <span className="equipo-nombre-mini">
                          {p.nombre_visitante ||
                            p.nombre_visita_libre ||
                            "Visitante"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    {p.estado === "jugado" ? (
                      <div className="resultado-badge">
                        <span className="goles">{p.goles_local}</span>
                        <span className="separador">-</span>
                        <span className="goles">{p.goles_visita}</span>
                      </div>
                    ) : (
                      getEstadoBadge(p.estado)
                    )}
                  </td>
                  <td>
                    <div className="info-partido">
                      {p.estadio && (
                        <span className="info-item">
                          <span className="info-icon">🏟️</span>
                          {p.estadio}
                        </span>
                      )}
                      {p.fecha_calendario && (
                        <span className="info-item">
                          <span className="info-icon">📅</span>
                          {formatFecha(p.fecha_calendario)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/fixture/editar-partido/${p.id}`)
                      }
                      className={`btn-accion ${p.estado === "jugado" ? "btn-editar" : "btn-marcador"}`}
                    >
                      {p.estado === "jugado" ? "✏️ Editar" : "⚽ Marcador"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div className="empty-message">
                    <span className="empty-icon">🏆</span>
                    <p>No hay partidos especiales registrados</p>
                    <button
                      onClick={() =>
                        navigate("/admin/fixture/nuevo-partido-unico")
                      }
                      className="btn-crear"
                    >
                      Crear primer partido especial
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Especiales;
