import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
configDotenv();

const dbName:string = process.env.DB_NAME as string;
const dbUser:string = process.env.DB_USER as string;
const dbPass:string = process.env.DB_PASS as string;
const dbHost:string = process.env.DB_HOST as string;
const dbPortString : string = process.env.DB_PORT as string;
let dbPort = undefined;
if(dbPortString){
    dbPort = parseInt(dbPortString, 10);
    console.log('Port is parsed');
    if(isNaN(dbPort)){
        console.error("DB PORT Variable not valid number");
        process.exit(1);
    }
    console.log("Port set");
}else{
    console.error("DB Port not set");
}

const sequelize = new Sequelize({
    database : dbName,
    username : dbUser,
    password : dbPass,
    host : dbHost,
    port : dbPort,
    dialect : 'postgres',
    dialectOptions :{
        ssl: {
            require: true,
            rejectUnauthorized: false // Allow self-signed certificates
          }
    },
    logging : console.log,
    
});


export default sequelize;