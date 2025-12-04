const express = require('express');
const router = express.Router();
const { getStores, submitRating, getUserRating } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

router.use(auth());
router.get('/stores', getStores);
router.post('/ratings', validateRating, submitRating);
router.get('/ratings/:store_id', getUserRating);

module.exports = router;