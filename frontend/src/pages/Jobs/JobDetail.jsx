import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJob, updateJob, deleteJob } from "../../api/api";

export const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasRole } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const response = await getJob(id);
            setJob(response.data);
        } catch (err) {
            console.error("Fetch job error:", err);
            setError(err.response?.data?.message || "Failed to fetch job details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!job) return;

        setUpdating(true);
        try {
            const response = await updateJob(id, { status: newStatus });
            setJob(response.data.job);
        } catch (err) {
            setError("Failed to update job status: " + (err.response?.data?.message || err.message));
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        try {
            await deleteJob(id);
            navigate("/jobs");
        } catch (err) {
            setError("Failed to delete job: " + (err.response?.data?.message || err.message));
            setDeleting(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'New': 'bg-blue-100 text-blue-800 border-blue-200',
            'Diagnosing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'In Progress': 'bg-orange-100 text-orange-800 border-orange-200',
            'Waiting for Parts': 'bg-purple-100 text-purple-800 border-purple-200',
            'Ready for Pickup': 'bg-green-100 text-green-800 border-green-200',
            'Completed': 'bg-gray-100 text-gray-800 border-gray-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg">Loading job details...</div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
        </div>
    );

    if (!job) return (
        <div className="p-4 text-gray-600">Job not found</div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
                        <p className="text-gray-600 mt-1">Job ID: #{job._id.slice(-8)}</p>
                    </div>
                    <div className="flex gap-4">
                        {hasRole(['admin', 'manager']) && (
                            <>
                                <Link
                                    to={`/jobs/${job._id}/edit`}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Job
                                </Link>
                                <button
                                    onClick={handleDeleteJob}
                                    disabled={deleting}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {deleting ? "Deleting..." : "Delete Job"}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => navigate('/jobs')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Status Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Job Status</h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>

                            {/* Status Update Buttons (for technicians) */}
                            {(hasRole(['technician']) && job.technician?._id === user?._id) && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Diagnosing', 'In Progress', 'Waiting for Parts', 'Ready for Pickup', 'Completed'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(status)}
                                                disabled={updating || job.status === status}
                                                className={`px-3 py-2 text-sm rounded transition-colors ${job.status === status
                                                        ? 'bg-blue-600 text-white cursor-not-allowed'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Problem Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Issue Summary</h3>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{job.issue}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Detailed Description</h3>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                                        {job.problemDescription || 'No detailed description provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Device Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Device Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Device Type</label>
                                    <p className="text-gray-900 mt-1">{job.deviceType}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Brand</label>
                                    <p className="text-gray-900 mt-1">{job.brand}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Model</label>
                                    <p className="text-gray-900 mt-1">{job.model}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Serial Number</label>
                                    <p className="text-gray-900 mt-1">{job.serialNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Assignment & Details */}
                    <div className="space-y-6">
                        {/* Assignment Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Customer</label>
                                    <p className="text-gray-900 mt-1 font-medium">{job.customer?.name}</p>
                                    <p className="text-sm text-gray-500">{job.customer?.phone}</p>
                                    <p className="text-sm text-gray-500">{job.customer?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Assigned Technician</label>
                                    <p className="text-gray-900 mt-1 font-medium">
                                        {job.technician?.name || 'Unassigned'}
                                    </p>
                                    {job.technician?.email && (
                                        <p className="text-sm text-gray-500">{job.technician.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Priority</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                                        {job.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Estimated Cost</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {job.estimatedCost ? `$${job.estimatedCost}` : 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Actual Cost</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {job.actualCost ? `$${job.actualCost}` : 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Created</span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Last Updated</span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(job.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <Link
                                    to={`/customers/${job.customer?._id}`}
                                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm text-center block hover:bg-gray-200 transition-colors"
                                >
                                    View Customer Details
                                </Link>
                                {hasRole(['admin', 'manager']) && (
                                    <Link
                                        to={`/jobs/${job._id}/edit`}
                                        className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm text-center block hover:bg-blue-200 transition-colors"
                                    >
                                        Edit Job Assignment
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        {hasRole(['admin', 'manager']) && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
                                <p className="text-red-700 text-sm mb-4">
                                    Once you delete a job, there is no going back. Please be certain.
                                </p>
                                <button
                                    onClick={handleDeleteJob}
                                    disabled={deleting}
                                    className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {deleting ? "Deleting Job..." : "Delete This Job"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};