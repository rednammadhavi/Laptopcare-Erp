import { Job } from "../models/Job.models.js";
import { Customer } from "../models/Customer.models.js";

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

// Create job (Admin, Manager, Receptionist)
const createJob = async (req, res) => {
    try {
        const { title, description, assignedTo, status } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const job = await Job.create({
            title,
            description,
            assignedTo,
            status: status || "Pending",
            createdBy: req.user.id,
        });

        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Error creating job", error: error.message });
    }
};


// Update job (Role-based)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (req.user.role === "technician") {
            if (job.technician?.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }

            const allowedFields = ["status", "repairDetails", "actualCost"];
            for (const field of allowedFields) {
                if (req.body[field] !== undefined) job[field] = req.body[field];
            }
        } else {
            Object.assign(job, req.body);
        }

        await job.save();

        const updatedJob = await job
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

// Delete job (Admin, Manager)
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
