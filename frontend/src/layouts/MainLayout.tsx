import { Outlet } from "react-router-dom";
import Navbar from "../components/nav/Navbar";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* child route content goes here */}
      </main>
    </div>
  );
}

export default MainLayout;
