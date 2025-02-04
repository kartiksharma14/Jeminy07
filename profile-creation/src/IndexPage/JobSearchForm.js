// src/components/JobSearchForm/JobSearchForm.js

import React, { useState } from "react";
import "./JobSearchForm.css"; // Import the corresponding CSS

function JobSearchForm() {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Implement search functionality or API calls here
    console.log("Searching for:", { skills, experience, location });
  };

  return (
    <div className="qsbWrapper">
      <div className="qsb">
        {/* Search Icon */}
        <img
          src="//static.naukimg.com/s/7/103/i/search.57b43584.svg"
          alt="Search Icon"
          className="searchIcon"
        />

        {/* Search Inputs Container */}
        <div className="qsbInputs">
          {/* Skills / Designations / Companies Input */}
          <div className="inputGroup">
            <input
              className="suggestor-input"
              type="text"
              placeholder="Enter skills / designations / companies"
              tabIndex="0"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {/* Separator */}
          <div className="pipe"></div>

          {/* Experience Dropdown */}
          <div className="inputGroup dropdownMainContainer">
            <input
              type="text"
              name="experienceDD"
              id="experienceDD"
              spellCheck="false"
              autoComplete="off"
              title=""
              placeholder="Select experience"
              className="ddInput nonSearched"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              aria-haspopup="listbox"
              aria-expanded={experience ? "true" : "false"}
            />
            <span className="dropArrowDD">˅</span>
            <div className="dropDownPrimaryContainer" role="listbox">
              <div className="dropdownContainer">
                <div className="dropdownPrimary">
                  {/* Dropdown items */}
                  <div
                    className="dropdownItem"
                    onClick={() => setExperience("Fresher")}
                    role="option"
                    aria-selected={experience === "Fresher"}
                  >
                    Fresher
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => setExperience("1 year")}
                    role="option"
                    aria-selected={experience === "1 year"}
                  >
                    1 year
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => setExperience("2 years")}
                    role="option"
                    aria-selected={experience === "2 years"}
                  >
                    2 years
                  </div>
                  {/* Add more items as needed */}
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="pipe"></div>

          {/* Location Input */}
          <div className="inputGroup">
            <input
              className="suggestor-input"
              type="text"
              placeholder="Enter location"
              tabIndex="0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <button className="qsbSubmit" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default JobSearchForm;
