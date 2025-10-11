import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobId: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    deviceType: String,
    issueDescription: String,
    status: { type: String, default: "Pending" },
    assignedTo: String,
    estimatedCost: Number,
    createdAt: { type: Date, default: Date.now }
});

export const Job = mongoose.model("Job", jobSchema);
