// src/components/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';
import useLogout from './useLogoutAdmin';

const AdminSidebar = () => {
  const logout = useLogout();
  return (
    <aside className="as-sidebar">
      <div className="as-logo">
        <h2>Admin Panel</h2>
      </div>
      <nav className="as-nav">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/admin/clients" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Manage Clients
        </NavLink>
        <NavLink 
          to="/admin/jobs" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Manage Jobs
        </NavLink>
        <NavLink 
          to="/admin/upload-candidates" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Upload Candidates
        </NavLink>
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Settings
        </NavLink>
        <NavLink 
          to="/admin/admin-reports" 
          className={({ isActive }) => `as-nav-link ${isActive ? 'active' : ''}`}
        >
          Reports
        </NavLink>
        <button className="as-nav-link logout-button" onClick={logout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
