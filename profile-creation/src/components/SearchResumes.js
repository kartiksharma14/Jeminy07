// src/SearchResumes.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchResumes.css";

const SearchResumes = () => {
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({});

  // Basic filters
  const [location, setLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Any");
  const [excludeKeyword, setExcludeKeyword] = useState("");
  const [itSkillsFilter, setItSkillsFilter] = useState("");
  const [disability, setDisability] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [gender, setGender] = useState("All Candidates");
  const [educationFilter, setEducationFilter] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [activeIn, setActiveIn] = useState("15 days");
  const [keyword, setKeyword] = useState("");
  const [relocate, setRelocate] = useState(false);

  const navigate = useNavigate();

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Build query parameters. Each param corresponds to one of your separate endpoints:
    //  - city => /candidate-profile/search-by-city?location=...
    //  - notice period => /candidates/search/notice-period?notice_period=...
    //  - exclude => /candidates/search-by-excluding-keyword?exclude=...
    //  - active_in => /candidates/search-by-active-in?days=...
    //  - itSkills => /candidates/search/it-skills?skills=...
    //  - disability => /candidates/search/disability?differently_abled=yes
    //  - salary => /candidates/search/salary?min_salary=...&max_salary=...
    //  - gender => /candidates/search/gender?gender=...
    //  - education => /candidates/search/education?university=...
    //  - employment => /candidates/search/employment?current_company_name=...
    //  - experience => /candidate-profile/candidates/experience/range?min_experience=...&max_experience=...
    //  - keywords => (You don't have a dedicated endpoint, but you might skip or do your own)

    const params = new URLSearchParams();

    if (location) {
      params.set("location", location);
    }
    if (noticePeriod && noticePeriod !== "Any") {
      params.set("notice_period", noticePeriod);
    }
    if (excludeKeyword) {
      params.set("exclude", excludeKeyword);
    }
    // Map your ActiveIn selection to days
    const mapActiveInToDays = {
      "1 day": 1,
      "15 days": 15,
      "30 days": 30,
      "3 months": 90,
      "6 months": 180,
    };
    if (activeIn && mapActiveInToDays[activeIn]) {
      params.set("days", mapActiveInToDays[activeIn]);
    }
    if (itSkillsFilter) {
      params.set("skills", itSkillsFilter);
    }
    if (disability) {
      params.set("differently_abled", "yes");
    }
    if (salaryMin) {
      params.set("min_salary", salaryMin);
    }
    if (salaryMax) {
      params.set("max_salary", salaryMax);
    }
    // If gender is 'All Candidates', skip. If it's 'Male Candidates', pass 'male', etc.
    const mapGenderToValue = {
      "All Candidates": "",
      "Male Candidates": "male",
      "Female Candidates": "female",
    };
    if (mapGenderToValue[gender]) {
      params.set("gender", mapGenderToValue[gender]);
    }
    if (educationFilter) {
      params.set("university", educationFilter);
    }
    if (employmentFilter) {
      params.set("current_company_name", employmentFilter);
    }
    if (minExperience) {
      params.set("min_experience", minExperience);
    }
    if (maxExperience) {
      params.set("max_experience", maxExperience);
    }
    if (keyword) {
      params.set("keyword", keyword);
    }
    if (relocate) {
      params.set("relocate", "true");
    }

    // Navigate to candidates with all these query params
    navigate(`/candidates?${params.toString()}`);
  };

  return (
    <div className="search-resumes-layout">
      {/* Search Section */}
      <div className="search-section">
        <h1 className="search-resume-heading">Search Candidates</h1>

        <form className="form-box" onSubmit={handleSearch}>
          {/* Keywords */}
          <div className="form-field">
            <label className="field-label">Keywords</label>
            <input
              type="text"
              placeholder="Enter keywords..."
              className="input-box"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Experience */}
          <div className="form-field">
            <label className="field-label">Experience (Years)</label>
            <div className="experience-range">
              <input
                type="number"
                placeholder="Min years"
                className="input-box"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                min="0"
              />
              <span className="separator">to</span>
              <input
                type="number"
                placeholder="Max years"
                className="input-box"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-field">
            <label className="field-label">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="input-box"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Checkbox for Relocation */}
          <div className="checkbox-field">
            <input
              type="checkbox"
              id="relocate"
              checked={relocate}
              onChange={(e) => setRelocate(e.target.checked)}
            />
            <label htmlFor="relocate">
              Include candidates who prefer to relocate
            </label>
          </div>

          {/* Salary */}
          <div className="form-field">
            <label className="field-label">Annual Salary</label>
            <div className="salary-range">
              <input
                type="number"
                placeholder="Min salary (INR)"
                className="input-box"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <span className="separator">to</span>
              <input
                type="number"
                placeholder="Max salary (INR)"
                className="input-box"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="expandable-section">
            {/* Employment Details */}
            <div
              className="collapser"
              onClick={() => toggleSection("employmentDetails")}
            >
              <h4 className="collapser-header">
                Employment Details
                <span className="expand-icon">
                  {expandedSections.employmentDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.employmentDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">Company</label>
                  <input
                    type="text"
                    placeholder="Add Company"
                    className="input-box"
                    value={employmentFilter}
                    onChange={(e) => setEmploymentFilter(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Notice Period</label>
                  <div className="modern-tag-selection">
                    {[
                      "Any",
                      "0-15 days",
                      "1 month",
                      "2 months",
                      "3 months",
                      "Serving Notice Period",
                    ].map((period) => (
                      <span
                        key={period}
                        className={`tag ${
                          noticePeriod === period ? "selected" : ""
                        }`}
                        onClick={() => setNoticePeriod(period)}
                      >
                        {period}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Education Details */}
            <div
              className="collapser"
              onClick={() => toggleSection("educationDetails")}
            >
              <h4 className="collapser-header">
                Education Details
                <span className="expand-icon">
                  {expandedSections.educationDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.educationDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">University</label>
                  <input
                    type="text"
                    placeholder="Search by university name"
                    className="input-box"
                    value={educationFilter}
                    onChange={(e) => setEducationFilter(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Diversity and Additional Info */}
            <div
              className="collapser"
              onClick={() => toggleSection("diversityDetails")}
            >
              <h4 className="collapser-header">
                Diversity and Additional Info
                <span className="expand-icon">
                  {expandedSections.diversityDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.diversityDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">Gender</label>
                  <div className="modern-tag-selection">
                    {["All Candidates", "Male Candidates", "Female Candidates"].map(
                      (option) => (
                        <span
                          key={option}
                          className={`tag ${
                            gender === option ? "selected" : ""
                          }`}
                          onClick={() => setGender(option)}
                        >
                          {option}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="checkbox-field">
                  <input
                    type="checkbox"
                    id="disability"
                    checked={disability}
                    onChange={(e) => setDisability(e.target.checked)}
                  />
                  <label htmlFor="disability">Person with Disability Only</label>
                </div>
              </div>
            )}
          </div>

          {/* Exclude Keyword */}
          <div className="form-field">
            <label className="field-label">Exclude Keyword</label>
            <input
              type="text"
              placeholder="Exclude candidates with this keyword"
              className="input-box"
              value={excludeKeyword}
              onChange={(e) => setExcludeKeyword(e.target.value)}
            />
          </div>

          {/* IT Skills */}
          <div className="form-field">
            <label className="field-label">IT Skills</label>
            <input
              type="text"
              placeholder="Enter IT Skills"
              className="input-box"
              value={itSkillsFilter}
              onChange={(e) => setItSkillsFilter(e.target.value)}
            />
          </div>

          {/* Active In and Search Button */}
          <div className="search-action-box">
            <div className="active-in-dropdown">
              <span className="active-in-label">Active In:</span>
              <div className="modern-tag-selection">
                {["1 day", "15 days", "30 days", "3 months", "6 months"].map(
                  (option) => (
                    <span
                      key={option}
                      className={`tag ${activeIn === option ? "selected" : ""}`}
                      onClick={() => setActiveIn(option)}
                    >
                      {option}
                    </span>
                  )
                )}
              </div>
            </div>
            <button type="submit" className="search-button-resume">
              Search Candidates
            </button>
          </div>
        </form>
      </div>

      {/* Recent Searches */}
      <div className="recent-searches">
        <h2 className="recent-searches-heading">Recent Searches</h2>
        <ul className="recent-searches-list">
          <li>
            <p>Python, React | 5+ years | Gurugram</p>
            <div className="actions">
              <button>Fill Search</button>
              <button>Search Profiles</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchResumes;
