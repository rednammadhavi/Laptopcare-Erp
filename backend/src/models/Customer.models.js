import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

export const Customer = mongoose.model("Customer", customerSchema);
