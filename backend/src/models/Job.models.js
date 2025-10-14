import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        description: String,
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },
        scheduledDate: Date,
    }, { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
