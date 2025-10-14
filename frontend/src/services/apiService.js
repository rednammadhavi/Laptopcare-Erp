import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

export const apiService = {
    setToken: (token) => {
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        else delete api.defaults.headers.common["Authorization"];
    },

    // Auth
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    logout: () => api.post("/auth/logout"),

    // Customers
    getCustomers: () => api.get("/customers"),
    getCustomer: (id) => api.get(`/customers/${id}`),
    createCustomer: (data) => api.post("/customers", data),
    updateCustomer: (id, data) => api.put(`/customers/${id}`, data),

    // Jobs
    getJobs: () => api.get("/jobs"),
    createJob: (data) => api.post("/jobs", data),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),

    // Inventory
    getInventory: () => api.get("/inventory"),
    addInventory: (data) => api.post("/inventory", data),

    // Reports
    getReports: () => api.get("/reports"),

    // Users
    getUsers: (params) => api.get("/auth/users", { params }),
};
