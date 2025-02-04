// SearchResumes.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchResumes.css";

const SearchResumes = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [activeIn, setActiveIn] = useState("7 days");
    const [noticePeriod, setNoticePeriod] = useState("Any");
    const [gender, setGender] = useState("All Candidates");
    const [minExperience, setMinExperience] = useState("");
    const [maxExperience, setMaxExperience] = useState("");
    const [keywords, setKeywords] = useState("");
    const [location, setLocation] = useState("");
    const [relocate, setRelocate] = useState(false);
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");

    const navigate = useNavigate();

    const toggleSection = (section) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // Build query parameters
        const params = new URLSearchParams({
            min_experience: minExperience,
            max_experience: maxExperience,
            keywords,
            location,
            relocate,
            salary_min: salaryMin,
            salary_max: salaryMax,
            notice_period: noticePeriod,
            gender,
            active_in: activeIn,
        });

        // Navigate to CandidatesList with query parameters
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
                        <label htmlFor="keywords" className="field-label">
                            Keywords
                        </label>
                        <input
                            type="text"
                            id="keywords"
                            placeholder="Enter keywords like skills, designation, or company"
                            className="input-box"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
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
                            Include candidates who prefer to relocate to above locations
                        </label>
                    </div>

                    {/* Annual Salary */}
                    <div className="form-field">
                        <label className="field-label">Annual Salary</label>
                        <div className="salary-range">
                            <input
                                type="number"
                                placeholder="Min salary (INR)"
                                className="input-box"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                                min="0"
                            />
                            <span className="separator">to</span>
                            <input
                                type="number"
                                placeholder="Max salary (Lacs)"
                                className="input-box"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                                min="0"
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                                        </svg>
                                    )}
                                </span>
                            </h4>
                        </div>
                        {expandedSections.employmentDetails && (
                            <div className="collapsible-content">
                                <div className="form-field">
                                    <label className="field-label">Department and Role</label>
                                    <input
                                        type="text"
                                        placeholder="Add Department/Role"
                                        className="input-box"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="field-label">Industry</label>
                                    <input
                                        type="text"
                                        placeholder="Add Industry"
                                        className="input-box"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="field-label">Company</label>
                                    <input
                                        type="text"
                                        placeholder="Add Company"
                                        className="input-box"
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="field-label">Designation</label>
                                    <input
                                        type="text"
                                        placeholder="Add Designation"
                                        className="input-box"
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
                                                className={`tag ${noticePeriod === period ? "selected" : ""
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                                        </svg>
                                    )}
                                </span>
                            </h4>
                        </div>
                        {expandedSections.educationDetails && (
                            <div className="collapsible-content">
                                <div className="form-field">
                                    <label className="field-label">UG Qualification</label>
                                    <div className="modern-tag-selection">
                                        {[
                                            "Any UG Qualification",
                                            "Specific UG Qualification",
                                            "No UG Qualification",
                                        ].map((option) => (
                                            <span
                                                key={option}
                                                className="tag"
                                                onClick={() => console.log(option)}
                                            >
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="field-label">PG Qualification</label>
                                    <div className="modern-tag-selection">
                                        {[
                                            "Any PG Qualification",
                                            "Specific PG Qualification",
                                            "No PG Qualification",
                                        ].map((option) => (
                                            <span
                                                key={option}
                                                className="tag"
                                                onClick={() => console.log(option)}
                                            >
                                                {option}
                                            </span>
                                        ))}
                                    </div>
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                        >
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
                                        {[
                                            "All Candidates",
                                            "Male Candidates",
                                            "Female Candidates",
                                        ].map((option) => (
                                            <span
                                                key={option}
                                                className={`tag ${gender === option ? "selected" : ""
                                                    }`}
                                                onClick={() => setGender(option)}
                                            >
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="checkbox-field">
                                    <input type="checkbox" id="disability" />
                                    <label htmlFor="disability">
                                        Person with Disability Only
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Box with Active In and Search Button */}
                    <div className="search-action-box">
                        <div className="active-in-dropdown">
                            <span className="active-in-label">Active In:</span>
                            <div className="modern-tag-selection">
                                {["1 day", "7 days", "30 days", "3 months", "6 months"].map(
                                    (option) => (
                                        <span
                                            key={option}
                                            className={`tag ${activeIn === option ? "selected" : ""
                                                }`}
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

            {/* Recent Searches Section */}
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
