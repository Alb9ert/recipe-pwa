import axios from "axios";

const test = https://recipe-pwa-i79y.onrender.com/api;
const api = axios.create({
  baseURL: test,
  withCredentials: true,
});

console.log("hi" + api.defaults.baseURL);
console.log("orale " + test);

export default api;
