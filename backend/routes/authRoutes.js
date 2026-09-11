const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authLimiter = require('../middleware/rateLimiter');
const { registerValidation, loginValidation } = require('../middleware/validation');
const authenticateToken = require('../middleware/authMiddleware');

// Auth endpoints
router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
