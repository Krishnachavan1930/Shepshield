"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Doctor extends sequelize_1.Model {
}
Doctor.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    speciality: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    experience: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    qualifications: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.default,
    modelName: "Doctor",
    timestamps: true,
});
exports.default = Doctor;
