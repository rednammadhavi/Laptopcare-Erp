import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout, setToken as setApiToken } from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
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

    const hasRole = (roles) => {
        if (!user || !user.role) return false;

        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        return hasRole(roles);
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