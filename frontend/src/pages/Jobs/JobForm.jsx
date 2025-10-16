import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    createJob,
    updateJob,
    getTechniciansList,
    getJob,
    getCustomers,
    getCustomer
} from "../../api/api";

export const JobForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const customerIdFromUrl = searchParams.get("customer");

    const { user } = useAuth();

    const [form, setForm] = useState({
        customer: customerIdFromUrl || "",
        deviceType: "Laptop",
        brand: "",
        model: "",
        serialNumber: "",
        issue: "",
        problemDescription: "",
        priority: "Medium",
        status: "New",
        technician: "",
        estimatedCost: "",
    });

    const [customers, setCustomers] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchDropdownData();
        if (id) {
            setIsEditMode(true);
            fetchJobData();
        } else if (customerIdFromUrl) {
            fetchCustomerDetails(customerIdFromUrl);
        }
    }, [id, customerIdFromUrl]);

    const fetchDropdownData = async () => {
        try {
            const [customersRes, techniciansRes] = await Promise.all([
                getCustomers(),
                getTechniciansList(),
            ]);
            setCustomers(customersRes.data);
            setTechnicians(techniciansRes.data);
        } catch {
            setError("Failed to load data");
        }
    };

    const fetchJobData = async () => {
        try {
            const response = await getJob(id);
            const job = response.data;
            setForm({
                customer: job.customer?._id || "",
                deviceType: job.deviceType || "Laptop",
                brand: job.brand || "",
                model: job.model || "",
                serialNumber: job.serialNumber || "",
                issue: job.issue || "",
                problemDescription: job.problemDescription || "",
                priority: job.priority || "Medium",
                status: job.status || "New",
                technician: job.technician?._id || "",
                estimatedCost: job.estimatedCost || "",
            });
        } catch {
            setError("Failed to fetch job details");
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const res = await getCustomer(customerId);
            const customer = res.data;

            // Auto-fill from customer
            setForm((prev) => ({
                ...prev,
                customer: customerId,
                deviceType: customer.deviceType || prev.deviceType,
                brand: customer.brand || prev.brand,
                model: customer.model || prev.model,
                issue:
                    customer.problemDescription ||
                    `Repair for ${customer.deviceType}`,
                problemDescription:
                    customer.problemDescription || prev.problemDescription,
            }));
        } catch {
            console.error("Failed to fetch customer details");
        }
    };

    const handleCustomerChange = async (e) => {
        const customerId = e.target.value;
        setForm((prev) => ({ ...prev, customer: customerId }));
        if (customerId) await fetchCustomerDetails(customerId);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (!form.customer) {
            setError("Please select a customer");
            setLoading(false);
            return;
        }
        if (!form.technician) {
            setError("Please assign a technician");
            setLoading(false);
            return;
        }
        if (!form.issue.trim()) {
            setError("Issue summary is required");
            setLoading(false);
            return;
        }

        try {
            const data = {
                ...form,
                serialNumber: form.serialNumber || undefined,
                estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : undefined,
                brand: form.brand || undefined,
                model: form.model || undefined,
            };

            if (isEditMode) {
                await updateJob(id, data);
            } else {
                await createJob(data);
            }
            navigate("/jobs");
        } catch (err) {
            console.error("Submission error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                `Failed to ${isEditMode ? "update" : "create"} job`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditMode ? "Edit Job Assignment" : "Assign Technician"}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Fill the job details and assign a technician.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/jobs")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Back
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Customer Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Customer *
                            </label>
                            <select
                                name="customer"
                                value={form.customer}
                                onChange={handleCustomerChange}
                                required
                                disabled={!!customerIdFromUrl}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Choose a customer...</option>
                                {customers.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name} - {c.phone} ({c.deviceType})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Device Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Device Type
                                </label>
                                <input
                                    type="text"
                                    name="deviceType"
                                    value={form.deviceType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Problem Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Summary
                            </label>
                            <input
                                type="text"
                                name="issue"
                                value={form.issue}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Problem Description
                            </label>
                            <textarea
                                name="problemDescription"
                                value={form.problemDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Technician + Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Technician *
                                </label>
                                <select
                                    name="technician"
                                    value={form.technician}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a technician...</option>
                                    {technicians.map((t) => (
                                        <option key={t._id} value={t._id}>
                                            {t.name} - {t.specialization || "General Repair"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        {/* Estimated Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Cost ($)
                            </label>
                            <input
                                type="number"
                                name="estimatedCost"
                                value={form.estimatedCost}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/jobs")}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Assigning..."
                                    : isEditMode
                                        ? "Update Job"
                                        : "Assign Technician"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
