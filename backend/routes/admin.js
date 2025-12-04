const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  createUser, 
  createStore, 
  getUsers, 
  getStores, 
  getUserDetails 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { validateUserRegistration, validateStoreCreation } = require('../middleware/validation');

router.use(auth('admin'));
router.get('/dashboard/stats', getDashboardStats);
router.post('/users', validateUserRegistration, createUser);
router.post('/stores', validateStoreCreation, createStore);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.get('/users/:id', getUserDetails);

module.exports = router;