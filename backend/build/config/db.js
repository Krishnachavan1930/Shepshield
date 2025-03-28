"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
(0, dotenv_1.configDotenv)();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPortString = process.env.DB_PORT;
let dbPort = undefined;
if (dbPortString) {
    dbPort = parseInt(dbPortString, 10);
    console.log('Port is parsed');
    if (isNaN(dbPort)) {
        console.error("DB PORT Variable not valid number");
        process.exit(1);
    }
    console.log("Port set");
}
else {
    console.error("DB Port not set");
}
const sequelize = new sequelize_1.Sequelize({
    database: dbName,
    username: dbUser,
    password: dbPass,
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Allow self-signed certificates
        }
    },
    logging: console.log,
});
exports.default = sequelize;
