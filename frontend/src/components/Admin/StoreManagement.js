import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import StoreForm from './StoreForm';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    loadStores();
  }, [filters]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateStore = () => {
    setShowForm(true);
  };

  const handleStoreCreated = () => {
    setShowForm(false);
    loadStores();
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
    <div style={{ padding: '1rem 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2>Store Management</h2>
        <button 
          onClick={handleCreateStore}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Add New Store
        </button>
      </div>

      {showForm && (
        <StoreForm onCancel={() => setShowForm(false)} onSuccess={handleStoreCreated} />
      )}

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2c3e50' }}>
          Filters
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by email"
            value={filters.email}
            onChange={handleFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Name</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Email</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Address</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Owner</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Rating</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  {store.name}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  {store.email}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  {store.address}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  {store.owner_name}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  <span style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {parseFloat(store.average_rating).toFixed(1)}/5
                  </span>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  {new Date(store.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stores.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#7f8c8d',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '1rem'
        }}>
          No stores found
        </div>
      )}
    </div>
  );
};

export default StoreManagement;