import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // 👈 1. AGREGAR ESTE IMPORT
import api, { BASE_URL } from "../../api";
import "../../assets/css/web/NoticiaDetalle.css";

const NoticiaDetalle = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const [imagenesGaleria, setImagenesGaleria] = useState([]);

  // Refs para el modal
  const imagenModalRef = useRef(null);

  useEffect(() => {
    fetchNoticia();
  }, [slug]);

  const fetchNoticia = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/noticias/${slug}`);

      if (response.data.status === 200) {
        setData(response.data.data);
        const imagenes = response.data.data.imagenesExtra || [];
        setImagenesGaleria(imagenes);
      } else {
        setError("Error al cargar la noticia");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  // Funciones para el modal (igual que el script PHP)
  const abrirModal = (index, imgSrc) => {
    setImagenActual(index);
    if (imagenModalRef.current) {
      imagenModalRef.current.src = imgSrc;
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  const imagenAnterior = () => {
    const newIndex =
      (imagenActual - 1 + imagenesGaleria.length) % imagenesGaleria.length;
    setImagenActual(newIndex);
    if (imagenModalRef.current) {
      imagenModalRef.current.src = imagenesGaleria[newIndex].imagen_path;
    }
  };

  const imagenSiguiente = () => {
    const newIndex = (imagenActual + 1) % imagenesGaleria.length;
    setImagenActual(newIndex);
    if (imagenModalRef.current) {
      imagenModalRef.current.src = imagenesGaleria[newIndex].imagen_path;
    }
  };

  if (loading) return <div className="loader-noticia">Cargando noticia...</div>;
  if (error) return <div className="error-noticia">{error}</div>;
  if (!data) return null;

  const { noticia, imagenesExtra } = data;

  // 👇 2. PREPARAR DATOS PARA META TAGS
  const urlActual = window.location.href;
  const tituloNoticia = noticia.titulo || "";

  // Construir URL completa de la imagen (¡importante para Facebook!)
  const imagenUrl = noticia?.imagen
    ? `${BASE_URL}uploads/noticias/${noticia.imagen}`
    : "https://web.asofutbolsanjavier.cl/og-image-default.jpg"; // Imagen por defecto

  // Limpiar descripción (quitar HTML y acortar)
  const descripcionLimpia =
    noticia?.descripcion
      ?.replace(/<[^>]*>?/gm, "") // Quitar etiquetas HTML
      ?.replace(/\\r\\n/g, " ") // Quitar saltos de línea
      ?.substring(0, 160) + "..."; // Acortar a 160 caracteres

  return (
    <>
      {/* 👇 3. META TAGS PARA REDES SOCIALES */}
      <Helmet>
        {/* Título de la página (pestaña del navegador) */}
        <title>{tituloNoticia} | Asofut San Javier</title>

        {/* Meta tags básicos */}
        <meta name="description" content={descripcionLimpia} />

        {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
        <meta property="og:title" content={tituloNoticia} />
        <meta property="og:description" content={descripcionLimpia} />
        <meta property="og:image" content={imagenUrl} />
        <meta property="og:url" content={urlActual} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Asofut San Javier" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tituloNoticia} />
        <meta name="twitter:description" content={descripcionLimpia} />
        <meta name="twitter:image" content={imagenUrl} />

        {/* Fecha de publicación (útil para artículos) */}
        <meta
          property="article:published_time"
          content={noticia.fecha_creacion}
        />
      </Helmet>

      {/* 👇 4. TU CÓDIGO EXISTENTE - SIN NINGÚN CAMBIO */}
      <div className="noticia-detalle-container">
        <div className="container mar_cont">
          <div className="row shadow-lg p-4">
            {/* Título de la noticia */}
            <h1 className="fw-bold text-center">{noticia.titulo}</h1>
            <p className="fecha_noti">
              {formatearFecha(noticia.fecha_creacion)}
            </p>

            {/* Botones de compartir */}
            <div className="fecha_noti">
              <span className="me-2 align-self-center fw-bold">Compartir:</span>
              <a
                href={`https://api.whatsapp.com/send?text=Mira esta noticia de Asofutbol: ${encodeURIComponent(tituloNoticia)} - ${encodeURIComponent(urlActual)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm rounded-pill px-3"
              >
                <i className="fa-brands fa-whatsapp me-1"></i> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlActual)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-facebook btn-sm rounded-pill px-3"
              >
                <i className="fa-brands fa-facebook-f me-1"></i> Facebook
              </a>
            </div>
            <div className="img_desc">
              {/* Imagen destacada - col-md-4 */}
              <div className="text-center col-md-4">
                <img
                  src={`${BASE_URL}uploads/noticias/${noticia.imagen}`}
                  alt={noticia.titulo}
                  className="img-det-noti rounded shadow-sm"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400/1e1e1e/00d4ff?text=Noticia";
                  }}
                />
              </div>

              {/* Contenido de la noticia - col-md-8 */}
              <div className="justify-texto col-md-8">
                <div
                  className="justify-text"
                  dangerouslySetInnerHTML={{
                    __html: noticia.descripcion || "Sin descripción disponible",
                  }}
                />
              </div>
            </div>
            <hr />

            {/* Galería de imágenes extra */}
            {imagenesExtra && imagenesExtra.length > 0 && (
              <div className="row mt-3">
                {imagenesExtra.map((img, index) => (
                  <div key={img.id} className="prev_modal">
                    <img
                      src={img.imagen_path}
                      alt="Foto adicional"
                      className="img-thumbnail galeria-img"
                      style={{ cursor: "pointer" }}
                      onClick={() => abrirModal(index, img.imagen_path)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Botón de regreso */}
            <div className="text-center mt-4">
              <Link to="/noticias" className="btn_volver">
                ← Volver a Noticias
              </Link>
            </div>
          </div>
        </div>

        {/* Modal para galería */}
        {modalOpen && (
          <div className="modal-personalizado" onClick={cerrarModal}>
            <div
              className="modal-contenido"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-cerrar" onClick={cerrarModal}>
                ×
              </button>

              <button className="modal-nav modal-prev" onClick={imagenAnterior}>
                ❮
              </button>

              <img
                ref={imagenModalRef}
                src={imagenesGaleria[imagenActual]?.imagen_path}
                alt="Imagen ampliada"
                className="modal-imagen"
              />

              <button
                className="modal-nav modal-next"
                onClick={imagenSiguiente}
              >
                ❯
              </button>

              <div className="modal-contador">
                {imagenActual + 1} / {imagenesGaleria.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoticiaDetalle;
