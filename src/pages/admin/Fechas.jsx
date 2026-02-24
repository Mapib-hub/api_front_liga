import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/fechas.css";

const API_URL = "http://192.168.1.250/api_backend/admin/fechas";
const TEMP_URL = "http://192.168.1.250/api_backend/admin/temporadas";

const Fechas = () => {
  const [data, setData] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre_fecha: "",
    estado: "pendiente",
    temporada_id: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resFechas, resTemps] = await Promise.all([
        axios.get(API_URL),
        axios.get(TEMP_URL),
      ]);
      setData(Array.isArray(resFechas.data) ? resFechas.data : []);
      setTemporadas(Array.isArray(resTemps.data) ? resTemps.data : []);
      const actual = resTemps.data.find((t) => t.actual == 1);
      if (actual) setForm((prev) => ({ ...prev, temporada_id: actual.id }));
      setLoading(false);
    } catch (e) {
      console.error("Error:", e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre_fecha", form.nombre_fecha);
    formData.append("estado", form.estado);
    formData.append("temporada_id", form.temporada_id);

    try {
      const url = editandoId
        ? `${API_URL}/actualizar/${editandoId}`
        : `${API_URL}/guardar`;
      await axios.post(url, formData);
      setEditandoId(null);
      setForm({ ...form, nombre_fecha: "" });
      fetchInitialData();
    } catch (e) {
      alert("Error al guardar");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <h2>📅 Gestión de Fechas</h2>
        <p>Administra las fechas de cada temporada</p>
      </header>

      <div className="page-grid">
        {/* Formulario */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>{editandoId ? "✏️ Editar Fecha" : "➕ Nueva Fecha"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="form-card-body">
            <div className="form-group">
              <label className="form-label">Nombre de la Fecha</label>
              <input
                className="form-input"
                value={form.nombre_fecha}
                onChange={(e) =>
                  setForm({ ...form, nombre_fecha: e.target.value })
                }
                placeholder="Ej: Fecha 1, Semifinal, etc..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="jugada">✅ Jugada</option>
                <option value="suspendida">🚫 Suspendida</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Temporada</label>
              <select
                className="form-select"
                value={form.temporada_id}
                onChange={(e) =>
                  setForm({ ...form, temporada_id: e.target.value })
                }
                required
              >
                <option value="">Seleccionar temporada...</option>
                {temporadas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre_temporada} {t.actual === 1 ? "🔥" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? "ACTUALIZAR FECHA" : "GUARDAR FECHA"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditandoId(null);
                    setForm({ ...form, nombre_fecha: "", estado: "pendiente" });
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>📋 Listado de Fechas</h3>
            <span className="badge">{data.length} fechas</span>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Temporada</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="table-row">
                      <td>
                        <span className="badge badge-success">
                          {item.nombre_temporada}
                        </span>
                      </td>
                      <td className="fw-bold">{item.nombre_fecha}</td>
                      <td>
                        <span className={`status-badge status-${item.estado}`}>
                          {item.estado === "pendiente" && "⏳ Pendiente"}
                          {item.estado === "jugada" && "✅ Jugada"}
                          {item.estado === "suspendida" && "🚫 Suspendida"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            setEditandoId(item.id);
                            setForm({
                              nombre_fecha: item.nombre_fecha,
                              estado: item.estado,
                              temporada_id: item.temporada_id,
                            });
                          }}
                          className="btn-icon"
                          title="Editar fecha"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center empty-state">
                      No hay fechas cargadas aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fechas;
