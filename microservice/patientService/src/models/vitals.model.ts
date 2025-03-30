import {DataTypes, Model} from "sequelize";
import sequelize from "../config/db";

class VitalSigns extends Model{
    public id! : number;
    public patientId! : number;
    public Temp : any;
    public HR? : number;
    public Resp? : number;
    public SBP? : number;
    public MAP? : number;
    public DBP? : number;
    public O2Sat? : any;
}

VitalSigns.init({
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },
    patientId : {
        type : DataTypes.INTEGER,
        references : {
            model : "patients",
            key : "id"
        },
    },
    Temp : {
        type : DataTypes.FLOAT,
        allowNull : false,
    },
    HR : {
        type : DataTypes.INTEGER,
    },
    Resp : {
        type : DataTypes.INTEGER,
    },
    SBP : {
        type : DataTypes.INTEGER
    },
    MAP : {
        type : DataTypes.INTEGER,
      },
      DBP : {
        type : DataTypes.INTEGER
      },
      O2Sat: {
        type: DataTypes.FLOAT,
      },
      recordedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
},
{
    sequelize,
    modelName : "VitalSigns",
    timestamps : true,
});

export default VitalSigns;