const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const { taskValidation } = require('../middleware/validation');

// Protect all task routes
router.use(authenticateToken);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskValidation, taskController.createTask);
router.put('/:id', taskValidation, taskController.updateTask);
router.patch('/:id/status', taskController.patchTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
