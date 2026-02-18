import { Outlet } from "react-router-dom";
import BottomNav from "../components/layout/BottomNav";

function MainLayout() {
  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
