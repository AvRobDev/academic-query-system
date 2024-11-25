import axios from "axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

const CobachApi = axios.create({
  baseURL: import.meta.env.VITE_COBACH_API_URL,
});

CobachApi.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  return config;
});

export { CobachApi };
