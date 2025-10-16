import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../../assets/bg.jpg";
import axios from "axios";

export const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "select",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [roleError, setRoleError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear role error when user starts selecting
        if (e.target.name === "role") {
            setRoleError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setRoleError("");

        // Validate role selection only on submit
        if (form.role === "select") {
            setRoleError("Please select a role");
            setLoading(false);
            return;
        }

        try {
            await axios.post("/api/auth/register", form);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
            {/* LEFT SIDE - App Info */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center text-white">
                <img
                    src={bgImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-700/60"></div>

                <div className="relative z-10 p-10 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        LaptopCare <span className="text-blue-200">ERP</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-md mb-6">
                        Manage your laptop service operations efficiently from customers to jobs and inventory.
                    </p>
                    <ul className="space-y-3 text-blue-100">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Easy customer management
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Track jobs in real-time
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Secure access for different roles
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE - Registration Form */}
            <div className="flex items-center justify-center w-full md:w-1/2 bg-blue-100 p-8 md:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-gray-600 mt-2">
                            Fill in your details to start using LaptopCare ERP
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 p-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5" />
                                    ) : (
                                        <FaEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className={`w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-white transition ${roleError ? "border-red-300" : "border-gray-200"
                                    }`}
                            >
                                <option value="select">Select</option>
                                <option value="technician">Technician</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            {roleError && (
                                <p className="text-red-500 text-xs mt-1">{roleError}</p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};