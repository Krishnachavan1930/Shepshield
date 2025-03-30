import {DataTypes, Model} from "sequelize";
import sequelize from "../config/db";

class LabResult extends Model{}

LabResult.init({
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        references: {
          model: "patients",
          key: "id",
        },
      },
      testType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      BaseExcess :  {
        type : DataTypes.INTEGER,
      },
      HCO3 : {
        type : DataTypes.INTEGER,
      },
      FiO2 : {
        type : DataTypes.FLOAT,
      },
      pH : {
        type : DataTypes.FLOAT,
      },
      PaCO2 : {
        type : DataTypes.FLOAT,
      },
      SaO2 : {
        type : DataTypes.FLOAT,
      },
      AST : {
        type : DataTypes.FLOAT,
      },
      BUN : {
        type : DataTypes.FLOAT,
      },
      Alkalinephos : {
        type : DataTypes.FLOAT,
      },
      Calcium : {
        type : DataTypes.FLOAT,
      },
      Chloride : {
        type : DataTypes.FLOAT,
      },
      Creatinine : {
        type : DataTypes.FLOAT,
      },
      Bilirubin_direct : {
        type : DataTypes.FLOAT,
      },
      Glucose : {
        type : DataTypes.FLOAT,
      },
      Lactate : {
        type : DataTypes.FLOAT,
      },
      Magnesium : {
        type : DataTypes.FLOAT,
      },
      Phosphate : {
        type : DataTypes.FLOAT,
      },
      Potassium : {
        type : DataTypes.FLOAT,
      },
      Bilirubin_total : {
        type : DataTypes.FLOAT,
      },
      TroponinI : {
        type : DataTypes.FLOAT,
      },
      Hct : {
        type : DataTypes.FLOAT,
      },
      Hgb : {
        type : DataTypes.FLOAT,
      },
      PTT : {
        type : DataTypes.FLOAT,
      },
      WBC : {
        type : DataTypes.FLOAT,
      },
      Fibrinogen : {
        type : DataTypes.FLOAT,
      },
      Platelets : {
        type : DataTypes.FLOAT,
      },
      Age : {
        type : DataTypes.FLOAT,
      },
      Gender : {
        type : DataTypes.FLOAT,
      },
      Unit1 : {
        type : DataTypes.FLOAT,
      },
      Unit2 : {
        type : DataTypes.FLOAT,
      },
      Hour_sin : {
        type : DataTypes.FLOAT,
      },
      Hour_cos : {
        type : DataTypes.FLOAT,
      },
      risk_percent : {
        type : DataTypes.FLOAT,
      },
      risk_level : {
        type : DataTypes.ENUM("High", "Medium", "Low")
      },
      recordedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
},
{
    sequelize,
    modelName : "LabResult",
    timestamps : true,
});

export default LabResult;