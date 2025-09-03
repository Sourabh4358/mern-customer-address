import axios from "axios";
//Vite-api-url from render
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  
});

export default api;
