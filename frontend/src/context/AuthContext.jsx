import React, { createContext, useContext, useState } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        await new Promise((r) => setTimeout(r, 300));
        setUser({ id: "u1", name: username, role: "receptionist" });
    };

    const logout = () => {
        setUser(null);
        apiService.setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
