import {DataTypes, Model} from "sequelize";
import sequelize from "../config/db";

class User extends Model{
  public id!: number;
  public password! : string;
}

User.init({
    id : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
      primaryKey : true,
    },
    name : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    email :{
      type : DataTypes.STRING,
      allowNull : false,
      unique : true,
    },
    password_hash : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    role : {
      type : DataTypes.ENUM("doctor", "nurse", "admin"),
      allowNull : false,
    },
    department: {
        type : DataTypes.ENUM("ICU", "Emergency", "General Medicine", "Cardiology", "Neurology", "Surgery", "Pediatrics"),
        allowNull : false,     
    },
    avatar : {
        type : DataTypes.STRING,
        defaultValue : "default-avatar.jpg"
    }
  },
  {
    sequelize,
    timestamps : true,
    modelName : 'user'
  });
  
  export default User;
  