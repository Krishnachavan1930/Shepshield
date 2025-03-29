"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI = exports.NODE_ENV = exports.JWT_SECRET = exports.DBPort = exports.DBHost = exports.DBPass = exports.DBUser = exports.DBName = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = parseInt(process.env.PORT);
exports.DBName = process.env.DB_NAME;
exports.DBUser = process.env.DB_USER;
exports.DBPass = process.env.DB_PASS;
exports.DBHost = process.env.DB_HOST;
exports.DBPort = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.NODE_ENV = process.env.NODE_ENV;
exports.MONGO_URI = process.env.MONGO_URI;
