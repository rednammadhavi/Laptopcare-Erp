import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomers, getMyCustomers, assignTechnicianToCustomer } from "../../api/api";

export const CustomersList = () => {
    const { hasRole } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            let response;
            if (hasRole("technician")) {
                response = await getMyCustomers();
            } else {
                response = await getCustomers();
            }
            setCustomers(response.data);
        } catch (err) {
            setError("Failed to fetch customers: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const refreshCustomers = () => {
        setLoading(true);
        fetchCustomers();
    };

    const hasAssignedTechnician = (customer) => customer.preferredTechnician?._id;

    const getStatusColor = (status) => {
        const colors = {
            New: "bg-blue-100 text-blue-800",
            Diagnosing: "bg-yellow-100 text-yellow-800",
            "In Progress": "bg-orange-100 text-orange-800",
            "Waiting for Parts": "bg-purple-100 text-purple-800",
            "Ready for Pickup": "bg-green-100 text-green-800",
            Completed: "bg-gray-100 text-gray-800",
            Cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: "bg-green-100 text-green-800",
            Medium: "bg-yellow-100 text-yellow-800",
            High: "bg-orange-100 text-orange-800",
            Urgent: "bg-red-100 text-red-800",
        };
        return colors[priority] || "bg-gray-100 text-gray-800";
    };

    const filteredCustomers = customers.filter((c) => {
        let statusMatch = true;
        if (filter === "active") statusMatch = !["Completed", "Cancelled"].includes(c.status);
        if (filter === "completed") statusMatch = ["Completed", "Cancelled"].includes(c.status);

        const searchMatch =
            searchTerm === "" ||
            [c.name, c.email, c.phone, c.brand, c.model, c.problemDescription]
                .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

        return statusMatch && searchMatch;
    });

    if (loading)
        return (
            <div className="p-6 text-gray-600 text-center animate-pulse">
                Loading customers...
            </div>
        );

    if (error)
        return (
            <div className="p-6 text-red-600 text-center font-medium">{error}</div>
        );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">
                        {hasRole("technician") ? "My Assigned Customers" : "Customers"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {hasRole("technician")
                            ? "Your assigned repair customers"
                            : "Manage all customer records and repair status"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={refreshCustomers}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh
                    </button>

                    {hasRole(["admin", "manager", "receptionist"]) && (
                        <Link
                            to="/customers/new"
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-all"
                        >
                            + Add Customer
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters + Search */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <input
                        type="text"
                        placeholder="Search customers by name, email, phone, device..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {["all", "active", "completed"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === key
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Customer", "Device Info", "Problem", "Status", "Priority", "Technician"].map((col) => (
                                    <th
                                        key={col}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div>
                                            <Link
                                                to={`/customers/${customer._id}`}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                {customer.name}
                                            </Link>
                                            <div className="text-sm text-gray-500">{customer.phone || "No phone"}</div>
                                            <div className="text-sm text-gray-500">{customer.email || "No email"}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">{customer.deviceType}</div>
                                        <div className="text-gray-500">{customer.brand} {customer.model}</div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {customer.problemDescription || "No problem description"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                customer.status
                                            )}`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                                customer.priority
                                            )}`}
                                        >
                                            {customer.priority}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {hasRole(["admin", "manager"]) ? (
                                            hasAssignedTechnician(customer) ? (
                                                <div className="flex items-center gap-2 text-green-700 font-semibold">
                                                    <svg
                                                        className="w-4 h-4 text-green-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{customer.preferredTechnician.name}</span>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={`/jobs/new?customer=${customer._id}`}
                                                    className="inline-flex items-center gap-2 text-purple-700 bg-purple-50 px-3 py-1 rounded hover:bg-purple-100 transition text-xs font-medium"
                                                    title="Assign Technician"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Assign Technician
                                                </Link>
                                            )
                                        ) : hasAssignedTechnician(customer) ? (
                                            <span className="text-green-700 font-semibold">
                                                {customer.preferredTechnician.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No customers found
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                Showing {filteredCustomers.length} of {customers.length} customers
            </div>
        </div>
    );
};
