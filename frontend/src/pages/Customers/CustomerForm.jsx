import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createCustomer, updateCustomer, getCustomer } from "../../api/api";

export const CustomerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { hasRole } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        deviceType: "Laptop",
        brand: "",
        model: "",
        problemDescription: "",
        priority: "Medium",
        status: "New",
        notes: "",
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
            const c = response.data;
            setForm({
                name: c.name || "",
                email: c.email || "",
                phone: c.phone || "",
                address: c.address || "",
                deviceType: c.deviceType || "Laptop",
                brand: c.brand || "",
                model: c.model || "",
                problemDescription: c.problemDescription || "",
                priority: c.priority || "Medium",
                status: c.status || "New",
                notes: c.notes || "",
            });
        } catch (err) {
            setError("Failed to fetch customer data.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!form.name.trim() || !form.problemDescription.trim()) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...form,
                email: form.email || undefined,
                phone: form.phone || undefined,
                address: form.address || undefined,
                brand: form.brand || undefined,
                model: form.model || undefined,
                notes: form.notes || undefined,
            };

            if (hasRole("receptionist") && !hasRole(["admin", "manager"])) {
                payload.status = "New";
            }

            if (isEditMode) {
                await updateCustomer(id, payload);
            } else {
                await createCustomer(payload);
            }

            navigate("/customers");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                `Failed to ${isEditMode ? "update" : "create"} customer.`
            );
        } finally {
            setLoading(false);
        }
    };

    const canEditStatus = hasRole(["admin", "manager"]);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800">
                                {isEditMode ? "Edit Customer" : "Add New Customer"}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {isEditMode
                                    ? "Update customer record and repair details"
                                    : "Register a new customer and log their device problem"}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/customers")}
                            className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Section: Customer Info */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">
                            Customer Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name *"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter customer's name"
                            />
                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="customer@example.com"
                            />
                            <InputField
                                label="Phone Number *"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="+91 9876543210"
                            />
                            <TextArea
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Enter full address"
                            />
                        </div>
                    </section>

                    {/* Section: Device Info */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">
                            Device Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SelectField
                                label="Device Type *"
                                name="deviceType"
                                value={form.deviceType}
                                onChange={handleChange}
                                options={[
                                    "Laptop",
                                    "Desktop",
                                    "Tablet",
                                    "Smartphone",
                                    "Monitor",
                                    "Printer",
                                    "Other",
                                ]}
                            />
                            <InputField
                                label="Brand *"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                required
                                placeholder="e.g., HP, Dell, Apple"
                            />
                            <InputField
                                label="Model *"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                required
                                placeholder="e.g., MacBook Pro, ThinkPad X1"
                            />
                        </div>
                    </section>

                    {/* Section: Problem Details */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">
                            Problem Details
                        </h2>
                        <TextArea
                            label="Problem Description *"
                            name="problemDescription"
                            value={form.problemDescription}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the issue and when it started..."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <SelectField
                                label="Priority Level"
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                options={["Low", "Medium", "High", "Urgent"]}
                            />
                            <SelectField
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                options={[
                                    "New",
                                    "Diagnosing",
                                    "In Progress",
                                    "Waiting for Parts",
                                    "Ready for Pickup",
                                    "Completed",
                                    "Cancelled",
                                ]}
                                disabled={!canEditStatus}
                            />
                        </div>
                    </section>

                    {/* Section: Notes */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-700 mb-4">
                            Additional Notes
                        </h2>
                        <TextArea
                            label="Notes & Observations"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any special instructions or remarks..."
                        />
                    </section>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate("/customers")}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50"
                        >
                            {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Customer" : "Create Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* Helper Components for Clean UI */
const InputField = ({ label, name, value, onChange, placeholder, type = "text", required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
    </div>
);

const TextArea = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${disabled ? "bg-gray-100 text-gray-500" : ""
                }`}
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);
