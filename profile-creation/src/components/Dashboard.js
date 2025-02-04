import React from "react";
import "./Dashboard.css";

const SavedSearches = () => {
  return (
    <div className="saved-searches">
      <div className="heading flex-row">
        <strong className="history-header">Saved Searches</strong>
        <a href="/v2/search/savedSearches" className="link ext">
          View All
        </a>
      </div>
      <div className="s-search-list">
        <div className="scrollable">
          <ul>
            <li>
              <div className="search-item">
                <h4 className="req">Execution Head_2</h4>
                <p className="search-details">
                  RoW, Vendor Management, Quality Process, Optical Testing, OFC, NLD, Project
                  Management | &gt;=13 years | 5-15 Lacs | Bhubaneswar, Kolkata, Ahmedabad
                </p>
                <div className="actions flex-row">
                  <a className="link fillSearch" href="/v3?agentId=65394872">
                    Fill this search
                  </a>
                  <a className="link ext" href="/v3/search?agentId=65394872">
                    10+ new profiles
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="search-item">
                <h4 className="req">Execution Head_1</h4>
                <p className="search-details">
                  Vendor Management, OFC, NLD, Deployment, Execution | &gt;=13 years | 5-15 Lacs |
                  Bhubaneswar, Kolkata, Ahmedabad
                </p>
                <div className="actions flex-row">
                  <a className="link fillSearch" href="/v3?agentId=65392286">
                    Fill this search
                  </a>
                  <a className="link ext" href="/v3/search?agentId=65392286">
                    10+ new profiles
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="search-item">
                <h4 className="req">CS - Pune</h4>
                <p className="search-details">
                  Sebi, Sebi Regulations, FEMA, Listing Agreement, Company Secretary | &gt;=6 years |
                  &lt;=8 Lacs | Pune
                </p>
                <div className="actions flex-row">
                  <a className="link fillSearch" href="/v3?agentId=65289732">
                    Fill this search
                  </a>
                  <a className="link ext" href="/v3/search?agentId=65289732">
                    1000+ new profiles
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
              <a href="/search/advanced">Advanced Search</a>
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
              <a href="/naukri-assessments" target="_blank">
                Naukri Assessments
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
  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">
          <h2>Welcome to the Recruiter Dashboard!</h2>
          <SavedSearches />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
