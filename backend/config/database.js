// backend/config/database.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'store_rating_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a promise based interface to the pool
const promisePool = pool.promise();

module.exports = promisePool;