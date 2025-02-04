import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="https://github.com/piyushpushkarstl/jeminy/blob/main/STL_GSB_Blue.png?raw=true" 
          alt="Logo" 
          className="logo" 
        />
      </div>
      <div className="header-center">
        <nav className="navigation">
          {/* Use Link for navigation */}
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/quick-links" className="nav-link">Quick Links</Link>
          <Link to="/recruiter" className="nav-link">Recruiter</Link> {/* Recruiter Link */}
        </nav>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-box" />
          <button className="search-button">🔍</button>
        </div>
      </div>
      <div className="header-right">
        <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
      </div>
    </header>
  );
}

export default Header;
