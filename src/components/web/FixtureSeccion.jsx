import React from "react";
import FixtureRow from "./FixtureRow";
import FixtureEspecialRow from "./FixtureEspecialRow";
import EmptyFixture from "./EmptyFixture";

const FixtureSeccion = ({
  titulo,
  fecha,
  regulares = [],
  especiales = [],
  color = "info",
  icono = "fa-solid fa-futbol",
}) => {
  const tieneContenido = regulares.length > 0 || especiales.length > 0;

  return (
    <div className="col-lg-6 mb-5">
      <div className="text-center mb-4">
        <h2 className={`text-${color} display-6 fw-bold`}>
          <i className={`${icono} me-2`}></i>
          Programación {titulo}
        </h2>
        <p className="text-success">{fecha || "Sin Fecha Definida"}</p>
      </div>

      {!tieneContenido ? (
        <EmptyFixture tipo={titulo.toLowerCase()} />
      ) : (
        <>
          {regulares.length > 0 && (
            <>
              <h5 className="border-bottom border-secondary pb-2 mb-3 text-uppercase small">
                Torneo Oficial
              </h5>
              {regulares.map((partido, index) => (
                <FixtureRow key={index} partido={partido} />
              ))}
            </>
          )}

          {especiales.length > 0 && (
            <>
              <h5
                className={`text-${color} border-bottom border-${color} pb-2 mb-3 mt-4 text-uppercase small`}
              >
                Definición / Liguilla
              </h5>
              {especiales.map((partido, index) => (
                <FixtureEspecialRow key={index} partido={partido} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FixtureSeccion;
