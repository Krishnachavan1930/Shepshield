"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.updatePassword = exports.GetMe = exports.Logout = exports.Login = exports.Register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.getDataValue("id")); // Use Sequelize's getter
    user.setDataValue("password", undefined); // Hide password before sending
    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};
const Register = async (req, res, next) => {
    try {
        console.log("[Register] Route called - Body:", req.body);
        const { name, email, password, role, department } = req.body;
        console.log(name, email, password, role, department);
        console.log("Register Route called");
        if (!name || !email || !password || !role || !department) {
            res.status(400).json({
                success: false,
                message: "Please enter all details"
            });
        }
        const existingUser = await user_model_1.default.findOne({ where: {
                email: email
            } });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }
        const hashed_pw = bcrypt_1.default.hashSync(password, 12);
        const newUser = await user_model_1.default.create({
            name: name,
            email: email,
            password_hash: hashed_pw,
            role: role,
            department: department
        });
        createSendToken(newUser, 201, res);
    }
    catch (err) {
        next(err);
    }
};
exports.Register = Register;
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }
        const user = await user_model_1.default.findOne({ where: {
                email: email
            } });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isCorrect = await bcrypt_1.default.compare(password, user.getDataValue("password"));
        if (!isCorrect) {
            res.status(401).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        createSendToken(user, 200, res);
    }
    catch (err) {
        next(err);
    }
};
exports.Login = Login;
const Logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
exports.Logout = Logout;
const GetMe = async (req, res, next) => {
    try {
        const user = await user_model_1.default.findByPk(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (err) {
        next(err);
    }
};
exports.GetMe = GetMe;
const updatePassword = async (req, res, next) => {
    try {
        const { curretPassword, newPassword } = req.body;
        const user = await user_model_1.default.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isCorrect = await bcrypt_1.default.compare(curretPassword, user.getDataValue('password'));
        if (!isCorrect) {
            res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }
        user.password = newPassword;
        await user.save();
        createSendToken(user, 200, res);
    }
    catch (err) {
        next(err);
    }
};
exports.updatePassword = updatePassword;
const updateMe = async (req, res, next) => {
    try {
        if (req.body.password) {
            res.status(400).json({
                success: false,
                message: "This is not for password updates, Please use /updatePassword route"
            });
        }
        const filteredBody = {};
        const allowedFields = ['name', 'email', 'department', 'avatar'];
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key];
            }
        });
        const updatedUser = await user_model_1.default.update(filteredBody, {
            where: { id: req.user.id },
            returning: true
        });
        res.status(200).json({
            sucess: true,
            user: updatedUser
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateMe = updateMe;
