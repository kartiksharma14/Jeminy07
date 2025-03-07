// src/components/AdminDashboard.js
import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Welcome to the Admin Dashboard</h1>
      <div className="admin-actions">
        <a href="/admin/recruiters" className="action-button">Manage Recruiters</a>
        <a href="/admin/jobs" className="action-button">Manage Jobs</a>
      </div>
    </div>
  );
};

export default AdminDashboard;
