import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // ✅ Cambiamos a axios
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/crear-partido.css";

// ✅ Solo necesitamos IMG_BASE para las imágenes
const IMG_BASE = `${BASE_URL}uploads/logos/`;

const CrearPartidoUnico = () => {
  const navigate = useNavigate();

  const [temporadas, setTemporadas] = useState([]);
  const [series, setSeries] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [formData, setFormData] = useState({
    temporada_id: "",
    fecha_id: "",
    serie_id: "",
    nombre_serie_libre: "",
    fase: "Amistoso",
    institucion_local_id: "",
    institucion_visitante_id: "",
    nombre_local_libre: "",
    nombre_visita_libre: "",
    estadio: "",
    fecha_calendario: "",
    hora: "",
  });

  useEffect(() => {
    fetchCatalogos();
  }, []);

  const fetchCatalogos = async () => {
    try {
      // ✅ axios con URL completa
      const [resTemps, resSeries, resInst] = await Promise.all([
        axios.get(`${BASE_URL}admin/temporadas`),
        axios.get(`${BASE_URL}admin/series`),
        axios.get(`${BASE_URL}admin/instituciones`),
      ]);

      setTemporadas(resTemps.data || []);
      setSeries(resSeries.data || []);
      setInstituciones(resInst.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
      alert("Error al cargar datos necesarios");
      setLoading(false);
    }
  };

  const fetchFechasPorTemporada = async (temporadaId) => {
    try {
      // ✅ axios con URL completa
      const response = await axios.get(`${BASE_URL}admin/getFechasPorTemporada/${temporadaId}`);
      setFechas(response.data || []);
    } catch (error) {
      console.error("Error al cargar fechas:", error);
      setFechas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "temporada_id" && value) {
      fetchFechasPorTemporada(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar serie
    if (!formData.serie_id && !formData.nombre_serie_libre) {
      alert(
        "❌ Debes seleccionar una serie o escribir un nombre para la categoría",
      );
      return;
    }

    // Validar equipos
    if (!formData.institucion_local_id && !formData.nombre_local_libre) {
      alert(
        "❌ Debes seleccionar un club o escribir un nombre para el equipo local",
      );
      return;
    }

    if (!formData.institucion_visitante_id && !formData.nombre_visita_libre) {
      alert(
        "❌ Debes seleccionar un club o escribir un nombre para el equipo visitante",
      );
      return;
    }

    setEnviando(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // ✅ axios con URL completa
      const response = await axios.post(
        `${BASE_URL}admin/fixture/guardar-unico`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.status) {
        alert("✅ Partido especial creado correctamente");
        navigate("/admin/fixture");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.message) {
        alert("❌ " + error.response.data.message);
      } else {
        alert("❌ Error al crear el partido");
      }
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <div className="admin-page crear-partido-page">
      {/* Header */}
      <div className="crear-partido-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div>
          <h2>
            <span className="header-icon">⭐</span>
            Crear Partido Especial
          </h2>
          <p className="header-description">
            Configura un partido amistoso, liguilla o definición fuera del
            fixture regular
          </p>
        </div>
      </div>

      <div className="crear-partido-card">
        <form
          onSubmit={handleSubmit}
          className="crear-partido-form"
          encType="multipart/form-data"
        >
          {/* Sección 1: Datos básicos */}
          <div className="form-section">
            <h3 className="section-title">📋 Información General</h3>

            <div className="form-grid">
              {/* Temporada */}
              <div className="form-group">
                <label className="form-label">Temporada *</label>
                <select
                  name="temporada_id"
                  value={formData.temporada_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar temporada</option>
                  {temporadas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre_temporada}
                    </option>
                  ))}
                </select>
              </div>

              {/* Serie / Categoría */}
              <div className="form-group">
                <label className="form-label">Serie / Categoría</label>
                <select
                  name="serie_id"
                  value={formData.serie_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Otra (Escribir abajo) --</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="nombre_serie_libre"
                  value={formData.nombre_serie_libre}
                  onChange={handleChange}
                  className="form-input mt-2"
                  placeholder="Ej: Selección Juvenil"
                />
              </div>

              {/* Tipo de Partido */}
              <div className="form-group">
                <label className="form-label">Tipo de Partido *</label>
                <select
                  name="fase"
                  value={formData.fase}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Amistoso">⚽ Amistoso</option>
                  <option value="Liguilla">🏆 Liguilla</option>
                  <option value="Definición">⚡ Definición</option>
                  <option value="Regional">📅 Regional</option>
                  <option value="Nacional">📅 Nacional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 2: Equipos */}
          <div className="form-section">
            <h3 className="section-title">⚔️ Equipos</h3>

            <div className="equipos-grid">
              {/* Equipo Local */}
              <div className="equipo-card local">
                <h4 className="equipo-titulo local-titulo">
                  <span>🏠</span> Equipo Local
                </h4>

                <div className="form-group">
                  <label className="form-label">
                    Seleccionar Club del Sistema
                  </label>
                  <select
                    name="institucion_local_id"
                    value={formData.institucion_local_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- No está en el sistema --</option>
                    {instituciones.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    O escribir nombre personalizado
                  </label>
                  <input
                    type="text"
                    name="nombre_local_libre"
                    value={formData.nombre_local_libre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ej: Selección Sub-17"
                  />
                </div>
              </div>

              {/* Equipo Visitante */}
              <div className="equipo-card visitante">
                <h4 className="equipo-titulo visitante-titulo">
                  <span>✈️</span> Equipo Visitante
                </h4>

                <div className="form-group">
                  <label className="form-label">
                    Seleccionar Club del Sistema
                  </label>
                  <select
                    name="institucion_visitante_id"
                    value={formData.institucion_visitante_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- No está en el sistema --</option>
                    {instituciones.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    O escribir nombre personalizado
                  </label>
                  <input
                    type="text"
                    name="nombre_visita_libre"
                    value={formData.nombre_visita_libre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ej: Selección San Javier"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Datos del encuentro */}
          <div className="form-section">
            <h3 className="section-title">📍 Detalles del Encuentro</h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Estadio / Cancha</label>
                <input
                  type="text"
                  name="estadio"
                  value={formData.estadio}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: Estadio Municipal"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha del Encuentro</label>
                <input
                  type="date"
                  name="fecha_calendario"
                  value={formData.fecha_calendario}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-guardar" disabled={enviando}>
              {enviando ? "Creando..." : "Crear Partido Especial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearPartidoUnico;