import React, { useState, useEffect } from "react";
import api from "../../api";
import NoticiasGrid from "../../components/web/NoticiasGrid";
import "../../assets/css/web/NoticiasPage.css";

const NoticiasPage = () => {
  const [todasLasNoticias, setTodasLasNoticias] = useState([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    api
      .get("/noticias")
      .then((res) => {
        // La API puede devolver { noticias: [...] } o directamente [...]
        const noticias = res.data.noticias || res.data || [];
        setTodasLasNoticias(noticias);
        setNoticiasFiltradas(noticias);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando noticias:", err);
        setLoading(false);
      });
  }, []);

  // Función de búsqueda
  useEffect(() => {
    let filtradas = todasLasNoticias;

    // Filtrar por texto
    if (busqueda.trim() !== "") {
      filtradas = filtradas.filter(
        (noticia) =>
          noticia.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          noticia.descripcion?.toLowerCase().includes(busqueda.toLowerCase()),
      );
    }

    // Filtrar por categoría (simulado, podés adaptarlo)
    if (categoria !== "todas") {
      filtradas = filtradas.filter(
        (noticia) => noticia.categoria === categoria,
      );
    }

    setNoticiasFiltradas(filtradas);
  }, [busqueda, categoria, todasLasNoticias]);

  // Obtener categorías únicas (si existen)
  const categorias = [
    "todas",
    ...new Set(todasLasNoticias.map((n) => n.categoria).filter(Boolean)),
  ];

  if (loading) return <div className="loader">Cargando noticias...</div>;

  return (
    <div className="noticias-page">
      <div className="noticias-header">
        <h1 className="noticias-titulo">Noticias</h1>
        <p className="noticias-subtitulo">
          Mantente informado con las últimas novedades
        </p>
      </div>

      {/* Buscador y filtros */}
      <div className="buscador-noticias">
        <div className="buscador-input-group">
          <span className="buscador-icon">🔍</span>
          <input
            type="text"
            className="buscador-input"
            placeholder="Buscar noticias..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {categorias.length > 1 && (
          <select
            className="categoria-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "todas" ? "Todas las categorías" : cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Resultados */}
      <div className="resultados-info">
        <p>
          {noticiasFiltradas.length}{" "}
          {noticiasFiltradas.length === 1
            ? "noticia encontrada"
            : "noticias encontradas"}
        </p>
      </div>

      {/* Grid de noticias (reutilizamos el componente) */}
      <NoticiasGrid
        noticias={noticiasFiltradas}
        mostrarImagen={true}
        columnas={2}
        titulo="" // Vacío porque ya tenemos título arriba
        mostrarCategoria={true}
      />
    </div>
  );
};

export default NoticiasPage;
