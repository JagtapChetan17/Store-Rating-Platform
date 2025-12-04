import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/App.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { changePassword } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    setError('');
    setSuccess('');

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
      setError('New password must contain at least one uppercase letter and one special character (!@#$%^&*)');
      return false;
    }

    return true;
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
      
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      console.log('Submitting password change:', passwordData);
      
      const result = await changePassword(passwordData);
      
      if (result.success) {
        setSuccess(result.message || 'Password changed successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-form">
        <h2>Change Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              New Password (8-16 characters, 1 uppercase, 1 special character)
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;