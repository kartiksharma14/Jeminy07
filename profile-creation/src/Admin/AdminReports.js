// src/Admin/AdminReports.js
import React, { useEffect, useState } from "react";
import "./AdminReports.css";
import RecruiterHomeHeader from "../RecruiterHomeHeader";
import RecruiterHomeFooter from "../RecruiterHomeFooter";
import AdminSidebar from "./AdminSidebar";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "candidates"

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for candidate list with pagination and free text search filter
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // New filter states
  const [keywords, setKeywords] = useState("");
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [includeRelocate, setIncludeRelocate] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [excludeKeyword, setExcludeKeyword] = useState("");
  const [itSkills, setItSkills] = useState("");
  const [activeIn, setActiveIn] = useState("");
  const [employmentDetails, setEmploymentDetails] = useState(false);
  const [educationDetails, setEducationDetails] = useState(false);
  const [diversityInfo, setDiversityInfo] = useState(false);

  // New state for collapsing advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Constant for pagination limit
  const candidateLimit = 10;

  // Fetch dashboard metrics using the admin token from localStorage
  const fetchMetrics = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/dashboard-metrics", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate list with pagination and advanced filters
  const fetchCandidates = async (page = 1) => {
    try {
      setCandidatesLoading(true);
      const token = localStorage.getItem("adminToken");
      // Build query parameters dynamically
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", candidateLimit);
      if (searchQuery) params.append("search", searchQuery);
      if (keywords) params.append("keywords", keywords);
      if (experienceMin) params.append("experienceMin", experienceMin);
      if (experienceMax) params.append("experienceMax", experienceMax);
      if (locationFilter) params.append("location", locationFilter);
      if (includeRelocate) params.append("includeRelocate", includeRelocate);
      if (salaryMin) params.append("salaryMin", salaryMin);
      if (salaryMax) params.append("salaryMax", salaryMax);
      if (excludeKeyword) params.append("excludeKeyword", excludeKeyword);
      if (itSkills) params.append("itSkills", itSkills);
      if (activeIn) params.append("activeIn", activeIn);
      if (employmentDetails) params.append("employmentDetails", employmentDetails);
      if (educationDetails) params.append("educationDetails", educationDetails);
      if (diversityInfo) params.append("diversityInfo", diversityInfo);

      const response = await fetch(
        `http://localhost:5000/api/admin/reports/candidates/?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const data = await response.json();
      setCandidates(data.candidates);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setCandidatesError(err.message);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Function to download the metrics report as a JSON file
  const downloadReport = () => {
    const reportData = metrics ? JSON.stringify(metrics, null, 2) : "";
    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to download the current page's candidate XLS file (paginated basic data)
  const downloadCurrentPageXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/candidates/fullxls/?page=${currentPage}&limit=${candidateLimit}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download current page XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "candidates_current_page.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to download the full candidate XLS file (all candidates, basic data)
  const downloadFullXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/reports/candidates/fullxls/?fullReport=true", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download full XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "candidates_full_report.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to download the current page's full candidate report (basic + profile details)
  const downloadCurrentPageFullCandidateReport = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/candidates/fullCandidateReportXls/?page=${currentPage}&limit=${candidateLimit}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download current page full candidate report XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "candidates_current_page_full_report.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to download full candidate report (all candidates with full details)
  const downloadFullCandidateReport = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/reports/candidates/fullCandidateReportXls?fullReport=true", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download full candidate report XLS");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "candidates_full_candidate_report.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to view candidate profile details as PDF
  const viewCandidateDetails = async (candidateId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/candidate-profile/${candidateId}/pdf`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download candidate profile PDF");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `candidate_${candidateId}_profile.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle handler for advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  // Handler for candidate search and filter submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Reset to page 1 on new search/filters
    fetchCandidates(1);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMetrics();
    fetchCandidates(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="enterprise-main">Loading...</div>;
  }
  if (error) {
    return <div className="enterprise-main">Error: {error}</div>;
  }

  return (
    <div className="enterprise-dashboard">
      <RecruiterHomeHeader />
      <div className="enterprise-layout">
        <AdminSidebar />
        <div className="enterprise-main">
          {/* Section Tabs */}
          <div className="section-tabs">
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Admin Report Dashboard
            </button>
            <button
              className={activeTab === "candidates" ? "active" : ""}
              onClick={() => setActiveTab("candidates")}
            >
              Candidate Report
            </button>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="enterprise-header">
                <h1>Admin Reports</h1>
                <button onClick={downloadReport}>Download Report</button>
              </div>
              <div className="enterprise-stats">
                <div className="enterprise-stat-card">
                  <div className="enterprise-stat-number">{metrics.totalRecruiters}</div>
                  <div className="enterprise-stat-label">Total Recruiters</div>
                </div>
                <div className="enterprise-stat-card">
                  <div className="enterprise-stat-number">{metrics.totalJobs}</div>
                  <div className="enterprise-stat-label">Total Jobs</div>
                </div>
                <div className="enterprise-stat-card">
                  <div className="enterprise-stat-number">{metrics.totalApplications}</div>
                  <div className="enterprise-stat-label">Total Applications</div>
                </div>
                <div className="enterprise-stat-card">
                  <div className="enterprise-stat-number">{metrics.uniqueCandidates}</div>
                  <div className="enterprise-stat-label">Unique Candidates</div>
                </div>
              </div>
              <div className="enterprise-card-section">
                {/* Job Posting Report */}
                <div className="enterprise-card">
                  <h2>Job Posting Report</h2>
                  <ul>
                    <li>Active Jobs: {metrics.activeJobs}</li>
                    <li>Approved Jobs: {metrics.approvedJobs}</li>
                    <li>Pending Jobs: {metrics.pendingJobs}</li>
                    <li>Rejected Jobs: {metrics.rejectedJobs}</li>
                  </ul>
                </div>
                {/* Candidate Report Summary */}
                <div className="enterprise-card">
                  <h2>Candidate Report</h2>
                  <ul>
                    <li>Total Applications: {metrics.totalApplications}</li>
                    <li>Unique Candidates: {metrics.uniqueCandidates}</li>
                  </ul>
                </div>
                {/* Recruiter (Client) Report */}
                <div className="enterprise-card">
                  <h2>Recruiter (Client) Report</h2>
                  <ul>
                    <li>Total Recruiters: {metrics.totalRecruiters}</li>
                    <li>Total Jobs Posted: {metrics.totalJobs}</li>
                  </ul>
                </div>
                {/* Approval/Decline Summary Report */}
                <div className="enterprise-card">
                  <h2>Approval/Decline Summary Report</h2>
                  <ul>
                    <li>Approved Jobs: {metrics.approvedJobs}</li>
                    <li>Pending Jobs: {metrics.pendingJobs}</li>
                    <li>Rejected Jobs: {metrics.rejectedJobs}</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === "candidates" && (
            <div className="enterprise-candidate-report">
              <h2>Candidate List</h2>
              {/* Advanced Filter Form */}
              <form className="enterprise-filter-form" onSubmit={handleSearchSubmit}>
                {/* Always visible basic field */}
                <div className="filter-row">
                  <div className="filter-field">
                    <label>Search Candidates</label>
                    <input
                      type="text"
                      placeholder="Search by name, email or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Toggle Advanced Filters */}
                <div className="advanced-toggle-row">
                  <button
                    type="button"
                    className="advanced-toggle-btn"
                    onClick={toggleAdvancedFilters}
                  >
                    {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
                  </button>
                </div>

                {/* Advanced filters (collapsible) */}
                {showAdvancedFilters && (
                  <>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Keywords</label>
                        <input
                          type="text"
                          placeholder="Enter keywords..."
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Experience (Years) - Min</label>
                        <input
                          type="number"
                          placeholder="Min years"
                          value={experienceMin}
                          onChange={(e) => setExperienceMin(e.target.value)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>Experience (Years) - Max</label>
                        <input
                          type="number"
                          placeholder="Max years"
                          value={experienceMax}
                          onChange={(e) => setExperienceMax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Location</label>
                        <input
                          type="text"
                          placeholder="Enter location"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>
                          <input
                            type="checkbox"
                            checked={includeRelocate}
                            onChange={(e) => setIncludeRelocate(e.target.checked)}
                          />
                          Include candidates who prefer to relocate
                        </label>
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Annual Salary (INR) - Min</label>
                        <input
                          type="number"
                          placeholder="Min salary"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>Annual Salary (INR) - Max</label>
                        <input
                          type="number"
                          placeholder="Max salary"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Employment Details</label>
                        <input
                          type="checkbox"
                          checked={employmentDetails}
                          onChange={(e) => setEmploymentDetails(e.target.checked)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>Education Details</label>
                        <input
                          type="checkbox"
                          checked={educationDetails}
                          onChange={(e) => setEducationDetails(e.target.checked)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>Diversity and Additional Info</label>
                        <input
                          type="checkbox"
                          checked={diversityInfo}
                          onChange={(e) => setDiversityInfo(e.target.checked)}
                        />
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Exclude Keyword</label>
                        <input
                          type="text"
                          placeholder="Exclude candidates with this keyword"
                          value={excludeKeyword}
                          onChange={(e) => setExcludeKeyword(e.target.value)}
                        />
                      </div>
                      <div className="filter-field">
                        <label>IT Skills</label>
                        <input
                          type="text"
                          placeholder="Enter IT Skills"
                          value={itSkills}
                          onChange={(e) => setItSkills(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Active In</label>
                        <select value={activeIn} onChange={(e) => setActiveIn(e.target.value)}>
                          <option value="">Select</option>
                          <option value="1day">1 day</option>
                          <option value="15days">15 days</option>
                          <option value="30days">30 days</option>
                          <option value="3months">3 months</option>
                          <option value="6months">6 months</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="filter-row">
                  <button className="filter-submit" type="submit">
                    Search Candidates
                  </button>
                </div>
              </form>

              {candidatesLoading ? (
                <p>Loading candidates...</p>
              ) : candidatesError ? (
                <p>Error: {candidatesError}</p>
              ) : (
                <>
                  <table className="candidate-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Last Login</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate) => (
                        <tr key={candidate.candidate_id}>
                          <td>{candidate.candidate_id}</td>
                          <td>{candidate.name}</td>
                          <td>{candidate.email}</td>
                          <td>{candidate.phone}</td>
                          <td>{candidate.formattedLastLogin}</td>
                          <td>
                            <button onClick={() => viewCandidateDetails(candidate.candidate_id)}>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-controls">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => fetchCandidates(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => fetchCandidates(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              <div className="download-buttons">
                <button onClick={downloadCurrentPageXls}>Download This Page XLS</button>
                <button onClick={downloadFullXls}>Download Full XLS</button>
                <button onClick={downloadCurrentPageFullCandidateReport}>
                  Download This Page Full Candidate Report
                </button>
                <button onClick={downloadFullCandidateReport}>
                  Download Full Candidate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default AdminReports;
