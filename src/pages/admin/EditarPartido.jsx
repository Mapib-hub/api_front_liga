import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../../api"; // ✅ Importamos api y BASE_URL
import "../../assets/css/admin/editar-partido.css";

// ✅ URLs corregidas usando BASE_URL
const PARTIDO_API = `${BASE_URL}admin/fixture/partido`;
const JUGADORES_API = `${BASE_URL}admin/fixture/get-jugadores-partido`;
const GOLES_API = `${BASE_URL}admin/registro/guardarGolesPartido`;
const GUARDAR_API = `${BASE_URL}admin/fixture/guardarGolesFecha`; // ✅ Agregamos esta constante
const IMG_BASE = `${BASE_URL}uploads/logos/`;

const EditarPartido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados para el modal de goleadores
  const [modalAbierto, setModalAbierto] = useState(false);
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
    fetchPartido();
  }, [id]);

  const fetchPartido = async () => {
    try {
      setLoading(true);
      // ✅ Cambiado a api.get con ruta limpia
      const response = await api.get(`/admin/fixture/partido/${id}`);
      setPartido(response.data);
    } catch (error) {
      console.error("Error al cargar partido:", error);
      alert("Error al cargar el partido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPartido((prev) => ({
      ...prev,
      [field]: field.includes("goles") ? Number(value) || 0 : value,
    }));
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

  const abrirModalGoleadores = async () => {
    if (!partido) return;

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
    if (!partido) return false;

    const golesLocalPartido = Number(partido.goles_local) || 0;
    const golesVisitaPartido = Number(partido.goles_visita) || 0;

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
      formData.append("partido_id", partido.id);

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
      alert("Error al conectar con el servidor");
    }
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      // 1. Limpiamos los datos para asegurarnos que sean solo valores planos
      const datosParaEnviar = [
        {
          id: partido.id,
          goles_local: parseInt(partido.goles_local) || 0,
          goles_visita: parseInt(partido.goles_visita) || 0,
          penales_local: partido.penales_local || null,
          penales_visita: partido.penales_visita || null,
          estado: partido.estado,
          observaciones: partido.observaciones || "",
        },
      ];

      // 2. Creamos el FormData
      const formData = new FormData();
      formData.append("datos", JSON.stringify(datosParaEnviar));

      // 3. Enviamos con api.post
      const response = await api.post(
        "/admin/fixture/guardarGolesFecha",
        formData,
      );

      if (response.data.status) {
        alert("✅ " + response.data.message);
        navigate(-1);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("ERROR:", error);
      alert("Error en la petición");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando partido...</div>
      </div>
    );
  }

  if (!partido) {
    return (
      <div className="admin-page">
        <div className="empty-state">Partido no encontrado</div>
      </div>
    );
  }

  return (
    <div className="admin-page editar-partido-page">
      <div className="editar-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div>
          <h2>
            <span className="header-icon">⚽</span>
            Editar Partido
          </h2>
          <small className="text-muted">
            {partido.serie_nombre} - {partido.nombre_fecha}
          </small>
        </div>
      </div>

      <div className="partido-card-unico">
        <div className="partido-header-unico">
          <div className="equipo-header local">
            {partido.local_logo && (
              <img
                src={`${IMG_BASE}${partido.local_logo}`}
                alt={partido.local_nombre}
                className="equipo-logo-grande"
              />
            )}
            <h3>{partido.local_nombre}</h3>
          </div>

          <div className="vs-grande">VS</div>

          <div className="equipo-header visitante">
            {partido.visitante_logo && (
              <img
                src={`${IMG_BASE}${partido.visitante_logo}`}
                alt={partido.visitante_nombre}
                className="equipo-logo-grande"
              />
            )}
            <h3>{partido.visitante_nombre}</h3>
          </div>
        </div>

        <div className="partido-editor-unico">
          {/* Marcador */}
          <div className="marcador-editor-unico">
            <label>Marcador Final</label>
            <div className="goles-inputs-grande">
              <input
                type="number"
                className="goles-input-grande"
                value={partido.goles_local || 0}
                onChange={(e) =>
                  handleInputChange(
                    "goles_local",
                    parseInt(e.target.value) || 0,
                  )
                }
                min="0"
              />
              <span className="separador-grande">-</span>
              <input
                type="number"
                className="goles-input-grande"
                value={partido.goles_visita || 0}
                onChange={(e) =>
                  handleInputChange(
                    "goles_visita",
                    parseInt(e.target.value) || 0,
                  )
                }
                min="0"
              />
            </div>
          </div>

          {/* Penales */}
          <div className="penales-editor-unico">
            <label>Penales (opcional)</label>
            <div className="penales-inputs-grande">
              <input
                type="number"
                className="penal-input"
                value={partido.penales_local || ""}
                onChange={(e) =>
                  handleInputChange("penales_local", e.target.value)
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
                  handleInputChange("penales_visita", e.target.value)
                }
                placeholder="-"
                min="0"
              />
            </div>
          </div>

          {/* Estado */}
          <div className="estado-editor-unico">
            <label>Estado</label>
            <select
              className="estado-select-grande"
              value={partido.estado || "pendiente"}
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <option value="pendiente">⏳ Pendiente</option>
              <option value="jugado">✅ Finalizado</option>
              <option value="suspendido">🚫 Suspendido</option>
            </select>
          </div>

          {/* Observación */}
          <div className="observacion-editor-unico">
            <label>📋 Observación</label>
            <input
              type="text"
              className="observacion-input-grande"
              placeholder="Ej: Incidentes, cambio de horario, expulsados..."
              value={partido.observaciones || ""}
              onChange={(e) =>
                handleInputChange("observaciones", e.target.value)
              }
            />
          </div>

          {/* Botón de goleadores */}
          <div className="goleadores-editor-unico">
            <button
              type="button"
              className="btn-goleadores-grande"
              onClick={abrirModalGoleadores}
            >
              <span>⚽</span> Registrar Goleadores
            </button>
          </div>
        </div>

        <div className="form-actions-unico">
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-guardar"
            onClick={guardarCambios}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* MODAL DE GOLEADORES (igual, sin cambios) */}
      {modalAbierto && (
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
                  ⚽ Goleadores {partido.local_nombre}
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
                  ⚽ Goleadores {partido.visitante_nombre}
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

export default EditarPartido;
