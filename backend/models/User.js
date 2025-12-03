const db = require('../config/database');

const User = {
  create: async (userData) => {
    const { name, email, password, address, role } = userData;
    const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [name, email, password, address, role || 'user']);
    return result;
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows;
  },

  updatePassword: async (id, password) => {
    console.log(`Updating password for user ID: ${id} at ${new Date().toISOString()}`);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    try {
      const [result] = await db.query(query, [password, id]);
      console.log(`Password update result: ${result.affectedRows} rows affected`);
      return result;
    } catch (error) {
      console.error('Database error in updatePassword:', error);
      throw error;
    }
  },

  getAll: async (filters) => {
    let query = 'SELECT * FROM users WHERE 1=1';
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
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  update: async (id, userData) => {
    const { name, email, address, role } = userData;
    const query = 'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?';
    const [result] = await db.query(query, [name, email, address, role, id]);
    return result;
  },

  // Helper method to format dates
  formatDate: (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  }
};

module.exports = User;