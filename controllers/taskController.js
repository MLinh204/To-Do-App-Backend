const Task = require('../models/Task');

const taskController = {
    async createTask(req, res){
        try{
            const{todoId} = req.params;
            const {title, description, dueDate} = req.body;
            const status = 'pending';
            const task = new Task();
            const result = await task.createTask(todoId, title, description, dueDate, status);
            res.status(200).json({message: 'Task created successfully', result});
        }
        catch(err){
            console.error(err);
            res.status(500).json({message: 'Error creating task', err});
        }
    },
    async getTasksByTodoId(req, res){
        try{
            const {todoId} = req.params;
            const task = new Task();
            const tasks = await task.getTasksByTodoId(todoId);
            if(tasks.length === 0){
                return res.status(404).json({message: 'No tasks found'});
            }
            res.status(200).json(tasks);
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error getting tasks', err});
        }
    },
    async getTaskById(req, res){
        try{
            const {taskId} = req.params;
            const task = new Task();
            const result = await task.getTaskById(taskId);
            if(!result){
                return res.status(404).json({message: 'Task not found'});
            }
            res.status(200).json(result);
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error getting task', err});
        }
    },
    async updateTaskStatus(req, res){
        try{
            const {taskId} = req.params;
            const {status} = req.body;
            const task = new Task();
            const result = await task.updateTaskStatus(taskId, status);
            if(!result){
                return res.status(404).json({message: 'Task not found'});
            }
            res.status(200).json({message: 'Task status updated successfully', result});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error updating task status', err});
        }
    },
    async updateTask(req, res){
        try{
            const {taskId} = req.params;
            const {title, description, due_date, status} = req.body;
            const task = new Task();
            const result = await task.updateTask(taskId, title, description, due_date, status);
            if(!result){
                return res.status(404).json({message: 'Task not found'});
            }
            res.status(200).json({message: 'Task updated successfully', result});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error updating task', err});
        }
    },
    async deleteTask(req, res){
        try{
            const {taskId} = req.params;
            const task = new Task();
            const result = await task.deleteTask(taskId);
            if(!result){
                return res.status(404).json({message: 'Task not found'});
            }
            res.status(200).json({message: 'Task deleted successfully'});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error deleting task', err});
        }
    }
};

module.exports = taskController;