"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLabResult = exports.getPatientLab = void 0;
const lab_model_1 = __importDefault(require("../models/lab.model"));
const getPatientLab = async (req, res, next) => {
    try {
        const pid = req.params.id;
        if (!pid) {
            return res.status(400).json({
                success: false,
                message: "Please enter patient id"
            });
        }
        const { rows: patientLab, count: total } = await lab_model_1.default.findAndCountAll({
            where: { patientId: pid },
            order: [[String("recordedAt"), "ASC"]],
        });
        if (!patientLab) {
            return res.status(404).json({
                success: false,
                message: "Patient Lab details not found"
            });
        }
        return res.status(200).json({
            success: true,
            count: total,
            data: patientLab
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPatientLab = getPatientLab;
const addLabResult = async (req, res, next) => {
    try {
        const data = req.body;
        const labResult = await lab_model_1.default.create({
            patientId: req.params.id,
            data
        });
        res.status(201).json({
            success: true,
            data: labResult
        });
    }
    catch (err) {
        next(err);
    }
};
exports.addLabResult = addLabResult;
