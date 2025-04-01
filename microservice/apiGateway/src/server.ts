import express, { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import axios, {AxiosError} from "axios";
import cors from "cors";
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

app.use(cors({
  origin: 'http://localhost:8080', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));
const checkServices = async (
  url: string,
  method: 'options' | 'get' | 'head' = 'options',
  timeout: number = 3000
): Promise<boolean> => {
  try {
    let response;
    switch (method) {
      case 'get':
        response = await axios.get(url, { timeout });
        break;
      case 'head':
        response = await axios.head(url, { timeout });
        break;
      case 'options':
      default:
        response = await axios.options(url, { timeout });
        break;
    }
    console.log(`Service check for ${url} (${method}): Status ${response.status}`);
    return response.status >= 200 && response.status < 300; // Success range
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      console.error(`Service ${url} responded with status: ${error.response.status}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`Connection refused for ${url}: Server may be down`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`Timeout for ${url}: Server didn’t respond in ${timeout}ms`);
    } else {
      console.error(`Error checking ${url}: ${error.message}`);
    }
    return false;
  }
};


app.get('/api/checkStatus', async (req: Request, res: Response) => {
  try {
    const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://default-url:port';
    const [mlModelStatus, alertSystemStatus] = await Promise.all([
      checkServices('http://localhost:5004/', 'get'), 
      checkServices(notificationUrl, 'get'),
    ]);

    const dbStatus = true; 

    console.log('Service statuses:', { mlModelStatus, alertSystemStatus, dbStatus });

    res.status(200).json({
      mlModelStatus,
      alertSystemStatus,
      dbStatus,
    });
  } catch (err) {
    console.error('Error in /api/checkStatus:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
