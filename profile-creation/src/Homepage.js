// src/components/HomePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import Footer from "./components/Footer";
import JobCard from "./JobCard"; // Ensure JobCard.js is in the correct path
import "./HomePage.css";

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
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setProfile(data.data);
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
          {profile && profile.photo ? (
            <img className="profile-img" src={profile.photo} alt="Profile" />
          ) : (
            <img
              className="profile-img"
              src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
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

const RecentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  // Pagination state for Recent Jobs
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    // Fetch recent jobs with pagination
    fetch(`http://localhost:5000/api/candidate/search-all?page=${currentPage}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) {
          setJobs(data.jobs);
          setCurrentPage(data.currentPage || currentPage);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err));

    // Fetch saved jobs
    fetchSavedJobs();
  }, [currentPage]);

  // Helper to fetch saved jobs from the backend
  const fetchSavedJobs = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://localhost:5000/api/saved-jobs", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success && data.savedJobs) {
        const savedJobsData = data.savedJobs.map((saved) => ({
          ...saved.JobPost, // Extract the JobPost details
          saved_job_id: saved.saved_job_id,
        }));
        setSavedJobs(savedJobsData);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  // handleToggleSave computes the current saved status from state
  const handleToggleSave = async (jobId) => {
    const token = localStorage.getItem("authToken");
    const isSaved = savedJobs.some((job) => job.job_id === jobId);
    console.log(`Toggling save for job ${jobId}. Currently saved: ${isSaved}`);
    try {
      if (isSaved) {
        // Unsave job: DELETE request
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/save`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        console.log("Unsave response:", res.status);
        if (res.ok) {
          console.log(`Job ${jobId} unsaved successfully.`);
        } else {
          const errorData = await res.json();
          console.error("Failed to unsave job", errorData);
        }
      } else {
        // Save job: POST request
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log("Save response:", res.status);
        if (res.ok) {
          const jobToSave = jobs.find((job) => job.job_id === jobId);
          if (jobToSave) {
            setSavedJobs((prevSavedJobs) => [...prevSavedJobs, jobToSave]);
            console.log(`Job ${jobId} saved successfully.`);
          } else {
            console.warn(`Job ${jobId} not found in current jobs list, but will refresh saved jobs.`);
          }
        } else {
          const errorData = await res.json();
          console.error("Failed to save job", errorData);
        }
      }
      // Refresh saved jobs list after toggling
      fetchSavedJobs();
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="hp-recent-jobs-card">
      <section className="job-section">
        <h2 className="section-heading">Recent Jobs</h2>
        {jobs.length > 0 ? (
          <>
            {jobs
            .filter((job) => !savedJobs.some((saved) => saved.job_id === job.job_id))
            .map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                savedJobs={savedJobs}
                onToggleSave={handleToggleSave}
              />
          ))}

            {/* Render pagination only if more than one page exists */}
            {totalPages > 1 && (
              <div className="hp-pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="section-message">Loading jobs...</p>
        )}
      </section>

      <section className="job-section">
        <h2 className="section-heading">Saved Jobs</h2>
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              savedJobs={savedJobs}
              onToggleSave={handleToggleSave}
            />
          ))
        ) : (
          <p className="section-message">No saved jobs</p>
        )}
      </section>
    </div>
  );
};

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="hp-dashboard">
        <div className="hp-layout">
          <div className="hp-left">
            <Sidebar />
          </div>
          <div className="hp-right">
            <RecentJobs />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
