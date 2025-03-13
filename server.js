const express = require('express');
const dbPool = require('./config/db');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
const uploadsDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

(async () => {
    try{
        const connection = await dbPool.getConnection();

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users
            (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                profile_picture VARCHAR(255)
            )
            `);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS todos
            (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            `);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tasks
            (
                id INT PRIMARY KEY AUTO_INCREMENT,
                todo_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                due_date DATE,
                status ENUM('pending', 'in progress','blocked', 'cancelled' ,'completed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (todo_id) REFERENCES todos(id)
            )
            `);
        console.log('Database tables created');
        
    } catch(err){
        console.error('Error connecting to the database: ', err);
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});