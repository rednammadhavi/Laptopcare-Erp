import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        deviceType: {
            type: String,
            required: true,
            default: "Laptop"
        },
        brand: {
            type: String,
            default: ""
        },
        model: {
            type: String,
            default: ""
        },
        serialNumber: {
            type: String,
            default: ""
        },
        issue: {
            type: String,
            required: true
        },
        problemDescription: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium"
        },
        status: {
            type: String,
            enum: ["New", "Diagnosing", "In Progress", "Waiting for Parts", "Ready for Pickup", "Completed", "Cancelled"],
            default: "New"
        },
        estimatedCost: Number,
        actualCost: Number,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);