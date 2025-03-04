const pool = require('../config/db');


class Todo {
    constructor(){
        this.pool = pool;
    }
    async createToDo(userId, title, description, createAt){
        const query = `INSERT INTO todos (user_id, title, description, created_at) VALUES (?, ?, ?, ?)`;
        const [result] = await this.pool.query(query, [userId, title, description, createAt]);
        return result.insertId;
    }
    async getTodosByUserId(userId){
        const query = `SELECT * FROM todos WHERE user_id = ?`;
        const [result] = await this.pool.query(query, [userId]);
        return result;
    }
    async getTodoById(todoId){
        const query = `SELECT * FROM todos WHERE id = ?`;
        const [result] = await this.pool.query(query, [todoId]);
        return result[0];
    }
    async updateTodoById(todoId, title, description){
        const query = `UPDATE todos SET title = ?, description = ? WHERE id = ?`;
        await this.pool.query(query, [title, description, todoId]);

        const [rows] = await this.pool.query(`SELECT * FROM todos WHERE id = ?`, [todoId]);
        return rows[0];
    }
    async deleteTodoById(todoId){
        const query = `DELETE FROM todos WHERE id = ?`;
        const [result] = await this.pool.query(query, [todoId]);
        return result.affectedRows;
    }
}

module.exports = Todo;