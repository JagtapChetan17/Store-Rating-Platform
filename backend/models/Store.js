// backend/models/store.js
const db = require('../config/database');

const Store = {
  create: async (storeData) => {
    const { name, email, address, owner_id } = storeData;
    const query = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, address, owner_id]);
    return result;
  },

  getAll: async (filters) => {
    let query = `
      SELECT s.*, u.name as owner_name, 
      COALESCE(AVG(r.rating), 0) as average_rating 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    if (filters.email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    
    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    
    query += ' GROUP BY s.id ORDER BY s.name ASC';
    
    const [rows] = await db.execute(query, params);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT s.*, u.name as owner_name, 
      COALESCE(AVG(r.rating), 0) as average_rating 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE s.id = ?
      GROUP BY s.id
    `;
    const [rows] = await db.execute(query, [id]);
    return rows;
  },

  getByOwnerId: async (ownerId) => {
    const query = 'SELECT * FROM stores WHERE owner_id = ?';
    const [rows] = await db.execute(query, [ownerId]);
    return rows;
  },

  search: async (searchTerm) => {
    const query = `
      SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating 
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE s.name LIKE ? OR s.address LIKE ?
      GROUP BY s.id ORDER BY average_rating DESC
    `;
    const [rows] = await db.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
    return rows;
  }
};

module.exports = Store;