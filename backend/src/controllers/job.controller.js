import { Job } from "../models/Job.models.js";

export const getJobs = async (req, res) => {
    const jobs = await Job.find().populate("customer");
    res.json(jobs);
};

export const createJob = async (req, res) => {
    try {
        const newJob = await Job.create(req.body);
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
