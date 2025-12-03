import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Added role field
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return false;
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter and one special character');
      return false;
    }

    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return false;
    }

    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address || !formData.password || !formData.confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create an account');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name (20-60 characters)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address (max 400 characters)</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password (8-16 characters, 1 uppercase, 1 special character)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;