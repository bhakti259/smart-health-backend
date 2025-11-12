// src/api/api.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor placeholder for JWT
api.interceptors.request.use((config) => {
  // if you implement auth, add token: config.headers.Authorization = `Bearer ${token}`
  return config;
});

export default api;
