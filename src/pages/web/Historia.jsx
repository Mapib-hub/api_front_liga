import React from "react";
import { BASE_URL } from "../../api";
import "../../assets/css/web/Historia.css";
import { Link } from "react-router-dom";

const Historia = () => {
  // Función helper para construir URLs de imágenes
  const getImagenUrl = (ruta) => {
    if (!ruta)
      return "https://placehold.co/1200x600/1a3b5d/white?text=Historia";
    return `${BASE_URL}uploads/${ruta}`;
  };

  // Datos de la campaña del título 2019
  const campaña2019 = [
    { partido: "San Javier vs Longaví", resultado: "2-0", local: true },
    { partido: "Longaví vs San Javier", resultado: "3-3", local: false },
    {
      partido: "San Javier vs Villa San Agustín",
      resultado: "1-1",
      local: true,
    },
    {
      partido: "San Javier vs Villa San Agustín",
      resultado: "3-2",
      local: true,
    },
    { partido: "San Javier vs Zavala Bravo", resultado: "1-1", local: true },
    { partido: "Zavala Bravo vs San Javier", resultado: "1-2", local: false },
    {
      partido: "San Javier vs Teno (Final)",
      resultado: "3-2",
      local: true,
      destacado: true,
    },
  ];

  // Hitos importantes
  const hitos = [
    {
      año: "1946",
      titulo: "Fundación",
      descripcion:
        "La Asociación de Fútbol de San Javier fue fundada oficialmente el 30 de agosto.",
    },
    {
      año: "2016",
      titulo: "Campeón Regional Infantil",
      descripcion:
        "Título regional infantil ANFA, superando a Villa San Agustín de Talca.",
    },
    {
      año: "2016",
      titulo: "Mejor Asociación ANFA Maule",
      descripcion: "Reconocimiento a la organización y desarrollo deportivo.",
    },
    {
      año: "2019",
      titulo: "Campeón Regional Adulto",
      descripcion:
        "Primer título regional adulto, clasificando al Nacional de Punta Arenas.",
    },
  ];

  return (
    <div className="historia-container">
      {/* Hero Section con imagen de fondo */}
      <div
        className="historia-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${getImagenUrl("historia/image1.jpg")})`,
        }}
      >
        <div className="historia-hero-content">
          <h1>Toda Historia tiene un Comienzo</h1>
          <div className="historia-hero-decoration">
            <span className="año-fundacion">1946</span>
            <span className="decadas">- 80+ años de historia -</span>
          </div>
        </div>
      </div>

      {/* Introducción */}
      <section className="historia-intro">
        <div className="container">
          <p className="intro-text">
            La Asociación de Fútbol de San Javier fue fundada oficialmente el{" "}
            <strong>30 de agosto de 1946</strong>, convirtiéndose en la
            institución rectora del fútbol amateur en la comuna. Desde sus
            inicios, ha tenido como misión organizar y promover la práctica del
            deporte más popular de Chile, generando espacios de encuentro,
            competencia y desarrollo para cientos de jugadores y familias
            sanjavierinas.
          </p>
        </div>
      </section>

      {/* Timeline / Hitos */}
      <section className="historia-timeline">
        <div className="container">
          <h2 className="section-title">Hitos que nos Definen</h2>
          <div className="timeline-grid">
            {hitos.map((hito, index) => (
              <div key={index} className="timeline-card">
                <div className="timeline-year">{hito.año}</div>
                <div className="timeline-content">
                  <h3>{hito.titulo}</h3>
                  <p>{hito.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primeros años - con imagen */}
      <section className="historia-epoca">
        <div className="container">
          <div className="epoca-grid">
            <div className="epoca-content">
              <h2>Primeros años</h2>
              <p>
                En sus primeras décadas, la Asociación reunió a los clubes más
                tradicionales de la comuna, como el histórico Club Deportivo 5
                de Abril, Tricolor y otros, lo que refleja la larga tradición
                futbolera de San Javier. Los campeonatos locales se convirtieron
                rápidamente en una verdadera fiesta comunitaria, congregando a
                hinchas y familias en canchas improvisadas y, más tarde, en
                recintos más formales.
                <br />
                (Imagenes provenientes de la Pagina{" "}
                <Link
                  to="https://www.facebook.com/profile.php?id=100064759594266"
                  target="_blank"
                >
                  Recuerdos San Javier de Loncomilla
                </Link>
                )
              </p>
            </div>
            <div className="epoca-imagen">
              <img
                src={getImagenUrl("historia/antiguo.png")}
                alt="Primeros años del fútbol en San Javier"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/1a3b5d/white?text=Primeros+Años")
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* La gran gesta de 2019 */}
      <section className="historia-gesta">
        <div className="container">
          <h2 className="section-title">La gran gesta de 2019</h2>
          <div className="gesta-content">
            <div className="gesta-texto">
              <p>
                El momento más recordado de la Asociación llegó en 2019, cuando
                la selección adulta de San Javier conquistó por primera vez el{" "}
                <strong>
                  Campeonato Regional de Selecciones ANFA del Maule
                </strong>
                . En la final, disputada en el Estadio Enrique Donn Müller de
                Constitución ante una multitudinaria hinchada que llenó la
                galería sur, San Javier derrotó por <strong>3-2 a Teno</strong>,
                en un partido vibrante.
              </p>
              <div className="gesta-destacado">
                <p>¡CAMPEONES REGIONALES 2019!</p>
              </div>
            </div>
            <div className="gesta-imagen">
              <img
                src={getImagenUrl("historia/image2019.png")}
                alt="Selección campeona 2019"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/1a3b5d/white?text=Campeones+2019")
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Campaña del título */}
      <section className="historia-campana">
        <div className="container">
          <h3 className="campana-subtitulo">La campaña del título 2019</h3>
          <div className="campana-grid">
            {campaña2019.map((partido, index) => (
              <div
                key={index}
                className={`campana-partido ${partido.destacado ? "destacado" : ""}`}
              >
                <span className="partido-nombre">{partido.partido}</span>
                <span
                  className={`partido-resultado ${partido.local ? "victoria" : "empate"}`}
                >
                  {partido.resultado}
                </span>
              </div>
            ))}
          </div>
          <p className="campana-nota">
            Con este logro, la selección adulta de San Javier obtuvo el derecho
            a representar a la Región del Maule en el{" "}
            <strong>
              Campeonato Nacional de Selecciones 2020 en Punta Arenas
            </strong>
            , un hito histórico para la institución.
          </p>
        </div>
      </section>

      {/* Infraestructura y comunidad */}
      <section className="historia-infraestructura">
        <div className="container">
          <div className="infraestructura-grid">
            <div className="infraestructura-imagen">
              <img
                src={getImagenUrl("historia/estadio-municipal.jpg")}
                alt="Estadio Municipal Alfonso Escobar Villablanca"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/1a3b5d/white?text=Estadio")
                }
              />
            </div>
            <div className="infraestructura-content">
              <h2>Infraestructura y comunidad</h2>
              <p>
                El fútbol de San Javier tiene como epicentro el{" "}
                <strong>Estadio Municipal Alfonso Escobar Villablanca</strong>,
                escenario de clásicos locales, campeonatos comunales y torneos
                aniversario que reúnen a toda la comunidad. La remodelación del
                recinto, junto con la gestión municipal, ha permitido que el
                fútbol amateur tenga un espacio digno para su práctica y
                proyección.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datos actuales */}
      <section className="historia-actualidad">
        <div className="container">
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-numero">12</span>
              <span className="stat-label">Instituciones afiliadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-numero">8</span>
              <span className="stat-label">Series oficiales</span>
            </div>
            <div className="stat-item">
              <span className="stat-numero">3</span>
              <span className="stat-label">Infantiles</span>
            </div>
            <div className="stat-item">
              <span className="stat-numero">5</span>
              <span className="stat-label">Adultas</span>
            </div>
          </div>
          <p className="actualidad-texto">
            Esta estructura garantiza la participación de niños, jóvenes y
            adultos, promoviendo la continuidad deportiva a lo largo de todas
            las etapas de la vida y fomentando el sentido de pertenencia
            comunitaria.
          </p>
          <p className="actualidad-cita">
            <strong>Cada 30 de agosto</strong> se conmemora su aniversario,
            ocasión en que se recuerda a los fundadores, se rinde homenaje a los
            dirigentes y jugadores destacados, y se renueva el compromiso de
            seguir fortaleciendo el fútbol en la comuna.
          </p>
        </div>
      </section>

      {/* Cierre épico */}
      <section className="historia-cierre">
        <div className="container">
          <p className="cierre-texto">
            Con casi 80 años de historia, la Asociación de Fútbol de San Javier
            es más que una institución deportiva: es un{" "}
            <strong>pilar cultural y social de la ciudad</strong>, una escuela
            de vida para miles de jugadores y un orgullo para toda la comunidad
            sanjavierina.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Historia;
