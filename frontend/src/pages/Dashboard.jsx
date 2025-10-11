import React from "react";
import { Card } from "../components/Card";

export const Dashboard = () => (
    <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
            <Card title="Open Jobs" value="12" />
            <Card title="Pending Payments" value="₹ 24,500" />
            <Card title="Low Inventory" value="3 Items" />
        </div>
    </div>
);
