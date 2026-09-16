import axios from "axios";
import { API_CONFIG } from "./env";
import { useAuthStore } from "../stores/useAuthStore";

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
