// src/Admin/AdminReports.js
import React, { useEffect, useState } from "react";
import "./AdminReports.css";
import RecruiterHomeHeader from "../RecruiterHomeHeader";
import RecruiterHomeFooter from "../RecruiterHomeFooter";
import AdminSidebar from "./AdminSidebar";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "candidates", "clients"

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

  // New filter states for candidates
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

  // Constant for pagination limit (for candidates)
  const candidateLimit = 10;

  // ---------------- Dashboard & Candidates Fetching ----------------

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

  // Fetch candidate list with pagination and filters
  const fetchCandidates = async (page = 1) => {
    try {
      setCandidatesLoading(true);
      const token = localStorage.getItem("adminToken");

      if (showAdvancedFilters) {
        // Build advanced query parameters only.
        const advancedParams = new URLSearchParams();
        advancedParams.append("page", page);
        advancedParams.append("limit", candidateLimit);
        if (searchQuery) advancedParams.append("keywords", searchQuery);
        if (experienceMin) advancedParams.append("experienceMin", experienceMin);
        if (experienceMax) advancedParams.append("experienceMax", experienceMax);
        if (locationFilter) advancedParams.append("location", locationFilter);
        if (includeRelocate) advancedParams.append("includeRelocate", includeRelocate);
        if (salaryMin) advancedParams.append("salaryMin", salaryMin);
        if (salaryMax) advancedParams.append("salaryMax", salaryMax);
        if (excludeKeyword) advancedParams.append("excludeKeyword", excludeKeyword);
        if (itSkills) advancedParams.append("itSkills", itSkills);
        if (activeIn) advancedParams.append("activeIn", activeIn);
        if (employmentDetails) advancedParams.append("employmentDetails", employmentDetails);
        if (educationDetails) advancedParams.append("educationDetails", educationDetails);
        if (diversityInfo) advancedParams.append("diversityInfo", diversityInfo);

        const advancedUrl = `http://localhost:5000/api/admin/reports/candidates/?${advancedParams.toString()}`;
        console.log("Advanced URL:", advancedUrl);

        const response = await fetch(advancedUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch candidates, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Advanced data:", data);
        setCandidates(data.candidates);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        // Build query parameters for basic filters
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

        const url = `http://localhost:5000/api/admin/reports/candidates/?${params.toString()}`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }
        const data = await response.json();
        setCandidates(data.candidates);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      setCandidatesError(err.message);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // ---------------- Download Functions ----------------

  // Download metrics report as JSON
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

  // Download current page's candidate XLS file
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

  // Download full candidate XLS file
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

  // Download current page's full candidate report XLS file
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

  // Download full candidate report XLS file (all candidates)
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

  // Download current page's subscriptions XLS file
  const downloadSubscriptionsCurrentPageXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/admin/subscriptions/download?page=${subscriptionCurrentPage}&limit=10`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download current page subscriptions XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "subscriptions_current_page.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Download full subscriptions XLS file (all subscriptions)
  const downloadSubscriptionsFullXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/subscriptions/download/full", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download full subscriptions XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "subscriptions_full_report.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Client download functions (clients)
  const downloadClientsCurrentPageXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/clients/download?page=${clientCurrentPage}&limit=10`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download current page clients XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "clients_current_page.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadClientsFullXls = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/clients/download?fullReport=true", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to download full clients XLS file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "clients_full_report.xlsx";
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

  // --------------------- Client Report Section ---------------------
   // New state for showing client details modal
   const [showClientModal, setShowClientModal] = useState(false);
   const [clientModalData, setClientModalData] = useState(null);

  // State for client report sub-tabs: "clients", "recruiters", "subscriptions"
  const [clientReportTab, setClientReportTab] = useState("clients");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientList, setClientList] = useState([]);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientError, setClientError] = useState(null);
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [clientTotalPages, setClientTotalPages] = useState(1);

  // Client dropdown for recruiters filter
  const [clientDropdown, setClientDropdown] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  // Recruiters for selected client
  const [recruiters, setRecruiters] = useState([]);
  const [recruitersLoading, setRecruitersLoading] = useState(false);
  const [recruitersError, setRecruitersError] = useState(null);

  // Subscriptions data
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [subscriptionsError, setSubscriptionsError] = useState(null);
  const [subscriptionCurrentPage, setSubscriptionCurrentPage] = useState(1);
  const [subscriptionTotalPages, setSubscriptionTotalPages] = useState(1);
  const [showExpiring, setShowExpiring] = useState(false);

  // Fetch client dropdown data
  const fetchClientDropdown = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/clients-dropdown", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch client dropdown");
      }
      const data = await response.json();
      setClientDropdown(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  // Function to fetch client subscription and recruiters data, then show modal
  const viewClientDetails = async (clientId) => {
    try {
      const token = localStorage.getItem("adminToken");
      // Fetch subscription & client details
      const subResponse = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/subscription`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!subResponse.ok) {
        throw new Error("Failed to fetch client subscription details");
      }
      const subData = await subResponse.json();

      // Fetch recruiters for this client
      const recResponse = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/recruiters`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!recResponse.ok) {
        throw new Error("Failed to fetch recruiters for client");
      }
      const recData = await recResponse.json();

      // Combine the results
      setClientModalData({
        subscription: subData.data.subscription,
        client: subData.data.client,
        recruiters: recData.recruiters || []
      });
      setShowClientModal(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Function to close the modal
  const closeClientModal = () => {
    setShowClientModal(false);
    setClientModalData(null);
  };
  // Fetch client list; if a search query exists, use the search endpoint
  const fetchClients = async (page = 1) => {
    try {
      setClientLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = "";
      if (clientSearchQuery) {
        url = `http://localhost:5000/api/admin/clients/search?query=${clientSearchQuery}`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to search clients");
        }
        const data = await response.json();
        setClientList(data.data || []);
        setClientTotalPages(1);
        setClientCurrentPage(1);
      } else {
        url = `http://localhost:5000/api/admin/clients?page=${page}&limit=10`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClientList(data.data);
        setClientCurrentPage(page);
        setClientTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      setClientError(err.message);
    } finally {
      setClientLoading(false);
    }
  };

  // Fetch recruiters for a selected client
  const fetchRecruitersForClient = async (clientId) => {
    try {
      setRecruitersLoading(true);
      console.log(clientId);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/recruiters`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recruiters");
      }
      const data = await response.json();
      setRecruiters(data.recruiters || []);
    } catch (err) {
      setRecruitersError(err.message);
    } finally {
      setRecruitersLoading(false);
    }
  };

  // Fetch subscriptions; if showExpiring is true, fetch expiring subscriptions
  const fetchSubscriptions = async (page = 1) => {
    try {
      setSubscriptionsLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = "";
      if (showExpiring) {
        url = `http://localhost:5000/api/admin/subscriptions/expiring?days=250`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch expiring subscriptions");
        }
        const data = await response.json();
        setSubscriptions(data.data);
        setSubscriptionTotalPages(1);
        setSubscriptionCurrentPage(1);
      } else {
        url = `http://localhost:5000/api/admin/subscriptions?page=${page}&limit=10`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        const data = await response.json();
        setSubscriptions(data.data);
        setSubscriptionCurrentPage(page);
        setSubscriptionTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      setSubscriptionsError(err.message);
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  // When showExpiring changes, re-fetch subscriptions
  useEffect(() => {
    fetchSubscriptions(1);
  }, [showExpiring]);

  // ---------------- Effects ----------------

  useEffect(() => {
    fetchMetrics();
    fetchCandidates(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When switching to the Client Report tab, load client data
  useEffect(() => {
    if (activeTab === "clients") {
      fetchClientDropdown();
      fetchClients(1);
      fetchSubscriptions(1);
    }
  }, [activeTab]);

  // When a client is selected in the Recruiters sub-tab, fetch recruiters
  useEffect(() => {
    if (selectedClient) {
      fetchRecruitersForClient(selectedClient);
    }
  }, [selectedClient]);

  // ---------------- Render ----------------

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
            <button
              className={activeTab === "clients" ? "active" : ""}
              onClick={() => setActiveTab("clients")}
            >
              Client Report
            </button>
          </div>

          {/* Dashboard Tab */}
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

          {/* Candidate Tab */}
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

                    {/* Submit Button */}
                    <div className="filter-row">
                      <button className="filter-submit" type="submit">
                        Search Candidates
                      </button>
                    </div>
                  </>
                )}
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

          {/* Client Report Tab */}
          {activeTab === "clients" && (
            <div className="enterprise-client-report">
              <h2>Client Report</h2>
              <div className="client-report-tabs">
                <button
                  className={clientReportTab === "clients" ? "active" : ""}
                  onClick={() => setClientReportTab("clients")}
                >
                  Clients
                </button>
                <button
                  className={clientReportTab === "recruiters" ? "active" : ""}
                  onClick={() => setClientReportTab("recruiters")}
                >
                  Recruiters
                </button>
                <button
                  className={clientReportTab === "subscriptions" ? "active" : ""}
                  onClick={() => setClientReportTab("subscriptions")}
                >
                  Subscriptions
                </button>
              </div>

              {clientReportTab === "clients" && (
                <div>
                  <form onSubmit={(e) => { e.preventDefault(); fetchClients(1); }}>
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                    />
                    <button type="submit-report">Search</button>
                  </form>
                  {clientLoading ? (
                    <p>Loading clients...</p>
                  ) : clientError ? (
                    <p>Error: {clientError}</p>
                  ) : (
                    <table className="candidate-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Contact Person</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientList?.map((client) => (
                          <tr key={client.client_id}>
                            <td>{client.client_id}</td>
                            <td>{client.client_name}</td>
                            <td>{client.contact_person}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            <td>{client.address}</td>
                            <td>
                              <button onClick={() => viewClientDetails(client.client_id)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="pagination-controls">
                    <button
                      disabled={clientCurrentPage <= 1}
                      onClick={() => fetchClients(clientCurrentPage - 1)}
                    >
                      Previous
                    </button>
                    <span>
                      Page {clientCurrentPage} of {clientTotalPages}
                    </span>
                    <button
                      disabled={clientCurrentPage >= clientTotalPages}
                      onClick={() => fetchClients(clientCurrentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <div className="download-buttons">
                    <button onClick={downloadClientsCurrentPageXls}>Download This Page XLS</button>
                    <button onClick={downloadClientsFullXls}>Download Full XLS</button>
                  </div>
                </div>
              )}

              {clientReportTab === "recruiters" && (
                <div>
                  <label>Select Client: </label>
                  <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                    <option value="">Select a client</option>
                    {(clientDropdown || []).map((client) => (
                      <option key={client.value} value={client.value}>
                        {client.label}
                      </option>
                    ))}
                  </select>
                  {selectedClient ? (
                    recruitersLoading ? (
                      <p>Loading recruiters...</p>
                    ) : recruitersError ? (
                      <p>Error: {recruitersError}</p>
                    ) : (
                      <table className="candidate-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Acccount Active Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(recruiters || []).map((rec) => (
                            <tr key={rec.recruiter_id}>
                              <td>{rec.recruiter_id}</td>
                              <td>{rec.name}</td>
                              <td>{rec.email}</td>
                              <td>{rec.is_active ? "Active" : "Inactive"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    <p>Please select a client to view recruiters.</p>
                  )}
                </div>
              )}

              {clientReportTab === "subscriptions" && (
                <div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={showExpiring}
                        onChange={(e) => setShowExpiring(e.target.checked)}
                      />
                      Show Expiring Subscriptions
                    </label>
                  </div>
                  {subscriptionsLoading ? (
                    <p>Loading subscriptions...</p>
                  ) : subscriptionsError ? (
                    <p>Error: {subscriptionsError}</p>
                  ) : (
                    <>
                      <table className="candidate-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Client Name</th>
                            <th>CV Quota</th>
                            <th>Logins Allowed</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.map((sub) => (
                            <tr key={sub.subscription_id}>
                              <td>{sub.subscription_id}</td>
                              <td>{sub.client.client_name}</td>
                              <td>{sub.cv_download_quota}</td>
                              <td>{sub.login_allowed}</td>
                              <td>{sub.start_date}</td>
                              <td>{sub.end_date}</td>
                              <td>{sub.is_active ? "Yes" : "No"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!showExpiring && (
                        <div className="pagination-controls">
                          <button
                            disabled={subscriptionCurrentPage <= 1}
                            onClick={() => fetchSubscriptions(subscriptionCurrentPage - 1)}
                          >
                            Previous
                          </button>
                          <span>
                            Page {subscriptionCurrentPage} of {subscriptionTotalPages}
                          </span>
                          <button
                            disabled={subscriptionCurrentPage >= subscriptionTotalPages}
                            onClick={() => fetchSubscriptions(subscriptionCurrentPage + 1)}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  <div className="download-buttons">
                    <button onClick={downloadSubscriptionsCurrentPageXls}>
                      Download This Page XLS
                    </button>
                    <button onClick={downloadSubscriptionsFullXls}>
                      Download Full XLS
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Modal for Client Details */}
          {showClientModal && clientModalData && (
          <div className="modal-overlay-report" onClick={closeClientModal}>
            <div className="modal-content-report" onClick={(e) => e.stopPropagation()}>
              <h3>Client Details</h3>
              <p><strong>Client ID:</strong> {clientModalData.client.client_id}</p>
              <p><strong>Client Name:</strong> {clientModalData.client.client_name}</p>
              <p><strong>Email:</strong> {clientModalData.client.email}</p>
              <p><strong>Phone:</strong> {clientModalData.client.phone}</p>
              <h4>Subscription Details</h4>
              {clientModalData.subscription ? (
                <ul>
                  <li><strong>Subscription ID:</strong> {clientModalData.subscription.subscription_id}</li>
                  <li><strong>CV Download Quota:</strong> {clientModalData.subscription.cv_download_quota}</li>
                  <li><strong>Logins Allowed:</strong> {clientModalData.subscription.login_allowed}</li>
                  <li><strong>Start Date:</strong> {clientModalData.subscription.start_date}</li>
                  <li><strong>End Date:</strong> {clientModalData.subscription.end_date}</li>
                  <li><strong>Active:</strong> {clientModalData.subscription.is_active ? "Yes" : "No"}</li>
                </ul>
              ) : (
                <p>No subscription details found.</p>
              )}
              <h4>Recruiters</h4>
              {clientModalData.recruiters && clientModalData.recruiters.length > 0 ? (
                <table className="candidate-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientModalData.recruiters.map(rec => (
                      <tr key={rec.recruiter_id}>
                        <td>{rec.recruiter_id}</td>
                        <td>{rec.name}</td>
                        <td>{rec.email}</td>
                        <td>{rec.is_active ? "Active" : "Inactive"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recruiters found for this client.</p>
              )}
              <button onClick={closeClientModal}>Close</button>
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
