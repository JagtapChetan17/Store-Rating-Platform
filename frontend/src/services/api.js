import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  getDashboardStats: () => authAPI.get('/admin/dashboard/stats'),
  createUser: (userData) => authAPI.post('/admin/users', userData),
  createStore: (storeData) => authAPI.post('/admin/stores', storeData),
  getUsers: (filters) => authAPI.get('/admin/users', { params: filters }),
  getStores: (filters) => authAPI.get('/admin/stores', { params: filters }),
  getUserDetails: (id) => authAPI.get(`/admin/users/${id}`),
};

export const userAPI = {
  getStores: (searchTerm) => authAPI.get('/users/stores', { params: { search: searchTerm } }),
  submitRating: (ratingData) => authAPI.post('/users/ratings', ratingData),
  getUserRating: (storeId) => authAPI.get(`/users/ratings/${storeId}`),
};

export const storeOwnerAPI = {
  getStoreRatings: () => authAPI.get('/store-owner/ratings'),
};