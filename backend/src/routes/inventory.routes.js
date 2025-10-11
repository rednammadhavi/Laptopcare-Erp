import express from "express";
import { getInventory, addInventory } from "../controllers/inventory.controller.js";

const router = express.Router();

router.route("/").get(getInventory);
router.route("/").post(addInventory);

export default router;
