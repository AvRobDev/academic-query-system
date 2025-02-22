import axios from "axios";

/**
 * @description Instancia de axios para consumir la API de Cobach
 * @type {AxiosInstance}
 * @param {string} token - Token de autenticación
 */

const CobachApi = axios.create({
  baseURL: import.meta.env.VITE_COBACH_API_URL,
});

/**
 * @description Interceptor para agregar el token de autenticación a las peticiones
 * @param {AxiosRequestConfig} config - Configuración de la petición
 */
CobachApi.interceptors.request.use(config => {

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { CobachApi };
