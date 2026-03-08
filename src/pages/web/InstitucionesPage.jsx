import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import "../../assets/css/web/InstitucionesPage.css";

const InstitucionesPage = () => {
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/instituciones")
      .then((res) => {
        // Ajustá según la estructura de tu API
        const data = res.data.data || res.data || [];
        setInstituciones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando instituciones:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Cargando instituciones...</div>;

  return (
    <div className="container mar_cont py-5">
      <div className="row mb-5 text-center">
        <div className="col-12">
          <h2 className="display-4 fw-bold text-uppercase">
            Nuestras <span className="text-neon">Instituciones</span>
          </h2>
          <div className="separador-neon mx-auto"></div>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {instituciones.map((inst) => (
          <div key={inst.id} className="col-6 col-md-4 col-lg-3">
            <Link
              to={`/instituciones/${inst.slug}`}
              className="text-decoration-none"
            >
              <div className="institucion-card-v2">
                <div className="card-glow"></div>
                <div className="logo-wrapper">
                  <img
/*                    src={`${BASE_URL}/uploads/logos/${inst.logo_path}`}*/
                    src={`${BASE_URL}${inst.logo_path}`}
                    alt={inst.nombre}
                    className="logo-institucion-v2"
                  />
                </div>
                <div className="info-institucion">
                  <h5 className="nombre-institucion-v2">{inst.nombre}</h5>
                  <span className="btn-ver-mas">Ver Club</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitucionesPage;
