import React, { useState } from "react";
import "./RecruiterHeader.css";
import { jwtDecode } from "jwt-decode";

const RecruiterHeader = () => {
  // Set debug to true to force dropdowns to remain open while you debug.
  const debug = true;
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu); // Open the specific dropdown
  };

  const handleMouseLeave = (menu) => {
    // Only close if not in debug mode.
    if (!debug && openDropdown === menu) {
      setTimeout(() => {
        setOpenDropdown(null); // Close the dropdown after leaving
      }, 100);
    }
  };

  const token = localStorage.getItem("authToken");
  let nmae = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nmae = decoded.nmae || "N/A"; // Adjust key if necessary
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <header className="recruiter-header">
      {/* 1. Logo Section */}
      <div className="recruiter-header-left">
        <a href="/">
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
            alt="Recruiter Logo"
            className="recruiter-logo"
          />
        </a>
      </div>

      {/* 2. Recruiter Header Center */}
      <nav className="recruiter-header-center">
        <div
          className="nav-item-container"
          onMouseEnter={() => handleMouseEnter("jobs")}
          onMouseLeave={() => handleMouseLeave("jobs")}
        >
          <div className="nav-title">Jobs & Responses</div>
          {(openDropdown === "jobs" || debug) && (
            <div className="dropdown">
              <a href="/post-job">Post a Hot Vacancy</a>
              <a href="/manage-jobs">Manage Jobs & Responses</a>
            </div>
          )}
        </div>

        <div
          className="nav-item-container"
          onMouseEnter={() => handleMouseEnter("resdex")}
          onMouseLeave={() => handleMouseLeave("resdex")}
        >
          <div className="nav-title">Resdex</div>
          {(openDropdown === "resdex" || debug) && (
            <div className="dropdown">
              <a href="/search-resumes">Search Resumes</a>
              <a href="/manage-searches">Manage Searches</a>
            </div>
          )}
        </div>

        <div
          className="nav-item-container"
          onMouseEnter={() => handleMouseEnter("analytics")}
          onMouseLeave={() => handleMouseLeave("analytics")}
        >
          <div className="nav-title">Analytics</div>
          {(openDropdown === "analytics" || debug) && (
            <div className="dropdown">
              <a href="/job-posting">Job Posting Reports</a>
              <a href="/usage-reports">Usage Reports</a>
              <a href="/nfl-report">NFL Report</a>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Search Bar */}
      <div className="search-bar-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for jobs, candidates, etc..."
          />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 4a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1116.32 5.91l4.4 4.4-1.42 1.42-4.4-4.4A9 9 0 012 11z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 4. Profile Section */}
      <div
        className="profile-container"
        onMouseEnter={() => handleMouseEnter("profile")}
        onMouseLeave={() => handleMouseLeave("profile")}
      >
        <div className="profile-trigger">
          <img
            src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
            alt="Recruiter Profile"
            className="profile-image"
          />
          <span className="profile-name">{nmae}</span>
        </div>
        {(openDropdown === "profile" || debug) && (
          <div className="dropdown profile-dropdown">
            <a href="/product-settings">Product Settings</a>
            <a href="/change-password">Change Password</a>
            <a href="/faqs">FAQs</a>
            <a href="/usage-guidelines">Usage Guidelines</a>
            <a href="/logout">Logout</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default RecruiterHeader;
