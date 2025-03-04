const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const {verifyToken} = require('../middleware/authMiddleware');

router.post('/create/user/:userId', verifyToken, todoController.createTodo);
router.get('/getTodos/:userId', verifyToken, todoController.getTodosByUserId);
router.get('/getTodo/:todoId', verifyToken, todoController.getTodoById);
router.put('/update/:todoId', verifyToken, todoController.updateTodoById);
router.delete('/delete/:todoId', verifyToken, todoController.deleteTodoById);

module.exports = router;