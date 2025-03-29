"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8000;
const SERVICES = {
    authService: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
    patientService: process.env.PATIENT_SERVICE_URL || "http://localhost:5002",
    notificationService: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5003",
    predictionService: process.env.PREDICTION_SERVICE_URL || "http://localhost:5004",
    reportService: process.env.REPORT_SERVICE_URL || "http://localhost:5005",
};
// Function to set up a proxy with proper logging
const setupProxy = (path, target) => {
    app.use(path, (0, http_proxy_middleware_1.createProxyMiddleware)({
        target,
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: "" }, // Remove base path before forwarding
        logProvider: () => console, // Ensures logging works
    }) // ✅ Explicitly casting to `any` to bypass TypeScript errors
    );
};
// Set up Proxies
setupProxy("/auth", SERVICES.authService);
setupProxy("/patients", SERVICES.patientService);
setupProxy("/notifications", SERVICES.notificationService);
setupProxy("/predictions", SERVICES.predictionService);
setupProxy("/reports", SERVICES.reportService);
app.get("/", (req, res) => {
    res.json({ message: "API Gateway Running" });
});
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
