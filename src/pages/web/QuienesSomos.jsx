import React from "react";
import api, { BASE_URL } from "../../api"; // 👈 Importamos BASE_URL
import "../../assets/css/web/QuienesSomos.css";

const QuienesSomos = () => {
  // Datos estáticos de los presidentes de clubes
  const presidentesClubes = [
    {
      nombre: "Manuel Gonzalez",
      club: "Lister Rossel",
      logo: "rossel.jpg",
    },
    { nombre: "Sebastian Gonzalez", club: "Huracan", logo: "huracan.jpg" },
    { nombre: "José Cofré", club: "Puente Pando", logo: "puente.jpg" },
    { nombre: "Adolfo Soto", club: "Liceo", logo: "liceo.jpg" },
    { nombre: "Robinson Ibarra", club: "Liverpool", logo: "liverpool.jpg" },
    { nombre: "Victor Valenzuela", club: "Tricolor", logo: "tricolor.jpg" },
    { nombre: "Agustin Iturriaga", club: "5 Abril", logo: "5abril.jpg" },
    { nombre: "Carlos Casanova", club: "Yungay", logo: "yungay.jpg" },
    { nombre: "Alex Espinoza", club: "Peñarol", logo: "penarol.jpg" },
    { nombre: "Victor Ríos", club: "Colo - Colo", logo: "colo-colo.jpg" },
    { nombre: "Narciso espinoza", club: "U de Chile", logo: "udechile.jpg" },
    { nombre: "Renato Cancino", club: "Bobadilla", logo: "bobadilla.jpg" },
  ];

  // Array de directivos con sus imágenes (en el backend)
  const directivos = [
    {
      cargo: "Presidente",
      nombre: "Don Eliecer Albornoz",
      descripcion:
        "Es quien lidera la institución con una visión clara, compromiso total y una trayectoria intachable. Bajo su conducción, hemos consolidado proyectos sociales y deportivos que nos enorgullecen.",
      imagen: "directiva/presidente.jpg", // 👈 Ruta relativa dentro del backend
      color: "presidente",
    },
    {
      cargo: "Secretario",
      nombre: "Juan Luis Ramirez",
      descripcion:
        "Lleva la gestión institucional con precisión y calidez. Su rol es fundamental para mantener el orden administrativo y brindar claridad en cada acción organizativa.",
      imagen: "directiva/secretario.jpg",
      color: "secretario",
    },
    {
      cargo: "Tesorero",
      nombre: "Claudio Venegas",
      descripcion:
        "Administra con responsabilidad las finanzas de la Asociación. Gracias a su transparencia y rigor, los proyectos que soñamos se hacen posibles.",
      imagen: "directiva/tesorero.jpg",
      color: "tesorero",
    },
    {
      cargo: "Primera Directora",
      nombre: "Sandra Arellano Ramirez",
      descripcion:
        "Encargada de liderar, coordinar y representar a la directiva, asegurando que todos los aspectos —deportivos, económicos y sociales— funcionen en armonía para el crecimiento de la Asociación y sus integrantes.",
      imagen: "directiva/directora.jpg",
      color: "primera-directora",
    },
  ];

  // Función helper para construir la URL completa de la imagen
  const getImagenUrl = (ruta) => {
    if (!ruta)
      return "https://placehold.co/400x400/1a3b5d/white?text=Sin+Imagen";
    return `${BASE_URL}uploads/${ruta}`; // 👈 IMPORTANTE: Concatenamos BASE_URL + ruta
  };

  return (
    <div className="quienes-somos-container">
      {/* Hero / Cabecera - con imagen del backend */}
      <div
        className="qs-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), 
          url(${getImagenUrl("directiva/directiva.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="qs-hero-overlay">
          <h1>Nuestra Identidad</h1>
          <p className="qs-lema">
            Somos más que fútbol. Somos comunidad, compromiso y corazón.
          </p>
        </div>
      </div>

      {/* Introducción */}
      <div className="qs-intro">
        <p>
          En nuestra institución creemos que el deporte no solo forma atletas,
          sino también personas. Nuestra historia está construida sobre esfuerzo
          colectivo, decisiones valientes y una pasión que atraviesa
          generaciones. Esta es nuestra directiva, el equipo humano que impulsa
          nuestro rumbo.
        </p>
      </div>

      {/* Directiva Principal - Con imágenes del backend */}
      <div className="qs-directiva-grid">
        {directivos.map((directivo, index) => (
          <div key={index} className={`qs-miembro-card ${directivo.color}`}>
            <div className="qs-miembro-imagen-container">
              <img
                src={getImagenUrl(directivo.imagen)} // 👈 Usamos la función helper
                alt={directivo.nombre}
                className="qs-miembro-imagen"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x400/1a3b5d/white?text=Error";
                }}
              />
            </div>
            <div className="qs-miembro-contenido">
              <h3>{directivo.cargo}</h3>
              <p className="qs-nombre">{directivo.nombre}</p>
              <p className="qs-descripcion">{directivo.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Presidentes de Clubes - Con logos del backend */}
      <div className="qs-presidentes-section">
        <h2>Nuestros Presidentes de Clubes</h2>
        <div className="qs-presidentes-lista">
          {presidentesClubes.map((presidente, index) => (
            <div key={index} className="qs-presidente-item">
              <div className="qs-presidente-info">
                <span className="qs-presidente-nombre">
                  {presidente.nombre}
                </span>
                <span className="qs-presidente-club">{presidente.club}</span>
              </div>
              <div className="qs-club-logo-mini">
                <img
                  src={getImagenUrl(`directiva/${presidente.logo}`)} // 👈 Logos en uploads/clubes/
                  alt={presidente.club}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/30x30/1a3b5d/white?text=Logo";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuienesSomos;
