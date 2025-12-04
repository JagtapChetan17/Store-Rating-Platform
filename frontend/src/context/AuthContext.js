import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete authAPI.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.put('/auth/change-password', passwordData);
      return { 
        success: true, 
        message: response.data.message || 'Password changed successfully' 
      };
    } catch (error) {
      console.error('Change password error:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password change failed' 
      };
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};