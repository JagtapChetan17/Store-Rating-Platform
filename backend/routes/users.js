const express = require('express');
const router = express.Router();
const { getStores, submitRating, getUserRating } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// All routes are protected
router.use(auth());

// @route   GET /api/users/stores
// @desc    Get all stores with search
// @access  Private
router.get('/stores', getStores);

// @route   POST /api/users/ratings
// @desc    Submit or update a rating
// @access  Private
router.post('/ratings', validateRating, submitRating);

// @route   GET /api/users/ratings/:store_id
// @desc    Get user's rating for a store
// @access  Private
router.get('/ratings/:store_id', getUserRating);

module.exports = router;