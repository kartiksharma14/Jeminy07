import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header-candidate">
      {/* Left Section: Logo */}
      <div className="header-left">
        <a href="/">
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.PNG?raw=true"
            alt="Logo"
            className="logo"
          />
        </a>
      </div>

      {/* Center Section: Navigation and Search */}
      <div className="header-center">
        <a href="/jobs" className="jobs-link">Jobs</a>
        <input
          type="text"
          placeholder="Search..."
          className="search-box"
        />
      </div>

      {/* Right Section: Profile Icon */}
      <div className="header-right">
        <div className="profile-icon-placeholder">
          {/* Placeholder for profile photo */}
        </div>
      </div>
    </header>
  );
}

export default Header;
