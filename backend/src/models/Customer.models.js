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
    }, { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
