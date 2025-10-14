import React, { useEffect, useState } from "react";
import {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory,
} from "../api/api";

export const Inventory = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: "", category: "", quantity: 0, price: 0, supplier: "", description: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const data = await getInventory();
        setItems(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateInventory(editingId, form);
            setEditingId(null);
        } else {
            await createInventory(form);
        }
        setForm({ name: "", category: "", quantity: 0, price: 0, supplier: "", description: "" });
        fetchItems();
    };

    const handleEdit = (item) => {
        setForm(item);
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        await deleteInventory(id);
        fetchItems();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

            <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full" />
                <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 w-full" />
                <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="border p-2 w-full" />
                <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 w-full" />
                <input placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="border p-2 w-full" />
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {editingId ? "Update Item" : "Add Item"}
                </button>
            </form>

            <table className="w-full border">
                <thead>
                    <tr className="border">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Supplier</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id} className="border">
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.category}</td>
                            <td className="border p-2">{item.quantity}</td>
                            <td className="border p-2">{item.price}</td>
                            <td className="border p-2">{item.supplier}</td>
                            <td className="border p-2 space-x-2">
                                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
