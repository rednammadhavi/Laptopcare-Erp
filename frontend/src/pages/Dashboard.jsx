import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getReports, getJobs, getCustomers, getInventory, getMyJobs } from "../api/api";
import { Card } from "../components/Card";

// Utility for status colors
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

// Utility for priority colors
const getPriorityColor = (priority) => {
    const colors = {
        'Low': 'text-green-600',
        'Medium': 'text-yellow-600',
        'High': 'text-orange-600',
        'Urgent': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
};

// Reusable component for Recent Jobs
const RecentJobs = ({ jobs }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</Link>
        </div>
        <div className="p-6">
            {jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">{job.customer?.name || 'Unknown Customer'}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{job.deviceType} • {job.brand} {job.model}</p>
                                <p className="text-xs text-gray-500">Issue: {job.issue?.substring(0, 60)}...</p>
                            </div>
                            <Link to={`/jobs/${job._id}`} className="ml-4 text-blue-600 hover:text-blue-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">No recent jobs found</div>
            )}
        </div>
    </div>
);

// Reusable component for Recent Customers
const RecentCustomers = ({ customers }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
            <Link to="/customers" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</Link>
        </div>
        <div className="p-6">
            {customers.length > 0 ? (
                <div className="space-y-4">
                    {customers.map(customer => (
                        <div key={customer._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">{customer.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                                    <p className="text-sm text-gray-600">{customer.phone || 'No phone'}</p>
                                    <p className="text-xs text-gray-500">{customer.deviceType} • {customer.brand}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                                    {customer.status}
                                </span>
                                <p className={`text-xs mt-1 ${getPriorityColor(customer.priority)}`}>{customer.priority}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No recent customers found
                </div>
            )}
        </div>
    </div>
);

export const Dashboard = () => {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState({});
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (hasRole(['admin', 'manager'])) {
                    const [reportsRes, jobsRes, customersRes, inventoryRes] = await Promise.all([
                        getReports(),
                        getJobs(),
                        getCustomers(),
                        getInventory()
                    ]);

                    const jobs = jobsRes.data || [];
                    const customers = customersRes.data || [];
                    const inventory = inventoryRes.data || [];

                    const activeJobs = jobs.filter(j => !['Completed', 'Cancelled'].includes(j.status)).length;
                    const completedJobs = jobs.filter(j => j.status === 'Completed').length;
                    const lowStockItems = inventory.filter(i => i.quantity < 5).length;

                    setStats({
                        ...reportsRes.data,
                        totalCustomers: customers.length,
                        activeJobs,
                        completedJobs,
                        lowStockItems,
                        myTotalJobs: 0,
                        myInProgressJobs: 0,
                        myCompletedJobs: 0
                    });

                    setRecentJobs(jobs.slice(0, 5));
                    setRecentCustomers(customers.slice(0, 5));

                } else if (hasRole('technician')) {
                    const myJobsRes = await getMyJobs();
                    const myJobs = myJobsRes.data || [];

                    setStats({
                        myTotalJobs: myJobs.length,
                        myInProgressJobs: myJobs.filter(j => j.status === 'In Progress').length,
                        myCompletedJobs: myJobs.filter(j => j.status === 'Completed').length
                    });

                    setRecentJobs(myJobs.slice(0, 5));
                    setRecentCustomers([]);
                } else if (hasRole('receptionist')) {
                    const customersRes = await getCustomers();
                    const customers = customersRes.data || [];
                    setStats({ totalCustomers: customers.length });
                    setRecentJobs([]);
                    setRecentCustomers(customers.slice(0, 5));
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [hasRole]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600 mt-2">
                    {hasRole(['admin', 'manager'])
                        ? "Here's what's happening in your LaptopCare service center today."
                        : hasRole('technician')
                            ? "Here's your current workload and job status."
                            : "Manage customer registrations and service requests."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className={`grid gap-6 mb-8 ${hasRole(['admin', 'manager']) ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : hasRole('technician') ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {hasRole(['admin', 'manager']) && (
                    <>
                        <Card title="Total Jobs" value={stats.totalJobs} />
                        <Card title="Completed Jobs" value={stats.completedJobs} />
                        <Card title="Pending Jobs" value={stats.pendingJobs} />
                        <Card title="Inventory Items" value={stats.inventoryItems} />
                        <Card title="Low Stock (<5)" value={stats.lowStockItems} />
                        <Card title="Total Customers" value={stats.totalCustomers} />
                        <Card title="Active Jobs" value={stats.activeJobs} />
                    </>
                )}
                {hasRole('technician') && (
                    <>
                        <Card title="Total Jobs" value={stats.myTotalJobs} />
                        <Card title="In Progress" value={stats.myInProgressJobs} />
                        <Card title="Completed" value={stats.myCompletedJobs} />
                    </>
                )}
                {hasRole('receptionist') && <Card title="Total Customers" value={stats.totalCustomers} />}
            </div>

            {/* Quick Actions */}
            {hasRole('technician') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Access</h2>
                            <p className="text-gray-600">Manage your assigned jobs and update their status</p>
                        </div>
                        <Link
                            to="/jobs"
                            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Go to My Jobs
                        </Link>
                    </div>
                </div>
            )}
            {hasRole('receptionist') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h2>
                            <p className="text-gray-600">Register new customers and manage existing customer records</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                            <Link to="/customers/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                                Add New Customer
                            </Link>
                            <Link to="/customers" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center">
                                View All Customers
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Jobs & Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {(hasRole(['admin', 'manager']) || hasRole('technician')) && <RecentJobs jobs={recentJobs} />}
                {(hasRole(['admin', 'manager']) || hasRole('receptionist')) && <RecentCustomers customers={recentCustomers} />}
            </div>

            {/* Fallback for unauthorized roles */}
            {!hasRole(['admin', 'manager', 'technician', 'receptionist']) && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                        <p className="text-gray-600">You don't have permission to access the dashboard.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
