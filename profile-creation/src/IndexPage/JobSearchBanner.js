import React from "react";
import { FaSearch } from "react-icons/fa";
import "./JobSearchBanner.css";

function JobSearchBanner() {
  return (
    <div className="jobsearch-banner">
      <div className="jobsearch-content">
        <h1 className="jobsearch-title">Find Your Dream Job Now</h1>
        <p className="jobsearch-subtitle">
          5 lakh+ jobs for you to explore.
        </p>
        <div className="jobsearch-searchbar">
          <input type="text" placeholder="Search jobs..." />
          <button type="button">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="jobsearch-image">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="Team collaboration at work"
        />
      </div>
    </div>
  );
}

export default JobSearchBanner;
