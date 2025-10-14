import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { apiService } from "../services/apiService";

export const Dashboard = () => {
    const [data, setData] = useState({
        totalJobs: 0,
        pendingJobs: 0,
        inventoryItems: 0,
    });

    useEffect(() => {
        const fetchReports = async () => {
            const res = await apiService.getReports();
            setData(res.data);
        };
        fetchReports();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Total Jobs" value={data.totalJobs} />
                <Card title="Pending Jobs" value={data.pendingJobs} />
                <Card title="Inventory Items" value={data.inventoryItems} />
            </div>
        </div>
    );
};
