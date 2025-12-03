const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    // Check if user already exists
    const existingUsers = await User.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      address, 
      role 
    });

    // Generate JWT token
    const payload = {
      user: {
        id: result.insertId,
        email,
        role: role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'store_rating_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: result.insertId,
        name,
        email,
        address,
        role
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'store_rating_jwt_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('Change password request for user:', userId);

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }

    // Validate new password
    if (newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be between 8 and 16 characters' 
      });
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must contain at least one uppercase letter and one special character' 
      });
    }

    // Get user from database
    const users = await User.findById(userId);
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await User.updatePassword(userId, hashedPassword);
    
    if (result.affectedRows === 0) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update password' 
      });
    }

    console.log('Password updated successfully for user:', userId);
    
    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = {
  register,
  login,
  changePassword
};