"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctor = exports.deleteDoctor = exports.updateDoctor = exports.createDoctor = exports.GetAllDoctors = void 0;
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const GetAllDoctors = async (req, res, next) => {
    try {
        let query = {};
        if (req.query.speciality) {
            query.speciality = req.query.speciality;
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const { rows: doctors, count: total } = await doctor_model_1.default.findAndCountAll({
            where: query,
            order: [[String(req.query.sort || "name"), "ASC"]],
            limit,
            offset,
        });
        res.status(200).json({
            success: true,
            count: doctors.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: doctors,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.GetAllDoctors = GetAllDoctors;
const createDoctor = async (req, res, next) => {
    try {
        const doctor = await doctor_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: doctor
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createDoctor = createDoctor;
const updateDoctor = async (req, res, next) => {
    try {
        const doctor = await doctor_model_1.default.update(req.body, { where: { id: req.params.id } });
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await doctor_model_1.default.findByPk(req.user.id);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        await doctor.destroy();
        doctor.save();
        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully"
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDoctor = deleteDoctor;
const getDoctor = async (req, res, next) => {
    try {
        const doctor = await doctor_model_1.default.findByPk(req.params.id);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        res.status(200).json({
            success: true,
            data: doctor
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getDoctor = getDoctor;
