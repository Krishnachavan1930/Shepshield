import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const SERVICES = {
  userService: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
  patientService: process.env.PATIENT_SERVICE_URL || "http://localhost:5002",
  notificationService: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5003",
  predictionService: process.env.PREDICTION_SERVICE_URL || "http://localhost:5004",
  reportService: process.env.REPORT_SERVICE_URL || "http://localhost:5005",
};

app.use("/auth", createProxyMiddleware({ target: SERVICES.userService, changeOrigin: true }));
app.use("/notifications", createProxyMiddleware({ target: SERVICES.notificationService, changeOrigin: true }));
app.use("/patients", createProxyMiddleware({ target: SERVICES.patientService, changeOrigin: true }));
app.use("/predictions", createProxyMiddleware({ target: SERVICES.predictionService, changeOrigin: true }));
app.use("/reports", createProxyMiddleware({ target: SERVICES.reportService, changeOrigin: true }));

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API Gateway Running" });
});

// Start the Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
