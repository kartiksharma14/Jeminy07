import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { jwtDecode } from "jwt-decode";
import JobStatus from "./JobStatus";
import UpdatePasswordModal from "./UpdatePasswordModal";

/** Helper function to format 'YYYY-MM-DD' into 'DD Mon YYYY' */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return dateObj.toLocaleDateString("en-GB", options); // e.g. "24 Mar 2025"
}

// Enhanced CVQuotaCard Component with refined progress bar
const CVQuotaCard = () => {
  const [quotaData, setQuotaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const token = localStorage.getItem("RecruiterToken");
        const response = await fetch("http://localhost:5000/api/recruiter/cv-quota", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setQuotaData(data);
        } else {
          setError("Failed to load quota.");
        }
      } catch (err) {
        console.error("Error fetching quota:", err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuota();
  }, []);

  if (loading) {
    return <div className="quota-card">Loading quota...</div>;
  }

  if (error) {
    return <div className="quota-card error-text">{error}</div>;
  }

  const { quota, subscription } = quotaData;
  const { total, used, remaining, unlimited } = quota;
  const progressPercentage = unlimited ? 100 : (used / total) * 100;

  return (
    <div className="quota-card">
      <div className="quota-card-header">
        <h3>Quota Usage</h3>
      </div>

      {/* Row of Quota Stats */}
      <div className="quota-stats-row">
        <div className="quota-stat">
          <span className="quota-label">Total</span>
          <span className="quota-value">{unlimited ? "∞" : total}</span>
        </div>
        <div className="quota-stat">
          <span className="quota-label">Used</span>
          <span className="quota-value">{used}</span>
        </div>
        <div className="quota-stat">
          <span className="quota-label">Remaining</span>
          <span className="quota-value">{unlimited ? "∞" : remaining}</span>
        </div>
      </div>

      {/* Naukri-like Progress Bar */}
      <div className="naukri-progress-container">
        <div className="naukri-progress-bg">
          <div
            className="naukri-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            {!unlimited && (
              <span className="naukri-progress-label">
                {Math.round(progressPercentage)}%
              </span>
            )}
            {unlimited && (
              <span className="naukri-progress-label">Unlimited</span>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Validity */}
      <div className="quota-subscription">
        <span className="quota-subscription-text">
          Valid from <strong>{formatDate(subscription.start_date)}</strong> to{" "}
          <strong>{formatDate(subscription.end_date)}</strong>
        </span>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          </ul>
        </div>

        {/* Jobs & Responses Section */}
        <div className="sidebar-section">
          <p className="hd">Jobs & Responses</p>
          <ul className="leftNav">
            <li>
              <a href="/post-job">Post a Job</a>
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
              <a href="/reports/contacted-candidates">
                Contacted Candidate Report
              </a>
            </li>
          </ul>
        </div>

        {/* Administration Section */}
        <div className="sidebar-section">
          <p className="hd">Administration</p>
          <ul className="leftNav">
            <li>
              <a href="#" onClick={openModal}>
                Change Password
              </a>
            </li>
            <li>
              <a href="/settings/usage-guidelines">Usage Guidelines</a>
            </li>
          </ul>
        </div>
      </div>
      <UpdatePasswordModal isOpen={isModalOpen} onClose={closeModal} />
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

          {/* CV Quota Section (above Job Status) */}
          <section className="dashboard-section">
            <CVQuotaCard />
          </section>

          {/* Job Status Section */}
          <section className="dashboard-section">
            <JobStatus />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
