"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
    id;
    password;
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("doctor", "nurse", "admin"),
        allowNull: false,
    },
    department: {
        type: sequelize_1.DataTypes.ENUM("ICU", "Emergency", "General Medicine", "Cardiology", "Neurology", "Surgery", "Pediatrics"),
        allowNull: false,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "default-avatar.jpg"
    }
}, {
    sequelize: db_1.default,
    timestamps: true,
    modelName: 'user'
});
exports.default = User;
