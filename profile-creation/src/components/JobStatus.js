import React, { useState, useEffect } from "react";
import "./JobStatus.css";

const JobPostingsCard = () => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the bearer token from local storage
    const token = localStorage.getItem("RecruiterToken");

    // Ensure you have a token before making the call
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/recruiter/jobs/most-recent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setJobData(data.job);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="job-postings-card">Loading...</div>;
  }

  if (error) {
    return <div className="job-postings-card">{error}</div>;
  }

  if (!jobData) {
    return <div className="job-postings-card">No job data available.</div>;
  }

  return (
    <div className="job-postings-card">
      {/* Card Header */}
      <div className="job-postings-header">
        <h3>Job Postings</h3>
      </div>

      {/* Job Metrics */}
      <div className="job-postings-metrics">
        <div className="metric">
          <span className="metric-label">Job Title</span>
          <span className="metric-value">{jobData.jobTitle}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Company Name</span>
          <span className="metric-value">{jobData.companyName}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Location</span>
          <span className="metric-value">{jobData.locations}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Last Updated</span>
          <span className="metric-value">{jobData.updatedAt}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Status</span>
          <span className="metric-value">
          {jobData.status.charAt(0).toUpperCase() + jobData.status.slice(1)}
        </span>
        </div>
        <div className="metric">
          <span className="metric-label">Application Count</span>
          <span className="metric-value">{jobData.applicationCount}</span>
        </div>
      </div>

      {/* Footer: Post Job on left, Manage Jobs on right */}
      <div className="job-postings-footer">
        <a className="post-job-link" href="/post-job">
          Post Job
        </a>
        <a className="manage-jobs-link" href="/manage-responses">
          Manage Jobs &amp; Responses
        </a>
      </div>
    </div>
  );
};

export default JobPostingsCard;
