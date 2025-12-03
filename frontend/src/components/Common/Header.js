import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: 'clamp(12px, 2vw, 16px) 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 clamp(16px, 3vw, 24px)',
        flexWrap: 'wrap'
      }}>
        <Link to="/" style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            backgroundColor: '#3498db',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)'
          }}>
            ⭐
          </span>
          StoreRating
        </Link>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '8px',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 1.5vw, 16px)',
          '@media (max-width: 768px)': {
            display: isMenuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
            marginTop: '16px',
            padding: '16px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            gap: '12px'
          }
        }}>
          {currentUser ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%'
                }
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)'
                }}>
                  <span style={{ fontWeight: '500' }}>👋</span>
                  <span style={{ 
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentUser.name}
                  </span>
                  <span style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {getRoleDisplay(currentUser.role)}
                  </span>
                </div>
                
                {currentUser.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(52, 152, 219, 0.2)',
                      border: '1px solid rgba(52, 152, 219, 0.3)',
                      fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      '&:hover': {
                        backgroundColor: 'rgba(52, 152, 219, 0.4)'
                      },
                      '@media (max-width: 768px)': {
                        width: '100%',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    <span>📊</span>
                    Dashboard
                  </Link>
                )}
                
                {currentUser.role === 'store_owner' && (
                  <Link 
                    to="/store-owner/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(46, 204, 113, 0.2)',
                      border: '1px solid rgba(46, 204, 113, 0.3)',
                      fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      '&:hover': {
                        backgroundColor: 'rgba(46, 204, 113, 0.4)'
                      },
                      '@media (max-width: 768px)': {
                        width: '100%',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    <span>🏪</span>
                    My Store
                  </Link>
                )}
                
                <Link 
                  to="/change-password" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    border: '1px solid rgba(155, 89, 182, 0.3)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    '&:hover': {
                      backgroundColor: 'rgba(155, 89, 182, 0.4)'
                    },
                    '@media (max-width: 768px)': {
                      width: '100%',
                      justifyContent: 'center'
                    }
                  }}
                >
                  <span>🔒</span>
                  Change Password
                </Link>
                
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(231, 76, 60, 0.3)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(231, 76, 60, 0.4)'
                    },
                    '@media (max-width: 768px)': {
                      width: '100%',
                      justifyContent: 'center'
                    }
                  }}
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              gap: '12px',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                width: '100%'
              }
            }}>
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(52, 152, 219, 0.8)',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  },
                  '@media (max-width: 768px)': {
                    width: '100%'
                  }
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(46, 204, 113, 0.8)',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  '&:hover': {
                    backgroundColor: '#27ae60'
                  },
                  '@media (max-width: 768px)': {
                    width: '100%'
                  }
                }}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* Add media query styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            width: 100%;
            margin-top: 16px;
            padding: 16px 0;
            border-top: 1px solid rgba(255,255,255,0.1);
            gap: 12px;
          }
          
          button[style*="display: none"] {
            display: block !important;
          }
          
          .user-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            width: 100% !important;
          }
          
          .nav-link, .logout-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          
          .auth-buttons {
            flex-direction: column !important;
            width: 100% !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;