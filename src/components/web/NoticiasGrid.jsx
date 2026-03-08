// components/web/NoticiasGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api";
import "../../assets/css/web/NoticiasGrid.css";

const NoticiasGrid = ({
  noticias = [],
  limite = null,
  mostrarImagen = false, // ← CONTROL: ¿mostrar imagen?
  columnas = 1, // ← CONTROL: 1, 2 o 3 columnas
  titulo = "ÚLTIMAS NOTICIAS", // ← CONTROL: título personalizable
  mostrarCategoria = true, // ← CONTROL: ¿mostrar "COMUNICADO"?
  variante = "normal", // ← CONTROL: "normal", "destacada", "mini"
}) => {
  const noticiasMostrar = limite ? noticias.slice(0, limite) : noticias;

  const getImagenUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x250";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}/uploads/noticias/${url}`;
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (noticiasMostrar.length === 0) {
    return (
      <div className="noticias-empty">
        <p>No hay noticias disponibles</p>
      </div>
    );
  }

  return (
    <div className={`noticias-container noticias-${variante}`}>
      {titulo && <h2 className="noticias-titulo-seccion">{titulo}</h2>}

      <div className={`noticias-grid noticias-grid-${columnas}`}>
        {noticiasMostrar.map((noticia) => (
          <article key={noticia.id} className="noticia-card">
            {mostrarImagen && (
              <div className="noticia-imagen">
                <img src={getImagenUrl(noticia.imagen)} alt={noticia.titulo} />
              </div>
            )}

            <div className="noticia-contenido">
              {mostrarCategoria && (
                <span className="noticia-categoria">COMUNICADO</span>
              )}

              <h3 className="noticia-titulo">{noticia.titulo}</h3>

              {noticia.descripcion && (
                <p className="noticia-extracto">
                  {noticia.descripcion.length > 120
                    ? `${noticia.descripcion.substring(0, 120)}...`
                    : noticia.descripcion}
                </p>
              )}

              <Link
                to={`/noticia/${noticia.slug || noticia.id}`}
                className="noticia-link"
              >
                LEER MÁS →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NoticiasGrid;
