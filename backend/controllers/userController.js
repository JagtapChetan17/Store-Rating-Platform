const Store = require('../models/Store');
const Rating = require('../models/Rating');

const getStores = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    let stores;
    
    if (searchTerm) {
      stores = await Store.search(searchTerm);
    } else {
      stores = await Store.getAll({});
    }
    
    // Get user's rating for each store
    const user_id = req.user.id;
    const storesWithUserRating = await Promise.all(stores.map(async (store) => {
      const userRating = await Rating.getUserRating(user_id, store.id);
      return {
        ...store,
        user_rating: userRating.length > 0 ? userRating[0].rating : null
      };
    }));
    
    res.json(storesWithUserRating);
  } catch (error) {
    console.error('Get stores error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Check if store exists
    const store = await Store.getById(store_id);
    if (store.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await Rating.createOrUpdate({ user_id, store_id, rating });
    
    // Get updated rating
    const updatedRating = await Rating.getUserRating(user_id, store_id);
    
    res.json({ 
      message: 'Rating submitted successfully',
      rating: updatedRating[0]
    });
  } catch (error) {
    console.error('Submit rating error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { store_id } = req.params;
    const user_id = req.user.id;

    const ratings = await Rating.getUserRating(user_id, store_id);
    res.json(ratings.length > 0 ? ratings[0] : { rating: null });
  } catch (error) {
    console.error('Get user rating error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStores,
  submitRating,
  getUserRating
};