// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import Header from './components/Common/Header';
import Login from './components/Common/Login';
import Register from './components/Common/Register';
import ChangePassword from './components/Common/ChangePassword';
import StoreList from './components/User/StoreList';
import AdminDashboard from './components/Admin/AdminDashboard';
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';
import PrivateRoute from './components/Common/PrivateRoute';
import './styles/App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!currentUser ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!currentUser ? <Register /> : <Navigate to="/" />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                {currentUser?.role === 'admin' ? (
                  <Navigate to="/admin/dashboard" />
                ) : currentUser?.role === 'store_owner' ? (
                  <Navigate to="/store-owner/dashboard" />
                ) : (
                  <StoreList />
                )}
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/change-password" 
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/store-owner/dashboard" 
            element={
              <PrivateRoute requiredRole="store_owner">
                <StoreOwnerDashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;