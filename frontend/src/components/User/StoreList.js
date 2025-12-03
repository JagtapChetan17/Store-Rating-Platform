// frontend/src/components/User/StoreList.js
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import '../../styles/App.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStores();
  }, [searchTerm]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getStores(searchTerm);
      setStores(response.data);
    } catch (error) {
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRating = async (storeId, rating) => {
    try {
      await userAPI.submitRating({ store_id: storeId, rating });
      loadStores(); // Reload stores to update ratings
    } catch (error) {
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="store-list-container">
      <h2>Stores</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stores-grid">
        {stores.map(store => (
          <StoreCard 
            key={store.id} 
            store={store} 
            onRate={handleRating}
          />
        ))}
      </div>

      {stores.length === 0 && !loading && (
        <div className="no-stores">No stores found</div>
      )}
    </div>
  );
};

const StoreCard = ({ store, onRate }) => {
  const [userRating, setUserRating] = useState(store.user_rating || 0);
  const [tempRating, setTempRating] = useState(0);

  useEffect(() => {
    loadUserRating();
  }, [store.id]);

  const loadUserRating = async () => {
    try {
      const response = await userAPI.getUserRating(store.id);
      setUserRating(response.data.rating || 0);
    } catch (error) {
      console.error('Failed to load user rating');
    }
  };

  const handleRate = async (rating) => {
    await onRate(store.id, rating);
    setUserRating(rating);
  };

  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <p className="store-address">{store.address}</p>
      <div className="store-rating">
        <span className="average-rating">
          Average Rating: {parseFloat(store.average_rating).toFixed(1)}/5
        </span>
        {userRating > 0 && (
          <span className="user-rating">Your Rating: {userRating}/5</span>
        )}
      </div>
      <div className="rating-controls">
        <p>Rate this store:</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`star ${star <= (tempRating || userRating) ? 'active' : ''}`}
              onMouseEnter={() => setTempRating(star)}
              onMouseLeave={() => setTempRating(0)}
              onClick={() => handleRate(star)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreList;