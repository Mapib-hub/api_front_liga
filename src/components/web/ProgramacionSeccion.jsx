import React from "react";
import { BASE_URL } from "../../api";
import "../../assets/css/web/ProgramacionSeccion.css";

const ProgramacionSeccion = ({
  titulo,
  fecha,
  regulares = [],
  especiales = [],
  color = "info",
}) => {
  const getImagenUrl = (logo) => {
    if (!logo) return "https://via.placeholder.com/40";
    return `${BASE_URL}${logo}`;
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

  if (especiales.length === 0 && regulares.length === 0) {
    return (
      <div className="col-lg-6 mb-5">
        <div className="text-center mb-4">
          <h2 className="programacion-titulo">Programación {titulo}</h2>
          <p className="programacion-fecha">{fecha || "Sin fecha"}</p>
        </div>
        <div className="empty-fixture">
          <p>No hay partidos programados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-6 mb-5">
      {/* TÍTULO */}
      <div className="text-center mb-4">
        <h2 className="programacion-titulo">Programación {titulo}</h2>
        <p className="programacion-fecha">{fecha || "Próxima fecha"}</p>
      </div>

      {/* PARTIDOS ESPECIALES */}
      {especiales.length > 0 && (
        <>
          <div className="seccion-etiqueta">
            <span className="etiqueta-texto">DEFINICIÓN / LIGUILLA</span>
          </div>

          <table className="programacion-tabla">
            <tbody>
              {especiales.map((partido, idx) => (
                <React.Fragment key={`esp-${idx}`}>
                  <tr className="partido-fila">
                    <td className="equipo-col">
                      <div className="equipo-info">
                        <img
                          src={getImagenUrl(
                            partido.escudo_local || partido.logo_local,
                          )}
                          alt={partido.nombre_local || partido.local}
                          className="equipo-escudo-tabla"
                        />
                        <span className="equipo-nombre-tabla">
                          {partido.nombre_local || partido.local}
                        </span>
                      </div>
                    </td>

                    <td className="info-col">
                      <div className="partido-info">
                        <span className="partido-fecha-tabla">
                          {formatFecha(partido.fecha_calendario)}
                        </span>
                        <span className="partido-serie-tabla">
                          {partido.nombre_serie}
                        </span>
                        <span className="partido-fase-tabla">LIGUILLA</span>
                        <span className="partido-hora-tabla">
                          {formatHora(partido.hora)}
                        </span>
                      </div>
                    </td>

                    <td className="equipo-col">
                      <div className="equipo-info visitante">
                        <span className="equipo-nombre-tabla">
                          {partido.nombre_visitante || partido.visitante}
                        </span>
                        <img
                          src={getImagenUrl(
                            partido.escudo_visitante || partido.logo_visitante,
                          )}
                          alt={partido.nombre_visitante || partido.visitante}
                          className="equipo-escudo-tabla"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="estadio-fila">
                    <td colSpan="3" className="estadio-col">
                      <span className="partido-estadio-tabla">
                        Estadio: {partido.estadio || "Por definir"}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* PARTIDOS REGULARES */}
      {regulares.length > 0 && (
        <>
          <div className="seccion-etiqueta regular">
            <span className="etiqueta-texto">
              TORNEO OFICIAL {titulo.toUpperCase()}
            </span>
          </div>

          <table className="programacion-tabla">
            <tbody>
              {regulares.map((partido, idx) => (
                <React.Fragment key={`reg-${idx}`}>
                  <tr className="partido-fila">
                    <td className="equipo-col">
                      <div className="equipo-info">
                        <img
                          src={getImagenUrl(partido.logo_local)}
                          alt={partido.local}
                          className="equipo-escudo-tabla"
                        />
                        <span className="equipo-nombre-tabla">
                          {partido.local}
                        </span>
                      </div>
                    </td>

                    <td className="vs-col">
                      <span className="partido-vs-tabla">VS</span>
                    </td>

                    <td className="equipo-col">
                      <div className="equipo-info visitante">
                        <span className="equipo-nombre-tabla">
                          {partido.visitante}
                        </span>
                        <img
                          src={getImagenUrl(partido.logo_visitante)}
                          alt={partido.visitante}
                          className="equipo-escudo-tabla"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="estadio-fila">
                    <td colSpan="3" className="estadio-col">
                      <span className="partido-estadio-tabla">
                        Estadio: {partido.estadio || "Por definir"}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ProgramacionSeccion;
