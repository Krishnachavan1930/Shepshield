import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8080;

// Define microservices and their routes
const services: { [key: string]: string } = {
  "/auth": "http://localhost:5001",
  "/notifications": "http://localhost:5003",
  "/patients": "http://localhost:5002",
  "/predictions": "http://localhost:5004",
  "/reports": "http://localhost:5005",
};

// Set up proxy routes
Object.entries(services).forEach(([route, target]) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "" },
    })
  );
});

// Start the API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
