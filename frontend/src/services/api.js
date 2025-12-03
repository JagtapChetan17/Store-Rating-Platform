import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });

    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          console.warn('Authentication failed, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.warn('Access denied');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.warn('Unhandled error status:', error.response.status);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error in setting up request
      console.error('Request setup error:', error.message);
    }

    // Return a consistent error object
    return Promise.reject({
      success: false,
      message: error.response?.data?.message || 
               error.message || 
               'Network error. Please check your connection.',
      status: error.response?.status,
      data: error.response?.data
    });
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

// Health check function
export const checkHealth = () => api.get('/health');