// src/components/AdminDashboard.js
import React from 'react';
import './AdminDashboard.css';
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="enterprise-dashboard">
      <RecruiterHomeHeader />
      <div className="enterprise-layout">
        <AdminSidebar />
        <main className="enterprise-main">
          <div className="enterprise-header">
            <h1>Dashboard</h1>
            <div className="enterprise-stats">
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">120</span>
                <span className="enterprise-stat-label">Recruiters</span>
              </div>
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">350</span>
                <span className="enterprise-stat-label">Jobs</span>
              </div>
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">480</span>
                <span className="enterprise-stat-label">Applications</span>
              </div>
            </div>
          </div>
          <div className="enterprise-content">
            <div className="enterprise-card-section">
              <div className="enterprise-card">
                <h3>Recent Recruiters</h3>
                <p>List of recent recruiters...</p>
              </div>
              <div className="enterprise-card">
                <h3>Recent Jobs</h3>
                <p>List of recent jobs...</p>
              </div>
              {/* Add additional cards or dashboard components as needed */}
            </div>
          </div>
        </main>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default AdminDashboard;
