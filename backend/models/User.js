// backend/models/user.js
const db = require('../config/database');

const User = {
  create: async (userData) => {
    const { name, email, password, address, role } = userData;
    const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, password, address, role || 'user']);
    return result;
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows;
  },

  updatePassword: async (id, password) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await db.execute(query, [password, id]);
    return result;
  },

  getAll: async (filters) => {
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    
    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.execute(query, params);
    return rows;
  }
};

module.exports = User;