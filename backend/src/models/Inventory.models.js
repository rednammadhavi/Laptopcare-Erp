import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        price: Number,
    }, { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
