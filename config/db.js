require('dotenv').config();
const mysql = require('mysql2/promise');

let dbConfig;

if (process.env.RAILWAY_ENVIRONMENT) {
    // Railway database connection
    dbConfig = {
        host: process.env.MYSQLHOST || 'mysql.railway.internal',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE || 'railway',
        port: process.env.MYSQLPORT || 3306
    };
} else {
    // Local database connection
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE || !process.env.DB_PORT) {
        throw new Error("Missing database environment variables");
    }

    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    };
}

const pool = mysql.createPool(dbConfig);
module.exports = pool;
