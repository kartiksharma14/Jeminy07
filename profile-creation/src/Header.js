// src/components/Header.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();

  // Search states
  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState(""); // Default is empty string (not "0")
  const [location, setLocation] = useState("");
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Profile menu state (opens on hover)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Ref for the expanded search panel
  const searchPanelRef = useRef(null);

  // Expand search panel when minimal search bar is clicked
  const handleExpandSearch = () => {
    setShowSearchPanel(true);
  };

  // Collapse search panel if clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target)) {
        setShowSearchPanel(false);
      }
    }
    if (showSearchPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchPanel]);

  // Build query object and navigate to /job-list
  const handleSearch = () => {
    const query = {};
    if (keyword.trim() !== "") query.keywords = keyword;
    if (location.trim() !== "") query.locations = location;
    // Add experience if user has made a selection (even if it's "0")
    if (experience !== "") query.experience = experience;
    navigate("/job-list", { state: { query } });
  };

  // Logout functionality: clear authToken and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/candidate/login");
  };

  const toggleMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  // Clear any pending hide timer and show the menu on mouse enter
  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowProfileMenu(true);
  };

  // Delay hiding the menu on mouse leave (e.g., 300ms)
  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowProfileMenu(false);
    }, 300);
  };

  return (
    <>
      <header className="header-candidate">
        {/* Left Section: Logo */}
        <div className="header-left">
          <a href="/homepage">
            <img
              src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
              alt="Logo"
              className="logo"
            />
          </a>
        </div>

        {/* Center Section: Minimal Search Bar */}
        <div className="header-center">
          {!showSearchPanel && (
            <div className="minimal-search" onClick={handleExpandSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search jobs here"
                  className="minimal-input"
                  readOnly
                />
                <button className="search-button-cad">
                  <FaSearch />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Profile Icon & Dropdown Menu */}
        <div
          className="header-right"
          ref={profileMenuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className="profile-icon-button"
            onClick={toggleMenu}
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
            aria-label="User menu"
          >
            <div className="profile-icon-placeholder" aria-hidden="true"></div>
          </button>
          {showProfileMenu && (
            <div className="profile-menu-dropdown" role="menu">
              <Link to="/homepage" className="profile-menu-item" role="menuitem">
                Homepage
              </Link>
              <Link to="/home" className="profile-menu-item" role="menuitem">
                Candidate Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="profile-menu-item"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Expanded Search Panel */}
      {showSearchPanel && (
        <div className="expanded-search-panel" ref={searchPanelRef}>
          <div className="expanded-search-content">
            <div className="search-field">
              <label>Keyword</label>
              <input
                type="text"
                placeholder="Enter skills / designations / companies"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Select number of years</option>
                <option value="0">0 Years</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>
            <div className="search-field">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="expanded-search-actions">
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
