"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictIo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid Authorization. Please login first or strict action will be taken"
            });
        }
        const decoded_token = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = await user_model_1.default.findByPk(decoded_token.id);
        if (!currentUser) {
            res.status(401).json({
                success: false,
                message: "The user belonging to this token no longer exists"
            });
        }
        req.user = currentUser;
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
exports.protect = protect;
const restrictIo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }
        next();
    };
};
exports.restrictIo = restrictIo;
