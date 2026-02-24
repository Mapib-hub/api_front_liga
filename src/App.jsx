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
import FixtureSerie from "./pages/admin/FixtureSerie"; // ← IMPORTAR
import EditarFecha from "./pages/admin/EditarFecha"; // ← IMPORTAR

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Layout />}>
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

          {/* 🔥 NUEVA RUTA PARA EDITAR FECHA */}
          <Route
            path="fixture/serie/:serieId/fecha/:fechaId"
            element={<EditarFecha />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
