import { Job } from "../models/Job.models.js";
import { Inventory } from "../models/Inventory.models.js";

const getReports = async (req, res) => {
    const totalJobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: "Pending" });
    const inventoryItems = await Inventory.countDocuments();

    res.json({
        totalJobs,
        pendingJobs,
        inventoryItems,
        generatedAt: new Date(),
    });
};

export { getReports };