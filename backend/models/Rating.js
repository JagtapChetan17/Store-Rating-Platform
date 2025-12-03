const db = require('../config/database');

const Rating = {
  createOrUpdate: async (ratingData) => {
    const { user_id, store_id, rating } = ratingData;
    const query = `
      INSERT INTO ratings (user_id, store_id, rating) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE rating = ?, updated_at = CURRENT_TIMESTAMP
    `;
    const [result] = await db.execute(query, [user_id, store_id, rating, rating]);
    return result;
  },

  getUserRating: async (user_id, store_id) => {
    const query = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
    const [rows] = await db.execute(query, [user_id, store_id]);
    return rows;
  },

  getStoreRatings: async (store_id) => {
    const query = `
      SELECT r.*, u.name as user_name 
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.execute(query, [store_id]);
    return rows;
  },

  getStats: async () => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM stores) as total_stores,
        (SELECT COUNT(*) FROM ratings) as total_ratings,
        (SELECT COUNT(DISTINCT store_id) FROM ratings) as rated_stores
    `;
    const [rows] = await db.execute(query);
    return rows;
  }
};

module.exports = Rating;