import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as apiLogin, setToken as apiSetToken } from "../../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../../assets/bg.jpg";

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await apiLogin({ email, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
                apiSetToken(data.token);
            }
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            await login(data.user || { name: email });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
            {/* LEFT SIDE - App Info with Background */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center text-white">
                <img
                    src={bgImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-700/60 "></div>

                <div className="relative z-10 p-10 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        LaptopCare <span className="text-blue-200">ERP</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-md mb-6">
                        Streamline your laptop service management track customers, jobs, and inventory effortlessly.
                    </p>
                    <ul className="space-y-3 text-blue-100">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Real-time job updates
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Customer tracking
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Inventory management
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="flex items-center justify-center w-full md:w-1/2 bg-blue-100 p-8 md:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
