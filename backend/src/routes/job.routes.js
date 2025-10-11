import express from "express";
import { getJobs, createJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/").get(getJobs);
router.route("/").post(createJob);

export default router;
