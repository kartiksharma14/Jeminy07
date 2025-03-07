import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobSuccess.css"; // You'll need to create this CSS file
import { FaSearch, FaHeart, FaBell, FaUser, FaCheckCircle } from "react-icons/fa";
import RecruiterHeader from "../components/RecruiterHeader";
import RecruiterFooter from "../components/RecruiterFooter";

const JobSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobData } = location.state || { jobData: {} };

  return (
    <div className="page-container">
        <RecruiterHeader/>

      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle size={60} color="#32a852" />
          </div>
          <h2 className="success-title">Job Created Successfully!</h2>
          
          <div className="job-details-summary">
            <div className="detail-item">
              <span className="detail-label">Job ID:</span>
              <span className="detail-value job-id">{jobData.jobId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Job Title:</span>
              <span className="detail-value">{jobData.jobTitle}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department & Role Type:</span>
              <span className="detail-value">{jobData.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Creation Date:</span>
              <span className="detail-value">
                {new Date(jobData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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

      <RecruiterFooter/>
    </div>
  );
};

export default JobSuccess;