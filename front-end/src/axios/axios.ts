// src/api/axios.ts
import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

// No authentication needed for this project

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response) {
            console.error("Errore API:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Nessuna risposta dal server:", error.request);
        } else {
            console.error("Errore Axios:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
