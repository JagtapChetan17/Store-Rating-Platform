const Rating = require('../models/Rating');
const Store = require('../models/Store');

const getStoreRatings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const stores = await Store.getByOwnerId(owner_id);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'No store found for this user' });
    }

    const storeId = stores[0].id;

    const ratings = await Rating.getStoreRatings(storeId);

    const storeDetails = await Store.getById(storeId);

    res.json({
      store: storeDetails[0],
      ratings: ratings
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStoreRatings
};