import React from "react";

const EmptyFixture = ({ tipo, icono = "fa-solid fa-calendar-xmark" }) => {
  return (
    <div
      className="bd-dark alert text-center shadow-sm"
      style={{ border: "1px dashed #333" }}
    >
      <i className={`${icono} d-block mb-2 fs-3 text-success opacity-50`}></i>
      <span className="text-white-50">
        No hay programación de {tipo} disponible.
      </span>
    </div>
  );
};

export default EmptyFixture;
