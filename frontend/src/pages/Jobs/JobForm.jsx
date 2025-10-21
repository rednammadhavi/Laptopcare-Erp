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

// Reusable Spinner component
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const JobForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const customerIdFromUrl = searchParams.get("customer");

    const { hasRole } = useAuth();

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
    const [customerDetails, setCustomerDetails] = useState(null);

    const [loadingData, setLoadingData] = useState(true); // fetching dropdown/job
    const [submitting, setSubmitting] = useState(false);   // submitting form
    const [error, setError] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    // Authorization check
    useEffect(() => {
        if (!hasRole(['admin', 'manager'])) {
            navigate('/jobs');
        }
    }, [hasRole, navigate]);

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoadingData(true);
                await fetchDropdownData();
                if (id) {
                    setIsEditMode(true);
                    await fetchJobData();
                } else if (customerIdFromUrl) {
                    await fetchCustomerDetails(customerIdFromUrl);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load initial data");
            } finally {
                setLoadingData(false);
            }
        };
        initialize();
    }, [id, customerIdFromUrl]);

    const fetchDropdownData = async () => {
        const [customersRes, techniciansRes] = await Promise.all([
            getCustomers(),
            getTechniciansList()
        ]);
        setCustomers(customersRes.data || []);
        setTechnicians(techniciansRes.data || []);
    };

    const fetchJobData = async () => {
        const res = await getJob(id);
        const job = res.data;

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

        if (job.customer?._id) {
            await fetchCustomerDetails(job.customer._id);
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const res = await getCustomer(customerId);
            const customer = res.data;
            setCustomerDetails(customer);

            if (!isEditMode) {
                setForm(prev => ({
                    ...prev,
                    customer: customerId,
                    deviceType: customer.deviceType || prev.deviceType,
                    brand: customer.brand || prev.brand,
                    model: customer.model || prev.model,
                    issue: customer.problemDescription || `Repair for ${customer.deviceType}`,
                    problemDescription: customer.problemDescription || prev.problemDescription
                }));
            }
        } catch (err) {
            console.error("Error fetching customer details:", err);
        }
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        setForm(prev => ({ ...prev, customer: customerId }));
        setCustomerDetails(null);
        if (customerId) fetchCustomerDetails(customerId);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value
        }));
    };

    const getErrorMessage = (err) => {
        return err.response?.data?.message || err.response?.data?.error || err.message || "Something went wrong";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.customer) return setError("Please select a customer");
        if (!form.technician) return setError("Please assign a technician");
        if (!form.issue.trim()) return setError("Issue summary is required");
        if (form.estimatedCost && form.estimatedCost < 0) return setError("Estimated cost cannot be negative");

        setSubmitting(true);

        const data = {
            customer: form.customer,
            technician: form.technician,
            deviceType: form.deviceType,
            brand: form.brand,
            model: form.model,
            serialNumber: form.serialNumber || undefined,
            issue: form.issue,
            problemDescription: form.problemDescription,
            priority: form.priority,
            status: form.status,
            estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : undefined
        };

        try {
            if (isEditMode) {
                await updateJob(id, data);
                alert("Job updated successfully!");
            } else {
                await createJob(data);
                alert("Job created successfully!");
            }
            navigate("/jobs");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (!hasRole(['admin', 'manager'])) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        Only Admin and Manager can create jobs.
                    </p>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    if (loadingData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Job" : "Create New Job"}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {isEditMode ? "Update job details and assignment" : "Assign a technician to repair a customer's device"}
                            </p>
                        </div>
                        <button onClick={() => navigate("/jobs")} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Back to Jobs
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

                        {/* Customer Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
                            <select
                                name="customer"
                                value={form.customer}
                                onChange={handleCustomerChange}
                                disabled={!!customerIdFromUrl && !isEditMode}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="">Choose a customer...</option>
                                {customers.map(c => (
                                    <option key={c._id} value={c._id}>{c.name} - {c.phone} ({c.deviceType})</option>
                                ))}
                            </select>
                            {customerDetails && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div><strong>Name:</strong> {customerDetails.name}</div>
                                    <div><strong>Phone:</strong> {customerDetails.phone || 'N/A'}</div>
                                    <div><strong>Email:</strong> {customerDetails.email || 'N/A'}</div>
                                    <div><strong>Device:</strong> {customerDetails.deviceType} {customerDetails.brand} {customerDetails.model}</div>
                                    {customerDetails.problemDescription && (
                                        <div className="md:col-span-2">
                                            <strong>Reported Issue:</strong> {customerDetails.problemDescription}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Device Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Device Type *</label>
                                <select name="deviceType" value={form.deviceType} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                                <input type="text" name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g., Dell, HP" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                                <input type="text" name="model" value={form.model} onChange={handleChange} required placeholder="e.g., ThinkPad X1" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                            </div>
                        </div>

                        {/* Serial Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                            <input type="text" name="serialNumber" value={form.serialNumber} onChange={handleChange} placeholder="Optional serial number" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                        </div>

                        {/* Problem Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Summary *</label>
                            <input type="text" name="issue" value={form.issue} onChange={handleChange} required placeholder="Brief description" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Problem Description</label>
                            <textarea name="problemDescription" value={form.problemDescription} onChange={handleChange} rows="4" placeholder="Detailed description" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                        </div>

                        {/* Assignment & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Technician *</label>
                                <select name="technician" value={form.technician} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                                    <option value="">Select a technician...</option>
                                    {technicians.map(t => (<option key={t._id} value={t._id}>{t.name} {t.email ? `(${t.email})` : ''}</option>))}
                                </select>
                                {technicians.length === 0 && <p className="text-xs text-red-500 mt-1">No technicians available</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                                <select name="priority" value={form.priority} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        {/* Status and Cost */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
                                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                                    <option value="New">New</option>
                                    <option value="Diagnosing">Diagnosing</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Waiting for Parts">Waiting for Parts</option>
                                    <option value="Ready for Pickup">Ready for Pickup</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost ($)</label>
                                <input type="number" name="estimatedCost" value={form.estimatedCost} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                            <button type="button" onClick={() => navigate("/jobs")} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
                                {submitting ? <Spinner /> : (isEditMode ? "Update Job" : "Create Job")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
