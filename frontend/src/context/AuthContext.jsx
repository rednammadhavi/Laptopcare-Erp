import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout, setToken as setApiToken } from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
    const [token, setTokenState] = useState(() => localStorage.getItem("token") || null);

    useEffect(() => {
        setApiToken(token);
    }, [token]);

    const loginUser = async (email, password) => {
        const { data } = await login({ email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setTokenState(data.token);
    };

    const logoutUser = async () => {
        try {
            await logout(); // call backend logout
        } catch (err) {
            console.error("Backend logout failed", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setTokenState(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
