import React from "react";
import "../../assets/css/web/DifuHorizontal.css";
import { BASE_URL } from "../../api";

const DifuHorizontal12 = () => {
  const imagenes = [
            'yungay_01.jpg', 
            'yungay_02.jpg', 
            'yungay_03.jpg'
  ];

  const links = [
     'https://www.instagram.com/alma.centromedico/',
     'https://www.facebook.com/p/Liberty-Motel-100057584014652/?locale=es_LA',
     '#' 
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

export default DifuHorizontal12;