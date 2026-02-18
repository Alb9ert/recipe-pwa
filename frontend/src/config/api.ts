import axios from "axios";

const api = axios.create({
  baseURL: "https://recipe-pwa-i79y.onrender.com/api",
  withCredentials: true,
});

export default api;
