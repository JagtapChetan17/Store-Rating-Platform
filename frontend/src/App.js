import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Common/Header';
import Login from './components/Common/Login';
import Register from './components/Common/Register';
import ChangePassword from './components/Common/ChangePassword';
import StoreList from './components/User/StoreList';
import AdminDashboard from './components/Admin/AdminDashboard';
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';
import PrivateRoute from './components/Common/PrivateRoute';

const AppContent = () => {
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px'
  };

  const mainStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    paddingTop: '80px'
  };

  return (
    <Router>
      <AuthProvider>
        <div style={containerStyle}>
          <Header />
          <main style={mainStyle}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <StoreList />
                </PrivateRoute>
              } />
              
              <Route path="/change-password" element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              } />
              
              <Route path="/admin/dashboard" element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/store-owner/dashboard" element={
                <PrivateRoute requiredRole="store_owner">
                  <StoreOwnerDashboard />
                </PrivateRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppContent;