import React from "react";

export const Card = ({ title, value }) => (
    <div className="p-4 bg-white rounded shadow-sm border">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
    </div>
);
