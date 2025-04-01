import dotenv from "dotenv";
import express, { Request, Response } from "express";

import cors from "cors";
import morgan from "morgan";
dotenv.config({path : "./.env"});

// Import Routes
import emailRoutes from "./routes/emailRoutes";
import whatsappRoutes from "./routes/whatsappRoutes";

// Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan("dev")); // Log requests
console.log(process.env.PORT);
// Routes
app.use("/api/email", emailRoutes);
app.use("/api/wp", whatsappRoutes);
app.use('/', async(req : Request, res : Response)=>{
  res.send("Notification service up and running");
});
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
