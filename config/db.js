const mysql = require('mysql2/promise');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'yhZApge06HwfPspi',
    database: 'todo_app',
    port: 3306
};
const pool = mysql.createPool(dbConfig);
module.exports = pool;



