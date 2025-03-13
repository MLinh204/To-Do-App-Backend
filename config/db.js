require('dotenv').config();
const mysql = require('mysql2/promise');

let dbConfig;

if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        port: url.port || 3306
    };
} else if (process.env.RAILWAY_ENVIRONMENT) {
    // Fallback to individual environment variables if DATABASE_URL is not set
    dbConfig = {
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE || 'railway',
        port: process.env.MYSQLPORT || 3306
    };
} else {
    // Local database connection
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'todo_app',
        port: process.env.DB_PORT || 3306
    };
}

if (!dbConfig.password) {
    throw new Error("Database password is missing! Check your environment variables.");
}

const pool = mysql.createPool(dbConfig);
module.exports = pool;
