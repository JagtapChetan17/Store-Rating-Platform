// frontend/src/components/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import UserForm from './UserForm';
import '../../styles/App.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
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

  const handleCreateUser = () => {
    setShowForm(true);
  };

  const handleUserCreated = () => {
    setShowForm(false);
    loadUsers();
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <button onClick={handleCreateUser} className="btn-primary">
          Add New User
        </button>
      </div>

      {showForm && (
        <UserForm onCancel={() => setShowForm(false)} onSuccess={handleUserCreated} />
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
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="no-data">No users found</div>
      )}
    </div>
  );
};

export default UserManagement;