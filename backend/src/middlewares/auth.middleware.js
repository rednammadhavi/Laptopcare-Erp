import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../controllers/auth.controller.js";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    if (isTokenBlacklisted(token)) return res.status(403).json({ message: "Token invalidated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
