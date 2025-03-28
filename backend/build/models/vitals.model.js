"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class VitalSigns extends sequelize_1.Model {
    id;
    patientId;
    Temp;
    HR;
    Resp;
    SBP;
    MAP;
    DBP;
    O2Sat;
}
VitalSigns.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patientId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Patients",
            key: "id"
        },
    },
    Temp: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    HR: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    Resp: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    SBP: {
        type: sequelize_1.DataTypes.INTEGER
    },
    MAP: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    DBP: {
        type: sequelize_1.DataTypes.INTEGER
    },
    O2Sat: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    recordedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: "VitalSigns",
    timestamps: true,
});
exports.default = VitalSigns;
