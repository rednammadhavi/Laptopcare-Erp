import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const Topbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between p-3 border-b bg-white">
            <div className="text-sm text-gray-600">
                Welcome{user ? `, ${user.name}` : ""}
            </div>
            <div className="flex items-center gap-3">
                <button
                    className="text-sm px-3 py-1 rounded border"
                    onClick={() => alert("Settings")}
                >
                    Settings
                </button>
                {user ? (
                    <button className="text-sm px-3 py-1 rounded border" onClick={logout}>
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="text-sm px-3 py-1 rounded border">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};
