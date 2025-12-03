const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

const validateUserRegistration = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter and one special character (!@#$%^&*)'),
  body('address')
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .optional()
    .isIn(['user', 'store_owner', 'admin'])
    .withMessage('Role must be one of: user, store_owner, admin'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateStoreCreation = [
  body('name')
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name must be between 1 and 60 characters'),
  body('email')
    .notEmpty().withMessage('Store email is required')
    .isEmail()
    .withMessage('Please include a valid email for the store'),
  body('address')
    .notEmpty().withMessage('Store address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('owner_id')
    .notEmpty().withMessage('Owner ID is required')
    .isInt()
    .withMessage('Owner ID must be a number'),
  handleValidationErrors
];

const validateRating = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('store_id')
    .notEmpty().withMessage('Store ID is required')
    .isInt()
    .withMessage('Store ID must be a number'),
  handleValidationErrors
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('New password must contain at least one uppercase letter and one special character (!@#$%^&*)'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateStoreCreation,
  validateRating,
  validatePasswordChange,
  handleValidationErrors
};