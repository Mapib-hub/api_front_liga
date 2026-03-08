import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/jugadores.css"; // Vamos a crear este CSS

// ✅ SOLO BASE_URL en todas las rutas
const API_URL = `${BASE_URL}admin/jugadores`;
const INST_URL = `${BASE_URL}admin/instituciones`;
const IMG_BASE = `${BASE_URL}uploads/jugadores/`;

const Jugadores = () => {
  const [data, setData] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [preview, setPreview] = useState(null);

  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [filtroInstitucion, setFiltroInstitucion] = useState("");

  const [form, setForm] = useState({
    institucion_id: "",
    nombres: "",
    apellidos: "",
    rut_dni: "",
    posicion: "",
    fecha_nacimiento: "",
    numero_camiseta: "",
    foto: null,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // ✅ axios con URL completa
      const [resJugadores, resInst] = await Promise.all([
        axios.get(API_URL),
        axios.get(INST_URL),
      ]);
      setData(Array.isArray(resJugadores.data) ? resJugadores.data : []);
      setInstituciones(Array.isArray(resInst.data) ? resInst.data : []);
      setLoading(false);
    } catch (e) {
      console.error("Error:", e);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Agregar todos los campos al FormData
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && key !== "foto") {
        formData.append(key, form[key]);
      }
    });

    // Agregar foto si existe
    if (form.foto) {
      formData.append("foto", form.foto);
    }

    try {
      // ✅ axios con URL completa
      const url = editandoId
        ? `${API_URL}/actualizar/${editandoId}`
        : `${API_URL}/guardar`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      cancelarEdicion();
      fetchInitialData();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response) {
        // El servidor respondió con error
        console.error("Datos del error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);

        // Mostrar alerta con el mensaje real
        alert(
          `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error("No hubo respuesta:", error.request);
        alert("No se recibió respuesta del servidor");
      } else {
        // Error al configurar la petición
        console.error("Error:", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  const prepararEdicion = (item) => {
    setEditandoId(item.id);
    setForm({
      institucion_id: item.institucion_id,
      nombres: item.nombres,
      apellidos: item.apellidos,
      rut_dni: item.rut_dni,
      posicion: item.posicion || "",
      fecha_nacimiento: item.fecha_nacimiento || "",
      numero_camiseta: item.numero_camiseta || "",
      foto: null,
    });
    setPreview(item.foto_path ? `${IMG_BASE}${item.foto_path}` : null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setPreview(null);
    setForm({
      institucion_id: "",
      nombres: "",
      apellidos: "",
      rut_dni: "",
      posicion: "",
      fecha_nacimiento: "",
      numero_camiseta: "",
      foto: null,
    });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este jugador?")) return;
    try {
      // ✅ axios con URL completa
      await axios.delete(`${API_URL}/eliminar/${id}`);
      fetchInitialData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  // 🎯 FILTROS DE BÚSQUEDA
  const jugadoresFiltrados = data.filter((jugador) => {
    // Filtro por texto (nombre, apellido, RUT)
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto =
      jugador.nombres?.toLowerCase().includes(textoBusqueda) ||
      jugador.apellidos?.toLowerCase().includes(textoBusqueda) ||
      jugador.rut_dni?.toLowerCase().includes(textoBusqueda) ||
      jugador.posicion?.toLowerCase().includes(textoBusqueda);

    // Filtro por institución
    const coincideInstitucion =
      filtroInstitucion === "" ||
      jugador.institucion_id.toString() === filtroInstitucion;

    return coincideTexto && coincideInstitucion;
  });

  const getNombreInstitucion = (id) => {
    const inst = instituciones.find((i) => i.id === id);
    return inst ? inst.nombre : "Desconocida";
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando jugadores...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <h2>⚽ Gestión de Jugadores</h2>
        <p>Administra el plantel de jugadores de todas las instituciones</p>
      </header>

      {/* 🔍 BARRA DE BÚSQUEDA */}
      <div className="buscador-container">
        <div className="buscador-grid">
          <div className="buscador-input-group">
            <span className="buscador-icon">🔍</span>
            <input
              type="text"
              className="buscador-input"
              placeholder="Buscar por nombre, apellido, RUT o posición..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="buscador-select"
            value={filtroInstitucion}
            onChange={(e) => setFiltroInstitucion(e.target.value)}
          >
            <option value="">Todas las instituciones</option>
            {instituciones.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.nombre}
              </option>
            ))}
          </select>

          <div className="buscador-stats">
            <span className="badge">{jugadoresFiltrados.length} jugadores</span>
          </div>
        </div>
      </div>

      <div className="page-grid">
        {/* Formulario */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>{editandoId ? "✏️ Editar Jugador" : "➕ Nuevo Jugador"}</h3>
          </div>

          <form
            onSubmit={handleSubmit}
            className="form-card-body"
            encType="multipart/form-data"
          >
            <div className="form-group">
              <label className="form-label">Institución</label>
              <select
                className="form-select"
                value={form.institucion_id}
                onChange={(e) =>
                  setForm({ ...form, institucion_id: e.target.value })
                }
                required
              >
                <option value="">Seleccionar institución...</option>
                {instituciones.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombres</label>
                <input
                  className="form-input"
                  value={form.nombres}
                  onChange={(e) =>
                    setForm({ ...form, nombres: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apellidos</label>
                <input
                  className="form-input"
                  value={form.apellidos}
                  onChange={(e) =>
                    setForm({ ...form, apellidos: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">RUT/DNI</label>
                <input
                  className="form-input"
                  value={form.rut_dni}
                  onChange={(e) =>
                    setForm({ ...form, rut_dni: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">N° Camiseta</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.numero_camiseta}
                  onChange={(e) =>
                    setForm({ ...form, numero_camiseta: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Posición</label>
                <select
                  className="form-select"
                  value={form.posicion}
                  onChange={(e) =>
                    setForm({ ...form, posicion: e.target.value })
                  }
                >
                  <option value="">Seleccionar...</option>
                  <option value="Arquero">🧤 Arquero</option>
                  <option value="Defensa">🛡️ Defensa</option>
                  <option value="Mediocampista">🎯 Mediocampista</option>
                  <option value="Delantero">⚡ Delantero</option>
                  <option value="Técnico">📋 Técnico</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha Nac.</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.fecha_nacimiento}
                  onChange={(e) =>
                    setForm({ ...form, fecha_nacimiento: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Foto del Jugador</label>
              <input
                type="file"
                className="form-input"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-imagen" />
                <div className="preview-overlay">
                  <span>Vista previa</span>
                  <button
                    type="button"
                    className="preview-btn-cambiar"
                    onClick={() => {
                      setPreview(null);
                      setForm({ ...form, foto: null });
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? "ACTUALIZAR JUGADOR" : "GUARDAR JUGADOR"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Jugadores */}
        <div className="table-card-jug">
          <div className="table-card-header">
            <h3>📋 Listado de Jugadores</h3>
            <span className="badge">{jugadoresFiltrados.length} jugadores</span>
          </div>

          <div className="jugadores-grid">
            {jugadoresFiltrados.length > 0 ? (
              jugadoresFiltrados.map((jugador) => (
                <div key={jugador.id} className="jugador-card">
                  <div className="jugador-imagen-container">
                    {jugador.foto_path ? (
                      <img
                        src={`${IMG_BASE}${jugador.foto_path}`}
                        alt={`${jugador.nombres} ${jugador.apellidos}`}
                        className="jugador-imagen"
                      />
                    ) : (
                      <div className="jugador-sin-imagen">
                        <span>📸</span>
                      </div>
                    )}
                    <div className="jugador-camiseta">
                      #{jugador.numero_camiseta || "?"}
                    </div>
                  </div>

                  <div className="jugador-info">
                    <h4 className="jugador-nombre">
                      {jugador.nombres} {jugador.apellidos}
                    </h4>

                    <div className="jugador-detalles">
                      <span className="jugador-institucion">
                        🏛️ {getNombreInstitucion(jugador.institucion_id)}
                      </span>
                      <span className="jugador-posicion">
                        {jugador.posicion || "Sin posición"}
                      </span>
                      <span className="jugador-rut">🆔 {jugador.rut_dni}</span>
                    </div>

                    <div className="jugador-estadisticas">
                      <span className="estadistica" title="Goles">
                        ⚽ {jugador.goles || 0}
                      </span>
                      <span className="estadistica" title="Tarjetas Amarillas">
                        🟨 {jugador.tarjetas_amarillas || 0}
                      </span>
                      <span className="estadistica" title="Tarjetas Rojas">
                        🟥 {jugador.tarjetas_rojas || 0}
                      </span>
                    </div>

                    <div className="jugador-acciones">
                      <button
                        onClick={() => prepararEdicion(jugador)}
                        className="jugador-btn jugador-btn-editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminar(jugador.id)}
                        className="jugador-btn jugador-btn-eliminar"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="empty-state"
                style={{ gridColumn: "1/-1", padding: "60px" }}
              >
                No se encontraron jugadores con esos filtros
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jugadores;
