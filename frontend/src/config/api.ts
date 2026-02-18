import axios from "axios";

const test = import.meta.env.VITE_APP_API_URL + "/api";

const api = axios.create({
  baseURL: test,
  withCredentials: true,
});

console.log("hi" + api.defaults.baseURL);
console.log("orale ");

export default api;
