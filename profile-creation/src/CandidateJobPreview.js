// src/components/CandidateJobPreview.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Facebook, Linkedin, Twitter } from "lucide-react";
import axios from "axios";
import Header from "./Header";
import Footer from "./components/Footer";
import "./CandidateJobPreview.css";

const CandidateJobPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData || {};
  const authToken = localStorage.getItem("authToken");
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applyError, setApplyError] = useState(null);

  // Check saved jobs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/saved-jobs", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (response.data.success) {
          const savedJobIds = response.data.savedJobs.map((job) => job.job_id);
          setIsSaved(savedJobIds.includes(jobData.job_id));
        }
      })
      .catch((error) => console.error("Error fetching saved jobs:", error));
  }, [jobData.job_id, authToken]);

  // Check applied jobs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/candidate/applications", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (response.data.success) {
          const appliedJobIds = response.data.applications.map(
            (application) => application.job_id
          );
          setIsApplied(appliedJobIds.includes(jobData.job_id));
        }
      })
      .catch((error) => console.error("Error fetching applied jobs:", error));
  }, [jobData.job_id, authToken]);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not specified";
    if (!max) return `₹ ${min} Lacs P.A.`;
    if (!min) return `₹ ${max} Lacs P.A.`;
    return `₹ ${min}-${max} Lacs P.A.`;
  };

  const formatExperience = (min, max) => {
    if (!min && !max) return "Not specified";
    if (!max) return `${min}+ years`;
    if (!min) return `Up to ${max} years`;
    return `${min} - ${max} years`;
  };

  const handleSaveToggle = async () => {
    const url = `http://localhost:5000/api/jobs/${jobData.job_id}/save`;
    try {
      if (isSaved) {
        const response = await axios.delete(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.success) {
          setIsSaved(false);
        } else {
          console.error("Failed to unsave job:", response.data.message);
        }
      } else {
        const response = await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.success) {
          setIsSaved(true);
        } else {
          console.error("Failed to save job:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    setApplyError(null);
    const jobId = jobData.job_id || "1000000005";
    const url = `http://localhost:5000/api/candidate/apply/${jobId}`;
    try {
      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data.success) {
        setIsApplied(true);
      } else {
        setApplyError(response.data.message || "Application failed.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplyError("There was an error processing your application.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="candidate-job-preview-container">
      <Header />
      <div className="preview-wrapper">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <h1 className="preview-title">Job Details</h1>

        {/* Job Header Card */}
        <div className="card">
          <div className="job-header">
            <h2 className="job-title">
              {jobData.jobTitle || "Not specified"}
            </h2>
            <p className="company-name">
              {jobData.companyName || "Not specified"}
            </p>
            <div className="job-meta">
              <span>
                {formatExperience(jobData.min_experience, jobData.max_experience)}
              </span>
              <span>
                {formatSalary(jobData.min_salary, jobData.max_salary)}
              </span>
              <span>{jobData.locations || "Not specified"}</span>
            </div>
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSaveToggle}>
              {isSaved ? "Unsave" : "Save for Later"}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApply}
              disabled={isApplying || isApplied}
            >
              {isApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
            </button>
          </div>
          {applyError && <p className="error-message">{applyError}</p>}
        </div>

        {/* Job Highlights */}
        <div className="card">
          <h2 className="section-title">Job Highlights</h2>
          <ul className="list-container">
            {jobData.keySkills ? (
              <li className="list-item">Key Skills: {jobData.keySkills}</li>
            ) : (
              <li className="list-item">Key Skills: Not specified</li>
            )}
            <li className="list-item">
              Employment Type: {jobData.employmentType || "Not specified"}
            </li>
            <li className="list-item">
              Industry: {jobData.industry || "Not specified"}
            </li>
            <li className="list-item">
              Work Mode: {jobData.workMode || "Not specified"}
            </li>
          </ul>
        </div>

        {/* Job Description */}
        <div className="card">
          <h2 className="section-title">Job Description</h2>
          <div className="job-description-content">
            {jobData.jobDescription ? (
              <div
                dangerouslySetInnerHTML={{ __html: jobData.jobDescription }}
              />
            ) : (
              <p>Not specified</p>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="card">
          <h2 className="section-title">About Company</h2>
          <p>{jobData.companyInfo || "Not specified"}</p>
          {jobData.companyAddress && (
            <div className="company-address">
              <h4 className="address-title">Address:</h4>
              <p>{jobData.companyAddress}</p>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        <div className="social-links">
          <Facebook className="social-icon facebook" />
          <Twitter className="social-icon twitter" />
          <Linkedin className="social-icon linkedin" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandidateJobPreview;
