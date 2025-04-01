import { configDotenv } from "dotenv";

configDotenv();


export const USER_DB_NAME = process.env.USER_DB_NAME;
export const USER_DB_USER = process.env.USER_DB_USER;
export const USER_DB_PASS = process.env.USER_DB_PASS;
export const USER_DB_HOST = process.env.USER_DB_HOST;
export const USER_DB_PORT = process.env.USER_DB_PORT;
