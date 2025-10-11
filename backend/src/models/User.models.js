import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "technician", "receptionist", "manager"], default: "receptionist" },
});

export const User = mongoose.model("User", userSchema);
