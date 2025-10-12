import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", 
    withCredentials: true,
    timeout: 8000,
});

export const apiService = {
    setToken: (token) => {
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        else delete api.defaults.headers.common["Authorization"];
    },

    login: (email, password) =>
        api.post("/auth/login", { email, password }),

    register: (payload) =>
        api.post("/auth/register", payload),

    getCustomers: () => api.get("/customers"),
};
