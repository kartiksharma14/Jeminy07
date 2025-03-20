// src/components/ApplicationStatus.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import Footer from "./components/Footer";
import "./ApplicationStatus.css";

// Sidebar Component
const Sidebar = () => {
  const [profile, setProfile] = useState(null);
  const [currentEmployment, setCurrentEmployment] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    let userId;

    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        userId = decoded.userId || decoded.id;
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
    if (!userId) {
      userId = 2;
    }

    fetch(`http://localhost:5000/api/candidate-profile/user-details/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setProfile(data.data);
          // Find current employment (where current_employment is "Yes")
          if (data.data.employment && data.data.employment.length > 0) {
            const currentJob = data.data.employment.find(
              (e) => e.current_employment === "Yes"
            );
            setCurrentEmployment(currentJob);
          }
        }
      })
      .catch((err) =>
        console.error("Error fetching candidate profile:", err)
      );
  }, []);

  return (
    <div className="sidebar-container">
      <div className="profile-section">
        <div className="profile-img-wrapper">
          <div className="profile-ring">
            <svg className="progress-ring" viewBox="0 0 100 100">
              <circle className="progress-ring-bg" cx="50" cy="50" r="40"></circle>
              <circle className="progress-ring-fill" cx="50" cy="50" r="40"></circle>
            </svg>
          </div>
          {profile && profile.photo ? (
            <img className="profile-img" src={profile.photo} alt="Profile" />
          ) : (
            <img
              className="profile-img"
              src="https://via.placeholder.com/80"
              alt=""
            />
          )}
        </div>
        <h3 className="profile-name">
          {profile ? profile.name : "Loading..."}
        </h3>
        <p className="profile-title">
          {currentEmployment
            ? `${currentEmployment.current_job_title} at ${currentEmployment.current_company_name}`
            : "No current employment info"}
        </p>
      </div>

      <div className="sidebar-nav">
        <ul>
          <li>
            <Link to="/homepage">My Home</Link>
          </li>
          <li>
            <Link to="/job-list">Jobs</Link>
          </li>
          <li>
            <Link to="/home">Profile</Link>
          </li>
          <li>
            <Link to="/application-status">Application Status</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const ApplicationStatus = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  // State for list view
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all"); // Options: "all", "pending", "rejected"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for single application detail view
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Fetch application detail if applicationId exists
  useEffect(() => {
    if (applicationId) {
      const fetchApplicationDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const res = await fetch(`http://localhost:5000/api/candidate/applications/${applicationId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setApplicationDetail(data.application);
          } else {
            setDetailError(data.message || "Failed to fetch application details");
          }
        } catch (err) {
          console.error(err);
          setDetailError("An error occurred while fetching application details");
        } finally {
          setDetailLoading(false);
        }
      };
      fetchApplicationDetail();
    }
  }, [applicationId, authToken]);

  // Fetch list of applications when no applicationId is provided.
  useEffect(() => {
    if (!applicationId) {
      const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
          let url = "http://localhost:5000/api/candidate/applications";
          if (filter !== "all") {
            url += `?status=${filter}`;
          }
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setApplications(data.applications);
          } else {
            setError(data.message || "Failed to fetch applications");
          }
        } catch (err) {
          console.error(err);
          setError("An error occurred while fetching applications");
        } finally {
          setLoading(false);
        }
      };

      fetchApplications();
    }
  }, [filter, applicationId, authToken]);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleApplicationClick = (id) => {
    navigate(`/application-status/${id}`);
  };

  // If applicationId is present, display the detail view.
  if (applicationId) {
    return (
      <>
        <Header />
        <div className="application-detail-container">
          <button onClick={() => navigate("/application-status")}>
            ← Back to Applications List
          </button>
          {detailLoading ? (
            <p>Loading application details...</p>
          ) : detailError ? (
            <p className="error">{detailError}</p>
          ) : applicationDetail ? (
            <div className="application-detail">
              <h2>{applicationDetail.JobPost?.jobTitle || "Job Title Not Available"}</h2>
              <p><strong>Status:</strong> {applicationDetail.status}</p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(applicationDetail.applied_at).toLocaleString()}
              </p>
              {/* Render additional details as needed */}
            </div>
          ) : (
            <p>No application details found.</p>
          )}
        </div>
        <Footer />
      </>
    );
  }

  // Otherwise, display the list of applications.
  return (
    <>
      <Header />
      <div className="hp-dashboard">
        <div className="hp-layout">
          <div className="hp-left">
            <Sidebar />
          </div>
          <div className="hp-right">
            <div className="application-status-container">
              <h1>Application Status</h1>
              <div className="filter-buttons">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={filter === "all" ? "active" : ""}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("pending")}
                  className={filter === "pending" ? "active" : ""}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("rejected")}
                  className={filter === "rejected" ? "active" : ""}
                >
                  Rejected
                </button>
              </div>
              {loading ? (
                <p>Loading applications...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <ul className="applications-list">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <li
                        key={app.application_id}
                        onClick={() => handleApplicationClick(app.application_id)}
                        className="application-card"
                      >
                        <h3>
                          {app.JobPost?.jobTitle || "Job Title Not Available"}
                        </h3>
                        <p>Status: {app.status}</p>
                        <p>
                          Applied At:{" "}
                          {new Date(app.applied_at).toLocaleString()}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p>No applications found.</p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationStatus;
