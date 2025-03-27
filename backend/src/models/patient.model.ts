import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Patient extends Model {}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    admissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    department: {
      type: DataTypes.ENUM("ICU", "Emergency", "General Medicine", "Cardiology", "Neurology", "Surgery", "Pediatrics"),
      allowNull: false,
    },
    medicalRecordNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Discharged", "Critical"),
      defaultValue: "Active",
    },
    riskScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    riskLevel: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Low",
    },
    medicalHistory: {
      type: DataTypes.TEXT,
    },
    allergies: {
      type: DataTypes.TEXT,
    },
    medications: {
      type: DataTypes.TEXT,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    assignedDoctor: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Patient",
    timestamps: true,
  }
);

class VitalSigns extends Model {}

VitalSigns.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Patients",
        key: "id",
      },
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oxygenSaturation: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "VitalSigns",
    timestamps: true,
  }
);

class LabResult extends Model {}

LabResult.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Patients",
        key: "id",
      },
    },
    testType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
    },
    normalRange: {
      type: DataTypes.STRING,
    },
    isAbnormal: {
      type: DataTypes.BOOLEAN,
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "LabResult",
    timestamps: true,
  }
);

Patient.hasMany(VitalSigns, { foreignKey: "patientId" });
VitalSigns.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(LabResult, { foreignKey: "patientId" });
LabResult.belongsTo(Patient, { foreignKey: "patientId" });

export { Patient, VitalSigns, LabResult };
