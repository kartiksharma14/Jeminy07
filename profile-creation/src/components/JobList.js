// src/components/JobList.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "./Footer";
import JobResultsSidebar from "./JobResultsSidebar";
import "./JobList.css";

const JobList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Retrieve query from state (passed from Header)
  const { query } = location.state || {};
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs based on provided filters and page number
  const fetchJobs = async (customQuery, page = 1) => {
    try {
      const token = localStorage.getItem("authToken");
      let baseUrl = "";
      let params = {};
  
      // Determine if any filters are provided
      const hasKeywords =
        customQuery.keywords && customQuery.keywords.trim() !== "";
      const hasLocations =
        customQuery.locations && customQuery.locations.trim() !== "";
      // Change: Now, even if experience === "0", it counts as provided.
      const hasExperience = customQuery.experience !== "";
  
      if (!hasKeywords && !hasLocations && !hasExperience) {
        // No filters provided at all
        baseUrl = "http://localhost:5000/api/search-all";
        params = { keywords: "", locations: "", page };
      } else if (!hasKeywords && !hasLocations && hasExperience) {
        // Only experience filter provided (including "0")
        baseUrl = "http://localhost:5000/api/jobs/search/experience";
        params = { max_experience: customQuery.experience, page };
      } else {
        // For any other combination, include keywords and locations.
        baseUrl = "http://localhost:5000/api/search-all";
        params = {
          keywords: customQuery.keywords || "",
          locations: customQuery.locations || "",
          page,
        };
        // Add experience if provided (even if it's "0")
        if (hasExperience) {
          params.experience = customQuery.experience;
        }
      }
  
      const queryParams = new URLSearchParams(params).toString();
      const url = `${baseUrl}?${queryParams}`;
      console.log("Fetching jobs via:", url);
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
  
      // Expect response to have a "jobs" array or "results" array.
      const fetchedJobs = data.jobs || data.results || [];
      setResults(fetchedJobs);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching jobs.");
      setResults([]);
    }
  };
  
  useEffect(() => {
    // Use the query from Header (or empty object if none) and current page
    fetchJobs(query || {}, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, currentPage]);

  // Handler for sidebar filter changes – refetch jobs with new filters and reset to page 1.
  const handleFilterChange = async (filters) => {
    setCurrentPage(1);
    await fetchJobs(filters, 1);
  };

  // When a job card is clicked, navigate to the job preview page.
  const handleViewJob = (job) => {
    navigate("/job-preview", { state: { jobData: job } });
  };

  return (
    <div className="joblist-container">
      <Header />
      <div className="joblist-layout">
        <JobResultsSidebar onFilterChange={handleFilterChange} />
        <div className="joblist-main">
          <h1 className="joblist-title">Job Search Results</h1>
          {error && <div className="joblist-error">{error}</div>}
          <div className="joblist-summary">
            <p>Total Jobs: {results.length}</p>
          </div>
          {results.length > 0 ? (
            <>
              <div className="joblist-grid">
                {results.map((job) => (
                  <div
                    key={job.job_id}
                    className="joblist-card"
                    onClick={() => handleViewJob(job)}
                  >
                    <h2 className="joblist-card-title">
                      {job.jobTitle || "No Title Provided"}
                    </h2>
                    <p className="joblist-card-company">
                      {job.companyName || "No Company"}
                    </p>
                    <div className="joblist-card-meta">
                      <span className="joblist-card-location">
                        {job.locations || "No Location"}
                      </span>
                      <span className="joblist-card-type">
                        {job.employmentType || "Not Specified"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Render pagination only if more than one page exists */}
              {totalPages > 1 && (
                <div className="joblist-pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="joblist-no-data">No jobs found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobList;
