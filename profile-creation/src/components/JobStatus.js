import React, { useState, useEffect } from "react";
import "./JobStatus.css";

const JobPostingsCard = () => {
  const [jobData, setJobData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = (page = 1) => {
    const token = localStorage.getItem("RecruiterToken");

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/api/recruiter/jobs/most-recent?page=${page}`, {
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
          setJobData(data.jobs);
          setPagination(data.pagination);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return <div className="job-postings-card">Loading...</div>;
  }

  if (error) {
    return <div className="job-postings-card">{error}</div>;
  }

  if (!jobData.length) {
    return <div className="job-postings-card">No job data available.</div>;
  }

  return (
    <div className="job-postings-card">
      <div className="job-postings-header">
        <h3>Job Postings</h3>
      </div>

      <div className="job-postings-metrics">
        {jobData.map((job) => (
          <div key={job.job_id} className="job-item">
            <div className="metric">
              <span className="metric-label">Job ID</span>
              <span className="metric-value">{job.job_id}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Job Title</span>
              <span className="metric-value">{job.jobTitle}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Company Name</span>
              <span className="metric-value">{job.companyName}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Location</span>
              <span className="metric-value">{job.locations}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Status</span>
              <span className="metric-value">
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Application Count</span>
              <span className="metric-value">{job.applicationCount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          className="paginate-btn"
          disabled={!pagination.hasPreviousPage}
          onClick={() => fetchJobs(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          className="paginate-btn"
          disabled={!pagination.hasNextPage}
          onClick={() => fetchJobs(pagination.currentPage + 1)}
        >
          Next
        </button>
      </div>

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