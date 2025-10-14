import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../../assets/bg.jpg";

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setMessage("Your password has been reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError("Invalid or expired reset link.");
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
                        Create a strong new password to keep your account secure.
                    </p>
                    <ul className="space-y-3 text-blue-100">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Keep your account safe
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Use a unique password
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE - Reset Form */}
            <div className="flex items-center justify-center w-full md:w-1/2 bg-blue-100 p-8 md:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-600 mt-2">
                            Enter your new password to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter new password"
                                    className="w-full border border-gray-200 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Confirm new password"
                                    className="w-full border border-gray-200 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirm ? (
                                        <FaEyeSlash className="h-5 w-5" />
                                    ) : (
                                        <FaEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Back to{" "}
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
