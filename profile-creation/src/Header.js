import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  // Search states
  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState("0");
  const [location, setLocation] = useState("");
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Profile menu state (opens on hover)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Ref for the expanded search panel
  const searchPanelRef = useRef(null);

  // When minimal search bar is clicked, expand the search panel
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

  // Handle search action using unified endpoint:
  // http://localhost:5000/api/search-all?keywords=...&locations=...&experience=...
  const handleSearch = async () => {
    try {
      const baseUrl = "http://localhost:5000/api/search-all";
      const queryParams = new URLSearchParams({
        keywords: keyword,
        locations: location,
        experience: experience
      }).toString();
      const url = `${baseUrl}?${queryParams}`;
      if (!url) return;

      const token = localStorage.getItem("authToken");
      console.log("Searching via:", url);
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log("Search results:", data);
      // Optionally, navigate to a job results page with the data:
      // navigate("/job", { state: { jobData: data } });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <>
      <header className="header-candidate">
        {/* Left Section: Logo */}
        <div className="header-left">
          <a href="/">
            <img
              src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
              alt="Logo"
              className="logo"
            />
          </a>
        </div>

        {/* Center Section: Minimal Search Bar (visible only when search panel is collapsed) */}
        <div className="header-center">
          {!showSearchPanel && (
            <div className="minimal-search" onClick={handleExpandSearch}>
              <input
                type="text"
                placeholder="Search jobs here"
                className="minimal-input"
                readOnly
              />
              <button className="minimal-search-btn">Search</button>
            </div>
          )}
        </div>

        {/* Right Section: Profile Icon & Menu (opens on hover) */}
        <div
          className="header-right"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
          ref={profileMenuRef}
        >
          <div className="profile-icon-placeholder">
            {/* Optionally, render a profile photo */}
          </div>
          {showProfileMenu && (
            <div className="profile-menu-dropdown">
              <Link to="/homepage" className="profile-menu-item">
                Homepage
              </Link>
              <Link to="/home" className="profile-menu-item">
                Candidate Profile
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Expanded Search Panel (appears below header when activated) */}
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
