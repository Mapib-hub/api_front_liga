import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../../api"; // ✅ Importamos api y BASE_URL
import "../../assets/css/admin/editar-fecha.css";

// ✅ URLs corregidas usando BASE_URL
const API_URL = `${BASE_URL}admin/partidos/serie`;
const JUGADORES_API = `${BASE_URL}admin/fixture/get-jugadores-partido`;
const GOLES_API = `${BASE_URL}admin/registro/guardarGolesPartido`;
const GUARDAR_API = `${BASE_URL}admin/fixture/guardarGolesFecha`;
const IMG_BASE = `${BASE_URL}uploads/logos/`;

const EditarFecha = () => {
  const { serieId, fechaId } = useParams();
  const navigate = useNavigate();

  const [partidos, setPartidos] = useState([]);
  const [serieInfo, setSerieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados para el modal de goleadores
  const [modalAbierto, setModalAbierto] = useState(false);
  const [partidoActual, setPartidoActual] = useState(null);
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisita, setJugadoresVisita] = useState([]);
  const [goleadoresLocal, setGoleadoresLocal] = useState([]);
  const [goleadoresVisita, setGoleadoresVisita] = useState([]);

  // Estados para búsqueda
  const [busquedaLocal, setBusquedaLocal] = useState("");
  const [busquedaVisita, setBusquedaVisita] = useState("");
  const [resultadosLocal, setResultadosLocal] = useState([]);
  const [resultadosVisita, setResultadosVisita] = useState([]);
  const [mostrarDropdownLocal, setMostrarDropdownLocal] = useState(false);
  const [mostrarDropdownVisita, setMostrarDropdownVisita] = useState(false);
  const [dropdownActivo, setDropdownActivo] = useState(null);

  useEffect(() => {
    fetchPartidos();
  }, [serieId, fechaId]);

  const fetchPartidos = async () => {
    try {
      setLoading(true);
      // ✅ Cambiado a api.get con ruta limpia
      const response = await api.get(
        `/admin/partidos/serie/${serieId}/fecha/${fechaId}`,
      );

      if (response.data.success) {
        setPartidos(response.data.data || []);
        if (response.data.data.length > 0) {
          setSerieInfo({
            nombre: response.data.data[0].serie_nombre,
            slug: response.data.data[0].serie_slug,
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar partidos:", error);
      alert("Error al cargar los partidos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setPartidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  // Filtrar jugadores locales según búsqueda
  useEffect(() => {
    if (busquedaLocal.length > 0 && dropdownActivo === "local") {
      const filtrados = jugadoresLocal.filter((j) =>
        `${j.nombres} ${j.apellidos}`
          .toLowerCase()
          .includes(busquedaLocal.toLowerCase()),
      );
      setResultadosLocal(filtrados);
      setMostrarDropdownLocal(true);
    } else {
      setResultadosLocal([]);
      setMostrarDropdownLocal(false);
    }
  }, [busquedaLocal, jugadoresLocal, dropdownActivo]);

  // Filtrar jugadores visita según búsqueda
  useEffect(() => {
    if (busquedaVisita.length > 0 && dropdownActivo === "visita") {
      const filtrados = jugadoresVisita.filter((j) =>
        `${j.nombres} ${j.apellidos}`
          .toLowerCase()
          .includes(busquedaVisita.toLowerCase()),
      );
      setResultadosVisita(filtrados);
      setMostrarDropdownVisita(true);
    } else {
      setResultadosVisita([]);
      setMostrarDropdownVisita(false);
    }
  }, [busquedaVisita, jugadoresVisita, dropdownActivo]);

  const abrirModalGoleadores = async (partido) => {
    setPartidoActual(partido);
    setGoleadoresLocal([]);
    setGoleadoresVisita([]);
    setBusquedaLocal("");
    setBusquedaVisita("");
    setDropdownActivo(null);

    try {
      // ✅ Cambiado a api.get con ruta limpia
      const response = await api.get(
        `/admin/fixture/get-jugadores-partido/${partido.id}`,
      );
      setJugadoresLocal(response.data.local || []);
      setJugadoresVisita(response.data.visita || []);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error al cargar jugadores:", error);
      alert("No se pudieron cargar los jugadores");
    }
  };

  const validarGoles = () => {
    if (!partidoActual) return false;

    const golesLocalPartido = Number(partidoActual.goles_local) || 0;
    const golesVisitaPartido = Number(partidoActual.goles_visita) || 0;

    const totalGolesLocal = goleadoresLocal.reduce(
      (sum, g) => sum + (Number(g.cantidad) || 0),
      0,
    );
    const totalGolesVisita = goleadoresVisita.reduce(
      (sum, g) => sum + (Number(g.cantidad) || 0),
      0,
    );

    if (
      golesLocalPartido !== totalGolesLocal ||
      golesVisitaPartido !== totalGolesVisita
    ) {
      alert(
        `⚠️ LOS GOLES NO COINCIDEN\n\n` +
          `Marcador: ${golesLocalPartido} - ${golesVisitaPartido}\n` +
          `Goleadores sumados: ${totalGolesLocal} - ${totalGolesVisita}`,
      );
      return false;
    }
    return true;
  };

  const guardarGoleadores = async () => {
    if (!validarGoles()) return;

    try {
      const formData = new FormData();
      formData.append("partido_id", partidoActual.id);

      goleadoresLocal.forEach((g) => {
        if (g.jugadorId) {
          formData.append("goles_local_ids[]", g.jugadorId);
          formData.append("cant_local_goles[]", g.cantidad);
        }
      });

      goleadoresVisita.forEach((g) => {
        if (g.jugadorId) {
          formData.append("goles_visita_ids[]", g.jugadorId);
          formData.append("cant_visita_goles[]", g.cantidad);
        }
      });

      // ✅ Cambiado a api.post con ruta limpia
      const response = await api.post(
        "/admin/registro/guardarGolesPartido",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        alert("✅ " + response.data.message);
        setModalAbierto(false);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error al guardar goleadores:", error);
      if (error.response) {
        alert(
          `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        alert("No se recibió respuesta del servidor");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const guardarTodosLosCambios = async () => {
    setGuardando(true);

    try {
      // Preparar datos
      const datos = partidos.map((p) => ({
        id: p.id,
        goles_local: Number(p.goles_local) || 0,
        goles_visita: Number(p.goles_visita) || 0,
        penales_local: p.penales_local || null,
        penales_visita: p.penales_visita || null,
        estado: p.estado || "pendiente",
        observaciones: p.observaciones || null,
      }));

      // Crear FormData con los datos en formato JSON string
      const formData = new FormData();
      formData.append("datos", JSON.stringify(datos));

      // ✅ Cambiado a api.post con ruta limpia
      const response = await api.post(
        "/admin/fixture/guardarGolesFecha",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.status) {
        alert("✅ " + response.data.message);
        navigate(`/admin/fixture/serie/${serieId}`);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("ERROR COMPLETO:", error);

      if (error.response) {
        const errorData = error.response.data;
        let mensajeError = `Error ${error.response.status}: `;

        if (typeof errorData === "string") {
          mensajeError += errorData;
        } else if (errorData.message) {
          mensajeError += errorData.message;
        } else if (errorData.error) {
          mensajeError += errorData.error;
        } else {
          mensajeError += JSON.stringify(errorData);
        }

        alert("❌ " + mensajeError);
      } else if (error.request) {
        alert("❌ No se recibió respuesta del servidor");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando partidos...</div>
      </div>
    );
  }

  return (
    <div className="admin-page editar-fecha-page">
      <div className="editar-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div>
          <h2>
            <span className="serie-icon">🏆</span>
            Editando Resultados: {serieInfo?.nombre}
          </h2>
          <small className="text-muted">
            Carga masiva de marcadores y detalles de la fecha
          </small>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="editar-form">
        <div className="table-container">
          <table className="editar-table">
            <thead>
              <tr>
                <th className="text-end">Local</th>
                <th className="text-center">Marcador</th>
                <th className="text-start">Visitante</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidos.map((partido) => (
                <React.Fragment key={partido.id}>
                  <tr className="partido-row">
                    <td className="text-end">
                      <span className="equipo-nombre">
                        {partido.local_nombre}
                      </span>
                      {partido.local_logo && (
                        <img
                          src={`${IMG_BASE}${partido.local_logo}`}
                          alt={partido.local_nombre}
                          className="equipo-logo-small ms-2"
                        />
                      )}
                    </td>

                    <td>
                      <div className="marcador-editor">
                        <div className="goles-inputs">
                          <input
                            type="number"
                            className="goles-input"
                            value={partido.goles_local || 0}
                            onChange={(e) =>
                              handleInputChange(
                                partido.id,
                                "goles_local",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min="0"
                          />
                          <span className="vs-separador">VS</span>
                          <input
                            type="number"
                            className="goles-input"
                            value={partido.goles_visita || 0}
                            onChange={(e) =>
                              handleInputChange(
                                partido.id,
                                "goles_visita",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min="0"
                          />
                        </div>

                        <div className="penales-inputs">
                          <span className="penal-label">PEN:</span>
                          <input
                            type="number"
                            className="penal-input"
                            value={partido.penales_local || ""}
                            onChange={(e) =>
                              handleInputChange(
                                partido.id,
                                "penales_local",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            min="0"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            className="penal-input"
                            value={partido.penales_visita || ""}
                            onChange={(e) =>
                              handleInputChange(
                                partido.id,
                                "penales_visita",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            min="0"
                          />
                        </div>
                      </div>
                    </td>

                    <td className="text-start">
                      {partido.visitante_logo && (
                        <img
                          src={`${IMG_BASE}${partido.visitante_logo}`}
                          alt={partido.visitante_nombre}
                          className="equipo-logo-small me-2"
                        />
                      )}
                      <span className="equipo-nombre">
                        {partido.visitante_nombre}
                      </span>
                    </td>

                    <td>
                      <select
                        className="estado-select"
                        value={partido.estado || "pendiente"}
                        onChange={(e) =>
                          handleInputChange(
                            partido.id,
                            "estado",
                            e.target.value,
                          )
                        }
                      >
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="jugado">✅ Finalizado</option>
                        <option value="suspendido">🚫 Suspendido</option>
                      </select>
                    </td>

                    <td>
                      <div className="acciones-btns">
                        <button
                          type="button"
                          className="btn-goleadores"
                          onClick={() => abrirModalGoleadores(partido)}
                          title="Registrar Goleadores"
                        >
                          ⚽ Goles
                        </button>
                        <button
                          type="button"
                          className="btn-observacion"
                          onClick={() => {
                            document
                              .getElementById(`obs-${partido.id}`)
                              .classList.toggle("show");
                          }}
                          title="Escribir Observación"
                        >
                          📝 Obs
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr id={`obs-${partido.id}`} className="observacion-row">
                    <td colSpan="5">
                      <div className="observacion-input-container">
                        <label>📋 OBSERVACIÓN:</label>
                        <input
                          type="text"
                          className="observacion-input"
                          placeholder="Ej: Incidentes, cambio de horario, expulsados..."
                          value={partido.observaciones || ""}
                          onChange={(e) =>
                            handleInputChange(
                              partido.id,
                              "observaciones",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate(`/admin/fixture/serie/${serieId}`)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-guardar"
            onClick={guardarTodosLosCambios}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Todos los Cambios"}
          </button>
        </div>
      </form>

      {/* MODAL DE GOLEADORES (igual) */}
      {modalAbierto && partidoActual && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <span>⚽</span> Registro de Goles
              </h3>
              <button
                className="modal-close"
                onClick={() => setModalAbierto(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Goleadores Local */}
              <div className="goleadores-section">
                <label className="section-label local-label">
                  ⚽ Goleadores {partidoActual.local_nombre}
                </label>

                <div className="goleadores-lista">
                  {goleadoresLocal.map((gol, index) => (
                    <div key={index} className="goleador-item">
                      <div className="buscador-container">
                        <input
                          type="text"
                          className="goleador-input"
                          placeholder="Buscar jugador local..."
                          value={gol.nombre}
                          onChange={(e) => {
                            const nuevos = [...goleadoresLocal];
                            nuevos[index].nombre = e.target.value;
                            setGoleadoresLocal(nuevos);
                            setBusquedaLocal(e.target.value);
                            setDropdownActivo("local");
                          }}
                          onFocus={() => {
                            setBusquedaLocal(gol.nombre);
                            setDropdownActivo("local");
                          }}
                          autoComplete="off"
                        />

                        {mostrarDropdownLocal && dropdownActivo === "local" && (
                          <div className="resultados-dropdown">
                            {resultadosLocal.length > 0 ? (
                              resultadosLocal.map((j) => (
                                <div
                                  key={j.id}
                                  className="resultado-item"
                                  onClick={() => {
                                    const nuevos = [...goleadoresLocal];
                                    nuevos[index].nombre =
                                      `${j.nombres} ${j.apellidos}`;
                                    nuevos[index].jugadorId = j.id;
                                    setGoleadoresLocal(nuevos);
                                    setBusquedaLocal("");
                                    setDropdownActivo(null);
                                    setMostrarDropdownLocal(false);
                                  }}
                                >
                                  {j.nombres} {j.apellidos}
                                </div>
                              ))
                            ) : (
                              <div className="resultado-item disabled">
                                No se encontraron jugadores
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <input
                        type="number"
                        className="goles-cantidad"
                        value={gol.cantidad}
                        onChange={(e) => {
                          const nuevos = [...goleadoresLocal];
                          nuevos[index].cantidad =
                            parseInt(e.target.value) || 1;
                          setGoleadoresLocal(nuevos);
                        }}
                        min="1"
                      />

                      <button
                        type="button"
                        className="btn-eliminar-goleador"
                        onClick={() =>
                          setGoleadoresLocal(
                            goleadoresLocal.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-agregar-goleador"
                  onClick={() =>
                    setGoleadoresLocal([
                      ...goleadoresLocal,
                      { jugadorId: "", nombre: "", cantidad: 1 },
                    ])
                  }
                >
                  + Agregar Goleador Local
                </button>
              </div>

              {/* Goleadores Visita */}
              <div className="goleadores-section">
                <label className="section-label visita-label">
                  ⚽ Goleadores {partidoActual.visitante_nombre}
                </label>

                <div className="goleadores-lista">
                  {goleadoresVisita.map((gol, index) => (
                    <div key={index} className="goleador-item">
                      <div className="buscador-container">
                        <input
                          type="text"
                          className="goleador-input"
                          placeholder="Buscar jugador visitante..."
                          value={gol.nombre}
                          onChange={(e) => {
                            const nuevos = [...goleadoresVisita];
                            nuevos[index].nombre = e.target.value;
                            setGoleadoresVisita(nuevos);
                            setBusquedaVisita(e.target.value);
                            setDropdownActivo("visita");
                          }}
                          onFocus={() => {
                            setBusquedaVisita(gol.nombre);
                            setDropdownActivo("visita");
                          }}
                          autoComplete="off"
                        />

                        {mostrarDropdownVisita &&
                          dropdownActivo === "visita" && (
                            <div className="resultados-dropdown">
                              {resultadosVisita.length > 0 ? (
                                resultadosVisita.map((j) => (
                                  <div
                                    key={j.id}
                                    className="resultado-item"
                                    onClick={() => {
                                      const nuevos = [...goleadoresVisita];
                                      nuevos[index].nombre =
                                        `${j.nombres} ${j.apellidos}`;
                                      nuevos[index].jugadorId = j.id;
                                      setGoleadoresVisita(nuevos);
                                      setBusquedaVisita("");
                                      setDropdownActivo(null);
                                      setMostrarDropdownVisita(false);
                                    }}
                                  >
                                    {j.nombres} {j.apellidos}
                                  </div>
                                ))
                              ) : (
                                <div className="resultado-item disabled">
                                  No se encontraron jugadores
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      <input
                        type="number"
                        className="goles-cantidad"
                        value={gol.cantidad}
                        onChange={(e) => {
                          const nuevos = [...goleadoresVisita];
                          nuevos[index].cantidad =
                            parseInt(e.target.value) || 1;
                          setGoleadoresVisita(nuevos);
                        }}
                        min="1"
                      />

                      <button
                        type="button"
                        className="btn-eliminar-goleador"
                        onClick={() =>
                          setGoleadoresVisita(
                            goleadoresVisita.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-agregar-goleador"
                  onClick={() =>
                    setGoleadoresVisita([
                      ...goleadoresVisita,
                      { jugadorId: "", nombre: "", cantidad: 1 },
                    ])
                  }
                >
                  + Agregar Goleador Visitante
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cerrar-modal"
                onClick={() => setModalAbierto(false)}
              >
                Cerrar
              </button>
              <button className="btn-guardar-modal" onClick={guardarGoleadores}>
                Guardar Planilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarFecha;
