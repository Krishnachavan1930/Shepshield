import dotenv from "dotenv";

dotenv.config();

export const PORT:number = parseInt(process.env.PORT as string);
export const DBName:string = process.env.DB_NAME as string;
export const DBUser:string = process.env.DB_USER as string;
export const DBPass:string = process.env.DB_PASS as string;
export const DBHost:string = process.env.DB_HOST as string;
export const DBPort = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const MONGO_URI = process.env.MONGO_URI as string;