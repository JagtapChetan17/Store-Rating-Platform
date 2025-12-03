import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor to handle auth errors
api.interceptors.response.use(
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

// API functions
export const authAPI = api;

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  createUser: (userData) => api.post('/admin/users', userData),
  createStore: (storeData) => api.post('/admin/stores', storeData),
  getUsers: (filters) => api.get('/admin/users', { params: filters }),
  getStores: (filters) => api.get('/admin/stores', { params: filters }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
};

export const userAPI = {
  getStores: (searchTerm) => api.get('/users/stores', { params: { search: searchTerm } }),
  submitRating: (ratingData) => api.post('/users/ratings', ratingData),
  getUserRating: (storeId) => api.get(`/users/ratings/${storeId}`),
};

export const storeOwnerAPI = {
  getStoreRatings: () => api.get('/store-owner/ratings'),
};