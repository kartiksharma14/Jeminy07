import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {jwtDecode} from "jwt-decode";
const JobStatus = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust this value to show more/less jobs per page

  // Retrieve token from localStorage (or your preferred storage)
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      console.error('No token found. Please log in.');
      setLoading(false);
      return;
    }
    fetch('http://localhost:5000/api/recruiter/jobs/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching job status:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div>Loading job status...</div>;
  }

  // Pagination logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="job-status">
      <div className="heading flex-row">
        <strong className="history-header">Job Status</strong>
      </div>
      <div className="job-list">
        <div className="scrollable">
          <ul>
            {currentJobs.map((job) => (
              <li key={job.job_id}>
                <div className="job-item">
                  <h4 className="job-title">{job.jobTitle}</h4>
                  <p className="job-details">
                    Status: {job.status} | Created on: {new Date(job.job_creation_date).toLocaleDateString()} | Location: {job.locations}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {pageNumbers.map((number) => (
            <span
              key={number}
              onClick={() => setCurrentPage(number)}
              className={number === currentPage ? "active" : ""}
            >
              {number}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};


const Sidebar = () => {
  return (
    <aside id="colL_MNR" className="sidebar">
      <div className="p1_6">
        {/* Resdex Searches Section */}
        <div className="sidebar-section">
          <p className="hd">Search Resumes</p>
          <ul className="leftNav">
            <li>
              <a href="/candidates">Advanced Search</a>
            </li>
            <li>
              <a href="/search/featured" target="_blank">
                Featured Resumes
              </a>
            </li>
          </ul>
        </div>

        {/* Jobs & Responses Section */}
        <div className="sidebar-section">
          <p className="hd">Jobs & Responses</p>
          <ul className="leftNav">
            <li>
              <a href="/edit-jobs">Edit/Refresh/Repost Jobs</a>
            </li>
            <li>
              <a href="/jeminy-assessments" target="_blank">
                Jeminy Assessments
              </a>
            </li>
            <li>
              <a href="/manage-responses">Manage Responses</a>
            </li>
          </ul>
        </div>

        {/* Reports & MIS Section */}
        <div className="sidebar-section">
          <p className="hd">Reports & MIS</p>
          <ul className="leftNav">
            <li>
              <a href="/reports/database-usage">Database Usage Reports</a>
            </li>
            <li>
              <a href="/reports/login">Login Report</a>
            </li>
            <li>
              <a href="/reports/contacted-candidates">Contacted Candidate Report</a>
            </li>
          </ul>
        </div>

        {/* Administration Section */}
        <div className="sidebar-section">
          <p className="hd">Administration</p>
          <ul className="leftNav">
            <li>
              <a href="/settings/product">Product Settings</a>
            </li>
            <li>
              <a href="/settings/change-password">Change Password</a>
            </li>
            <li>
              <a href="/settings/usage-guidelines">Usage Guidelines</a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

const Dashboard = () => {
  const token = localStorage.getItem("authToken");
  let companyName = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      companyName = decoded.company_name || ""; // Adjust key if necessary
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">
          <div className="dashboard-header">
            <h2>Welcome to the Recruiter Dashboard!</h2>
            {companyName && <span className="company-name">💼 {companyName}</span>}
          </div>

          {/* Job Status Section */}
          <section className="dashboard-section">
            <JobStatus />
          </section>

          {/* Add additional sections here as needed */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
