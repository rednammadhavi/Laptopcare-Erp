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
            setError("Failed to fetch customer details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading customer details...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!customer) return <div className="p-4">Customer not found</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Details</h1>
                <div className="flex gap-4">
                    {hasRole(['admin', 'manager']) && (
                        <Link
                            to={`/customers/${customer._id}/edit`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Edit Customer
                        </Link>
                    )}
                    <button
                        onClick={() => navigate('/customers')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Customers
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-3">
                            <p><strong>Name:</strong> {customer.name}</p>
                            <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                        <div className="space-y-3">
                            <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
                            <p><strong>Preferred Technician:</strong> {customer.preferredTechnician?.name || 'None'}</p>
                            <p><strong>Created:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
                            <p><strong>Last Updated:</strong> {new Date(customer.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};