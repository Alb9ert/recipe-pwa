import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-400 mb-2">404</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-3">Page not found</h2>
          <p className="text-gray-500 text-sm">Oops! Looks like this page does not exist.</p>
        </div>

        <button
          onClick={handleGoHome}
          className="bg-main-color hover:bg-main-hover-color text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
        >
          Go home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
