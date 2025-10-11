import React from "react";
import { useNavigate } from "react-router-dom";

export const JobsPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Service Jobs</h1>
                <button className="px-3 py-2 rounded border" onClick={() => navigate("/jobs/new")}>
                    New Job
                </button>
            </div>
            <div className="bg-white border rounded p-4">
                List of jobs, filters, and quick actions.
            </div>
        </div>
    );
};
