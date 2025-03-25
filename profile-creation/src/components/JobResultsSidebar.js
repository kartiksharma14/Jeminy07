// src/components/JobResultsSidebar.js
import React, { useState } from "react";
import "./JobResultsSidebar.css";

const JobResultsSidebar = ({ onFilterChange }) => {
  // Local state for filters using keys that match our API query parameters.
  const [keywords, setKeywords] = useState("");
  const [experience, setExperience] = useState("");
  const [locations, setLocations] = useState("");

  const handleKeywordsChange = (e) => {
    const newVal = e.target.value;
    setKeywords(newVal);
    onFilterChange({ keywords: newVal, experience, locations });
  };

  const handleExperienceChange = (e) => {
    const newVal = e.target.value;
    setExperience(newVal);
    // If "0" is selected, pass an empty value to avoid making a query with "0"
    onFilterChange({ keywords, experience: newVal === "0" ? "" : newVal, locations });
  };

  const handleLocationsChange = (e) => {
    const newVal = e.target.value;
    setLocations(newVal);
    onFilterChange({ keywords, experience, locations: newVal });
  };

  return (
    <aside className="jr-sidebar">
      <h2 className="jr-sidebar-title">Filters</h2>
      <div className="jr-sidebar-section">
        <label htmlFor="jr-keywords">Keyword:</label>
        <input
          type="text"
          id="jr-keywords"
          placeholder="Skills, designations..."
          value={keywords}
          onChange={handleKeywordsChange}
        />
      </div>
      <div className="jr-sidebar-section">
        <label htmlFor="jr-experience">Experience:</label>
        <select
          id="jr-experience"
          value={experience}
          onChange={handleExperienceChange}
        >
          <option value="">Select number of years</option>
          <option value="0">0 Years</option>
          <option value="1">1 Year</option>
          <option value="2">2 Years</option>
          <option value="3">3 Years</option>
          <option value="4">4 Years</option>
          <option value="5">5 Years</option>
          <option value="10">10+ Years</option>
        </select>
      </div>
      <div className="jr-sidebar-section">
        <label htmlFor="jr-locations">Location:</label>
        <input
          type="text"
          id="jr-locations"
          placeholder="Enter location"
          value={locations}
          onChange={handleLocationsChange}
        />
      </div>
    </aside>
  );
};

export default JobResultsSidebar;
