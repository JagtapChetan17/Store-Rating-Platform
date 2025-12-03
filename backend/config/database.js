const mysql = require('mysql2');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'store_rating_platform';

const setupConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

const promisePool = pool.promise();

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    await setupConnection.promise().query(`
      CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
      DEFAULT CHARACTER SET utf8mb4
      COLLATE utf8mb4_general_ci
    `);

    await setupConnection.promise().query(`USE \`${DB_NAME}\``);

    console.log('Creating tables...');

    await setupConnection.promise().query("DROP TABLE IF EXISTS ratings");
    await setupConnection.promise().query("DROP TABLE IF EXISTS stores");
    await setupConnection.promise().query("DROP TABLE IF EXISTS users");

    await setupConnection.promise().query(`
      CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(191) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('admin','user','store_owner') DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('Users table created');

    await setupConnection.promise().query(`
      CREATE TABLE stores (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(191) NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY email (email),
        KEY owner_id (owner_id),
        CONSTRAINT stores_ibfk_1
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('Stores table created');

    await setupConnection.promise().query(`
      CREATE TABLE ratings (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_user_store (user_id, store_id),
        KEY store_id (store_id),
        CONSTRAINT ratings_ibfk_1
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT ratings_ibfk_2
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('Ratings table created');

    console.log('Database setup completed successfully');

  } catch (err) {
    console.error("Database setup error:", err);
  } finally {
    setupConnection.end();
  }
}

setupDatabase();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection from pool:', err.message);
  } else {
    console.log('Database pool connected successfully');
    connection.release();
  }
});

pool.on('acquire', (connection) => {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
  console.log('Connection %d released', connection.threadId);
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = promisePool;
