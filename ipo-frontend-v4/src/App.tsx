import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import MainMenuPage from "./pages/MainMenuPage";
import IpoCreatePage from "./pages/IpoCreatePage";
import IpoListPage from "./pages/IpoListPage";
import CollecteOrdreListPage from "./pages/CollecteOrdreListPage";
import CollecteOrdreCreatePage from "./pages/CollecteOrdreCreatePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="/ipo" element={<IpoListPage />} />
          <Route path="/ipo/create" element={<IpoCreatePage mode="create" />} />
          <Route path="/ipo/edit/:id" element={<IpoCreatePage mode="edit" />} />
          <Route path="/ipo/view/:id" element={<IpoCreatePage mode="view" />} />
          <Route path="/collecte" element={<CollecteOrdreListPage />} />
          <Route path="/collecte/create" element={<CollecteOrdreCreatePage mode="create" />} />
          <Route path="/collecte/edit/:id" element={<CollecteOrdreCreatePage mode="edit" />} />
          <Route path="/collecte/view/:id" element={<CollecteOrdreCreatePage mode="view" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}