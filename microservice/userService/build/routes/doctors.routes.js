"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctors_controller_1 = require("../controllers/doctors.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', doctors_controller_1.GetAllDoctors);
router.get('/:id', doctors_controller_1.getDoctor);
router.use(auth_middleware_1.protect);
router.post('/', (0, auth_middleware_1.restrictIo)('admin'), doctors_controller_1.createDoctor);
router.put('/:id', (0, auth_middleware_1.restrictIo)('admin'), doctors_controller_1.updateDoctor);
router.delete('/:id', (0, auth_middleware_1.restrictIo)('admin'), doctors_controller_1.deleteDoctor);
exports.default = router;
