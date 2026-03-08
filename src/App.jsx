import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
// Componentes
import Noticias from "./pages/admin/Noticias";
import Instituciones from "./pages/admin/Instituciones";
import Series from "./pages/admin/Series";
import Fechas from "./pages/admin/Fechas";
import Temporadas from "./pages/admin/Temporadas";
import Jugadores from "./pages/admin/Jugadores";
import Fixture from "./pages/admin/Fixture";
import VerEspeciales from "./pages/admin/VerEspeciales";
import EditarPartido from "./pages/admin/EditarPartido";
import GenerarJornada from "./pages/admin/GenerarJornada";
import Goleadores from "./pages/admin/Goleadores";
import Dashboard from "./pages/admin/Dashboard";
import CrearPartidoUnico from "./pages/admin/CrearPartidoUnico";
import FixtureSerie from "./pages/admin/FixtureSerie";
import EditarFecha from "./pages/admin/EditarFecha";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import LayoutWeb from "./components/LayoutWeb"; // <-- DEBES CREAR ESTO (Menú neón, banner, etc)

// COMPONENTES PÚBLICOS (Debes crearlos en src/pages/web/...)
import Home from "./pages/web/Dashboard";
import FixtureTorneo from "./pages/web/FixtureTorneo";
import SerieDetalle from "./pages/web/SerieDetalle";
import NoticiasPage from "./pages/web/NoticiasPage";
import Nosotros from "./pages/web/QuienesSomos";
import Historia from "./pages/web/Historia";
import ProgramacionSeccion from "./components/web/ProgramacionSeccion";
import StatsCards from "./components/web/StatsCards";
import InstitucionesPage from "./pages/web/InstitucionesPage";
import InstitucionDetalle from "./pages/web/InstitucionDetalle";
import NoticiaDetalle from "./pages/web/NoticiaDetalle";
//import FixturePublico from "./pages/web/FixturePublico";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWeb />}>
          <Route index element={<Home />} />
          <Route path="/instituciones" element={<InstitucionesPage />} />
          <Route path="/detalle-serie/:slug" element={<SerieDetalle />} />
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/instituciones/:slug" element={<InstitucionDetalle />} />
          <Route path="/noticia/:slug" element={<NoticiaDetalle />} />
          <Route path="/fixture-completo" element={<FixtureTorneo />} />
          {/* <Route path="noticias/:slug" element={<DetalleNoticia />} />
          <Route path="fixture-completo" element={<FixturePublico />} />
           Aquí irán las tablas de posiciones, etc */}
        </Route>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="noticias" element={<Noticias />} />
          <Route path="series" element={<Series />} />
          <Route path="fechas" element={<Fechas />} />
          <Route path="jugadores" element={<Jugadores />} />
          <Route
            path="fixture/generar-jornada/:principalId"
            element={<GenerarJornada />}
          />
          <Route path="fixture/partidoUnico" element={<CrearPartidoUnico />} />
          <Route path="temporadas" element={<Temporadas />} />
          <Route path="fixture/especiales" element={<VerEspeciales />} />
          <Route
            path="fixture/editar-partido/:id"
            element={<EditarPartido />}
          />
          <Route path="instituciones" element={<Instituciones />} />
          <Route path="goleadores" element={<Goleadores />} />
          <Route path="fixture/:fechaId?" element={<Fixture />} />
          <Route path="fixture" element={<Fixture />} />
          <Route path="fixture/serie/:id" element={<FixtureSerie />} />
          <Route
            path="fixture/serie/:serieId/fecha/:fechaId"
            element={<EditarFecha />}
          />
        </Route>
      </Routes>{" "}
      {/* ← Y ESTO */}
    </Router>
  );
}

export default App;
