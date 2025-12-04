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
    
    res.json(stores);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    await Rating.createOrUpdate({ user_id, store_id, rating });
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStores,
  submitRating,
  getUserRating
};