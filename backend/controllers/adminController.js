const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await Rating.getStats();
    res.json(stats[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUsers = await User.findByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({ name, email, password: hashedPassword, address, role });

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const result = await Store.create({ name, email, address, owner_id });

    res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = await User.getAll(filters);
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const filters = req.query;
    const stores = await Store.getAll(filters);
    res.json(stores);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const users = await User.findById(userId);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.role === 'store_owner') {
      const stores = await Store.getByOwnerId(userId);
      const userWithStore = {
        ...user,
        stores: stores
      };
      res.json(userWithStore);
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getStores,
  getUserDetails
};