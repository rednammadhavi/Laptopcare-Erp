import React, { useEffect, useState } from "react";
import { getInventory } from "../api/api";

export const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await getInventory();
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter items based on search input
    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                Loading inventory...
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Spare Parts Inventory
            </h2>

            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Inventory Grid */}
            {filteredItems.length === 0 ? (
                <p className="text-center text-gray-500">No items found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white shadow-lg rounded-2xl overflow-hidden border hover:shadow-2xl transition"
                        >
                            <img
                                src={
                                    item.image ||
                                    "https://cdn-icons-png.flaticon.com/512/2689/2689493.png"
                                }
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500">{item.category}</p>

                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-700">
                                        💰 <span className="font-medium">₹{item.price}</span>
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${item.quantity < 5 ? "text-red-500" : "text-green-600"
                                            }`}
                                    >
                                        Stock: {item.quantity}
                                    </p>
                                </div>

                                {item.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
