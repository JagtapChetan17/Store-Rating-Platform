import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/App.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          StoreRating
        </Link>
        <nav className="nav">
          {currentUser ? (
            <>
              <span className="welcome">Welcome, {currentUser.name}</span>
              {currentUser.role === 'admin' && (
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              )}
              {currentUser.role === 'store_owner' && (
                <Link to="/store-owner/dashboard">Store Owner Dashboard</Link>
              )}
              <Link to="/change-password">Change Password</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;