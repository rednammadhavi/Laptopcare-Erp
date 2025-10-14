import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../../assets/bg.jpg";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setMessage("A password reset link has been sent to your email.");
        } catch (err) {
            setError("Something went wrong. Please try again.");
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
                <div className="absolute inset-0 bg-blue-700/60"></div>

                <div className="relative z-10 p-10 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        LaptopCare <span className="text-blue-200">ERP</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-md mb-6">
                        Securely manage your account and reset your password whenever you
                        need. We’re here to help you stay connected.
                    </p>
                    <ul className="space-y-3 text-blue-100">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Safe & Secure System
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Easy password recovery
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                            Reliable customer support
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE - Forgot Password Form */}
            <div className="flex items-center justify-center w-full md:w-1/2 bg-blue-100 p-8 md:p-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
                        <p className="text-gray-600 mt-2">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
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

                        {/* Message / Error */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    {/* Back to login */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Remembered your password?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
