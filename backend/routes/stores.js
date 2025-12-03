const express = require('express');
const router = express.Router();
const { getStoreRatings } = require('../controllers/storeOwnerController');
const auth = require('../middleware/auth');

// All routes are protected and require store_owner role
router.use(auth('store_owner'));

// @route   GET /api/store-owner/ratings
// @desc    Get ratings for the owner's store
// @access  Private (Store Owner)
router.get('/ratings', getStoreRatings);

module.exports = router;