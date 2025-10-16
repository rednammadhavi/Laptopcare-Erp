import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJob, updateJob } from "../../api/api";

export const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasRole } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    // if (loading) return <div className="p-4">Loading job details...</div>;
    // if (error) return <div className="p-4 text-red-600">{error}</div>;
    // if (!job) return <div className="p-4">Job not found</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Job Details</h1>
                <div className="flex gap-4">
                    {hasRole(['admin', 'manager']) && (
                        <Link
                            to={`/jobs/${job._id}/edit`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Edit Job
                        </Link>
                    )}
                    <button
                        onClick={() => navigate('/jobs')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>

            {/* Job details implementation */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Job #{job._id}</h2>
                {/* Add detailed job information here */}
            </div>
        </div>
    );
};