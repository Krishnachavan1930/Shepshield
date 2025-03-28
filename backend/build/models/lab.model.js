"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class LabResult extends sequelize_1.Model {
}
LabResult.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patientId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Patients",
            key: "id",
        },
    },
    testType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    BaseExcess: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    HCO3: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    FiO2: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    pH: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    PaCO2: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    SaO2: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    AST: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    BUN: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Alkalinephos: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Calcium: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Chloride: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Creatinine: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Bilirubin_direct: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Glucose: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Lactate: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Magnesium: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Phosphate: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Potassium: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Bilirubin_total: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    TroponinI: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Hct: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Hgb: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    PTT: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    WBC: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Fibrinogen: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Platelets: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Age: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Gender: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Unit1: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Unit2: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Hour_sin: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    Hour_cos: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    risk_percent: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    risk_level: {
        type: sequelize_1.DataTypes.ENUM("High", "Medium", "Low")
    },
    recordedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: "LabResult",
    timestamps: true,
});
exports.default = LabResult;
