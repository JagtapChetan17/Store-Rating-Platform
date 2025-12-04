import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement'; 
import DashboardStats from './DashboardStats';
import '../../styles/App.css';

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
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'stores' ? 'active' : ''}
          onClick={() => setActiveTab('stores')} 
        >
          Store Management
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;