import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import NoticiasGrid from "../../components/web/NoticiasGrid";
import { apoyosMap } from "../../components/apoyos";
import "../../assets/css/web/InstitucionDetalle.css";

const InstitucionDetalle = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstitucionData();
  }, [slug]);

  const fetchInstitucionData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/instituciones/${slug}`);

      if (response.data.status === 200) {
        setData(response.data.data);
      } else {
        setError("Error al cargar los datos");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin dato disponible";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="loader-institucion">Cargando...</div>;
  if (error) return <div className="error-institucion">{error}</div>;
  if (!data) return null;

  const { club, resumen, por_series, noticias, puesto, grafico } = data;

  // ✅ DEFINIR institucionId AQUÍ
  const institucionId = club?.id;

  return (
    <div className="institucion-detalle-container">
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white fw-bold mb-0">
            <i className="fas fa-chart-line text-accent me-2"></i>
            Información de la Institución
          </h2>
          <Link to="/instituciones" className="btn_det btn-outline-info btn-sm">
            <i className="fas fa-arrow-left me-1"></i> Volver
          </Link>
        </div>

        <div className="rowdet">
          {/* Tarjeta principal del club */}
          <div className="col-md-12 mb-4">
            <div className="card h-100 shadow">
              <div className="rowdet2 g-0">
                {/* Columna izquierda - Logo y nombre */}
                <div className="col-md-6 card-det text-center border-end">
                  <div className="logo-detalle position-relative mb-3">
                    <img
                      src={`${BASE_URL}${club.logo_path}`}
                      className="img-thumbnail rounded-circle"
                      alt={club.nombre}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/120x120/1e1e1e/00d4ff?text=Logo";
                      }}
                    />
                  </div>
                  <h3 className="nomClub">{club.nombre}</h3>
                  <hr className="border-secondary opacity-25" />
                  <div
                    className="text-white-50 small px-3"
                    style={{ textAlign: "justify" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        club.descripcion
                          ?.replace(/\\r\\n/g, "<br/>")
                          .replace(/\\n/g, "<br/>") ||
                        "Sin descripción disponible",
                    }}
                  />
                </div>

                {/* Columna derecha - Información y stats */}
                <div className="col-md-6 card-det text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <p className="text50 px-3">
                      <strong>Fundación:</strong>{" "}
                      {formatearFecha(club.fundacion)}
                    </p>
                    <p className="text50 px-3">
                      <strong>Razón Social:</strong>{" "}
                      {club.razon_social || "Sin dato disponible"}
                    </p>
                    <p className="text50 px-3">
                      <strong>Dirección:</strong>{" "}
                      {club.direccion || "Sin dato disponible"}
                    </p>
                    <p className="text50 px-3">
                      <strong>Teléfono:</strong>{" "}
                      {club.telefono || "Sin dato disponible"}
                    </p>
                    <p className="text50 px-3">
                      <strong>Email:</strong>{" "}
                      {club.email_contacto || "Sin dato disponible"}
                    </p>
                    <p className="text50 px-3">
                      <strong>Estadio:</strong>{" "}
                      {club.estadio || "Sin dato disponible"}
                    </p>
                    <p className="text50 px-3">
                      <strong>Dirección Estadio:</strong>{" "}
                      {club.direccion_estadio || "Sin dato disponible"}
                    </p>

                    {!club.maps ? (
                      <p className="text-white-50 px-3 small italic">
                        No hay información de mapa disponible.
                      </p>
                    ) : (
                      <div className="iframe-container px-3 mb-3">
                        <iframe
                          src={club.maps}
                          height="350"
                          style={{
                            border: 0,
                            width: "90%",
                            margin: "10px auto",
                          }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Ubicación del estadio"
                        ></iframe>
                      </div>
                    )}
                  </div>

                  <hr className="border-secondary opacity-25" />

                  {/* Stats rápidas */}
                  <div className="g-2 px-2">
                    <div className="esta_det">
                      <div className="p-2 border border-secondary rounded bg-black-49">
                        <small
                          className="text-white-50 d-block text-uppercase"
                          style={{ fontSize: "1rem", padding: "5%" }}
                        >
                          GANADOS
                        </small>
                        <span className="text-success fw-bold fs-5">
                          {resumen.pg}
                        </span>
                      </div>
                    </div>
                    <div className="esta_det">
                      <div className="p-2 border border-secondary rounded bg-black-49">
                        <small
                          className="text-white-50 d-block text-uppercase"
                          style={{ fontSize: "1rem", padding: "5%" }}
                        >
                          EMPATADOS
                        </small>
                        <span className="text-secondary fw-bold fs-5">
                          {resumen.pe}
                        </span>
                      </div>
                    </div>
                    <div className="esta_det">
                      <div className="p-2 border border-secondary rounded bg-black-49">
                        <small
                          className="text-white-50 d-block text-uppercase"
                          style={{ fontSize: "1rem", padding: "5%" }}
                        >
                          PERDIDOS
                        </small>
                        <span className="text-danger fw-bold fs-5">
                          {resumen.pp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Puesto si existe */}
                  {puesto > 0 && (
                    <div className="mt-3">
                      <span className="puesto-badge">
                        Puesto #{puesto} en el ranking general
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 👇 APOYO PUBLICITARIO - ANTES DEL DESGLOSE */}
          {institucionId && apoyosMap[parseInt(institucionId)] && (
            <div className="apoyo-container mb-4">
              {React.createElement(apoyosMap[parseInt(institucionId)])}
            </div>
          )}

          {/* Tabla de desglose por categorías */}
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="card-header">
                <h6 className="m-0">
                  <i className="fas fa-list-ol text-accent me-2"></i>
                  Desglose por Categorías
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-hover mb-0 text-center">
                    <thead>
                      <tr>
                        <th className="text-start ps-4">Serie</th>
                        <th className="text-accent">PTS</th>
                        <th>PJ</th>
                        <th className="ocultar">PG</th>
                        <th className="ocultar">PE</th>
                        <th className="ocultar">PP</th>
                        <th className="ocultar">GF</th>
                        <th className="ocultar">GC</th>
                        <th>DG</th>
                        <th>Efectividad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {por_series &&
                        Object.entries(por_series).map(
                          ([nombreSerie, stats]) => {
                            const diff = stats.gf - stats.gc;
                            const totalP = stats.pj * 3;
                            const efectividad =
                              totalP > 0
                                ? Math.round((stats.pts / totalP) * 100)
                                : 0;

                            return (
                              <tr key={nombreSerie} className="align-middle">
                                <td className="text-start ps-4 fw-bold text-white">
                                  {nombreSerie}
                                </td>
                                <td className="bg-black fw-bold fs-5 text-warning text-accent">
                                  {stats.pts}
                                </td>
                                <td>{stats.pj}</td>
                                <td className="text-white ocultar">
                                  {stats.pg}
                                </td>
                                <td className="text-white ocultar">
                                  {stats.pe}
                                </td>
                                <td className="text-danger ocultar">
                                  {stats.pp}
                                </td>
                                <td className="ocultar">{stats.gf}</td>
                                <td className="ocultar">{stats.gc}</td>
                                <td
                                  className={
                                    diff > 0
                                      ? "text-white"
                                      : diff < 0
                                        ? "text-danger"
                                        : ""
                                  }
                                >
                                  {diff > 0 ? "+" : ""}
                                  {diff}
                                </td>
                                <td>{efectividad}%</td>
                              </tr>
                            );
                          },
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Rendimiento General */}
          <div className="col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-header">
                <h6 className="m-0">
                  <i className="fas fa-star text-accent me-2"></i>
                  Rendimiento General
                </h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-borderless text-center align-middle mb-0">
                    <thead>
                      <tr>
                        <th>PARTIDOS</th>
                        <th>PUNTOS</th>
                        <th>DIF. GOLES</th>
                        <th>EFECTIVIDAD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="fs-5 fw-light">{resumen.pj}</span>
                        </td>
                        <td>
                          <span className="fs-5 fw-bold text-accent">
                            {resumen.pts}
                          </span>
                        </td>
                        <td>
                          {(() => {
                            const dg = resumen.gf - resumen.gc;
                            return (
                              <span
                                className={`fs-5 fw-bold ${dg >= 0 ? "text-success" : "text-danger"}`}
                              >
                                {dg > 0 ? "+" : ""}
                                {dg}
                              </span>
                            );
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const ptsPosibles = resumen.pj * 3;
                            const efec =
                              ptsPosibles > 0
                                ? Math.round((resumen.pts / ptsPosibles) * 100)
                                : 0;
                            return <span className="fs-5">{efec}%</span>;
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Distribución de Goles */}
          <div className="col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-header">
                <h6 className="m-0">
                  <i className="fas fa-star text-accent me-2"></i>
                  Distribución de Goles por Serie
                </h6>
              </div>
              <div className="card-body">
                {grafico && grafico.length > 0 ? (
                  <div className="table-responsive">
                    {grafico.map((item, index) => {
                      const porcentaje =
                        resumen.gf > 0 ? (item.goles / resumen.gf) * 100 : 0;
                      return (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between small mb-1">
                            <span>{item.serie}</span>
                            <span className="text-accent">
                              {item.goles} Goles
                            </span>
                          </div>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${porcentaje}%` }}
                              aria-valuenow={porcentaje}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-white-50">
                    No hay datos de goles disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Noticias */}
        <div className="row mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white fw-bold mb-0">
              <i className="fas fa-newspaper text-accent me-2"></i>
              Noticias de {club.nombre}
            </h2>
          </div>

          {noticias && noticias.length > 0 ? (
            <NoticiasGrid
              noticias={noticias}
              mostrarImagen={true}
              columnas={3}
              titulo=""
              limite={noticias.length}
            />
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No hay noticias disponibles para este club.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitucionDetalle;
