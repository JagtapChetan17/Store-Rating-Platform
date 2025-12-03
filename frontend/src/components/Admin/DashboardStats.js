import React from 'react';

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d'
      }}>
        Loading dashboard stats...
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#e74c3c'
      }}>
        Failed to load dashboard stats
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>
        Platform Overview
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#7f8c8d',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Total Users
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#3498db',
            margin: '1rem 0'
          }}>
            {stats.total_users}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#7f8c8d',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Total Stores
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#3498db',
            margin: '1rem 0'
          }}>
            {stats.total_stores}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            marginTop: 0,
            color: '#7f8c8d',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Total Ratings
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#3498db',
            margin: '1rem 0'
          }}>
            {stats.total_ratings}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;