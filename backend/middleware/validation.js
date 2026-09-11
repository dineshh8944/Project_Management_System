const { body, validationResult } = require('express-validator');

// Helper to handle validation error responses
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Register Validation Rules
const registerValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

// Login Validation Rules
const loginValidation = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Project Creation/Editing Validation Rules
const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('status')
    .optional()
    .isIn(['Not Started', 'In Progress', 'Completed'])
    .withMessage('Invalid project status value'),
  body('start_date')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid YYYY-MM-DD date'),
  body('end_date')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid YYYY-MM-DD date'),
  validate
];

// Task Creation/Editing Validation Rules
const taskValidation = [
  body('name').trim().notEmpty().withMessage('Task name is required'),
  body('project_id').isInt().withMessage('Valid project_id is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid task priority value'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Invalid task status value'),
  body('due_date')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid YYYY-MM-DD date'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  projectValidation,
  taskValidation
};
