const express = require('express');
const taskController = require('../controller/task');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/tasks', verifyToken, taskController.createTask);

router.get('/tasks', verifyToken,  taskController.getAllTasks);

router.get('/tasks/:id', verifyToken, taskController.getTaskById);

router.patch('/tasks/:id', verifyToken, taskController.UpdateTaskInfo);

router.delete('/tasks/:id',verifyToken, taskController.deleteTask);


module.exports = router;
