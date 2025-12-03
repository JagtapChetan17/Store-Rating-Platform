const db = require('../config/database');

const User = {
  create: async (userData) => {
    try {
      const { name, email, password, address, role } = userData;
      const query = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
      const [result] = await db.execute(query, [name, email, password, address, role || 'user']);
      return result;
    } catch (error) {
      console.error('User.create error:', error.message);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await db.execute(query, [email]);
      return rows;
    } catch (error) {
      console.error('User.findByEmail error:', error.message);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const query = 'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error('User.findById error:', error.message);
      throw error;
    }
  },

  updatePassword: async (id, password) => {
    try {
      console.log('Executing update password query for user:', id);
      const query = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const [result] = await db.execute(query, [password, id]);
      console.log('Update password result:', result);
      return result;
    } catch (error) {
      console.error('User.updatePassword error:', error.message);
      console.error('SQL Query:', query);
      console.error('Parameters:', [password, id]);
      throw error;
    }
  },

  getAll: async (filters) => {
    try {
      let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
      const params = [];
      
      if (filters && filters.name) {
        query += ' AND name LIKE ?';
        params.push(`%${filters.name}%`);
      }
      
      if (filters && filters.email) {
        query += ' AND email LIKE ?';
        params.push(`%${filters.email}%`);
      }
      
      if (filters && filters.address) {
        query += ' AND address LIKE ?';
        params.push(`%${filters.address}%`);
      }
      
      if (filters && filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('User.getAll error:', error.message);
      throw error;
    }
  }
};

module.exports = User;