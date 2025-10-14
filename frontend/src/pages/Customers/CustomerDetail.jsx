import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../../services/apiService";

export const CustomerDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = id === "new";

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        preferredTechnician: "",
    });
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const techRes = await apiService.getUsers({ role: "technician" });
                setTechnicians(techRes.data);

                if (!isNew) {
                    const res = await apiService.getCustomer(id);
                    setFormData(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) await apiService.createCustomer(formData);
            else await apiService.updateCustomer(id, formData);
            navigate("/customers");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">
                {isNew ? "Add New Customer" : "Edit Customer"}
            </h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Preferred Technician</label>
                        <select
                            name="preferredTechnician"
                            value={formData.preferredTechnician}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Technician</option>
                            {technicians.map((t) => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            {isNew ? "Create" : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
