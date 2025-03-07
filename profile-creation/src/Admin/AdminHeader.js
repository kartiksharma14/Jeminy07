// src/components/AdminHeader.js
import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-logo">
        <a href="/admin/dashboard">
          <img 
            src="https://via.placeholder.com/150x40?text=Admin+Logo" 
            alt="Admin Logo" 
          />
        </a>
      </div>
      <nav className="admin-nav">
        <ul>
          <li><a href="/admin/recruiters">Manage Recruiters</a></li>
          <li><a href="/admin/jobs">Manage Jobs</a></li>
        </ul>
      </nav>
      <div className="admin-profile">
        <a href="/admin/logout">Logout</a>
      </div>
    </header>
  );
};

export default AdminHeader;
