const Rating = require('../models/Rating');
const Store = require('../models/Store');

const getStoreRatings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // First get the store owned by this user
    const stores = await Store.getByOwnerId(owner_id);
    if (stores.length === 0) {
      return res.status(404).json({ 
        message: 'No store found for this user. Please contact admin to create a store.' 
      });
    }

    const storeId = stores[0].id;

    // Get ratings for this store
    const ratings = await Rating.getStoreRatings(storeId);

    // Get average rating
    const storeDetails = await Store.getById(storeId);

    res.json({
      store: storeDetails[0],
      ratings: ratings
    });
  } catch (error) {
    console.error('Get store ratings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStoreRatings
};