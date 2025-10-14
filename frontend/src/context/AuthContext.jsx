import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    useEffect(() => {
        apiService.setToken(token);
    }, [token]);

    const login = async (email, password) => {
        const { data } = await apiService.login({ email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.token);
    };

    const logout = async () => {
        await apiService.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
