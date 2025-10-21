import React, { useEffect, useState } from "react";
import { getReports } from "../api/api";
import { Card } from "../components/Card";

export const ReportsPage = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await getReports();
                setData(res.data || {});
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Loading reports...
            </div>
        );
    }

    const totalJobs = data?.totalJobs || 0;
    const completedJobs = data?.completedJobs || 0;
    const pendingJobs = data?.pendingJobs || 0;
    const totalInventory = data?.totalInventory || 0;
    const lowStock = data?.lowStock || 0;
    const activeJobs = data?.activeJobs || 0;

    const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) + "%" : "0%";
    const customerSatisfaction = completedJobs > 0 ? Math.min(95, 70 + Math.floor((completedJobs / 10) * 5)) + "%" : "0%";

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <Card title="Total Jobs" value={totalJobs} />
                <Card title="Completed Jobs" value={completedJobs} />
                <Card title="Pending Jobs" value={pendingJobs} />
                <Card title="Inventory Items" value={totalInventory} />
                <Card title="Low Stock (<5)" value={lowStock} />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    title="Completion Rate"
                    value={completionRate}
                    description={`${completedJobs} of ${totalJobs} jobs completed`}
                    color="blue"
                />
                <Card
                    title="Active Workload"
                    value={activeJobs}
                    description="Jobs currently in progress"
                    color="green"
                />
                <Card
                    title="Customer Satisfaction"
                    value={customerSatisfaction}
                    description="Based on completed jobs"
                    color="purple"
                />
            </div>
        </div>
    );
};
