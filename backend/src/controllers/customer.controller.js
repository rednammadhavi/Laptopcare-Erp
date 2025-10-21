import { Customer } from "../models/Customer.models.js";
import { User } from "../models/User.models.js";

// Get all customers
const getCustomers = async (req, res) => {
    try {
        let customers;

        if (req.user.role === "technician") {
            // Technicians only see customers assigned to them
            customers = await Customer.find({
                preferredTechnician: req.user._id
            }).populate("preferredTechnician", "name email");
        } else if (req.user.role === "receptionist") {
            // Receptionists can see all customers but can't see technician assignments in some cases
            customers = await Customer.find().populate("preferredTechnician", "name email");
        } else {
            // Admin & Manager see all customers
            customers = await Customer.find().populate("preferredTechnician", "name email");
        }

        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single customer
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate("preferredTechnician", "name email");

        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // Technicians can only access customers assigned to them
        if (req.user.role === "technician" &&
            customer.preferredTechnician?._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create customer (Admin & Manager only)
const createCustomer = async (req, res) => {
    try {
        const data = {
            ...req.body,
            createdBy: req.user._id // Track who created the customer
        };

        // Validate preferredTechnician if provided
        if (data.preferredTechnician && data.preferredTechnician !== "") {
            const technician = await User.findById(data.preferredTechnician);
            if (!technician || technician.role !== 'technician') {
                return res.status(400).json({ message: "Invalid technician selected" });
            }
        } else {
            delete data.preferredTechnician;
        }

        const customer = await Customer.create(data);
        const populatedCustomer = await customer.populate("preferredTechnician", "name email");

        res.status(201).json(populatedCustomer);
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update customer (Admin & Manager can update all, Technicians can update status/notes)
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        let data = { ...req.body };

        // Role-based update restrictions
        if (req.user.role === "technician") {
            // Technicians can only update status and notes for their assigned customers
            if (customer.preferredTechnician?.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Only allow updating specific fields
            const allowedUpdates = ["status", "notes", "estimatedCompletion"];
            data = {};
            allowedUpdates.forEach(field => {
                if (req.body[field] !== undefined) {
                    data[field] = req.body[field];
                }
            });
        } else if (req.user.role === "receptionist") {
            // Receptionists can update basic customer info but not technician assignments
            const allowedUpdates = ["name", "email", "phone", "address", "deviceType", "brand", "model", "problemDescription", "notes"];
            data = {};
            allowedUpdates.forEach(field => {
                if (req.body[field] !== undefined) {
                    data[field] = req.body[field];
                }
            });

            // Receptionists cannot change technician assignment or status beyond "New"
            if (req.body.status && req.body.status !== "New") {
                return res.status(403).json({ message: "Receptionists can only set status to 'New'" });
            }
        } else {
            // Admin & Manager can update everything except createdBy
            delete data.createdBy;

            // Validate technician if changing
            if (data.preferredTechnician && data.preferredTechnician !== "") {
                const technician = await User.findById(data.preferredTechnician);
                if (!technician || technician.role !== 'technician') {
                    return res.status(400).json({ message: "Invalid technician selected" });
                }
            }
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true, runValidators: true }
        ).populate("preferredTechnician", "name email");

        res.json(updatedCustomer);
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete customer (Admin & Manager only)
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get technicians for dropdown
const getTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' }).select('name email');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get technician's assigned customers
const getMyCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({
            preferredTechnician: req.user._id
        }).populate("preferredTechnician", "name email");

        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getTechnicians,
    getMyCustomers
};