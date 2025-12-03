const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      // Get token from header
      let token;
      const authHeader = req.header('Authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7, authHeader.length);
      }
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'No token, authorization denied' 
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'store_rating_platform_jwt_secret_key_2024');
      
      // Get user from database to ensure they still exist
      const users = await User.findById(decoded.user.id);
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: 'User no longer exists' 
        });
      }

      // Add user info to request
      req.user = {
        id: decoded.user.id,
        email: decoded.user.email,
        role: decoded.user.role
      };

      // Check if user has required role
      if (roles.length > 0 && !roles.includes(decoded.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Insufficient permissions.' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired. Please login again.' 
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token. Please login again.' 
        });
      }
      
      res.status(401).json({ 
        success: false,
        message: 'Authentication failed' 
      });
    }
  };
};

module.exports = auth;