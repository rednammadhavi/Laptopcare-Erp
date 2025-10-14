import express from "express";
import {
    registerTechnician,
    loginTechnician,
    getTechnicians,
    getTechnician,
    updateTechnician,
    deleteTechnician
} from "../controllers/technician.controller.js";

const router = express.Router();

// Auth routes
router.route("/register").post(registerTechnician);
router.route("/login").post(loginTechnician);

// CRUD routes
router.route("/").get(getTechnicians);
router.route("/:id")
    .get(getTechnician)
    .put(updateTechnician)
    .delete(deleteTechnician);

export default router;
