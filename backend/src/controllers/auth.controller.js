import { User } from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

let tokenBlacklist = [];

export const logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });
    tokenBlacklist.push(token);
    res.json({ message: "Logged out successfully" });
};

export const isTokenBlacklisted = (token) => tokenBlacklist.includes(token);

export { registerUser, loginUser };

