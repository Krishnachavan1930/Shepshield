"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_1.MONGO_URI);
        console.log(`MongoDB Connected ${conn.connection.host}`);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};
exports.connectDB = connectDB;
