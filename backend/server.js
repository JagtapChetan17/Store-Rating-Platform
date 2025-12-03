const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://store-rating-platform.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/store-owner', storeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Store Rating Platform API',
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Store Rating Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      users: '/api/users',
      storeOwner: '/api/store-owner'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    user: req.user
  });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=== SERVER STARTED ===`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_NAME || 'store_rating_platform'}`);
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default'}`);
});