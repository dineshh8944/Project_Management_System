const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authMiddleware');
const { projectValidation } = require('../middleware/validation');

// Protect all project routes
router.use(authenticateToken);

router.get('/', projectController.getProjects);
router.get('/stats/dashboard', projectController.getDashboardStats);
router.get('/:id', projectController.getProjectById);
router.post('/', projectValidation, projectController.createProject);
router.put('/:id', projectValidation, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
