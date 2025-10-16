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

    const loginUser = async (userData) => {
        setUser(userData);
        setTokenState(localStorage.getItem("token"));
    };

    const logoutUser = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Backend logout failed", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setTokenState(null);
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loginUser,
            logoutUser,
            hasRole,
            hasAnyRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};