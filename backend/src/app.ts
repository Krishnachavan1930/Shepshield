import { configDotenv } from "dotenv";
import express from "express";
configDotenv();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("Server running on PORT", PORT);
})