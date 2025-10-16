import { User } from "../models/User.models.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate role
        const validRoles = ["admin", "manager", "technician"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login user with role validation
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role)
            return res
                .status(400)
                .json({ message: "Please provide email, password and role" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user role matches requested role
        if (user.role !== role) {
            return res.status(401).json({
                message: `Invalid credentials for ${role} role`
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        res.json({ message: "Password reset token generated", resetToken });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user details
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update user details
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) user.password = req.body.password;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUser,
    updateUser,
};