import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {jwtDecode} from "jwt-decode";
import JobStatus from "./JobStatus";
import UpdatePasswordModal from "./UpdatePasswordModal";

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
              {/* Instead of linking to another page, open the modal */}
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

          {/* Job Status Section */}
          <section className="dashboard-section">
            <JobStatus/>
          </section>

          {/* Add additional sections here as needed */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
