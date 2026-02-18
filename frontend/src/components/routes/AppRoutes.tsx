import MainLayout from "../../layouts/MainLayout";
import Home from "../../pages/Home";
import NotFound from "../../pages/NotFound";

import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
