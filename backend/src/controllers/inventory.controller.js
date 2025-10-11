import { Inventory } from "../models/Inventory.models.js";

export const getInventory = async (req, res) => {
    const items = await Inventory.find();
    res.json(items);
};

export const addInventory = async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
