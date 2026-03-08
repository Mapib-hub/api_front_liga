import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/fixture-serie.css";

// ✅ SOLO BASE_URL en todas las rutas
const API_URL = `${BASE_URL}admin/partidos/serie`;
const IMG_BASE = `${BASE_URL}`;
/*const IMG_BASE = `${BASE_URL}uploads/logos/`; */
const FixtureSerie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fechas, setFechas] = useState({});
  const [serieInfo, setSerieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [temporada, setTemporada] = useState("");
  const [showObservaciones, setShowObservaciones] = useState({});

  useEffect(() => {
    fetchFixtureSerie();
  }, [id]);

  const fetchFixtureSerie = async () => {
    try {
      setLoading(true);
      // ✅ axios con URL completa
      const response = await axios.get(`${API_URL}/${id}`);

      if (response.data.success) {
        setFechas(response.data.data || {});
        setTemporada(response.data.temporada || "");

        const primeraFecha = Object.values(response.data.data)[0];
        if (primeraFecha && primeraFecha.length > 0) {
          setSerieInfo({
            nombre: primeraFecha[0].serie_nombre,
            slug: primeraFecha[0].serie_slug,
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar fixture:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleObservacion = (partidoId) => {
    setShowObservaciones((prev) => ({
      ...prev,
      [partidoId]: !prev[partidoId],
    }));
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

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "jugado":
        return <span className="badge-estado jugado">✅ Jugado</span>;
      case "pendiente":
        return <span className="badge-estado pendiente">⏳ Pendiente</span>;
      default:
        return <span className="badge-estado">{estado}</span>;
    }
  };

  const getFaseBadge = (fase) => {
    return fase === "Liguilla" ? (
      <span className="fase-badge liguilla">🏆 Liguilla</span>
    ) : (
      <span className="fase-badge regular">⚽ Regular</span>
    );
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando fixture...</div>
      </div>
    );
  }

  return (
    <div className="admin-page fixture-serie-page">
      {/* Header */}
      <div className="fixture-serie-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div className="header-info">
          <h2>
            <span className="serie-icon">🏆</span>
            {serieInfo?.nombre || "Cargando..."}
          </h2>
          {temporada && <span className="temporada-badge">{temporada}</span>}
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            📅 {Object.keys(fechas).length} Fechas
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="fixture-serie-content">
        {Object.keys(fechas).length > 0 ? (
          Object.entries(fechas).map(([nombreFecha, partidos]) => {
            // Obtener el ID de la fecha del primer partido
            const fechaId = partidos[0]?.fecha_id;

            return (
              <div key={nombreFecha} className="fecha-card">
                <div className="fecha-header">
                  <div className="fecha-titulo">
                    <h3>{nombreFecha}</h3>
                    {partidos[0]?.fase && getFaseBadge(partidos[0].fase)}
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/admin/fixture/serie/${id}/fecha/${fechaId}`)
                    }
                    className="btn-editar-fecha"
                  >
                    ✏️ Editar Fecha
                  </button>
                </div>

                <div className="partidos-container">
                  {partidos.map((partido) => (
                    <div key={partido.id} className="partido-card">
                      {/* EQUIPO LOCAL */}
                      <div className="equipo-block local">
                        {partido.local_logo ? (
                          <img
                            src={`${IMG_BASE}${partido.local_logo}`}
                            alt={partido.local_nombre}
                            className="equipo-logo-grande"
                          />
                        ) : (
                          <div className="equipo-logo-placeholder">🏟️</div>
                        )}
                        <span className="equipo-nombre-grande">
                          {partido.local_nombre}
                        </span>
                      </div>

                      {/* RESULTADO Y DETALLES */}
                      <div className="resultado-block">
                        <div className="resultado-card">
                          <span className="goles-grande">
                            {partido.goles_local ?? 0}
                          </span>
                          <span className="separador">-</span>
                          <span className="goles-grande">
                            {partido.goles_visita ?? 0}
                          </span>
                        </div>

                        <div className="partido-detalles">
                          {getEstadoBadge(partido.estado)}

                          {(partido.fecha_calendario || partido.hora) && (
                            <span className="fecha-hora">
                              📅 {formatFecha(partido.fecha_calendario)}
                              {partido.hora &&
                                ` ⏰ ${partido.hora.substring(0, 5)}`}
                            </span>
                          )}

                          {partido.estadio && (
                            <span className="estadio">
                              🏟️ {partido.estadio}
                            </span>
                          )}
                        </div>

                        {/* Observaciones */}
                        {partido.observaciones && (
                          <div className="observaciones-container">
                            <button
                              className="btn-observaciones"
                              onClick={() => toggleObservacion(partido.id)}
                            >
                              📋{" "}
                              {showObservaciones[partido.id]
                                ? "Ocultar"
                                : "Ver"}{" "}
                              observaciones
                            </button>
                            {showObservaciones[partido.id] && (
                              <div className="observaciones-texto">
                                {partido.observaciones}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* EQUIPO VISITANTE */}
                      <div className="equipo-block visitante">
                        {partido.visitante_logo ? (
                          <img
                            src={`${IMG_BASE}${partido.visitante_logo}`}
                            alt={partido.visitante_nombre}
                            className="equipo-logo-grande"
                          />
                        ) : (
                          <div className="equipo-logo-placeholder">🏟️</div>
                        )}
                        <span className="equipo-nombre-grande">
                          {partido.visitante_nombre}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No hay partidos para esta serie en la temporada actual</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureSerie;
