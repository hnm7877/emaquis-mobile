import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "./authStore";

const isProd = !__DEV__;

export const axiosInstance = axios.create({
  baseURL: isProd
    ? "https://api.emaquis-api.fyi/api/v1/"
    : "http://localhost:3001/api/v1",
});

export async function getAuthHeaders() {
  const token =
    useAuthStore.getState().token || (await AsyncStorage.getItem("token"));
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const token =
      useAuthStore.getState().token || (await AsyncStorage.getItem("token"));
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Déconnexion automatique si 401
      useAuthStore.getState().logout();
      await AsyncStorage.removeItem("token");
      // Ici, tu peux aussi déclencher une navigation vers Login si besoin
    }
    return Promise.reject(error);
  }
);
