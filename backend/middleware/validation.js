const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .optional()
    .isIn(['user', 'store_owner', 'admin'])
    .withMessage('Role must be user, store_owner, or admin'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateStoreCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name must be between 1 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email for the store')
    .normalizeEmail(),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('owner_id')
    .isInt()
    .withMessage('Owner ID must be a valid integer'),
  handleValidationErrors
];

const validateRating = [
  body('store_id')
    .isInt()
    .withMessage('Store ID must be a valid integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  handleValidationErrors
];

const validateChangePassword = [
  body('currentPassword')
    .exists()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateStoreCreation,
  validateRating,
  validateChangePassword,
  handleValidationErrors
};