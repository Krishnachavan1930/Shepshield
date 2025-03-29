import { configDotenv } from "dotenv";
import express from "express";
import AuthRoutes from "./routes/auth.routes";
import DoctorRoutes from "./routes/doctors.routes";
configDotenv();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/doctors", DoctorRoutes);

// Basic GET route
app.get("/", (req, res) => {
  res.send("SepShield API is running");
});

app.listen(PORT as number, "0.0.0.0", () => {
  console.log(`Server running on PORT ${PORT}`);
});