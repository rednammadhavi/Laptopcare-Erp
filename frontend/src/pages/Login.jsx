import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setLoading(true);
        try {
            await login(username, password);
            navigate("/");
        } catch {
            alert("Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Sign in</h2>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Username"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full p-2 border rounded mb-4"
                placeholder="Password"
            />
            <button
                onClick={submit}
                className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>
        </div>
    );
};
