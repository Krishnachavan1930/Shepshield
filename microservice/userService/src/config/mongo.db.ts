import mongoose from "mongoose";
import { MONGO_URI } from "./config";

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected ${conn.connection.host}`);

    }catch(err){
        console.error(err);
        throw err;
    }
}