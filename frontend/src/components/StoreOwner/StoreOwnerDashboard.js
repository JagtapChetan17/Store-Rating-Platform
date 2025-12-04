import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../services/api';
import '../../styles/App.css';

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
      setError('Failed to load store ratings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading store data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!storeData) {
    return <div className="no-data">No store data available</div>;
  }

  const { store, ratings } = storeData;

  return (
    <div className="store-owner-dashboard">
      <h1>Store Owner Dashboard</h1>
      
      <div className="store-summary">
        <h2>{store.name}</h2>
        <p className="store-address">{store.address}</p>
        <div className="store-rating">
          <span className="rating-value">{parseFloat(store.average_rating).toFixed(1)}</span>
          <span className="rating-label">Average Rating</span>
        </div>
      </div>

      <div className="ratings-section">
        <h3>Customer Ratings ({ratings.length})</h3>
        
        {ratings.length > 0 ? (
          <div className="ratings-list">
            {ratings.map(rating => (
              <div key={rating.id} className="rating-item">
                <div className="rating-header">
                  <span className="user-name">{rating.user_name}</span>
                  <span className="rating-stars">
                    {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                  </span>
                </div>
                <div className="rating-date">
                  {new Date(rating.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-ratings">No ratings yet</div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;