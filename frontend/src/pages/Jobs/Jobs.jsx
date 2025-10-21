import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJobs, getMyJobs } from "../../api/api";

// Loading Component
const Loading = () => (
    <div className="p-4 text-center text-gray-500">Loading jobs...</div>
);

// Error Component
const ErrorMessage = ({ message }) => (
    <div className="p-4 text-center text-red-600">{message}</div>
);

// Filter Buttons Component
const FilterButtons = ({ filter, setFilter }) => {
    const buttons = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
    ];

    return (
        <div className="flex bg-gray-100 rounded-lg p-1">
            {buttons.map(btn => (
                <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === btn.value
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};

// Job Row Component
const JobRow = ({ job, getStatusColor }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            #{job._id.slice(-6)}
        </td>
        <td className="px-6 py-4">
            <div className="text-sm font-medium text-gray-900">
                {job.customer?.name || 'Unknown Customer'}
            </div>
            <div className="text-sm text-gray-500">
                {job.deviceType} - {job.brand} {job.model}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {job.technician?.name || 'Unassigned'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <Link
                to={`/jobs/${job._id}`}
                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded text-xs"
            >
                View Details
            </Link>
        </td>
    </tr>
);

// Empty State Component
const EmptyState = ({ filter }) => (
    <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
            {filter === "all" ? "No jobs found" : `No ${filter} jobs found`}
        </h3>
        <p className="text-gray-500">
            {filter === "all"
                ? "There are no jobs in the system yet."
                : `No ${filter} jobs match the current filter.`}
        </p>
    </div>
);

export const JobsPage = () => {
    const { hasRole } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            let response;
            if (hasRole('technician')) {
                response = await getMyJobs();
            } else {
                response = await getJobs();
            }
            setJobs(response.data);
        } catch (err) {
            setError("Failed to fetch jobs: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
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

    const filteredJobs = jobs.filter(job => {
        if (filter === "active") return !['Completed', 'Cancelled'].includes(job.status);
        if (filter === "completed") return ['Completed', 'Cancelled'].includes(job.status);
        return true;
    });

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        {hasRole('technician') ? 'My Jobs' : 'All Jobs'}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {hasRole('technician') ? 'Your assigned repair jobs' : 'All repair job assignments'}
                    </p>
                </div>
                <FilterButtons filter={filter} setFilter={setFilter} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobs.length > 0
                                ? filteredJobs.map(job => <JobRow key={job._id} job={job} getStatusColor={getStatusColor} />)
                                : <tr><td colSpan={5}><EmptyState filter={filter} /></td></tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                        {filter !== "all" && ` • Filtered by ${filter}`}
                    </p>
                </div>
            </div>
        </div>
    );
};
