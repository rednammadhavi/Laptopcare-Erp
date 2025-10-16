import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCustomers, deleteCustomer, getMyCustomers } from "../../api/api";

export const CustomersList = () => {
    const { user, hasRole } = useAuth();
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
            if (hasRole('technician')) {
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

    const handleDelete = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            await deleteCustomer(customerId);
            setCustomers(customers.filter(customer => customer._id !== customerId));
        } catch (err) {
            setError("Failed to delete customer");
        }
    };

    // Check if customer has an assigned job/technician
    const hasAssignedJob = (customer) => {
        return customer.preferredTechnician || customer.assignedJob;
    };

    const getStatusColor = (status) => {
        const colors = {
            'New': 'bg-blue-100 text-blue-800',
            'Diagnosing': 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-orange-100 text-orange-800',
            'Waiting for Parts': 'bg-purple-100 text-purple-800',
            'Ready for Pickup': 'bg-green-100 text-green-800',
            'Completed': 'bg-gray-100 text-gray-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'High': 'bg-orange-100 text-orange-800',
            'Urgent': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    // Filter customers based on status and search term
    const filteredCustomers = customers.filter(customer => {
        // Status filter
        let statusMatch = true;
        if (filter === "active") {
            statusMatch = !['Completed', 'Cancelled'].includes(customer.status);
        } else if (filter === "completed") {
            statusMatch = ['Completed', 'Cancelled'].includes(customer.status);
        }

        // Search filter
        const searchMatch = searchTerm === "" ||
            customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.problemDescription?.toLowerCase().includes(searchTerm.toLowerCase());

        return statusMatch && searchMatch;
    });

    // Statistics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => !['Completed', 'Cancelled'].includes(c.status)).length;
    const newCustomers = customers.filter(c => c.status === 'New').length;
    const inProgressCustomers = customers.filter(c => c.status === 'In Progress').length;

    if (loading) return <div className="p-4">Loading customers...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {hasRole('technician') ? 'My Assigned Customers' : 'Customers'}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {hasRole('technician')
                            ? 'Viewing your assigned repair customers'
                            : 'Manage all customer records and repair status'
                        }
                    </p>
                </div>

                {/* Add Customer Button */}
                {hasRole(['admin', 'manager', 'receptionist']) ? (
                    <Link
                        to="/customers/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span>
                        Add New Customer
                    </Link>
                ) : (
                    <div className="text-sm text-gray-500">
                        {hasRole('technician')
                            ? 'Contact receptionist for new customer registration'
                            : 'Only authorized staff can create customers'
                        }
                    </div>
                )}
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
                    <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-blue-600">{newCustomers}</div>
                    <div className="text-sm text-gray-600">New</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-orange-600">{inProgressCustomers}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
                    <div className="text-sm text-gray-600">Active</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search Box */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search customers by name, email, phone, device..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === "all"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("active")}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === "active"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === "completed"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Device Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Problem
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                {!hasRole('technician') && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assigned To
                                    </th>
                                )}
                                {(hasRole(['admin', 'manager', 'receptionist'])) && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Customer Information */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <Link
                                                to={`/customers/${customer._id}`}
                                                className="font-medium text-blue-600 hover:text-blue-900 hover:underline"
                                            >
                                                {customer.name}
                                            </Link>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {customer.phone || 'No phone'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {customer.email || 'No email'}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Device Information */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{customer.deviceType}</div>
                                            <div className="text-gray-500">
                                                {customer.brand} {customer.model}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {customer.address ? `${customer.address.substring(0, 30)}...` : 'No address'}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Problem Description */}
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs">
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {customer.problemDescription || 'No problem description'}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                                            {customer.status}
                                        </span>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(customer.priority)}`}>
                                            {customer.priority}
                                        </span>
                                    </td>

                                    {/* Assigned Technician */}
                                    {!hasRole('technician') && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {customer.preferredTechnician?.name || (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                    )}

                                    {/* Actions */}
                                    {(hasRole(['admin', 'manager', 'receptionist'])) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                {/* Edit Button */}
                                                <Link
                                                    to={`/customers/${customer._id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Edit Customer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>

                                                {/* View Details Button */}
                                                <Link
                                                    to={`/customers/${customer._id}`}
                                                    className="text-green-600 hover:text-green-900 transition-colors"
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>

                                                {/* Assign Job Button - Show + icon if unassigned, tick icon if assigned */}
                                                {hasRole(['admin', 'manager']) && (
                                                    <Link
                                                        to={`/jobs/new?customer=${customer._id}`}
                                                        className={`transition-colors ${hasAssignedJob(customer)
                                                                ? "text-green-600 hover:text-green-900"
                                                                : "text-purple-600 hover:text-purple-900"
                                                            }`}
                                                        title={hasAssignedJob(customer) ? "Technician Assigned" : "Assign Technician"}
                                                    >
                                                        {hasAssignedJob(customer) ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        )}
                                                    </Link>
                                                )}

                                                {/* Delete Button - Only for admin and manager */}
                                                {hasRole(['admin', 'manager']) && (
                                                    <button
                                                        onClick={() => handleDelete(customer._id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete Customer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm
                                ? `No customers match "${searchTerm}"`
                                : filter === "all"
                                    ? "There are no customers in the system yet."
                                    : `No ${filter} customers found.`
                            }
                        </p>
                        {hasRole(['admin', 'manager', 'receptionist']) && filteredCustomers.length === 0 && !searchTerm && (
                            <Link
                                to="/customers/new"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-2"
                            >
                                <span>+</span>
                                Add Your First Customer
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                    Showing {filteredCustomers.length} of {customers.length} customers
                    {searchTerm && ` • Searching for "${searchTerm}"`}
                </p>
            </div>
        </div>
    );
};