import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobSuccess.css"; // Make sure this CSS file exists
import { FaSearch, FaHeart, FaBell, FaUser, FaCheckCircle } from "react-icons/fa";
import RecruiterHeader from "../components/RecruiterHeader";
import RecruiterFooter from "../components/RecruiterFooter";

const JobSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect the published job to be passed as jobData.
  const { jobData } = location.state || { jobData: {} };

  return (
    <div className="page-container">
      <RecruiterHeader />

      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle size={60} color="#32a852" />
          </div>
          <h2 className="success-title">Job Created Successfully!</h2>

          <div className="job-details-summary">
            <div className="detail-item">
              <span className="detail-label">Job ID:</span>
              {/* Use jobData.job_id (assuming your backend returns job_id) */}
              <span className="detail-value">{jobData.job_id || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Job Title:</span>
              <span className="detail-value">{jobData.jobTitle || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department & Role Type:</span>
              <span className="detail-value">{jobData.department || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Creation Date:</span>
              <span className="detail-value">
                {jobData.createdAt
                  ? new Date(jobData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Not specified'}
              </span>
            </div>
          </div>

          <div className="success-message">
            <p>
              Your job posting has been created and published successfully.
              You can now view responses as they come in.
            </p>
          </div>

          <div className="success-actions">
            <button 
              className="view-jobs-button" 
              onClick={() => navigate("/manage-jobs-responses")}
            >
              View All Jobs
            </button>
            <button 
              className="post-new-button" 
              onClick={() => navigate("/post-job")}
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>

      <RecruiterFooter />
    </div>
  );
};

export default JobSuccess;
