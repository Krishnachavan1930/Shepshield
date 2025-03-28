"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVitalSigns = exports.getPatientVitals = void 0;
const vitals_model_1 = __importDefault(require("../models/vitals.model"));
const getPatientVitals = async (req, res, next) => {
    try {
        // const patientVitals = await VitalSigns.findOne({where : {
        //     patientId : req.params.id
        // }});
        const { rows: patientVitals, count: total } = await vitals_model_1.default.findAndCountAll({
            where: { patientId: req.params.id },
            order: [[String("recordedAt"), "ASC"]],
        });
        if (!patientVitals) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        res.status(200).json({
            success: true,
            count: total,
            data: patientVitals
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPatientVitals = getPatientVitals;
const addVitalSigns = async (req, res, next) => {
    try {
        const data = req.body;
        const patientVitals = await vitals_model_1.default.create({
            patientId: req.params.id,
            data
        });
        if (!patientVitals) {
            return res.status(500).json({
                success: false,
                message: "Failed to add patient vitals"
            });
        }
        return res.status(201).json({
            success: true,
            data: patientVitals
        });
    }
    catch (err) {
        next(err);
    }
};
exports.addVitalSigns = addVitalSigns;
