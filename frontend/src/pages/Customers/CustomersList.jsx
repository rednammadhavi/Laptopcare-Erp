import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { Link } from "react-router-dom";

export const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await apiService.getCustomers();
        setCustomers(res.data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Customers</h1>
            <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                    <input className="p-2 border rounded" placeholder="Search customers..." />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
                </div>
                <Link to="/customers/new" className="px-3 py-2 border rounded">
                    New Customer
                </Link>
            </div>

            <div className="bg-white border rounded">
                {loading ? (
                    <div className="p-4">Loading...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Name</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-2">{c.name}</td>
                                    <td className="p-2">{c.phone}</td>
                                    <td className="p-2">
                                        <Link to={`/customers/${c.id}`} className="text-blue-600">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
