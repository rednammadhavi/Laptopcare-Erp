import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

// Set JWT token
export const setToken = (token) => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
};

// Auth
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");

// Customers
export const getCustomers = () => api.get("/customers");
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const getTechniciansList = () => api.get("/customers/technicians/list");
export const getMyCustomers = () => api.get("/customers/my-customers");

// Jobs
export const getJobs = () => api.get("/jobs");
export const getMyJobs = () => api.get("/jobs/my-jobs");
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Inventory
export const getInventory = () => api.get("/inventory");
export const createInventory = (data) => api.post("/inventory", data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

// Reports
export const getReports = () => api.get("/reports");

export const assignTechnicianToCustomer = (customerId) => api.patch(`/customers/${customerId}/assign-technician`);

// Users (if needed for technicians dropdown)
export const getUsers = (params) => api.get("/auth/users", { params });

export default api;