import React from "react";

export const Card = ({ title, value }) => (
    <div className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
        <div className="text-sm text-gray-500 font-medium tracking-wide">{title}</div>
        <div className="text-3xl font-extrabold text-blue-700 mt-2">{value}</div>
    </div>
);
