import axios from "axios";

const CobachApi = axios.create({
  baseURL: import.meta.env.VITE_COBACH_API_URL,
});

CobachApi.interceptors.request.use(config => {

  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { CobachApi };
