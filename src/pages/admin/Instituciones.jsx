import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Usamos axios
import { BASE_URL } from "../../api"; // ✅ Solo importamos BASE_URL
import "../../assets/css/admin/instituciones.css"; // CSS específico
import "../../assets/css/admin/fechas.css"; // Clases base

// ✅ SOLO BASE_URL en todas las rutas
const API_URL = `${BASE_URL}admin/instituciones`;
const IMG_BASE = `${BASE_URL}`;

const Instituciones = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ axios con URL completa
      const res = await axios.get(API_URL);
      setData(Array.isArray(res.data) ? res.data : []);
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
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    if (form.imagen) formData.append("imagen", form.imagen);

    try {
      if (editandoId) {
        // ✅ axios con URL completa
        await axios.post(`${API_URL}/actualizar/${editandoId}`, formData);
      } else {
        // ✅ axios con URL completa
        await axios.post(`${API_URL}/guardar`, formData);
      }
      cancelarEdicion();
      fetchData();
    } catch (e) {
      alert("Error al guardar la institución");
    }
  };

  const prepararEdicion = (item) => {
    setEditandoId(item.id);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      imagen: null,
    });
    setPreview(item.logo_path ? `${IMG_BASE}${item.logo_path}` : null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setPreview(null);
    setForm({ nombre: "", descripcion: "", imagen: null });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta institución?")) return;
    try {
      // ✅ axios con URL completa
      await axios.delete(`${API_URL}/eliminar/${id}`);
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando instituciones...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header con estilo heráldico */}
      <div className="instituciones-header">
        <div className="instituciones-title-section">
          <h2>
            <span>🛡️</span> Gestión de Instituciones
          </h2>
          <p>Administra clubes, asociaciones y entidades deportivas</p>
        </div>

        <div className="instituciones-stats">
          <div className="instituciones-stat-card">
            <div className="instituciones-stat-number">{data.length}</div>
            <div className="instituciones-stat-label">Instituciones</div>
          </div>
          <div className="instituciones-stat-card">
            <div className="instituciones-stat-number">
              {data.filter((i) => i.logo_path).length}
            </div>
            <div className="instituciones-stat-label">Con Escudo</div>
          </div>
          <div className="instituciones-stat-card">
            <div className="instituciones-stat-number">
              {data.filter((i) => i.descripcion?.length > 50).length}
            </div>
            <div className="instituciones-stat-label">Completas</div>
          </div>
        </div>
      </div>

      <div className="page-grid">
        {/* Formulario - Lado Izquierdo */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editandoId ? "✏️ Editar Institución" : "➕ Nueva Institución"}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="form-card-body">
            <div className="form-group">
              <label className="form-label">Nombre de la Institución</label>
              <input
                className="form-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Club Atlético Independiente, Asociación X, etc..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción / Historia</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Breve descripción, fundación, logros, etc..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Escudo / Logo</label>
              <input
                type="file"
                className="form-input"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>

            {preview && (
              <div className="institucion-preview-container">
                <img
                  src={preview}
                  alt="Preview"
                  className="institucion-preview"
                />
                <div className="institucion-preview-overlay">
                  <span>Vista previa del escudo</span>
                  <button
                    type="button"
                    className="institucion-preview-btn"
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
                {editandoId
                  ? "ACTUALIZAR INSTITUCIÓN"
                  : "REGISTRAR INSTITUCIÓN"}
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

        {/* Listado de Instituciones - Lado Derecho */}
        <div className="table-card_inst">
          <div className="table-card-header">
            <h3>🛡️ Directorio de Instituciones</h3>
            <span className="badge">{data.length} registros</span>
          </div>

          <div className="instituciones-grid">
            {data.length > 0 ? (
              data.map((item, index) => (
                <div
                  key={item.id}
                  className="institucion-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="institucion-logo-container">
                    {item.logo_path ? (
                      <img
                        src={`${IMG_BASE}${item.logo_path}`}
                        alt={item.nombre}
                        className="institucion-logo"
                      />
                    ) : (
                      <div className="institucion-logo-placeholder">
                        Escudo no disponible
                      </div>
                    )}
                  </div>

                  <div className="institucion-card-header">
                    <span className="institucion-badge">INSTITUCIÓN</span>
                    <span className="institucion-id">ID: {item.id}</span>
                  </div>

                  <div className="institucion-card-body">
                    <h4 className="institucion-nombre">{item.nombre}</h4>
                    <p className="institucion-descripcion">
                      {item.descripcion || "Sin descripción disponible"}
                    </p>
                  </div>

                  <div className="institucion-card-footer">
                    <div className="institucion-acciones">
                      <button
                        onClick={() => prepararEdicion(item)}
                        className="institucion-btn institucion-btn-editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminar(item.id)}
                        className="institucion-btn institucion-btn-eliminar"
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
                No hay instituciones registradas aún. ¡Comienza agregando una!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instituciones;
