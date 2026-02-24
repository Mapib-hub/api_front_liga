import { useEffect, useState } from "react";
import axios from "axios";
// Importamos el mismo CSS maestro (o podrías tener uno unificado)
import "../../assets/css/temporadas.css"; // Reutilizamos los estilos de fechas

const API_URL = "http://192.168.1.250/api_backend/admin/temporadas";

const Temporadas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre_temporada: "", actual: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (e) {
      console.error("Error al cargar datos", e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre_temporada", form.nombre_temporada);
    formData.append("actual", form.actual ? 1 : 0);

    try {
      if (editandoId) {
        await axios.post(`${API_URL}/actualizar/${editandoId}`, formData);
      } else {
        await axios.post(`${API_URL}/guardar`, formData);
      }
      cancelarEdicion();
      fetchData();
    } catch (e) {
      alert("Error al guardar la temporada");
    }
  };

  const activarTemporada = async (id) => {
    try {
      await axios.post(`${API_URL}/activar/${id}`);
      fetchData();
    } catch (e) {
      alert("Error al activar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta temporada?")) return;
    try {
      await axios.delete(`${API_URL}/eliminar/${id}`);
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const prepararEdicion = (item) => {
    setEditandoId(item.id);
    setForm({
      nombre_temporada: item.nombre_temporada,
      actual: item.actual == 1,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm({ nombre_temporada: "", actual: false });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando temporadas...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <h2>📅 Gestión de Temporadas</h2>
        <p>Administra las temporadas de la liga</p>
      </header>

      <div className="page-grid">
        {/* Formulario - Lado Izquierdo */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>{editandoId ? "✏️ Editar Temporada" : "➕ Nueva Temporada"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="form-card-body">
            <div className="form-group">
              <label className="form-label">Nombre de la Temporada</label>
              <input
                className="form-input"
                value={form.nombre_temporada}
                onChange={(e) =>
                  setForm({ ...form, nombre_temporada: e.target.value })
                }
                placeholder="Ej: Temporada 2025, Apertura 2024, etc..."
                required
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--accent)",
                  }}
                  checked={form.actual}
                  onChange={(e) =>
                    setForm({ ...form, actual: e.target.checked })
                  }
                />
                <span>Marcar como Temporada Actual 🔥</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? "ACTUALIZAR TEMPORADA" : "GUARDAR TEMPORADA"}
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

        {/* Listado de Temporadas - Lado Derecho */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>📋 Listado de Temporadas</h3>
            <span className="badge">{data.length} temporadas</span>
          </div>

          <div className="temporadas-grid">
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item.id}
                  className={`temporada-card ${item.actual == 1 ? "temporada-actual" : ""}`}
                >
                  <div className="temporada-header">
                    <span className="temporada-id">ID: {item.id}</span>
                    {item.actual == 1 && (
                      <span className="badge badge-success">🔥 ACTUAL</span>
                    )}
                  </div>

                  <h4 className="temporada-titulo">{item.nombre_temporada}</h4>

                  <div className="temporada-acciones">
                    <button
                      onClick={() => prepararEdicion(item)}
                      className="temporada-btn temporada-btn-editar"
                      title="Editar temporada"
                    >
                      ✏️ Editar
                    </button>

                    {item.actual != 1 && (
                      <>
                        <button
                          onClick={() => activarTemporada(item.id)}
                          className="temporada-btn temporada-btn-activar"
                          title="Activar como temporada actual"
                        >
                          ⚡ Activar
                        </button>
                        <button
                          onClick={() => eliminar(item.id)}
                          className="temporada-btn temporada-btn-eliminar"
                          title="Eliminar temporada"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                className="empty-state"
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                No hay temporadas cargadas aún
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temporadas;
