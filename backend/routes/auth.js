const express = require('express');
const router = express.Router();
const { register, login, changePassword, testTimestamps } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin,
  validatePasswordChange 
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
router.put('/change-password', 
  auth(), // First authenticate
  validatePasswordChange, // Then validate input
  changePassword // Finally process
);

// @route   GET /api/auth/test-timestamps
// @desc    Test user timestamps
// @access  Private
router.get('/test-timestamps', auth(), testTimestamps);

// @route   GET /api/auth/test-auth
// @desc    Test authentication
// @access  Private
router.get('/test-auth', auth(), (req, res) => {
  res.json({ 
    success: true,
    message: 'Authentication is working!',
    user: req.user 
  });
});

module.exports = router;