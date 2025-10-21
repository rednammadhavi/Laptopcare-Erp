import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomer } from "../../api/api";

export const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const response = await getCustomer(id);
            setCustomer(response.data);
        } catch (err) {
            setError("Failed to fetch customer details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="p-6 text-gray-600 text-center animate-pulse">
                Loading customer details...
            </div>
        );
    if (error)
        return <div className="p-6 text-red-600 text-center font-medium">{error}</div>;
    if (!customer)
        return <div className="p-6 text-gray-600 text-center">Customer not found.</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">
                    Customer Details
                </h1>
                <div className="flex flex-wrap gap-3">
                    {hasRole(["admin", "manager", "receptionist"]) && (
                        <Link
                            to={`/customers/${customer._id}/edit`}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-all"
                        >
                            Edit Customer
                        </Link>
                    )}
                    <button
                        onClick={() => navigate("/customers")}
                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-gray-200 transition-all"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all hover:shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-4">
                            Basic Information
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <p>
                                <strong className="text-gray-800">Name:</strong> {customer.name}
                            </p>
                            <p>
                                <strong className="text-gray-800">Email:</strong>{" "}
                                {customer.email || "N/A"}
                            </p>
                            <p>
                                <strong className="text-gray-800">Phone:</strong>{" "}
                                {customer.phone || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-4">
                            Additional Information
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <p>
                                <strong className="text-gray-800">Address:</strong>{" "}
                                {customer.address || "N/A"}
                            </p>
                            <p>
                                <strong className="text-gray-800">Preferred Technician:</strong>{" "}
                                {customer.preferredTechnician?.name || "None"}
                            </p>
                            <p>
                                <strong className="text-gray-800">Created:</strong>{" "}
                                {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <strong className="text-gray-800">Last Updated:</strong>{" "}
                                {new Date(customer.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
