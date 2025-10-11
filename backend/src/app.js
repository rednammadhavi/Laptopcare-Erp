import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import jobRoutes from "./routes/job.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import reportRoutes from "./routes/report.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);

export { app }
