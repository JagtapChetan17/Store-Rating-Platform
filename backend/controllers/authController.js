const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    // Check if user already exists
    const existingUsers = await User.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      address, 
      role 
    });

    // Get the created user with timestamps
    const newUsers = await User.findById(result.insertId);
    const newUser = newUsers[0];
    
    console.log('New user created with ID:', result.insertId);
    console.log('Created at:', newUser.created_at);
    console.log('Updated at:', newUser.updated_at);

    // Generate JWT token
    const payload = {
      user: {
        id: result.insertId,
        email,
        role: role,
        name: name
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log('Password change request body:', req.body);
    console.log('Authenticated user:', req.user);
    
    const { currentPassword, newPassword } = req.body;
    
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Both currentPassword and newPassword are required' 
      });
    }
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id;

    // Get user from database
    const users = await User.findById(userId);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    console.log('Found user in database:', user.email);
    console.log('Current user timestamps - Created:', user.created_at, 'Updated:', user.updated_at);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'New password must be a string' });
    }
    
    if (newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({ 
        message: 'New password must be between 8 and 16 characters' 
      });
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      return res.status(400).json({ 
        message: 'New password must contain at least one uppercase letter and one special character (!@#$%^&*)' 
      });
    }

    // Hash new password
    console.log('Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('Password hashed successfully');

    // Update password
    await User.updatePassword(userId, hashedPassword);
    console.log('Password updated in database');

    // Get updated user to check new timestamps
    const updatedUsers = await User.findById(userId);
    const updatedUser = updatedUsers[0];
    console.log('Updated user timestamps - Created:', updatedUser.created_at, 'Updated:', updatedUser.updated_at);
    
    res.json({ 
      success: true,
      message: 'Password updated successfully',
      timestamps: {
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Test endpoint to check user timestamps
const testTimestamps = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const users = await User.findById(userId);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        created_at_formatted: new Date(user.created_at).toLocaleString(),
        updated_at_formatted: new Date(user.updated_at).toLocaleString(),
        is_updated: user.created_at !== user.updated_at
      }
    });
  } catch (error) {
    console.error('Test timestamps error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  testTimestamps
};