const Todo = require('../models/Todo');

const todoController = {
    async createTodo (req, res){
        try{
            const {userId} = req.params;
            const {title, description} = req.body;
            const createAt = new Date();
            const todo = new Todo();
            const todoId = await todo.createToDo(userId, title, description, createAt);
            res.status(200).json({todoId});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error creating todo list', err});
        }
    },
    async getTodosByUserId(req, res){
        try{
            const {userId} = req.params;
            const todo = new Todo();
            const todos = await todo.getTodosByUserId(userId);
            res.status(200).json(todos || []);
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error getting todos', err});
        }
    },
    async getTodoById(req, res){
        try{
            const {todoId} = req.params;
            const todo = new Todo();
            const result = await todo.getTodoById(todoId);
            if(!result){
                return res.status(404).json({message: 'Todo list not found'});
            }
            res.status(200).json(result);
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error getting todo', err});
        }
    },
    async updateTodoById(req, res){
        try{
            const {todoId} = req.params;
            const {title, description} = req.body;
            const todo = new Todo();
            const result = await todo.updateTodoById(todoId, title, description);
            res.status(200).json(result);
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error updating todo', err});
        }
    },
    async deleteTodoById(req, res){
        try{
            const {todoId} = req.params;
            const todo = new Todo();
            const result = await todo.deleteTodoById(todoId);
            res.status(200).json({message: 'Todo list deleted successfully'});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error deleting todo list', err});
        }
    }
};

module.exports = todoController;