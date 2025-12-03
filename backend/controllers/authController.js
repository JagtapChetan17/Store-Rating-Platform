const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;
    console.log('Register attempt for:', email);

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ 
        success: false,
        message: 'Name must be between 20 and 60 characters' 
      });
    }

    // Validate address length
    if (address.length > 400) {
      return res.status(400).json({ 
        success: false,
        message: 'Address must not exceed 400 characters' 
      });
    }

    // Check if user already exists
    const existingUsers = await User.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
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

    if (!result || !result.insertId) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create user in database' 
      });
    }

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
      process.env.JWT_SECRET || 'store_rating_platform_jwt_secret_key_2024',
      { expiresIn: '7d' }
    );

    // Get user data without password
    const userData = await User.findById(result.insertId);

    if (!userData || userData.length === 0) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to retrieve user data after creation' 
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData[0];

    res.status(201).json({ 
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Register error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if user exists
    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
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
      process.env.JWT_SECRET || 'store_rating_platform_jwt_secret_key_2024',
      { expiresIn: '7d' }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

const changePassword = async (req, res) => {
  let connection;
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('=== CHANGE PASSWORD REQUEST ===');
    console.log('User ID from token:', userId);
    console.log('User from token:', req.user);

    // Validate input
    if (!currentPassword || !newPassword) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }

    // Validate new password
    if (newPassword.length < 8 || newPassword.length > 16) {
      console.log('Password length validation failed');
      return res.status(400).json({ 
        success: false,
        message: 'New password must be between 8 and 16 characters' 
      });
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      console.log('Password complexity validation failed');
      return res.status(400).json({ 
        success: false,
        message: 'New password must contain at least one uppercase letter and one special character' 
      });
    }

    // Get user from database
    console.log('Fetching user from database for ID:', userId);
    const users = await User.findById(userId);
    
    if (!users || users.length === 0) {
      console.error('User not found in database for ID:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = users[0];
    console.log('User found in DB:', { 
      id: user.id, 
      email: user.email,
      hasPassword: !!user.password
    });

    // Verify current password
    console.log('Verifying current password...');
    console.log('User password from DB:', user.password ? 'Exists' : 'Missing');
    console.log('Current password provided:', currentPassword ? 'Yes' : 'No');
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be different from current password' 
      });
    }

    // Hash new password
    console.log('Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('New password hashed successfully');

    console.log('Updating password in database...');
    // Update password
    const result = await User.updatePassword(userId, hashedPassword);
    
    console.log('Update result:', result);
    
    if (!result) {
      console.error('Update password returned null result');
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update password - no result from database' 
      });
    }

    if (result.affectedRows === 0) {
      console.error('No rows affected by update');
      return res.status(500).json({ 
        success: false,
        message: 'Failed to update password - user not found in database' 
      });
    }

    console.log('Password updated successfully!');
    console.log('Rows affected:', result.affectedRows);
    
    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('=== CHANGE PASSWORD ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        success: false,
        message: 'Database table not found. Please check database setup.' 
      });
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ 
        success: false,
        message: 'Database access denied. Please check database credentials.' 
      });
    }
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({ 
        success: false,
        message: 'Database not found. Please create the database first.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  changePassword
};