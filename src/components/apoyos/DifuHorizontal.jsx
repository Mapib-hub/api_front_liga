import React from "react";
import "../../assets/css/web/DifuHorizontal.css";
import { BASE_URL } from "../../api";

const DifuHorizontal = () => {
  const imagenes = [
    "5abril_01.jpg",
    "udechile_02.jpg",
    "yungay_01.jpg",
    "imagen_01.jpg"
  ];

  const links = [
    "https://www.instagram.com/estampados_eclipse_lunar/",
    "https://www.facebook.com/jar61?locale=ms_MY",
    "https://www.instagram.com/jokerbarbershopsj/?hl=es",
    "https://www.instagram.com/mapibdeportes/"
  ];

  return (
    <div id="nextMatch" className="apoyo container next-match text-center">
      <div className="contenedor-apoyo horizontal text-center">
        {imagenes.map((img, i) => (
          <div key={i} className="marg_apoyo">
            <div className="box box-solid back_equi">
              <div className="box-header with-border">
                {links[i] && links[i] !== "" ? (
                  <a href={links[i]} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${BASE_URL}uploads/contenido/${img}`}
                      className="img_apoyo"
                      alt="apoyo"
                    />
                  </a>
                ) : (
                  <img
                    className="img_apoyo"
                    src={`${BASE_URL}uploads/contenido/${img}`}  // ✅ MISMA RUTA
                    alt="apoyo"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifuHorizontal;