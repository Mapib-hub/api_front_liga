import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import "../../assets/css/web/NoticiaDetalle.css";
import { apoyosMap } from "../../components/apoyos";

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

  // URL para compartir
  const urlActual = window.location.href;
  const tituloNoticia = data?.noticia?.titulo || "";

  if (loading) return <div className="loader-noticia">Cargando noticia...</div>;
  if (error) return <div className="error-noticia">{error}</div>;
  if (!data) return null;

  const { noticia, imagenesExtra } = data;
  // ✅ DEFINIR institucionId AQUÍ
  const institucionId = noticia?.institucion_id;
  return (
    <div className="noticia-detalle-container">
      <div className="container mar_cont">
        <div className="row shadow-lg p-4">
          {/* Título de la noticia */}
          <h1 className="tit_noti_det">{noticia.titulo}</h1>
          <p className="fecha_noti">{formatearFecha(noticia.fecha_creacion)}</p>

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
                className="text_desc"
                dangerouslySetInnerHTML={{
                  __html: noticia.descripcion || "Sin descripción disponible",
                }}
              />
            </div>
          </div>
          <hr />

          {/* 👇 APOYO PUBLICITARIO - ANTES DEL DESGLOSE */}
          {institucionId && apoyosMap[parseInt(institucionId)] && (
            <div className="apoyo-container mb-4">
              {React.createElement(apoyosMap[parseInt(institucionId)])}
            </div>
          )}

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
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>
              ×
            </button>

            <button className="modal-nav modal-prev" onClick={imagenAnterior}>
              ❮
            </button>

            <img
              src={imagenesGaleria[imagenActual]?.imagen_path}
              alt="Imagen ampliada"
              className="modal-imagen"
            />

            <button className="modal-nav modal-next" onClick={imagenSiguiente}>
              ❯
            </button>

            <div className="modal-contador">
              {imagenActual + 1} / {imagenesGaleria.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiaDetalle;
