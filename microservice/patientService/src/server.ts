import { configDotenv } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import sequelize from "./config/db";
import morgan from "morgan"
import PatientRoutes from "./routes/patient.routes";
import AnalyticsRoutes from "./routes/analytics.routes";
configDotenv();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));

app.use('/api/patients', PatientRoutes);
app.use('/api/analytics', AnalyticsRoutes);


app.use("/", (req : Request, res : Response)=>{
    res.send('SepShield API is running');
})

app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  });

app.listen(PORT, async()=>{
    await sequelize.sync({force : true});
    console.log("Server running on PORT", PORT);
})