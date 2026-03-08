import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/noticias.css"; // Importamos el CSS específico
import "../../assets/css/admin/fechas.css"; // Para reutilizar clases base (form-card, etc.)

// ✅ SOLO BASE_URL en todas las rutas
const API_URL = `${BASE_URL}admin/noticias`;
const INST_URL = `${BASE_URL}admin/instituciones`;
const IMG_BASE = `${BASE_URL}uploads/noticias/`;

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_creacion: new Date().toISOString().split("T")[0],
    institucion_id: "0",
    imagen: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ axios con URL completa
      const [resNoticias, resInst] = await Promise.all([
        axios.get(API_URL),
        axios.get(INST_URL),
      ]);
      setNoticias(Array.isArray(resNoticias.data) ? resNoticias.data : []);
      setInstituciones(Array.isArray(resInst.data) ? resInst.data : []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imagen: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) data.append(key, form[key]);
    });

    try {
      if (editandoId) {
        // ✅ axios con URL completa
        await axios.post(`${API_URL}/actualizar/${editandoId}`, data);
      } else {
        // ✅ axios con URL completa
        await axios.post(`${API_URL}/guardar`, data);
      }
      cancelarEdicion();
      fetchData();
    } catch (e) {
      alert("Error al procesar la noticia");
    }
  };

  const prepararEdicion = (n) => {
    setEditandoId(n.id);
    setForm({
      titulo: n.titulo,
      descripcion: n.descripcion,
      fecha_creacion: n.fecha_creacion,
      institucion_id: n.institucion_id,
      imagen: null,
    });
    setPreview(n.imagen ? `${IMG_BASE}${n.imagen}` : null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setPreview(null);
    setForm({
      titulo: "",
      descripcion: "",
      fecha_creacion: new Date().toISOString().split("T")[0],
      institucion_id: "0",
      imagen: null,
    });
  };

  const eliminarNoticia = async (id) => {
    if (!window.confirm("¿Eliminar definitivamente esta noticia?")) return;
    try {
      // ✅ axios con URL completa
      await axios.delete(`${API_URL}/eliminar/${id}`);
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const getNombreInstitucion = (id) => {
    if (id === "0" || id === 0) return "🏛️ Directiva";
    const inst = instituciones.find((i) => i.id.toString() === id.toString());
    return inst ? `⚽ ${inst.nombre}` : `Club ID: ${id}`;
  };

  const getInstitucionClass = (id) => {
    return id === "0" || id === 0 ? "directiva" : "club";
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando redacción...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Hero Section */}
      <div className="noticias-hero">
        <div>
          <h2 className="page-header" style={{ marginBottom: 0 }}>
            📰 Redacción de Noticias
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "5px" }}>
            Gestiona las noticias y comunicados de la liga
          </p>
        </div>
        <div className="noticias-stats">
          <div className="stat-item">
            <span className="stat-number">{noticias.length}</span>
            <span className="stat-label">Publicaciones</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{instituciones.length + 1}</span>
            <span className="stat-label">Fuentes</span>
          </div>
        </div>
      </div>

      <div className="page-grid">
        {/* Formulario - Lado Izquierdo */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>{editandoId ? "✏️ Editar Noticia" : "➕ Nueva Noticia"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="form-card-body">
            <div className="form-group">
              <label className="form-label">Institución Emisora</label>
              <select
                className="form-select"
                value={form.institucion_id}
                onChange={(e) =>
                  setForm({ ...form, institucion_id: e.target.value })
                }
              >
                <option value="0">🏛️ Directiva</option>
                {instituciones.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    ⚽ {inst.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Título de la Noticia</label>
              <input
                className="form-input"
                placeholder="Ej: Gran triunfo de la liga en el torneo..."
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea
                className="admin-textarea"
                rows="5"
                placeholder="Escribe aquí el cuerpo de la noticia..."
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Imagen de Portada</label>
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
                      setForm({ ...form, imagen: null });
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? "ACTUALIZAR NOTICIA" : "PUBLICAR NOTICIA"}
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
        {/* Listado de Noticias - Lado Derecho */}
        <div className="table-card-noti">
          <div className="table-card-header">
            <h3>📋 Últimas Noticias</h3>
            <span className="badge">{noticias.length} publicaciones</span>
          </div>

          <div className="noticias-grid">
            {noticias.length > 0 ? (
              noticias.map((n) => (
                <div key={n.id} className="noticia-card-admin">
                  <div className="noticia-imagen-container">
                    {n.imagen ? (
                      <img
                        src={`${IMG_BASE}${n.imagen}`}
                        alt={n.titulo}
                        className="noticia-imagen"
                      />
                    ) : (
                      <div className="noticia-sin-imagen">
                        Sin imagen destacada
                      </div>
                    )}
                    <div className="noticia-institucion">
                      <span
                        className={`inst-badge ${getInstitucionClass(n.institucion_id)}`}
                      >
                        {getNombreInstitucion(n.institucion_id)}
                      </span>
                    </div>
                  </div>

                  <div className="noticia-contenido">
                    <h4 className="noticia-titulo">{n.titulo}</h4>
                    <p className="noticia-descripcion">{n.descripcion}</p>

                    <div className="noticia-metadata">
                      <span className="noticia-fecha">
                        {new Date(n.fecha_creacion).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="noticia-id">ID: {n.id}</span>
                    </div>

                    <div className="noticia-acciones">
                      <button
                        onClick={() => prepararEdicion(n)}
                        className="noticia-btn noticia-btn-editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarNoticia(n.id)}
                        className="noticia-btn noticia-btn-eliminar"
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
                No hay noticias publicadas aún. ¡Crea la primera!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noticias;
