import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/goleadores.css";

const API_URL = "http://192.168.1.250/api_backend/admin";
const IMG_BASE = "http://192.168.1.250/api_backend/uploads/logos/";

const Goleadores = () => {
  const [goleadores, setGoleadores] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [series, setSeries] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados para el modal de registro manual
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [serieSeleccionada, setSerieSeleccionada] = useState("");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisita, setJugadoresVisita] = useState([]);
  const [goleadoresLocal, setGoleadoresLocal] = useState([]);
  const [goleadoresVisita, setGoleadoresVisita] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Estados para búsqueda
  const [busquedaLocal, setBusquedaLocal] = useState("");
  const [busquedaVisita, setBusquedaVisita] = useState("");
  const [resultadosLocal, setResultadosLocal] = useState([]);
  const [resultadosVisita, setResultadosVisita] = useState([]);
  const [mostrarDropdownLocal, setMostrarDropdownLocal] = useState(false);
  const [mostrarDropdownVisita, setMostrarDropdownVisita] = useState(false);
  const [dropdownActivo, setDropdownActivo] = useState(null);

  useEffect(() => {
    fetchGoleadores();
    fetchFechas();
  }, []);

  const fetchGoleadores = async () => {
    try {
      const response = await axios.get(`${API_URL}/goles`);
      if (response.data.status) {
        setGoleadores(response.data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar goleadores:", error);
      setLoading(false);
    }
  };

  const fetchFechas = async () => {
    try {
      const response = await axios.get(`${API_URL}/fechas`);
      setFechas(response.data || []);
    } catch (error) {
      console.error("Error al cargar fechas:", error);
    }
  };

  // ===== FUNCIONES CORREGIDAS DEL MODAL =====

  const cargarSeries = async (fechaId) => {
    if (!fechaId) {
      setSeries([]);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/series`);
      setSeries(response.data || []);
      // Resetear selecciones dependientes
      setSerieSeleccionada("");
      setPartidoSeleccionado("");
      setPartidos([]);
    } catch (error) {
      console.error("Error al cargar series:", error);
      setSeries([]);
    }
  };

  const cargarPartidos = async (fechaId, serieId) => {
    if (!fechaId || !serieId) {
      setPartidos([]);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/partidos/serie/${serieId}/fecha/${fechaId}`,
      );
      // 👇 IMPORTANTE: Los partidos vienen en response.data.data
      setPartidos(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar partidos:", error);
      setPartidos([]);
    }
  };

  const cargarJugadoresPartido = async (partidoId) => {
    if (!partidoId) {
      setJugadoresLocal([]);
      setJugadoresVisita([]);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/fixture/get-jugadores-partido/${partidoId}`,
      );
      setJugadoresLocal(response.data.local || []);
      setJugadoresVisita(response.data.visita || []);
      // Limpiar goleadores anteriores
      setGoleadoresLocal([]);
      setGoleadoresVisita([]);
    } catch (error) {
      console.error("Error al cargar jugadores:", error);
    }
  };

  // Handlers con logs para debug
  const handleFechaChange = (e) => {
    const fechaId = e.target.value;
    console.log("Fecha seleccionada:", fechaId);
    setFechaSeleccionada(fechaId);
    if (fechaId) {
      cargarSeries(fechaId);
    } else {
      setSeries([]);
      setSerieSeleccionada("");
      setPartidos([]);
      setPartidoSeleccionado("");
    }
  };

  const handleSerieChange = (e) => {
    const serieId = e.target.value;
    console.log("Serie seleccionada:", serieId);
    setSerieSeleccionada(serieId);
    if (serieId && fechaSeleccionada) {
      cargarPartidos(fechaSeleccionada, serieId);
    } else {
      setPartidos([]);
      setPartidoSeleccionado("");
    }
  };

  const handlePartidoChange = (e) => {
    const partidoId = e.target.value;
    console.log("Partido seleccionado:", partidoId);
    setPartidoSeleccionado(partidoId);
    if (partidoId) {
      cargarJugadoresPartido(partidoId);
    } else {
      setJugadoresLocal([]);
      setJugadoresVisita([]);
    }
  };

  // Resto de funciones (agregarGoleador, eliminarGoleador, etc.)
  const agregarGoleador = (equipo) => {
    if (equipo === "local") {
      setGoleadoresLocal([
        ...goleadoresLocal,
        { jugadorId: "", nombre: "", cantidad: 1 },
      ]);
    } else {
      setGoleadoresVisita([
        ...goleadoresVisita,
        { jugadorId: "", nombre: "", cantidad: 1 },
      ]);
    }
  };

  const eliminarGoleador = (equipo, index) => {
    if (equipo === "local") {
      setGoleadoresLocal(goleadoresLocal.filter((_, i) => i !== index));
    } else {
      setGoleadoresVisita(goleadoresVisita.filter((_, i) => i !== index));
    }
  };

  const handleGoleadorChange = (equipo, index, field, value) => {
    if (equipo === "local") {
      const nuevos = [...goleadoresLocal];
      nuevos[index][field] = value;
      setGoleadoresLocal(nuevos);
    } else {
      const nuevos = [...goleadoresVisita];
      nuevos[index][field] = value;
      setGoleadoresVisita(nuevos);
    }
  };

  const seleccionarJugador = (equipo, index, jugador) => {
    const nombreCompleto = `${jugador.nombres} ${jugador.apellidos}`;
    if (equipo === "local") {
      const nuevos = [...goleadoresLocal];
      nuevos[index].nombre = nombreCompleto;
      nuevos[index].jugadorId = jugador.id;
      setGoleadoresLocal(nuevos);
      setBusquedaLocal("");
      setDropdownActivo(null);
    } else {
      const nuevos = [...goleadoresVisita];
      nuevos[index].nombre = nombreCompleto;
      nuevos[index].jugadorId = jugador.id;
      setGoleadoresVisita(nuevos);
      setBusquedaVisita("");
      setDropdownActivo(null);
    }
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

  const eliminarGol = async (golId) => {
    if (!window.confirm("¿Estás seguro de eliminar este gol?")) return;

    try {
      const response = await axios.delete(`${API_URL}/goles/borrar/${golId}`);
      if (response.data.success) {
        alert("✅ Gol eliminado correctamente");
        fetchGoleadores();
      }
    } catch (error) {
      console.error("Error al eliminar gol:", error);
      alert("❌ Error al eliminar el gol");
    }
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();

    if (!partidoSeleccionado) {
      alert("❌ Debes seleccionar un partido");
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append("partido_id", partidoSeleccionado);

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

      const response = await axios.post(
        `${API_URL}/registro/guardarGolesPartido`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        alert("✅ Goles registrados correctamente");
        setModalAbierto(false);
        fetchGoleadores();
        // Resetear estados
        setFechaSeleccionada("");
        setSerieSeleccionada("");
        setPartidoSeleccionado("");
        setGoleadoresLocal([]);
        setGoleadoresVisita([]);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al guardar los goles");
    } finally {
      setEnviando(false);
    }
  };

  const goleadoresFiltrados = goleadores.filter((g) =>
    `${g.nombres} ${g.apellidos} ${g.club} ${g.serie}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  // Función para resetear el modal al cerrarlo
  const cerrarModal = () => {
    setModalAbierto(false);
    setFechaSeleccionada("");
    setSerieSeleccionada("");
    setPartidoSeleccionado("");
    setSeries([]);
    setPartidos([]);
    setJugadoresLocal([]);
    setJugadoresVisita([]);
    setGoleadoresLocal([]);
    setGoleadoresVisita([]);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando goleadores...</div>
      </div>
    );
  }

  return (
    <div className="admin-page goleadores-page">
      {/* Header */}
      <div className="goleadores-header">
        <div>
          <h2>
            <span className="header-icon">⚽</span>
            Gestión de Goleadores
          </h2>
          <p className="header-description">
            Busca y elimina registros de goles individuales
          </p>
        </div>
        <button className="btn-nuevo-gol" onClick={() => setModalAbierto(true)}>
          <span>➕</span> Registrar Gol Manual
        </button>
      </div>

      {/* Buscador */}
      <div className="buscador-container">
        <div className="buscador-input-group">
          <span className="buscador-icon">🔍</span>
          <input
            type="text"
            className="buscador-input"
            placeholder="Buscar por nombre, club o serie..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Goleadores */}
      <div className="goleadores-table-container">
        <table className="goleadores-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Club</th>
              <th>Serie / Fecha</th>
              <th className="text-center">Cant.</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {goleadoresFiltrados.length > 0 ? (
              goleadoresFiltrados.map((gol) => (
                <tr key={gol.id} className="gol-row">
                  <td>
                    <div className="jugador-info">
                      <span className="jugador-nombre">
                        {gol.nombres} {gol.apellidos}
                      </span>
                      <span className="jugador-id">ID: {gol.jugador_id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="club-info">
                      {gol.club_logo && (
                        <img
                          src={`${IMG_BASE}${gol.club_logo}`}
                          alt={gol.club}
                          className="club-logo-mini"
                        />
                      )}
                      <span>{gol.club}</span>
                    </div>
                  </td>
                  <td>
                    <span className="serie-badge">{gol.serie}</span>
                    {gol.nombre_fecha && (
                      <span className="fecha-small">{gol.nombre_fecha}</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="cantidad-badge">{gol.cantidad}</span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarGol(gol.id)}
                      title="Eliminar gol"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No hay goles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL REGISTRO MANUAL */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h3>
                <span>⚽</span> Registro Manual de Goles
              </h3>
              <button className="modal-close" onClick={cerrarModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitManual} className="modal-body">
              {/* Paso 1: Selección de Fecha */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">1. Seleccionar Fecha</label>
                  <select
                    className="form-select"
                    value={fechaSeleccionada}
                    onChange={handleFechaChange}
                  >
                    <option value="">Elegir fecha...</option>
                    {fechas.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nombre_fecha}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Paso 2: Serie */}
                <div className="form-group">
                  <label className="form-label">2. Serie</label>
                  <select
                    className="form-select"
                    value={serieSeleccionada}
                    onChange={handleSerieChange}
                    disabled={!fechaSeleccionada}
                  >
                    <option value="">
                      {!fechaSeleccionada
                        ? "Primero elija fecha"
                        : "Seleccionar serie"}
                    </option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Paso 3: Partido */}
                <div className="form-group">
                  <label className="form-label">3. Partido</label>
                  <select
                    className="form-select"
                    value={partidoSeleccionado}
                    onChange={handlePartidoChange}
                    disabled={!serieSeleccionada}
                  >
                    <option value="">
                      {!serieSeleccionada
                        ? "Primero elija serie"
                        : "Seleccionar partido"}
                    </option>
                    {partidos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.local_nombre} vs {p.visitante_nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {partidoSeleccionado && (
                <>
                  <hr className="divider" />

                  {/* Sección de carga de goles */}
                  <div className="goles-row">
                    {/* Goleadores Local */}
                    <div className="goleadores-column local-column">
                      <div className="column-header local-header">LOCAL</div>
                      <div className="goleadores-lista">
                        {goleadoresLocal.map((gol, index) => (
                          <div key={index} className="goleador-item">
                            <div className="buscador-container">
                              <input
                                type="text"
                                className="goleador-input"
                                placeholder="Buscar jugador..."
                                value={gol.nombre}
                                onChange={(e) => {
                                  handleGoleadorChange(
                                    "local",
                                    index,
                                    "nombre",
                                    e.target.value,
                                  );
                                  setBusquedaLocal(e.target.value);
                                  setDropdownActivo("local");
                                }}
                                onFocus={() => {
                                  setBusquedaLocal(gol.nombre);
                                  setDropdownActivo("local");
                                }}
                                autoComplete="off"
                              />
                              {mostrarDropdownLocal &&
                                dropdownActivo === "local" && (
                                  <div className="resultados-dropdown">
                                    {resultadosLocal.length > 0 ? (
                                      resultadosLocal.map((j) => (
                                        <div
                                          key={j.id}
                                          className="resultado-item"
                                          onClick={() =>
                                            seleccionarJugador(
                                              "local",
                                              index,
                                              j,
                                            )
                                          }
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
                              onChange={(e) =>
                                handleGoleadorChange(
                                  "local",
                                  index,
                                  "cantidad",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              min="1"
                            />
                            <button
                              type="button"
                              className="btn-eliminar-goleador"
                              onClick={() => eliminarGoleador("local", index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-agregar-goleador local-btn"
                        onClick={() => agregarGoleador("local")}
                      >
                        + Añadir Goleador
                      </button>
                    </div>

                    {/* Goleadores Visita */}
                    <div className="goleadores-column visita-column">
                      <div className="column-header visita-header">VISITA</div>
                      <div className="goleadores-lista">
                        {goleadoresVisita.map((gol, index) => (
                          <div key={index} className="goleador-item">
                            <div className="buscador-container">
                              <input
                                type="text"
                                className="goleador-input"
                                placeholder="Buscar jugador..."
                                value={gol.nombre}
                                onChange={(e) => {
                                  handleGoleadorChange(
                                    "visita",
                                    index,
                                    "nombre",
                                    e.target.value,
                                  );
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
                                          onClick={() =>
                                            seleccionarJugador(
                                              "visita",
                                              index,
                                              j,
                                            )
                                          }
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
                              onChange={(e) =>
                                handleGoleadorChange(
                                  "visita",
                                  index,
                                  "cantidad",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              min="1"
                            />
                            <button
                              type="button"
                              className="btn-eliminar-goleador"
                              onClick={() => eliminarGoleador("visita", index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-agregar-goleador visita-btn"
                        onClick={() => agregarGoleador("visita")}
                      >
                        + Añadir Goleador
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cerrar-modal"
                  onClick={cerrarModal}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn-guardar-modal"
                  disabled={enviando || !partidoSeleccionado}
                >
                  {enviando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goleadores;
