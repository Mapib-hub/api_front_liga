import React from "react";
import { BASE_URL } from "../../api";

const FixtureRow = ({ partido }) => {
  const getImagenUrl = (logo) => {
    if (!logo) return "https://via.placeholder.com/60";
    return `${BASE_URL}/uploads/logos/${logo}`;
  };

  return (
    <>
      <div className="fixture-row d-flex align-items-center justify-content-between shadow mb-2">
        <div className="text-end" style={{ width: "40%" }}>
          <img
            src={getImagenUrl(partido.logo_local)}
            className="img-fluid p-1"
            style={{ width: "60px" }}
            alt={partido.local}
          />
          <span className="fw-bold d-block small">{partido.local}</span>
        </div>
        <div className="text-center" style={{ width: "20%" }}>
          <span className="badge bg-dark border border-info">VS</span>
        </div>
        <div className="text-start" style={{ width: "40%" }}>
          <img
            src={getImagenUrl(partido.logo_visitante)}
            className="img-fluid p-1"
            style={{ width: "60px" }}
            alt={partido.visitante}
          />
          <span className="fw-bold d-block small">{partido.visitante}</span>
        </div>
      </div>
      <div className="text-center mb-4">
        <small>Estadio: {partido.estadio || "Por definir"}</small>
      </div>
    </>
  );
};

export default FixtureRow;
