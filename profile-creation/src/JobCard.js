import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

const JobCard = ({ job, savedJobs, onToggleSave }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);

  // Update isSaved whenever savedJobs changes
  useEffect(() => {
    const saved = savedJobs.some((savedJob) => savedJob.job_id === job.job_id);
    setIsSaved(saved);
  }, [savedJobs, job.job_id]);

  // Check if the candidate has already applied for this job
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/candidate/applications", {
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const appliedJobIds = data.applications.map((app) => app.job_id);
          setIsApplied(appliedJobIds.includes(job.job_id));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };
    fetchApplications();
  }, [job.job_id]);

  // Helper functions to format salary and experience
  const formatSalary = (min, max) => {
    if (!min && !max) return "Not specified";
    if (!max) return `₹ ${min} Lacs P.A.`;
    if (!min) return `₹ ${max} Lacs P.A.`;
    return `₹ ${min}-${max} Lacs P.A.`;
  };

  const formatExperience = (min, max) => {
    if (!min && !max) return "";
    if (!max) return `${min}+ years`;
    if (!min) return `Up to ${max} years`;
    return `${min} - ${max} years`;
  };

  // Navigate to job preview page and send all state data
  const handleViewJob = () => {
    navigate("/job-preview", {
      state: {
        jobData: job,
        isSaved,
        isApplied,
        isApplying,
        applyError,
      },
    });
  };

  // Handle applying to a job.
  const handleApply = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (isApplied || isApplying) return;
    setIsApplying(true);
    setApplyError(null);
    const authToken = localStorage.getItem("authToken");
    const url = `http://localhost:5000/api/candidate/apply/${job.job_id}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setIsApplied(true);
      } else {
        setApplyError(result.message || "Application failed.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplyError("There was an error processing your application.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="card" data-job-id={job.job_id} onClick={handleViewJob}>
      <div className="job-header">
        <h2 className="job-title">{job.jobTitle || "Not specified"}</h2>
        <p className="company-name">{job.companyName || "Not specified"}</p>
        <div className="job-meta">
          {formatExperience(job.min_experience, job.max_experience) && (
            <span>{formatExperience(job.min_experience, job.max_experience)}</span>
          )}
          <span>{formatSalary(job.min_salary, job.max_salary)}</span>
          <span>{job.locations || "Not specified"}</span>
        </div>
      </div>
      <div className="button-group">
        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.job_id);
          }}
        >
          {isSaved ? "Unsave" : "Save for Later"}
        </button>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleApply(e);
          }}
          disabled={isApplied || isApplying}
        >
          {isApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
        </button>
      </div>
      {applyError && <p className="error-message">{applyError}</p>}
    </div>
  );
};

export default JobCard;
