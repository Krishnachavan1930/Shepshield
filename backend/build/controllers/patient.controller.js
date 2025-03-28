"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatient = exports.getAllPatients = void 0;
const patient_model_1 = require("../models/patient.model");
const getAllPatients = async (req, res, next) => {
    try {
        let query = {};
        if (req.query.status)
            query.status = req.query.status;
        if (req.query.riskLevel)
            query.riskLevel = req.query.riskLevel;
        if (req.query.department)
            query.department = req.query.department;
        if (req.query.search) {
            query = {};
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const { rows: patient, count: total } = await patient_model_1.Patient.findAndCountAll({
            where: query,
            order: [[String(req.query.sort || "name"), "ASC"]],
            limit,
            offset,
        });
        res.status(200).json({
            success: true,
            count: patient.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: patient
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPatients = getAllPatients;
const getPatient = async (req, res, next) => {
    try {
        const patient = await patient_model_1.Patient.findByPk(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        res.status(200).json({
            success: true,
            data: patient
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPatient = getPatient;
const createPatient = async (req, res, next) => {
    try {
        if (!req.body.riskScore && req.body.vitalSigns) {
            req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
        }
        const patient = await patient_model_1.Patient.create(req.body);
        res.status(201).json({
            success: true,
            data: patient
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createPatient = createPatient;
const updatePatient = async (req, res, next) => {
    try {
        if (req.body.vitalSigns && !req.body.riskScore) {
            req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
        }
        const patient = await patient_model_1.Patient.update(req.body, { where: { id: req.params.id } });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        res.status(200).json({
            success: true,
            data: patient
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res, next) => {
    try {
        const patient = await patient_model_1.Patient.findByPk(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        await patient.destroy();
        return res.status(200).json({
            success: true,
            message: "Patient deleted successfully"
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deletePatient = deletePatient;
const calculateRiskScore = (vitalSigns) => {
    let score = 30;
    if (vitalSigns.Temp > 38.5)
        score += 20;
    else if (vitalSigns.Temp > 38.0)
        score += 10;
    if (vitalSigns.HR > 100)
        score += 20;
    else if (vitalSigns.HR > 90)
        score += 10;
    if (vitalSigns.Resp > 22)
        score += 20;
    else if (vitalSigns.Resp > 20)
        score += 10;
    if (vitalSigns.O2Sat < 92)
        score += 20;
    else if (vitalSigns.O2Sat < 95)
        score += 10;
    return Math.min(score, 100);
};
