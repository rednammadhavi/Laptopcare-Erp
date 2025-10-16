import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/my-jobs", authorizeRoles("technician"), getMyJobs);

router
    .route("/")
    .get(authorizeRoles("admin", "manager", "technician"), getAllJobs)
    .post(authorizeRoles("admin", "manager"), createJob);

router
    .route("/:id")
    .get(authorizeRoles("admin", "manager", "technician"), getJobById)
    .put(authorizeRoles("admin", "manager", "technician"), updateJob)
    .delete(authorizeRoles("admin", "manager"), deleteJob);

export default router;
