// components/web/FooterWeb.jsx
import React from "react";
import api, { BASE_URL } from "../../api";
import { Link } from "react-router-dom";
import "../../assets/css/web/FooterWeb.css";

const FooterWeb = () => {
  return (
    <footer className="footer-web">
      <div className="footer-container">
        {/* Fila 1: Logo e información */}
        <div className="footer-row">
          <div className="footer-col footer-info">
            <h3 className="footer-logo">ASOFUT San Javier</h3>

            <img
              src={`${BASE_URL}/uploads/logos/asociacion.png`} // ← CORREGIDO
              alt="Logo ASOFUT"
              className="logo_footer"
            />
            <p>San Javier, Región del Maule</p>
            <p>
              <a
                href="mailto:contacto@asofutbolsanjavier.cl"
                className="footer-link"
              >
                contacto@asofutbolsanjavier.cl
              </a>
            </p>
          </div>

          {/* Fila 2: Enlaces útiles (a la derecha) */}
          <div className="footer-col footer-links">
            <h4>Enlaces útiles</h4>
            <ul>
              <li>
                <Link to="/reglamento">Reglamento</Link>
              </li>
              <li>
                <Link to="/nosotros">Quienes Somos</Link>
              </li>
              <li>
                <Link to="/historia">Nuestra Historia</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Fila 2: Copyright y créditos */}
        <div className="footer-bottom">
          <p>© 2026 ASOFUT San Javier. Todos los derechos reservados.</p>
          <p className="footer-credits">
            Desarrollado por{" "}
            <a
              href="https://mapibpublicidad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Mapib Publicidad
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterWeb;
