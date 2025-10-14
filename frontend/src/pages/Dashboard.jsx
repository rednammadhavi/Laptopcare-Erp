import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { getReports } from "../api/api";

export const Dashboard = () => {
    const [data, setData] = useState({
        totalJobs: 0,
        pendingJobs: 0,
        inventoryItems: 0,
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await getReports();
                setData(res.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
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
