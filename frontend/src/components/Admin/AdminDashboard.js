import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats stats={stats} loading={loading} />;
      case 'users':
        return <UserManagement />;
      case 'stores':
        return <StoreManagement />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '2rem' }}>
        Admin Dashboard
      </h1>
      
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #ddd',
        marginBottom: '2rem'
      }}>
        <button 
          style={{
            padding: '1rem 2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: activeTab === 'dashboard' ? '#3498db' : '#7f8c8d',
            borderBottom: `3px solid ${activeTab === 'dashboard' ? '#3498db' : 'transparent'}`
          }}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          style={{
            padding: '1rem 2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: activeTab === 'users' ? '#3498db' : '#7f8c8d',
            borderBottom: `3px solid ${activeTab === 'users' ? '#3498db' : 'transparent'}`
          }}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          style={{
            padding: '1rem 2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: activeTab === 'stores' ? '#3498db' : '#7f8c8d',
            borderBottom: `3px solid ${activeTab === 'stores' ? '#3498db' : 'transparent'}`
          }}
          onClick={() => setActiveTab('stores')}
        >
          Store Management
        </button>
      </div>

      <div style={{ minHeight: '400px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;