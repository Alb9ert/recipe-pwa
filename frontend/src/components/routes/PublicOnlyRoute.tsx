import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/AuthContext.tsx";

const PublicOnlyRoute = () => {
  const user = useUser();

  if (user === undefined) {
    // User status not determined yet
    return <div>Loading...</div>;
  }

  if (user) {
    // Not logged in
    return <Navigate to="/dashboard" replace />;
  }

  // User is logged in
  return <Outlet />;
};

export default PublicOnlyRoute;
