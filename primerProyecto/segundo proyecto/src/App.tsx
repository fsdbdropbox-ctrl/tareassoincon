import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { MaterialsView } from "./pages/MaterialsView";
import { LocationView } from "./pages/LocationView";
import { LocationMaterials } from "./pages/LocationMaterials";
import './translation/i18n';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/materials" replace />} />
          <Route path="materials" element={<MaterialsView />} />
          <Route path="locations" element={<LocationView />} />
          <Route path="locations/:id/materials" element={<LocationMaterials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;