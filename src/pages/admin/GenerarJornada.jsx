import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/generar-jornada.css";

const API_URL = "http://192.168.1.250/api_backend/admin/fixture";

const GenerarJornada = () => {
  const { principalId } = useParams();
  const navigate = useNavigate();

  const [duelo, setDuelo] = useState(null);
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState({});
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetchDueloYSeries();
  }, [principalId]);

  const fetchDueloYSeries = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/generar-jornada/${principalId}`,
      );

      if (response.data.status) {
        setDuelo(response.data.duelo);
        setSeries(response.data.series);

        // Inicializar todos como seleccionados (checked)
        const inicial = {};
        response.data.series.forEach((s) => {
          inicial[s.id] = true;
        });
        setSelectedSeries(inicial);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar la información del cruce");
    } finally {
      setLoading(false);
    }
  };

  const toggleSerie = (serieId) => {
    setSelectedSeries((prev) => ({
      ...prev,
      [serieId]: !prev[serieId],
    }));
  };

  const marcarTodas = () => {
    const todasSeleccionadas = Object.values(selectedSeries).every(
      (v) => v === true,
    );
    const nuevoEstado = !todasSeleccionadas;

    const nuevas = {};
    series.forEach((s) => {
      nuevas[s.id] = nuevoEstado;
    });
    setSelectedSeries(nuevas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const seriesSeleccionadas = Object.entries(selectedSeries)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => parseInt(id));

    if (seriesSeleccionadas.length === 0) {
      alert("❌ Debes seleccionar al menos una serie");
      setEnviando(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("principal_id", principalId);
      formData.append("fecha_id", duelo.fecha_id);

      // Enviar cada serie como un campo separado con el mismo nombre
      seriesSeleccionadas.forEach((id) => {
        formData.append("series[]", id);
      });

      const response = await axios.post(
        `${API_URL}/guardar-jornada`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.status) {
        alert("✅ Partidos generados correctamente");
        navigate(`/fixture/${duelo.fecha_id}`);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        alert(
          `❌ Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        );
      } else {
        alert("❌ Error al guardar");
      }
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Cargando información...</div>
      </div>
    );
  }

  if (!duelo) {
    return (
      <div className="admin-page">
        <div className="empty-state">Cruce no encontrado</div>
      </div>
    );
  }

  const todasSeleccionadas =
    Object.values(selectedSeries).length > 0 &&
    Object.values(selectedSeries).every((v) => v === true);

  return (
    <div className="admin-page generar-jornada-page">
      <div className="generar-jornada-card">
        {/* Header */}
        <div className="generar-header">
          <h6 className="header-subtitulo">CONFIGURAR JORNADA</h6>
          <h2 className="header-titulo">
            <span className="equipo-nombre">{duelo.local_nombre}</span>
            <span className="vs-badge">VS</span>
            <span className="equipo-nombre">{duelo.visitante_nombre}</span>
          </h2>
        </div>

        <div className="generar-body">
          {/* Info alert */}
          <div className="info-alert">
            <span className="info-icon">ℹ️</span>
            <p>
              Selecciona las series que participarán en este cruce. Al guardar,
              el sistema generará los registros individuales para cada partido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="generar-form">
            <input type="hidden" name="principal_id" value={duelo.id} />
            <input type="hidden" name="fecha_id" value={duelo.fecha_id} />

            {/* Series grid */}
            <div className="series-section">
              <div className="series-header">
                <h3 className="series-titulo">
                  <span>📋</span> Series Disponibles
                </h3>
                <button
                  type="button"
                  className="btn-marcar-todas"
                  onClick={marcarTodas}
                >
                  <span>✓✓</span>{" "}
                  {todasSeleccionadas ? "Desmarcar Todas" : "Marcar Todas"}
                </button>
              </div>

              <div className="series-grid">
                {series.map((serie) => (
                  <label key={serie.id} className="serie-label">
                    <input
                      type="checkbox"
                      className="serie-checkbox"
                      checked={selectedSeries[serie.id] || false}
                      onChange={() => toggleSerie(serie.id)}
                    />
                    <div
                      className={`serie-card ${selectedSeries[serie.id] ? "selected" : ""}`}
                    >
                      <div className="serie-icon">🏆</div>
                      <div className="serie-info">
                        <span className="serie-nombre">{serie.nombre}</span>
                        <span className="serie-slug">{serie.slug}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              <button type="submit" className="btn-generar" disabled={enviando}>
                <span>💾</span>
                {enviando ? "Generando..." : "Generar Partidos"}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => navigate(`/fixture`)}
              >
                Cancelar y volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerarJornada;
