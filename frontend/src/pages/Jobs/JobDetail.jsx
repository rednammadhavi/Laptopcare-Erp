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
        if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
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

    if (loading) return (
        <div className="p-6 text-gray-600 text-center animate-pulse">Loading job details...</div>
    );

    if (error) return (
        <div className="p-6 text-red-600 text-center font-medium">{error}</div>
    );

    if (!job) return (
        <div className="p-6 text-gray-600 text-center">Job not found</div>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">Job Details</h1>
                    <p className="text-gray-600 mt-1">Job ID: #{job._id.slice(-8)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {hasRole(['admin', 'manager']) && (
                        <>
                            <Link
                                to={`/jobs/${job._id}/edit`}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-all"
                            >
                                Edit Job
                            </Link>
                            <button
                                onClick={handleDeleteJob}
                                disabled={deleting}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm transition-all disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete Job"}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => navigate("/jobs")}
                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-gray-200 transition-all"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Job Info Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all hover:shadow-lg space-y-6">
                {/* Status */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-blue-700">Job Status</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                    </span>
                </div>

                {/* Status Update Buttons */}
                {(hasRole(['technician']) && job.technician?._id === user?._id) && (
                    <div className="flex flex-wrap gap-2">
                        {['Diagnosing', 'In Progress', 'Waiting for Parts', 'Ready for Pickup', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                disabled={updating || job.status === status}
                                className={`px-3 py-2 text-sm rounded transition-colors ${job.status === status
                                    ? 'bg-blue-600 text-white cursor-not-allowed'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}

                {/* Problem Details */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Problem Details</h3>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>Issue:</strong> {job.issue}</p>
                        <p><strong>Description:</strong> {job.problemDescription || "N/A"}</p>
                    </div>
                </div>

                {/* Device Info */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Device Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Type:</strong> {job.deviceType}</p>
                        <p><strong>Brand:</strong> {job.brand}</p>
                        <p><strong>Model:</strong> {job.model}</p>
                        <p><strong>Serial Number:</strong> {job.serialNumber || "N/A"}</p>
                    </div>
                </div>

                {/* Assignment */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Assignment</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Customer:</strong> {job.customer?.name} ({job.customer?.phone || "N/A"})</p>
                        <p><strong>Technician:</strong> {job.technician?.name || "Unassigned"}</p>
                    </div>
                </div>

                {/* Job Details */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Job Details</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Priority:</strong> <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>{job.priority}</span></p>
                        <p><strong>Estimated Cost:</strong> {job.estimatedCost ? `$${job.estimatedCost}` : "N/A"}</p>
                        <p><strong>Actual Cost:</strong> {job.actualCost ? `$${job.actualCost}` : "N/A"}</p>
                        <p><strong>Created:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(job.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
