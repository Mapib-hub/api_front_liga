import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  // Le agregamos el /api aquí para que las llamadas de datos sean cortas
  baseURL: `${BASE_URL}api` 
});

// Exportamos también la URL base sola por si necesitas armar rutas de imágenes manuales
export { BASE_URL };
export default api;