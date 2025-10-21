import { Job } from "../models/Job.models.js";
import { Inventory } from "../models/Inventory.models.js";

const getReports = async (req, res) => {
    const [totalJobs, completedJobs, pendingJobs, totalInventory, lowStock] = await Promise.all([
        Job.countDocuments(),
        Job.countDocuments({ status: "Completed" }),
        Job.countDocuments({ status: { $nin: ["Completed", "Cancelled"] } }),
        Inventory.countDocuments(),
        Inventory.countDocuments({ quantity: { $lt: 5 } })
    ]);
    res.json({
        totalJobs, completedJobs, pendingJobs, totalInventory, lowStock, generatedAt: new Date()
    });
};

export { getReports };