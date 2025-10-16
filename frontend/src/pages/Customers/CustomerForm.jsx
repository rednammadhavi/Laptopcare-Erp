import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createCustomer, updateCustomer, getCustomer } from "../../api/api";

export const CustomerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const { user, hasRole } = useAuth();
    const [form, setForm] = useState({
        // Basic Information
        name: "",
        email: "",
        phone: "",
        address: "",

        // Device Information
        deviceType: "Laptop",
        brand: "",
        model: "",

        // Problem Information
        problemDescription: "",
        priority: "Medium",

        // Status (Receptionist can only set to "New")
        status: "New",

        // Additional Information
        notes: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchCustomerData();
        }
    }, [id]);

    const fetchCustomerData = async () => {
        try {
            const response = await getCustomer(id);
            const customer = response.data;

            setForm({
                name: customer.name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                address: customer.address || "",
                deviceType: customer.deviceType || "Laptop",
                brand: customer.brand || "",
                model: customer.model || "",
                problemDescription: customer.problemDescription || "",
                priority: customer.priority || "Medium",
                status: customer.status || "New",
                notes: customer.notes || ""
            });
        } catch (err) {
            setError("Failed to fetch customer data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic validation
        if (!form.name.trim()) {
            setError("Customer name is required");
            setLoading(false);
            return;
        }

        if (!form.problemDescription.trim()) {
            setError("Problem description is required");
            setLoading(false);
            return;
        }

        try {
            const submitData = {
                ...form,
                // Convert empty strings to undefined for optional fields
                email: form.email || undefined,
                phone: form.phone || undefined,
                address: form.address || undefined,
                brand: form.brand || undefined,
                model: form.model || undefined,
                notes: form.notes || undefined
            };

            // Receptionist can only create customers with "New" status
            if (hasRole('receptionist') && !hasRole(['admin', 'manager'])) {
                submitData.status = "New";
            }

            if (isEditMode) {
                await updateCustomer(id, submitData);
            } else {
                await createCustomer(submitData);
            }
            navigate("/customers");
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`);
        } finally {
            setLoading(false);
        }
    };

    // Check if user can edit status (only admin/manager)
    const canEditStatus = hasRole(['admin', 'manager']);

    // Check if user can assign technician (only admin/manager)
    const canAssignTechnician = hasRole(['admin', 'manager']);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditMode ? "Edit Customer" : "Add New Customer"}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {hasRole('receptionist') && !hasRole(['admin', 'manager'])
                                        ? "Register new customer with device repair details"
                                        : isEditMode
                                            ? "Update customer information and repair status"
                                            : "Create a new customer record with device repair details"
                                    }
                                </p>
                                {hasRole('receptionist') && !hasRole(['admin', 'manager']) && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                        <p className="text-xs text-blue-700">
                                            <strong>Receptionist Mode:</strong> You can register customers and their device problems.
                                            Technicians will be assigned by managers.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/customers")}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Back to Customers
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Section 1: Basic Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter customer's full name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="customer@example.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Enter complete address"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Device Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Device Type *
                                    </label>
                                    <select
                                        name="deviceType"
                                        value={form.deviceType}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="Laptop">Laptop</option>
                                        <option value="Desktop">Desktop</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Smartphone">Smartphone</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Printer">Printer</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand *
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Dell, HP, Apple, Lenovo"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Model *
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={form.model}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., MacBook Pro, ThinkPad X1, Inspiron 15"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Problem Information */}
                        <div className="border-b border-gray-200 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Details</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Problem Description *
                                    </label>
                                    <textarea
                                        name="problemDescription"
                                        value={form.problemDescription}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        placeholder="Describe the issue in detail. Include any error messages, symptoms, and when the problem started..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority Level
                                        </label>
                                        <select
                                            name="priority"
                                            value={form.priority}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {form.priority === 'Low' && 'Standard repair timeline'}
                                            {form.priority === 'Medium' && 'Moderate urgency'}
                                            {form.priority === 'High' && 'High priority repair'}
                                            {form.priority === 'Urgent' && 'Immediate attention required'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            disabled={!canEditStatus}
                                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!canEditStatus ? 'bg-gray-100 text-gray-500' : ''
                                                }`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Diagnosing">Diagnosing</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Waiting for Parts">Waiting for Parts</option>
                                            <option value="Ready for Pickup">Ready for Pickup</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        {!canEditStatus && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Status can only be changed by managers or administrators
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Additional Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes & Observations
                                </label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Any additional notes, observations, or special instructions..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    These notes will help technicians understand the customer's requirements
                                </p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/customers")}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditMode ? "Updating..." : "Creating..."}
                                    </span>
                                ) : (
                                    isEditMode ? "Update Customer" : "Create Customer"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};