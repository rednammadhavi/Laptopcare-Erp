import { Job } from "../models/Job.models.js";

// Get jobs
const getJobs = async (req, res) => {
    const jobs = await Job.find()
        .populate("customer", "name")
        .populate("technician", "name");
    res.json(jobs);
};

// Create job
const createJob = async (req, res) => {
    const job = await Job.create(req.body);
    res.status(201).json(job);
};

// Update job
const updateJob = async (req, res) => {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
};

// Delete job
const deleteJob = async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
};


export {
    getJobs,
    createJob,
    updateJob,
    deleteJob
};
