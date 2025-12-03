import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../services/api';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStoreRatings();
  }, []);

  const loadStoreRatings = async () => {
    try {
      setLoading(true);
      const response = await storeOwnerAPI.getStoreRatings();
      setStoreData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load store ratings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d'
      }}>
        Loading store data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#e74c3c'
      }}>
        {error}
      </div>
    );
  }

  if (!storeData) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d'
      }}>
        No store data available
      </div>
    );
  }

  const { store, ratings } = storeData;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '2rem' }}>
        Store Owner Dashboard
      </h1>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
          {store.name}
        </h2>
        <p style={{ 
          color: '#7f8c8d',
          marginBottom: '1.5rem'
        }}>
          {store.address}
        </p>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#f39c12',
            lineHeight: '1'
          }}>
            {parseFloat(store.average_rating).toFixed(1)}
          </span>
          <span style={{
            color: '#7f8c8d',
            fontSize: '0.9rem'
          }}>
            Average Rating
          </span>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          color: '#2c3e50',
          borderBottom: '1px solid #ddd',
          paddingBottom: '1rem'
        }}>
          Customer Ratings ({ratings.length})
        </h3>
        
        {ratings.length > 0 ? (
          <div style={{ marginTop: '1.5rem' }}>
            {ratings.map(rating => (
              <div key={rating.id} style={{
                padding: '1rem',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                    {rating.user_name}
                  </span>
                  <span style={{ color: '#f39c12', fontSize: '1.2rem' }}>
                    {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                  </span>
                </div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                  {new Date(rating.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#7f8c8d',
            fontStyle: 'italic'
          }}>
            No ratings yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;