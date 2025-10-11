import { Customer } from "../models/Customer.models.js";

const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
};

const addCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export { getCustomers, addCustomer };
