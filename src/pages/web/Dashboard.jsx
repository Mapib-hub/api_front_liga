// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import ProgramacionSeccion from "../../components/web/ProgramacionSeccion";
import DifuHorizontal from "../../components/apoyos/DifuHorizontal";
import DifuHorizontalz from "../../components/apoyos/DifuHorizontalz";
import StatsCards from "../../components/web/StatsCards";
import NoticiasGrid from "../../components/web/NoticiasGrid";
import "../../assets/css/web/DashboardWeb.css";

const Dashboard = () => {
  const location = useLocation();
  const [noticiasCarrusel, setNoticiasCarrusel] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [series, setSeries] = useState([]);
  const [programacion, setProgramacion] = useState({
    adultos: { regulares: [], especiales: [] },
    infantil: { regulares: [], especiales: [] },
  });
  const [fechas, setFechas] = useState({ adultos: null, infantil: null });
  const [stats, setStats] = useState({
    instituciones: 12,
    series: 8,
    infantiles: 3,
    adultos: 5,
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get("/noticias3"),
      api.get("/noticias"),
      api.get("/series"),
      api.get("/fixture/adultos"),
      api.get("/fixture/infantil"),
    ])
      .then(
        ([resNoticias3, resNoticias, resSeries, resAdultos, resInfantil]) => {
          // console.log("📦 noticias3 (carrusel):", resNoticias3.data);
          // console.log("📦 noticias (tarjetas):", resNoticias.data);

          setNoticiasCarrusel(resNoticias3.data.noticias || []);
          setNoticias(resNoticias.data || []);
          setSeries(resSeries.data.data || []);

          // ✅ CORRECCIÓN: Verificamos que exista data antes de usarla
          const adultosData = resAdultos.data?.data;
          const infantilData = resInfantil.data?.data;

          setProgramacion({
            adultos: {
              regulares: adultosData?.regulares || [],
              especiales: adultosData?.especiales || [],
            },
            infantil: {
              regulares: infantilData?.regulares || [],
              especiales: infantilData?.especiales || [],
            },
          });

          // ✅ También guardamos las fechas si vienen
          setFechas({
            adultos: adultosData?.fecha || null,
            infantil: infantilData?.fecha || null,
          });

          setLoading(false);
        },
      )
      .catch((err) => {
        console.error("Error en API:", err);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % noticiasCarrusel.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + noticiasCarrusel.length) % noticiasCarrusel.length,
    );
  };

  const getImagenUrl = (url) => {
    if (!url) return "https://via.placeholder.com/1200x600";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}/uploads/noticias/${url}`;
  };

  if (loading) return <div className="loader">Cargando...</div>;

  return (
    <div className="web-container">
      {/* CARRUSEL */}
      <div className="carrusel-contenedor">
        <div
          className="carrusel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {noticiasCarrusel.map((noticia) => (
            <div key={noticia.id} className="carrusel-item">
              <img src={getImagenUrl(noticia.imagen)} alt={noticia.titulo} />
              <div className="carrusel-overlay-bg"></div>
              <div className="carrusel-overlay">
                <span className="destacado">DESTACADO</span>
                <h3>{noticia.titulo}</h3>
                <button
                  className="btn-leer"
                  onClick={() =>
                    (window.location.href = `/noticia/${noticia.slug || noticia.id}`)
                  }
                >
                  LEER NOTICIA
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="carrusel-btn prev" onClick={prevSlide}>
          ❮
        </button>
        <button className="carrusel-btn next" onClick={nextSlide}>
          ❯
        </button>
      </div>

      {/* 🌟 SERIES */}
      <nav className="series-nav-dashboard">
        {series.map((serie) => {
          const isActive = false;
          return (
            <Link
              key={serie.id}
              to={`/detalle-serie/${serie.slug}`}
              className={`serie-nav-link ${isActive ? "active" : ""}`}
            >
              {serie.nombre}
            </Link>
          );
        })}
      </nav>

      {/* PROGRAMACIÓN ADULTOS / INFANTIL */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <ProgramacionSeccion
            titulo="Adultos"
            fecha={fechas.adultos?.nombre_fecha}
            regulares={programacion.adultos.regulares}
            especiales={programacion.adultos.especiales}
            color="info"
          />

          <ProgramacionSeccion
            titulo="Infantil"
            fecha={fechas.infantil?.nombre_fecha}
            regulares={programacion.infantil.regulares}
            especiales={programacion.infantil.especiales}
            color="success"
          />
        </div>
      </div>
      {/* Apoyos */}
      <DifuHorizontal />

      {/* ESTADÍSTICAS */}
      <StatsCards stats={stats} />
      {/* Apoyos */}
      <DifuHorizontalz />

      {/* NOTICIAS */}
      <NoticiasGrid
        noticias={noticias}
        limite={6}
        mostrarImagen={true}
        columnas={1}
        titulo="ÚLTIMAS NOTICIAS"
      />
    </div>
  );
};

export default Dashboard;
