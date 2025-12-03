const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  console.log('=== Setting up database ===');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root'
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'store_rating_platform'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database created/verified');
    
    // Use the database
    await connection.query(`USE \`${process.env.DB_NAME || 'store_rating_platform'}\``);
    
    // Drop tables if they exist
    await connection.query('DROP TABLE IF EXISTS ratings');
    await connection.query('DROP TABLE IF EXISTS stores');
    await connection.query('DROP TABLE IF EXISTS users');
    console.log('✅ Old tables dropped');
    
    // Create users table (no CHECK, ENUM as VARCHAR)
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table created');
    
    // Create stores table
    await connection.query(`
      CREATE TABLE stores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        address VARCHAR(255),
        owner_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_owner (owner_id),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Stores table created');
    
    // Create ratings table (remove CHECK, use INT and validate in app)
    await connection.query(`
      CREATE TABLE ratings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_store (user_id, store_id),
        INDEX idx_store (store_id),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Ratings table created');
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const ownerPassword = await bcrypt.hash('Owner@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);
    const testPassword = await bcrypt.hash('Test@123', salt);
    
    // Insert test users
    await connection.query(`
      INSERT INTO users (name, email, password, address, role) VALUES
      ('System Administrator Long Name Example', 'admin@store.com', ?, '123 System Address Street, Admin City, Country', 'admin'),
      ('Store Owner One Long Name Example', 'owner@store.com', ?, '456 Business Avenue, Owner City, Country', 'store_owner'),
      ('Regular User Long Name Example', 'user@store.com', ?, '789 User Street, User City, Country', 'user'),
      ('Test User Long Name For Password Change', 'test@store.com', ?, '321 Test Street, Test City, Country', 'user')
    `, [adminPassword, ownerPassword, userPassword, testPassword]);
    console.log('✅ Test users created with hashed passwords');
    
    // Insert stores
    await connection.query(`
      INSERT INTO stores (name, email, address, owner_id) VALUES
      ('Coffee Shop Example Store', 'coffee@store.com', '123 Coffee Street, Coffee City, Country', 2),
      ('Book Store Example Name', 'books@store.com', '456 Book Avenue, Book City, Country', 2)
    `);
    console.log('✅ Test stores created');
    
    // Insert ratings
    await connection.query(`
      INSERT INTO ratings (user_id, store_id, rating) VALUES
      (3, 1, 5),
      (3, 2, 4),
      (4, 1, 3)
    `);
    console.log('✅ Test ratings created');
    
    console.log('=== Database setup complete! ===');
    console.log('\nTest users created:');
    console.log('1. admin@store.com / Admin@123 (Admin)');
    console.log('2. owner@store.com / Owner@123 (Store Owner)');
    console.log('3. user@store.com / User@123 (Regular User)');
    console.log('4. test@store.com / Test@123 (Test User for password change)');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('Full error:', error);
  } finally {
    await connection.end();
    process.exit();
  }
}

setupDatabase();
