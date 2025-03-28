import {DataTypes, Model} from "sequelize";
import sequelize from "../config/db";

class Doctor extends Model{}

Doctor.init({
    id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    speciality : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    bio : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    imageUrl : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    position : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    experience : {
        type: DataTypes.INTEGER,
        allowNull : false,
    },
    qualifications : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        allowNull : false,
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    phone : {
        type : DataTypes.INTEGER,
        allowNull : false,
    }
},{
    sequelize,
    modelName : "Doctor",
    timestamps : true,
});


export default Doctor;