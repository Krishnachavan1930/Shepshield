"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.Register);
router.post('/login', auth_controller_1.Login);
router.post('/logout', auth_controller_1.Logout);
router.get('/me', auth_middleware_1.protect, auth_controller_1.GetMe);
router.put('/update-password', auth_middleware_1.protect, auth_controller_1.updatePassword);
router.put('/update-me', auth_middleware_1.protect, auth_controller_1.updateMe);
exports.default = router;
