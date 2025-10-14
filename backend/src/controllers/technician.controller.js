import { Technician } from "../models/Technician.models.js";
import jwt from "jsonwebtoken";

// Utility: Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register Technician
const registerTechnician = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const exists = await Technician.findOne({ email });
        if (exists) return res.status(400).json({ message: "Technician already exists" });

        const technician = await Technician.create({ name, email, password, phone });
        res.status(201).json({
            token: generateToken(technician._id),
            technician: { id: technician._id, name: technician.name, email: technician.email, phone: technician.phone }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login Technician
const loginTechnician = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tech = await Technician.findOne({ email });
        if (tech && await tech.matchPassword(password)) {
            res.json({
                token: generateToken(tech._id),
                technician: { id: tech._id, name: tech.name, email: tech.email, phone: tech.phone }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all Technicians
const getTechnicians = async (req, res) => {
    try {
        const technicians = await Technician.find().select("-password");
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single Technician
const getTechnician = async (req, res) => {
    try {
        const technician = await Technician.findById(req.params.id).select("-password");
        if (!technician) return res.status(404).json({ message: "Technician not found" });
        res.json(technician);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Technician
const updateTechnician = async (req, res) => {
    try {
        const technician = await Technician.findById(req.params.id);
        if (!technician) return res.status(404).json({ message: "Technician not found" });

        technician.name = req.body.name || technician.name;
        technician.email = req.body.email || technician.email;
        technician.phone = req.body.phone || technician.phone;
        if (req.body.password) technician.password = req.body.password;

        await technician.save();
        res.json({ message: "Technician updated successfully", technician });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Technician
const deleteTechnician = async (req, res) => {
    try {
        const technician = await Technician.findById(req.params.id);
        if (!technician) return res.status(404).json({ message: "Technician not found" });

        await technician.remove();
        res.json({ message: "Technician deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export {
    registerTechnician,
    loginTechnician,
    getTechnicians,
    getTechnician,
    updateTechnician,
    deleteTechnician
};
