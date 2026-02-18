import api from "../config/api";
import { useEffect, useState } from "react";

const Home = () => {
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await api.get("/");
        // Expecting { message: "API is running" }
        setApiMessage(res.data?.message ?? "API responded");
      } catch (err) {
        console.error(err);
        setApiError("Failed to reach backend API");
      }
    };

    void checkApi();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-semibold">Blank MERN Starter</h1>
      <p className="text-gray-600">Frontend is running.</p>
      <div className="mt-4">
        {apiMessage && <p className="text-green-600">Backend: {apiMessage}</p>}
        {apiError && <p className="text-red-600">{apiError}</p>}
        {!apiMessage && !apiError && <p className="text-gray-500">Checking backend connection…</p>}
      </div>
    </div>
  );
};

export default Home;
