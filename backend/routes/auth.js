const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin,
  validateChangePassword 
} = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateUserRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, login);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth(), validateChangePassword, changePassword);

module.exports = router;