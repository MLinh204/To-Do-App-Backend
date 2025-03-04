const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const {verifyToken} = require('../middleware/authMiddleware');

router.post('/create/:todoId', verifyToken, taskController.createTask);
router.get('/getTasks/:todoId', verifyToken, taskController.getTasksByTodoId);
router.get('/getTask/:taskId', verifyToken, taskController.getTaskById);
router.put('/update/:taskId', verifyToken, taskController.updateTask);
router.put('/updateStatus/:taskId', verifyToken, taskController.updateTaskStatus);
router.delete('/delete/:taskId', verifyToken, taskController.deleteTask);

module.exports = router;
