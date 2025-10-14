import express from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} from "../controllers/job.controller.js";

const router = express.Router();

// Admin & Manager: Full access
router.route("/")
    .get(authorizeRoles("Admin", "Manager"), getAllJobs)
    .post(authorizeRoles("Admin", "Manager", "Receptionist"), createJob);

router.route("/:id")
    .get(authorizeRoles("Admin", "Manager", "Technician"), getJobById)
    .put(authorizeRoles("Admin", "Manager", "Technician"), updateJob)
    .delete(authorizeRoles("Admin", "Manager"), deleteJob);

export default router;