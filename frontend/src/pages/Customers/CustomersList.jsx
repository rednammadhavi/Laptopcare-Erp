import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/apiService";

export const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCustomers = async () => {
        try {
            const res = await apiService.getCustomers();
            setCustomers(res.data);
        } catch (err) {
            console.error("Error fetching customers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Customers</h1>
                <Link
                    to="/customers/new"
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                    Add New
                </Link>
            </div>

            <div className="bg-white border rounded">
                {loading ? (
                    <div className="p-4 text-gray-600">Loading...</div>
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
                                <tr key={c._id} className="border-t">
                                    <td className="p-2">{c.name}</td>
                                    <td className="p-2">{c.phone}</td>
                                    <td className="p-2">
                                        <Link
                                            to={`/customers/${c._id}`}
                                            className="text-blue-600"
                                        >
                                            View/Edit
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
