// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  createUser, 
  createStore, 
  getUsers, 
  getStores, 
  getUserDetails 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { validateUserRegistration, validateStoreCreation } = require('../middleware/validation');

// All routes are protected and require admin role
router.use(auth('admin'));

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard/stats', getDashboardStats);

// @route   POST /api/admin/users
// @desc    Create a new user
// @access  Private (Admin)
router.post('/users', validateUserRegistration, createUser);

// @route   POST /api/admin/stores
// @desc    Create a new store
// @access  Private (Admin)
router.post('/stores', validateStoreCreation, createStore);

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin)
router.get('/users', getUsers);

// @route   GET /api/admin/stores
// @desc    Get all stores with filters
// @access  Private (Admin)
router.get('/stores', getStores);

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Private (Admin)
router.get('/users/:id', getUserDetails);

module.exports = router;