// src/components/LogoutButton.js
import React from 'react';
import useLogout from './useLogoutAdmin';
import './LogoutButton.css'; // Create this CSS file for styling

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button className="lb-logout-button" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;
