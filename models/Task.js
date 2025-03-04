const pool = require('../config/db');

class Task {
    constructor(){
        this.pool = pool;
    }
    async createTask(todoId, title, description, dueDate, status){
        const query = `INSERT INTO tasks (todo_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await this.pool.query(query, [todoId, title, description, dueDate, status]);
        const [rows] = await this.pool.query(`SELECT * FROM tasks WHERE id = ?`, result.insertId);
        return rows[0];
    }
    async getTasksByTodoId(todoId){
        const query = `SELECT * FROM tasks WHERE todo_id = ?`;
        const [tasks] = await this.pool.query(query, [todoId]);
        return tasks;
    }
    async getTaskById(taskId){
        const query = `SELECT * FROM tasks WHERE id =?`;
        const [tasks] = await this.pool.query(query, [taskId]);
        return tasks[0];
    }
    async updateTask(taskId, title, description, dueDate, status){
        const query = `UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?`;
        const [result] = await this.pool.query(query, [title, description, dueDate, status, taskId]);
        const [rows] = await this.pool.query(`SELECT * FROM tasks WHERE id = ?`, taskId);
        return rows[0];
    }
    async deleteTask(taskId){
        const query = `DELETE FROM tasks WHERE id = ?`;
        const [result] = await this.pool.query(query, [taskId]);
        return result.affectedRows;
    }
    async updateTaskStatus(taskId, status){
        const query = `UPDATE tasks SET status = ? WHERE id = ?`;
        await this.pool.query(query, [status, taskId]);
        const [rows] = await this.pool.query(`SELECT * FROM tasks WHERE id = ?`, taskId);
        return rows[0];
    }
}

module.exports = Task;