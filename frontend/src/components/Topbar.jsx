import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Topbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
            <div className="text-sm text-gray-600 font-medium">
                Welcome{user ? `, ${user.name}` : ""}
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => alert("Settings")}
                    className="text-sm px-4 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
                >
                    ⚙️ Settings
                </button>
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="text-sm px-4 py-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 transition-all"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="text-sm px-4 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};
