import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importa useParams
import api, { BASE_URL } from "../../api";
import "../../assets/css/web/SerieDetalle.css";

const SerieDetalle = () => {
  // No recibes props
  const { slug } = useParams(); // Obtienes el slug de la URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      //console.log("Fetching URL:", `/series/detalle/${slug}`);

      const response = await api.get(`/series/detalle/${slug}`);
      // console.log("Response:", response.data);

      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError("Error al cargar los datos");
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  const {
    serie,
    menu_series,
    tabla,
    fecha_adultos,
    proximo_partido,
    ultimo_partido,
  } = data;

  return (
    <div className="serie-detalle-container">
      {/* Barra de navegación de series */}
      <nav className="series-nav">
        {menu_series.map((item) => (
          <a
            key={item.id}
            href={`/detalle-serie/${item.slug}`}
            className={item.id === serie.id ? "active" : ""}
          >
            {item.nombre}
          </a>
        ))}
      </nav>

      {/* Título de la serie actual */}
      <div className="serie-descripcion-web">
        <h1>{serie.nombre.toUpperCase()}</h1>
        <p>{serie.descripcion}</p>
      </div>

      {/* Tabla de posiciones */}
      <div className="tabla-posiciones">
        <div className="table-responsive">
          <h2>Tabla de Posiciones</h2>
          <table className="pos_series">
            <thead>
              <tr>
                <th>Club</th>
                <th>PTS</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th className="red">PP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>%Efe</th>
              </tr>
            </thead>
            <tbody>
              {/* ===== INICIO DE LOS CAMBIOS ===== */}
              {tabla.map((equipo, index) => {
                // La posición es index + 1 (porque el array empieza en 0)
                const posicion = index + 1;

                // 🔴 NUEVO: Determinar la clase CSS según las reglas
                let rowClass = "";

                // 🔴 NUEVO: Serie infantil (ID menor o igual a 3)
                if (serie.id <= 3) {
                  // Colorear posiciones 1 a 8
                  if (posicion <= 8) {
                    rowClass = "infantil-destacado";
                  }
                }
                // 🔴 NUEVO: Serie adulta (ID mayor a 3)
                else {
                  if (posicion === 1) {
                    rowClass = "campeon";
                  } else if (posicion >= 2 && posicion <= 5) {
                    rowClass = "clasificado";
                  }
                }

                return (
                  // 🔴 NUEVO: Agregamos la clase calculada a la fila
                  <tr key={equipo.id} className={rowClass}>
                    <td className="club-cell">
                      <img
                        src={`${BASE_URL}${equipo.escudo}`}
                        alt={equipo.nombre}
                        className="club-escudo"
                      />
                      <span>{equipo.nombre}</span>
                    </td>
                    <td className="pts">{equipo.PTS}</td>
                    <td>{equipo.PJ}</td>
                    <td>{equipo.PG}</td>
                    <td>{equipo.PE}</td>
                    <td className="red">{equipo.PP}</td>
                    <td>{equipo.GF}</td>
                    <td>{equipo.GC}</td>
                    <td>{equipo.DG}</td>
                    <td className="porcentaje">
                      {((equipo.PTS / (equipo.PJ * 3)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              {/* ===== FIN DE LOS CAMBIOS ===== */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Próximo Encuentro y Último Resultado */}
      <div className="partidos-grid">
        {/* Próximo Encuentro */}
        <div className="cproximo-partido">
          <div className="card bg-dark border-secondary h-100 shadow">
            <div className="card-header border-info">
              <h5 className="m-0 text-white">
                <i className="fa-solid fa-calendar-check text-info me-2"></i>
                Próximo Encuentro
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover m-0">
                  <thead>
                    <tr className="text-info small text-uppercase">
                      <th className="text-end" style={{ width: "40%" }}>
                        Local
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        Hora/Fecha
                      </th>
                      <th className="text-start" style={{ width: "40%" }}>
                        Visita
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!proximo_partido || proximo_partido.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No hay partidos programados
                        </td>
                      </tr>
                    ) : (
                      proximo_partido.map((partido) => (
                        <React.Fragment key={partido.id}>
                          <tr>
                            <td className="text-end align-middle text-white-50">
                              <img
                                className="img-tablaPos"
                                src={`${BASE_URL}${partido.logo_local}`}
                                alt={partido.nombre_local}
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/50x50/1e1e1e/00d4ff?text=Logo";
                                }}
                              />
                              {partido.nombre_local}
                            </td>
                            <td className="text-center align-middle">
                              <span className="badge bg-info text-dark px-3">
                                {partido.fecha_hora || "Pendiente"}
                              </span>
                            </td>
                            <td className="text-start align-middle text-white-50">
                              {partido.nombre_visita}
                              <img
                                className="img-tablaPos"
                                src={`${BASE_URL}${partido.logo_visita}`}
                                alt={partido.nombre_visita}
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/50x50/1e1e1e/00d4ff?text=Logo";
                                }}
                              />
                            </td>
                          </tr>
                          {partido.observaciones && (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center align-middle"
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: partido.observaciones,
                                  }}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Último Resultado */}
        <div className="cproximo-partido">
          <div className="card bg-dark border-secondary h-100 shadow">
            <div className="card-header border-info">
              <h5 className="m-0 text-white">
                <i className="fa-solid fa-circle-check text-info me-2"></i>
                Último Resultado
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover m-0">
                  <thead>
                    <tr className="text-info small text-uppercase">
                      <th className="text-end" style={{ width: "40%" }}>
                        Local
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        Res
                      </th>
                      <th className="text-start" style={{ width: "40%" }}>
                        Visita
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!ultimo_partido || ultimo_partido.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No hay resultados recientes
                        </td>
                      </tr>
                    ) : (
                      ultimo_partido.map((partido) => (
                        <React.Fragment key={partido.id}>
                          <tr>
                            <td className="text-end align-middle text-white-50">
                              <img
                                className="img-tablaPos"
                                src={`${BASE_URL}${partido.logo_local}`}
                                alt={partido.nombre_local}
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/50x50/1e1e1e/00d4ff?text=Logo";
                                }}
                              />
                              {partido.nombre_local}
                            </td>
                            <td className="text-center align-middle">
                              <span className="badge bg-info text-dark px-3">
                                {partido.goles_local} - {partido.goles_visita}
                              </span>
                            </td>
                            <td className="text-start align-middle text-white-50">
                              {partido.nombre_visita}
                              <img
                                className="img-tablaPos"
                                src={`${BASE_URL}${partido.logo_visita}`}
                                alt={partido.nombre_visita}
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/50x50/1e1e1e/00d4ff?text=Logo";
                                }}
                              />
                            </td>
                          </tr>
                          {partido.observaciones && (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center align-middle"
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: partido.observaciones,
                                  }}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerieDetalle;
