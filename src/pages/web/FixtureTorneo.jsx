import React, { useState, useEffect } from "react";
import api, { BASE_URL } from "../../api";
import DifuHorizontal from "../../components/apoyos/DifuHorizontal.jsx";
import "../../assets/css/web/FixtureTorneo.css";

const FixtureTorneo = () => {
  const [fixtureData, setFixtureData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/fixture")
      .then((res) => {
        console.log("📦 Data recibida:", res.data);
        setFixtureData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando fixture:", err);
        setLoading(false);
      });
  }, []);

  const getImagenUrl = (logo) => {
    if (!logo) return "https://via.placeholder.com/50";
    // ✅ Si logo ya trae la ruta completa (ej: "uploads/logos/equipo.png")
    return `${BASE_URL}${logo}`;
  };

  if (loading) return <div className="loader">Cargando fixture...</div>;
  if (!fixtureData?.data) return <div className="loader">No hay datos</div>;

  const fechas = Object.entries(fixtureData.data).map(
    ([nombreFecha, partidos]) => ({
      nombre: nombreFecha,
      partidos: partidos,
    }),
  );

  return (
    <div className="fixture-container">
      <div className="bg-oscuro p-4 rounded shadow-lg">
        <h2 className="text-center fw-bold mb-5 text-uppercase">
          Fixture del Torneo
        </h2>

        {fechas.map((fecha, idx) => (
          <div key={idx} className="mb-5">
            {/* Cabecera de fecha */}
            <div className="fix-header mb-3 p-2 rounded-3 shadow-sm">
              <h4 className="m-0 fw-bold">
                <i className="fas fa-calendar-alt me-2"></i> {fecha.nombre}
              </h4>
            </div>

            {/* Grid de partidos */}
            <div className="row g-3">
              {fecha.partidos.map((partido) => (
                <div key={partido.id} className="tarj_part">
                  <div className="card-partido h-100 border-0 shadow-sm p-2">
                    <div className="card-body d-flex align-items-center justify-content-between text-center">
                      {/* Equipo Local */}
                      <div className="equipo-box">
                        <img
                          className="img-fluid mb-2"
                          style={{ maxHeight: "50px" }}
                          src={getImagenUrl(partido.logo_local)}
                          alt={partido.local}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <p className="small fw-bold m-0 text-white text-truncate">
                          {partido.local}
                        </p>
                      </div>

                      {/* VS */}
                      <div className="vs-badge mx-2">
                        <span className="badge bg-dark rounded-circle p-2">
                          VS
                        </span>
                      </div>

                      {/* Equipo Visitante */}
                      <div className="equipo-box">
                        <img
                          className="img-fluid mb-2"
                          style={{ maxHeight: "50px" }}
                          src={getImagenUrl(partido.logo_visitante)}
                          alt={partido.visitante}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <p className="small fw-bold m-0 text-white text-truncate">
                          {partido.visitante}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Publicidad cada 4 fechas */}
            {(idx + 1) % 4 === 0 && (
              <div className="contenedor-apoyo horizontal">
                <DifuHorizontal />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixtureTorneo;