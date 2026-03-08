import React from "react";
import { BASE_URL } from "../../api";

const FixtureEspecialRow = ({ partido }) => {
  const getImagenUrl = (logo) => {
    if (!logo) return "https://via.placeholder.com/60";
    return `${BASE_URL}/uploads/logos/${logo}`;
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatHora = (horaStr) => {
    if (!horaStr) return "";
    return horaStr.substring(0, 5);
  };

  return (
    <>
      <div
        className="fixture-row d-flex align-items-center justify-content-between shadow mb-2"
        style={{ borderLeft: "4px solid #07ff5e" }}
      >
        <div className="text-end" style={{ width: "35%" }}>
          <img
            src={getImagenUrl(partido.escudo_local || partido.logo_local)}
            className="img-fluid p-1"
            style={{ width: "60px" }}
            alt={partido.nombre_local || partido.local}
          />
          <span className="fw-bold d-block small">
            {partido.nombre_local || partido.local}
          </span>
        </div>
        <div className="text-center" style={{ width: "30%" }}>
          <div className="small fw-bold">
            {formatFecha(partido.fecha_calendario)}
          </div>
          <small
            className="d-block text-white-50"
            style={{ fontSize: "0.7rem" }}
          >
            {partido.nombre_serie}
          </small>
          <span
            className="badge bg-success text-dark"
            style={{ fontSize: "0.6rem" }}
          >
            {partido.fase?.toUpperCase()}
          </span>
          <div className="small fw-bold">{formatHora(partido.hora)}</div>
        </div>
        <div className="text-start" style={{ width: "35%" }}>
          <img
            src={getImagenUrl(
              partido.escudo_visitante || partido.logo_visitante,
            )}
            className="img-fluid p-1"
            style={{ width: "60px" }}
            alt={partido.nombre_visitante || partido.visitante}
          />
          <span className="fw-bold d-block small">
            {partido.nombre_visitante || partido.visitante}
          </span>
        </div>
      </div>
      <div className="text-center mb-4">
        <small className="text-white-50 small">
          Estadio: {partido.estadio || "Por definir"}
        </small>
      </div>
    </>
  );
};

export default FixtureEspecialRow;
