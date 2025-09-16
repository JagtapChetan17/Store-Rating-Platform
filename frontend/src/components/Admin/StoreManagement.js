// frontend/src/components/Admin/StoreManagement.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import StoreForm from './StoreForm';
import '../../styles/App.css';

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
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="store-management">
      <div className="section-header">
        <h2>Store Management</h2>
        <button onClick={handleCreateStore} className="btn-primary">
          Add New Store
        </button>
      </div>

      {showForm && (
        <StoreForm onCancel={() => setShowForm(false)} onSuccess={handleStoreCreated} />
      )}

      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-grid">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="stores-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Rating</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.owner_name}</td>
                <td>
                  <span className="rating-badge">
                    {parseFloat(store.average_rating).toFixed(1)}/5
                  </span>
                </td>
                <td>{new Date(store.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stores.length === 0 && !loading && (
        <div className="no-data">No stores found</div>
      )}
    </div>
  );
};

export default StoreManagement;