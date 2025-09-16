-- Create database
CREATE DATABASE IF NOT EXISTS store_rating_platform;
USE store_rating_platform;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ratings table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_store (user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password, address, role) VALUES
('Rajesh Kumar Sharma', 'rajesh.sharma@example.com', '$2b$10$ExampleHashedPassword1', '123 Main Street, Bangalore, Karnataka', 'admin'),
('Priya Singh Patel', 'priya.patel@example.com', '$2b$10$ExampleHashedPassword2', '456 Oak Avenue, Mumbai, Maharashtra', 'user'),
('Vikram Malhotra', 'vikram.malhotra@example.com', '$2b$10$ExampleHashedPassword3', '789 Pine Road, Delhi', 'store_owner'),
('Anjali Gupta Joshi', 'anjali.joshi@example.com', '$2b$10$ExampleHashedPassword4', '321 Elm Street, Chennai, Tamil Nadu', 'user'),
('Arun Singhania', 'arun.singhania@example.com', '$2b$10$ExampleHashedPassword5', '654 Cedar Lane, Kolkata, West Bengal', 'store_owner');

INSERT INTO stores (name, email, address, owner_id) VALUES
('Sharma Electronics', 'sharma.electronics@example.com', '123 Main Street, Bangalore, Karnataka', 3),
('Patel Clothing Store', 'patel.clothing@example.com', '456 Fashion Street, Mumbai, Maharashtra', 5),
('Malhotra Grocery', 'malhotra.grocery@example.com', '789 Food Lane, Delhi', 3),
('Joshi Book Store', 'joshi.books@example.com', '321 Knowledge Road, Chennai, Tamil Nadu', 5);

INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 4),
(2, 3, 5),
(4, 1, 3),
(4, 2, 4),
(4, 3, 5);