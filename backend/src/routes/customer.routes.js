import express from "express";
import { getCustomers, addCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.route("/").get(getCustomers);
router.route("/").post(addCustomer);

export default router;
