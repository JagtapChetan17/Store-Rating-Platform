import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: 'Admin',
      store_owner: 'Store Owner',
      user: 'User'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#e74c3c',
      store_owner: '#2ecc71',
      user: '#3498db'
    };
    return colors[role] || '#95a5a6';
  };

  const containerStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%'
  };

  const innerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    flexWrap: 'wrap'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const mobileMenuButtonStyle = {
    display: isMobile ? 'block' : 'none',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '8px'
  };

  const navStyle = {
    display: isMobile ? (isMenuOpen ? 'flex' : 'none') : 'flex',
    alignItems: 'center',
    gap: '16px',
    ...(isMobile && {
      flexDirection: 'column',
      width: '100%',
      marginTop: '16px',
      padding: '16px 0',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      gap: '12px'
    })
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    ...(isMobile && {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%'
    })
  };

  const welcomeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '6px',
    fontSize: '0.9rem'
  };

  const roleBadgeStyle = (role) => ({
    backgroundColor: getRoleColor(role),
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600'
  });

  const linkStyle = (color) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: `${color}20`,
    border: `1px solid ${color}30`,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      backgroundColor: `${color}40`
    },
    ...(isMobile && {
      width: '100%',
      justifyContent: 'center'
    })
  });

  const logoutButtonStyle = {
    background: 'transparent',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(231, 76, 60, 0.4)'
    },
    ...(isMobile && {
      width: '100%',
      justifyContent: 'center'
    })
  };

  const authButtonsContainerStyle = {
    display: 'flex',
    gap: '12px',
    ...(isMobile && {
      flexDirection: 'column',
      width: '100%'
    })
  };

  const authButtonStyle = (bgColor, hoverColor) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: bgColor,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: hoverColor
    },
    ...(isMobile && {
      width: '100%'
    })
  });

  return (
    <header style={containerStyle}>
      <div style={innerContainerStyle}>
        <Link to="/" style={logoStyle}>
          <span style={{ 
            backgroundColor: '#3498db',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '1rem'
          }}>
            ⭐
          </span>
          StoreRating
        </Link>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={mobileMenuButtonStyle}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation */}
        <nav style={navStyle}>
          {currentUser ? (
            <>
              <div style={userInfoStyle}>
                <div style={welcomeStyle}>
                  <span style={{ fontWeight: '500' }}>👋</span>
                  <span style={{ 
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentUser.name}
                  </span>
                  <span style={roleBadgeStyle(currentUser.role)}>
                    {getRoleDisplay(currentUser.role)}
                  </span>
                </div>
                
                {currentUser.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    style={linkStyle('#3498db')}
                  >
                    <span>📊</span>
                    Dashboard
                  </Link>
                )}
                
                {currentUser.role === 'store_owner' && (
                  <Link 
                    to="/store-owner/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    style={linkStyle('#2ecc71')}
                  >
                    <span>🏪</span>
                    My Store
                  </Link>
                )}
                
                <Link 
                  to="/change-password" 
                  onClick={() => setIsMenuOpen(false)}
                  style={linkStyle('#9b59b6')}
                >
                  <span>🔒</span>
                  Change Password
                </Link>
                
                <button 
                  onClick={handleLogout}
                  style={logoutButtonStyle}
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={authButtonsContainerStyle}>
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                style={authButtonStyle('#3498db', '#2980b9')}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)}
                style={authButtonStyle('#2ecc71', '#27ae60')}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;