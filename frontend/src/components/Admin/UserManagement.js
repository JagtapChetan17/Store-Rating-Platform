import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import UserForm from './UserForm';

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
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#7f8c8d'
      }}>
        Loading users...
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
        <h2>User Management</h2>
        <button 
          onClick={handleCreateUser}
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
          Add New User
        </button>
      </div>

      {showForm && (
        <UserForm onCancel={() => setShowForm(false)} onSuccess={handleUserCreated} />
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
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
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
              }}>Role</th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                fontWeight: '600',
                color: '#2c3e50'
              }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const roleColors = {
                admin: { bg: '#e3f2fd', color: '#1976d2' },
                user: { bg: '#f3e5f5', color: '#7b1fa2' },
                store_owner: { bg: '#e8f5e8', color: '#388e3c' }
              };
              const roleStyle = roleColors[user.role] || { bg: '#f5f5f5', color: '#666' };
              
              return (
                <tr key={user.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {user.name}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {user.address}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: roleStyle.bg,
                      color: roleStyle.color
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#7f8c8d',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '1rem'
        }}>
          No users found
        </div>
      )}
    </div>
  );
};

export default UserManagement;