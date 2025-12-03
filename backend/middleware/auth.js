const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'No token provided' 
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'store_rating_jwt_secret');
      req.user = decoded.user;

      // Check role
      if (roles.length > 0 && !roles.includes(decoded.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
  };
};

module.exports = auth;