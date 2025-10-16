import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: String,
        email: String,
        address: String,
        preferredTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // New fields for problem tracking
        problemDescription: {
            type: String,
            default: ""
        },
        deviceType: {
            type: String,
            enum: ["Laptop", "Desktop", "Tablet", "Other"],
            default: "Laptop"
        },
        brand: String,
        model: String,
        status: {
            type: String,
            enum: ["New", "Diagnosing", "In Progress", "Waiting for Parts", "Ready for Pickup", "Completed", "Cancelled"],
            default: "New"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium"
        },
        estimatedCompletion: Date,
        notes: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Customer = mongoose.model("Customer", customerSchema);