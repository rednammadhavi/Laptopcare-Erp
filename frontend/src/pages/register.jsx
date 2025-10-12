import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "receptionist",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("http://localhost:5000/api/auth/register", form);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-2 text-center text-gray-800">
                    LaptopCare ERP
                </h1>
                <p className="text-sm text-gray-500 mb-6 text-center">Create a new account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="receptionist">Receptionist</option>
                            <option value="technician">Technician</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
