import express from "express";
import {
    getJobs,
    createJob,
    updateJob,
    deleteJob
} from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getJobs).post(createJob);
router.route("/:id").put(updateJob).delete(deleteJob);

export default router;
