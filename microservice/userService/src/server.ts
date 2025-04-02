import dotenv from "dotenv";
import express from "express";
import AuthRoutes from "./routes/auth.routes";
import DoctorRoutes from "./routes/doctors.routes";
import sequelize from "./config/db";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

// Log the path to see where it is loading the .env file from

// Load the .env file
dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(
  cors({
    origin: 'http://localhost:8080', // Allow only your frontend
    credentials: true, // If using cookies or Authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(cookieParser());
// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/doctors", DoctorRoutes);


app.listen(PORT as number, "0.0.0.0", async() => {
  console.log(`Server running on PORT ${PORT}`);
});