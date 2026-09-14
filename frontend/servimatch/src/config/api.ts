import axios from "axios";
import { API_CONFIG } from "./env";

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
