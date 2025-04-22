import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import scheduleRoutes from "./routes/schedule.route.js";
import truckRoutes from "./routes/truck.route.js";
import userRoutes from "./routes/user.route.js";
import specialCollectionRoutes from "./routes/specialCollection.route.js";
import requestTrackingDeviceRoutes from "./routes/requestDevice.route.js";
import wasteDeviceRoutes from "./routes/device.route.js"; // Import the wasteDeviceRoutes
import paymentRoutes from "./routes/payment.route.js";

// Load environment variables
dotenv.config();

// Validate required env vars
const requiredEnvVars = ["MONGO_URI", "PORT"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ ERROR: ${envVar} is not defined in the .env file.`);
    process.exit(1);
  }
});

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS (allow frontend to access APIs with cookies)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Ensure this is correct
app.use(cors({
  origin: FRONTEND_URL, // Allow frontend to access the API
  credentials: true, // Allow cookies if you're using them
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/users", userRoutes);
app.use("/api/special-collections", specialCollectionRoutes);
app.use("/api/devices/request", requestTrackingDeviceRoutes);
app.use("/api/devices", wasteDeviceRoutes); // Ensure this route is correctly mapped
app.use("/api/payments", paymentRoutes);

// Fallback route for unmatched paths
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const isDev = process.env.NODE_ENV === "development"; 
  console.error(isDev ? err.stack : "❌ Server Error:", message);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
