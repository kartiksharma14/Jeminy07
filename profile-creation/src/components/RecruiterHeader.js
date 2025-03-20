// src/components/RecruiterHeader.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./RecruiterHeader.css";

const RecruiterHeader = () => {
  // Set debug to true to force dropdowns to remain open while debugging.
  const debug = true;
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

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

  const token = localStorage.getItem("RecruiterToken");
  let nmae = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nmae = decoded.name || "N/A"; // Adjust key if necessary
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Logout function: clear authToken and navigate to recruiter login
  const handleLogout = () => {
    localStorage.removeItem("RecruiterToken");
    navigate("/recruiter/login");
  };

  return (
    <header className="recruiter-header">
      {/* 1. Logo Section */}
      <div className="recruiter-header-left">
        <a href="/recruiter">
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
              <a href="/manage-responses">Manage Jobs & Responses</a>
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
            <button
              type="button"
              onClick={handleLogout}
              className="profile-dropdown"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default RecruiterHeader;
