import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true, default: 0
        },
        price: {
            type: Number,
            required: true
        },
        supplier: {
            type: String
        },
        description: {
            type: String
        },
    }, { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
