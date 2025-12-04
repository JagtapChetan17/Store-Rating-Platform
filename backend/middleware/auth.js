const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
  
      req.user = {
        id: decoded.user.id,
        email: decoded.user.email,
        role: decoded.user.role,
        name: decoded.user.name || ''
      };

      if (roles.length && !roles.includes(decoded.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = auth;