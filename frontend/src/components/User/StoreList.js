import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

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
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d'
      }}>
        Loading stores...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
        {currentUser?.role === 'user' ? 'Rate Stores' : 'Stores'}
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {stores.map(store => (
          <StoreCard 
            key={store.id} 
            store={store} 
            onRate={handleRating}
          />
        ))}
      </div>

      {stores.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#7f8c8d'
        }}>
          No stores found
        </div>
      )}
    </div>
  );
};

const StoreCard = ({ store, onRate }) => {
  const [userRating, setUserRating] = useState(store.user_rating || 0);
  const [tempRating, setTempRating] = useState(0);

  useEffect(() => {
    setUserRating(store.user_rating || 0);
  }, [store.user_rating]);

  const handleRate = async (rating) => {
    await onRate(store.id, rating);
    setUserRating(rating);
  };

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        color: '#2c3e50',
        marginBottom: '0.5rem'
      }}>
        {store.name}
      </h3>
      <p style={{ 
        color: '#7f8c8d',
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        {store.address}
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Average Rating: {parseFloat(store.average_rating).toFixed(1)}/5
        </span>
        {userRating > 0 && (
          <span style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#3498db'
          }}>
            Your Rating: {userRating}/5
          </span>
        )}
      </div>
      <div>
        <p style={{ 
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Rate this store:
        </p>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: star <= (tempRating || userRating) ? '#f39c12' : '#ddd',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
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