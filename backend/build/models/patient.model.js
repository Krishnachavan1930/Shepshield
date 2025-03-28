"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabResult = exports.VitalSigns = exports.Patient = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const vitals_model_1 = __importDefault(require("./vitals.model"));
exports.VitalSigns = vitals_model_1.default;
const lab_model_1 = __importDefault(require("./lab.model"));
exports.LabResult = lab_model_1.default;
class Patient extends sequelize_1.Model {
}
exports.Patient = Patient;
Patient.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false,
    },
    admissionDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    department: {
        type: sequelize_1.DataTypes.ENUM("ICU", "Emergency", "General Medicine", "Cardiology", "Neurology", "Surgery", "Pediatrics"),
        allowNull: false,
    },
    medicalRecordNumber: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Active", "Discharged", "Critical"),
        defaultValue: "Active",
    },
    riskScore: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    riskLevel: {
        type: sequelize_1.DataTypes.ENUM("Low", "Medium", "High"),
        defaultValue: "Low",
    },
    medicalHistory: {
        type: sequelize_1.DataTypes.TEXT,
    },
    allergies: {
        type: sequelize_1.DataTypes.TEXT,
    },
    medications: {
        type: sequelize_1.DataTypes.TEXT,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
    },
    assignedDoctor: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "Users",
            key: "id",
        },
    },
}, {
    sequelize: db_1.default,
    modelName: "Patient",
    timestamps: true,
});
Patient.hasMany(vitals_model_1.default, { foreignKey: "patientId" });
vitals_model_1.default.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasMany(lab_model_1.default, { foreignKey: "patientId" });
lab_model_1.default.belongsTo(Patient, { foreignKey: "patientId" });
