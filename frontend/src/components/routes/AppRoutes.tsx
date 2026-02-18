import MainLayout from "../../layouts/MainLayout";
import Home from "../../pages/Home";
import Tilfoej from "../../pages/Tilfoej";
import Indkoeb from "../../pages/Indkoeb";
import Analyse from "../../pages/Analyse";
import RecipeDetail from "../../pages/RecipeDetail";
import NotFound from "../../pages/NotFound";

import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tilfoej" element={<Tilfoej />} />
        <Route path="/rediger/:recipeId" element={<Tilfoej />} />
        <Route path="/indkoeb" element={<Indkoeb />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/opskrift/:recipeId" element={<RecipeDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
