import { Customer } from "../models/Customer.models.js";

// Get all customers
const getCustomers = async (req, res) => {
    const customers = await Customer.find().populate("preferredTechnician", "name email");
    res.json(customers);
};

// Get single customer
const getCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id).populate("preferredTechnician", "name email");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
};

// Create customer
const createCustomer = async (req, res) => {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
};

// Update customer
const updateCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
};

// Delete customer
const deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
};


export {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
