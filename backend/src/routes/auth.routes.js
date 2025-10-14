import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUser,
    updateUser
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/me").get(verifyJWT, getUser).put(verifyJWT, updateUser);

export default router;
