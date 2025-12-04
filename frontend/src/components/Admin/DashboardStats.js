import React from 'react';
import '../../styles/App.css';

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return <div className="loading">Loading dashboard stats...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard stats</div>;
  }

  return (
    <div className="dashboard-stats">
      <h2>Platform Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.total_users}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Stores</h3>
          <div className="stat-number">{stats.total_stores}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <div className="stat-number">{stats.total_ratings}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;