const express = require('express');
const router = express.Router();
const { register, login, changePassword, testTimestamps } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin,
  validatePasswordChange 
} = require('../middleware/validation');

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.put('/change-password', 
  auth(), 
  validatePasswordChange, 
  changePassword 
);
router.get('/test-timestamps', auth(), testTimestamps);
router.get('/test-auth', auth(), (req, res) => {
  res.json({ 
    success: true,
    message: 'Authentication is working!',
    user: req.user 
  });
});

module.exports = router;