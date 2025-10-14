import { Job } from "../models/Job.models.js";
import { Customer } from "../models/Customer.models.js";

// Get all jobs (Admin & Manager)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("customer", "name email phone")
            .populate("technician", "name email");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get job by ID (Admin, Manager, Technician)
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("customer", "name email phone")
            .populate("technician", "name email");
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create job (Admin, Manager, Receptionist)
const createJob = async (req, res) => {
    try {
        const { customer, laptopModel, issue, preferredTechnician, status } = req.body;

        const customerExists = await Customer.findById(customer);
        if (!customerExists) return res.status(404).json({ message: "Customer not found" });

        const job = await Job.create({
            customer,
            laptopModel,
            issue,
            preferredTechnician,
            status: status || "Received",
            createdBy: req.user._id
        });

        const populatedJob = await job.populate("customer", "name email phone")
            .populate("technician", "name email");

        res.status(201).json(populatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update job (Admin, Manager, Technician)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (req.user.role === "Technician") {
            // Technician can only update status and repair details
            const { status, repairDetails } = req.body;
            if (status) job.status = status;
            if (repairDetails) job.repairDetails = repairDetails;
        } else {
            // Admin & Manager can update everything
            Object.assign(job, req.body);
        }

        await job.save();

        const updatedJob = await job.populate("customer", "name email phone")
            .populate("technician", "name email");

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete job (Admin & Manager)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
};
