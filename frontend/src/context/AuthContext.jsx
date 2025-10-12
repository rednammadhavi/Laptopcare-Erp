import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "../services/apiService";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        if (token) {
            apiService.setToken(token);
        }
        if (userJson) {
            try {
                setUser(JSON.parse(userJson));
            } catch (e) {
                console.warn("Invalid user in localStorage");
                localStorage.removeItem("user");
            }
        }
        setReady(true);
    }, []);

    const login = async (maybeEmailOrUser, maybePassword) => {
        if (typeof maybeEmailOrUser === "object" && maybeEmailOrUser !== null) {
            const userObj = maybeEmailOrUser;
            setUser(userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            const token = localStorage.getItem("token");
            apiService.setToken(token);
            return userObj;
        }

        const email = maybeEmailOrUser;
        const password = maybePassword;
        const { data } = await apiService.login(email, password);
        if (data?.token) {
            localStorage.setItem("token", data.token);
            apiService.setToken(data.token);
        }
        if (data?.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data;
    };

    const register = async (payload) => {
        const { data } = await apiService.register(payload);
        return data;
    };

    const logout = async () => {
        try {
            await apiService.post?.("/auth/logout");
        } catch (e) {
            // console.log(e);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        apiService.setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, ready, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
