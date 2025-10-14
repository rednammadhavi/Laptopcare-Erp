import express from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.route("/")
    .get(getAllInventory)
    .post(authorizeRoles("Admin", "Manager"), createInventory);

router.route("/:id")
    .get(getInventoryById)
    .put(authorizeRoles("Admin", "Manager"), updateInventory)
    .delete(authorizeRoles("Admin", "Manager"), deleteInventory);

export default router;
