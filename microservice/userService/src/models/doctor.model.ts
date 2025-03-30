import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Doctor extends Model {}

Doctor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {  // ✅ Changed to snake_case for PostgreSQL compatibility
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.BIGINT, // ✅ Changed to BIGINT to handle long numbers
      allowNull: false,
    },
    created_at: {  // ✅ Explicitly defining timestamps in snake_case
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Doctor",
    tableName: "doctor",
    timestamps: true, // Sequelize will now use "created_at" and "updated_at"
    underscored: true, // ✅ Makes Sequelize use snake_case for timestamps
  }
);

export default Doctor;
