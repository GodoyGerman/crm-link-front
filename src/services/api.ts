import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Ajusta según tu backend FastAPI
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
