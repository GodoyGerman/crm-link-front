import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // o la URL que uses
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;