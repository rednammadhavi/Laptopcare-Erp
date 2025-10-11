import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    itemName: String,
    quantity: Number,
    reorderLevel: Number,
    price: Number,
    supplier: String,
    lastUpdated: { type: Date, default: Date.now }
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
