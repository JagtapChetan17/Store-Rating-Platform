import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { changePassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Calculate password strength for new password
    if (name === 'newPassword') {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[!@#$%^&*]/.test(value)) strength += 25;
      if (value.length >= 12) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters');
      return false;
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      setError('New password must contain at least one uppercase letter and one special character');
      return false;
    }

    return true;
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return '#e74c3c';
    if (strength < 75) return '#f39c12';
    return '#2ecc71';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result.success) {
        setSuccess(result.message);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: 'clamp(16px, 3vw, 32px)',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{
        background: 'white',
        padding: 'clamp(20px, 4vw, 40px)',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '500px',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(24px, 4vw, 32px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#3498db',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            color: 'white'
          }}>
            🔒
          </div>
          <h2 style={{ 
            margin: '0 0 8px 0',
            color: '#2c3e50',
            fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
            fontWeight: '600'
          }}>
            Change Password
          </h2>
          <p style={{
            color: '#7f8c8d',
            fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
            margin: 0
          }}>
            Update your password to keep your account secure
          </p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c0392b',
            padding: 'clamp(12px, 2vw, 16px)',
            borderRadius: '8px',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            borderLeft: '4px solid #e74c3c',
            fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div style={{
            backgroundColor: '#d5f4e6',
            color: '#27ae60',
            padding: 'clamp(12px, 2vw, 16px)',
            borderRadius: '8px',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            borderLeft: '4px solid #2ecc71',
            fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)'
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <label htmlFor="currentPassword" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#34495e',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
            }}>
              Current Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 2vw, 16px)',
                  border: '2px solid #e0e6ed',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#3498db',
                    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
                  },
                  '&:disabled': {
                    backgroundColor: '#f8f9fa',
                    cursor: 'not-allowed'
                  }
                }}
                placeholder="Enter your current password"
              />
            </div>
          </div>

          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <label htmlFor="newPassword" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#34495e',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
            }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 2vw, 16px)',
                  border: '2px solid #e0e6ed',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#3498db',
                    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
                  },
                  '&:disabled': {
                    backgroundColor: '#f8f9fa',
                    cursor: 'not-allowed'
                  }
                }}
                placeholder="Enter new password (8-16 characters)"
              />
            </div>
            
            {/* Password strength indicator */}
            {formData.newPassword && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.85rem)',
                    color: '#7f8c8d'
                  }}>
                    Password Strength:
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.85rem)',
                    color: getStrengthColor(passwordStrength),
                    fontWeight: '600'
                  }}>
                    {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Fair' : 'Strong'}
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  backgroundColor: '#ecf0f1',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${passwordStrength}%`,
                    height: '100%',
                    backgroundColor: getStrengthColor(passwordStrength),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)',
                  color: '#7f8c8d',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: formData.newPassword.length >= 8 ? '#2ecc71' : '#95a5a6'
                  }}>
                    {formData.newPassword.length >= 8 ? '✓' : '○'} 8+ characters
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: /[A-Z]/.test(formData.newPassword) ? '#2ecc71' : '#95a5a6'
                  }}>
                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'} Uppercase
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: /[!@#$%^&*]/.test(formData.newPassword) ? '#2ecc71' : '#95a5a6'
                  }}>
                    {/[!@#$%^&*]/.test(formData.newPassword) ? '✓' : '○'} Special
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#34495e',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
            }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 2vw, 16px)',
                  border: '2px solid #e0e6ed',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  '&:focus': {
                    outline: 'none',
                    borderColor: formData.newPassword === formData.confirmPassword ? '#2ecc71' : '#e74c3c',
                    boxShadow: formData.newPassword === formData.confirmPassword 
                      ? '0 0 0 3px rgba(46, 204, 113, 0.1)'
                      : '0 0 0 3px rgba(231, 76, 60, 0.1)'
                  },
                  '&:disabled': {
                    backgroundColor: '#f8f9fa',
                    cursor: 'not-allowed'
                  }
                }}
                placeholder="Confirm your new password"
              />
              {formData.confirmPassword && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  color: formData.newPassword === formData.confirmPassword ? '#2ecc71' : '#e74c3c'
                }}>
                  {formData.newPassword === formData.confirmPassword ? '✓' : '✗'}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(14px, 2.5vw, 18px)',
              backgroundColor: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              '&:hover:not(:disabled)': {
                backgroundColor: '#2980b9',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
              },
              '&:active:not(:disabled)': {
                transform: 'translateY(0)'
              }
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            div {
              padding: 20px !important;
            }
            
            input {
              font-size: 16px !important; /* Prevent zoom on iOS */
            }
          }
          
          @media (max-width: 480px) {
            div {
              padding: 16px !important;
            }
            
            h2 {
              font-size: 1.3rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChangePassword;