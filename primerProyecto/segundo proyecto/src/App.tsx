import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MaterialsView } from "./pages/MaterialsView";
import { LocationView } from "./pages/LocationView";
import { LocationMaterials } from "./pages/LocationMaterials";
import { MainLayout } from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir la raíz a la primera pestaña por defecto */}
        <Route path="/" element={<Navigate to="/materials" replace />} />

        {/* Aquí irán tus rutas reales */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/materials" element={<MaterialsView />} />
          <Route path="/locations" element={<LocationView />} />
          <Route path="/locations/:id/materials" element={<LocationMaterials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;