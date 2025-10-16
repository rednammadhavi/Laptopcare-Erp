import express from "express";
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getTechnicians,
    getMyCustomers
} from "../controllers/customer.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get technicians for dropdown (Admin & Manager only)
router.get("/technicians/list", authorizeRoles('admin', 'manager'), getTechnicians);

// Get technician's assigned customers
router.get("/my-customers", authorizeRoles('technician'), getMyCustomers);

// Customer routes with role-based access
router.route("/")
    .get(authorizeRoles('admin', 'manager', 'technician'), getCustomers)
    .post(authorizeRoles('admin', 'manager'), createCustomer);

router.route("/:id")
    .get(authorizeRoles('admin', 'manager', 'technician'), getCustomer)
    .put(authorizeRoles('admin', 'manager', 'technician'), updateCustomer)
    .delete(authorizeRoles('admin', 'manager'), deleteCustomer);

export default router;