import { Job } from "../models/Job.models.js";
import { Customer } from "../models/Customer.models.js";
import { User } from "../models/User.models.js";

// Get all jobs (Admin, Manager, Technician)
const getAllJobs = async (req, res) => {
    try {
        let jobs;
        const role = req.user.role;

        if (role === "technician") {
            jobs = await Job.find({ technician: req.user._id })
                .populate("customer", "name email phone")
                .populate("technician", "name email");
        } else {
            jobs = await Job.find()
                .populate("customer", "name email phone")
                .populate("technician", "name email");
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error in getAllJobs:", error);
        res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
    }
};

// Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("customer", "name email phone")
            .populate("technician", "name email");

        if (!job) return res.status(404).json({ message: "Job not found" });

        // Technicians can only access jobs assigned to them
        if (
            req.user.role === "technician" &&
            job.technician?._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error("Error in getJobById:", error);
        res.status(500).json({ message: "Failed to fetch job details", error: error.message });
    }
};

// Create job (Admin & Manager only - enforced by route middleware)
const createJob = async (req, res) => {
    try {
        const {
            customer,
            technician,
            deviceType,
            brand,
            model,
            serialNumber,
            issue,
            problemDescription,
            priority,
            status,
            estimatedCost
        } = req.body;

        // Validate required fields
        if (!customer || !technician || !issue) {
            return res.status(400).json({
                message: "Customer, technician, and issue are required fields"
            });
        }

        // Verify customer exists
        const customerExists = await Customer.findById(customer);
        if (!customerExists) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Verify technician exists and has technician role
        const technicianUser = await User.findById(technician);
        if (!technicianUser || technicianUser.role !== 'technician') {
            return res.status(400).json({ message: "Invalid technician selected" });
        }

        const job = await Job.create({
            customer,
            technician,
            deviceType: deviceType || "Laptop",
            brand,
            model,
            serialNumber,
            issue,
            problemDescription,
            priority: priority || "Medium",
            status: status || "New",
            estimatedCost,
            createdBy: req.user._id,
        });

        // Populate the created job with customer and technician details
        const populatedJob = await Job.findById(job._id)
            .populate("customer", "name email phone")
            .populate("technician", "name email");

        res.status(201).json({
            message: "Job created successfully",
            job: populatedJob
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({
            message: "Error creating job",
            error: error.message
        });
    }
};

// Update job (Role-based)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Role-based update restrictions
        if (req.user.role === "technician") {
            // Technicians can only update jobs assigned to them
            if (job.technician?.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Technicians can only update specific fields
            const allowedFields = ["status", "problemDescription", "actualCost"];
            const updateData = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });

            // Apply updates
            Object.assign(job, updateData);
        } else {
            // Admin & Manager can update all fields except createdBy
            const updateData = { ...req.body };
            delete updateData.createdBy;

            // Validate technician if changing
            if (updateData.technician && updateData.technician !== job.technician?.toString()) {
                const technicianUser = await User.findById(updateData.technician);
                if (!technicianUser || technicianUser.role !== 'technician') {
                    return res.status(400).json({ message: "Invalid technician selected" });
                }
            }

            Object.assign(job, updateData);
        }

        await job.save();

        const updatedJob = await Job.findById(job._id)
            .populate("customer", "name email phone")
            .populate("technician", "name email");

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Error in updateJob:", error);
        res.status(500).json({ message: "Failed to update job", error: error.message });
    }
};

// Delete job (Admin & Manager only - enforced by route middleware)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error in deleteJob:", error);
        res.status(500).json({ message: "Failed to delete job", error: error.message });
    }
};

// Get technician's jobs
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ technician: req.user._id })
            .populate("customer", "name email phone")
            .populate("technician", "name email");

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error in getMyJobs:", error);
        res.status(500).json({ message: "Failed to fetch technician jobs", error: error.message });
    }
};

export {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
};