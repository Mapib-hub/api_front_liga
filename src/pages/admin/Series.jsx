import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/series.css"; // CSS específico para series
import "../../assets/css/fechas.css"; // Clases base (form-card, etc.)

const API_URL = "http://192.168.1.250/api_backend/admin/series";

const Series = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);

    try {
      if (editandoId) {
        await axios.post(`${API_URL}/actualizar/${editandoId}`, formData);
      } else {
        await axios.post(`${API_URL}/guardar`, formData);
      }
      cancelarEdicion();
      fetchData();
    } catch (e) {
      alert("Error al guardar la serie.");
    }
  };

  const prepararEdicion = (item) => {
    setEditandoId(item.id);
    setForm({
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm({ nombre: "", descripcion: "" });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar serie?")) return;
    try {
      await axios.delete(`${API_URL}/eliminar/${id}`);
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando series...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header temático */}
      <div className="series-header">
        <div className="series-title-section">
          <h2>🏆 Gestión de Series</h2>
          <p>Administra las series y competiciones de la liga</p>
        </div>

        <div className="series-stats">
          <div className="series-stat-card">
            <div className="series-stat-number">{data.length}</div>
            <div className="series-stat-label">Series Activas</div>
          </div>
          <div className="series-stat-card">
            <div className="series-stat-number">
              {data.filter((s) => s.descripcion?.length > 0).length}
            </div>
            <div className="series-stat-label">Con Descripción</div>
          </div>
        </div>
      </div>

      <div className="page-grid">
        {/* Formulario - Lado Izquierdo */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>{editandoId ? "✏️ Editar Serie" : "➕ Nueva Serie"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="form-card-body">
            <div className="form-group">
              <label className="form-label">Nombre de la Serie</label>
              <input
                className="form-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Primera División, Copa de Liga, etc..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Describe el formato, equipos participantes, etc..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? "ACTUALIZAR SERIE" : "CREAR SERIE"}
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

        {/* Listado de Series - Lado Derecho */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>🏆 Listado de Series</h3>
            <span className="badge">{data.length} series</span>
          </div>

          <div className="series-grid">
            {data.length > 0 ? (
              data.map((item, index) => (
                <div
                  key={item.id}
                  className="serie-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="serie-card-header">
                    <span className="serie-icon">🏆</span>
                    <span className="serie-id">ID: {item.id}</span>
                  </div>

                  <div className="serie-card-body">
                    <h4 className="serie-nombre">{item.nombre}</h4>

                    {item.descripcion ? (
                      <p className="serie-descripcion">{item.descripcion}</p>
                    ) : (
                      <p className="serie-descripcion serie-descripcion-placeholder">
                        Sin descripción disponible
                      </p>
                    )}

                    <div className="serie-card-stats">
                      <span className="serie-stat">
                        <span>📅</span> Creada recientemente
                      </span>
                    </div>
                  </div>

                  <div className="serie-card-footer">
                    <div className="serie-acciones">
                      <button
                        onClick={() => prepararEdicion(item)}
                        className="serie-btn serie-btn-editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminar(item.id)}
                        className="serie-btn serie-btn-eliminar"
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
                No hay series creadas aún. ¡Crea la primera!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Series;
