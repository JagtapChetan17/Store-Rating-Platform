const express = require('express');
const router = express.Router();
const { getStoreRatings } = require('../controllers/storeOwnerController');
const auth = require('../middleware/auth');

router.use(auth('store_owner'));
router.get('/ratings', getStoreRatings);

module.exports = router;