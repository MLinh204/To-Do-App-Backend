const pool = require('../config/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class User {
    constructor(){
        this.pool = pool;

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = path.join(__dirname, '../uploads/profiles');
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                cb(null, dir);
            },
            filename: (req, file, cb) => {
              const userId = req.params.userId || 'unknown';
              cb(null, `profile_${userId}_${Date.now()}${path.extname(file.originalname)}`);            },
          });
          this.upload = multer({ storage: this.storage });
    }
    async createUser(email, username, password){
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;
        const [result] = await this.pool.query(query, [email, username, hashedPassword]);
        return result.insertId;
    }
    async getUserByEmail(email){
        const query = `SELECT * FROM users WHERE email = ?`;
        const [users] = await this.pool.query(query, [email]);
        return users[0];
    }
    async getUserById(id){
        const query = `SELECT * FROM users WHERE id = ?`;
        const [users] = await this.pool.query(query, [id]);
        return users[0];
    }
    async updateUserById(id, email, username, password){
        const query = `UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?`;
        await this.pool.query(query, [email, username, password, id]);

        const [rows] = await this.pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        return rows[0];
    }
    async deleteUserById(id){
        const query = `DELETE FROM users WHERE id = ?`;
        const [result] = await this.pool.query(query, [id]);
        return result;
    }
    async updateProfilePicture(userId, imagePath) {
        const query = 'UPDATE users SET profile_picture = ? WHERE id = ?';
        await this.pool.query(query, [imagePath, userId]);
    }
    
    getUploadMiddleware() {
        return this.upload.single('profilePicture');
    }
}

module.exports = User;