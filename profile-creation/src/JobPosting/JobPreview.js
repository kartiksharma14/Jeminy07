import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Facebook, Linkedin, Twitter } from 'lucide-react';
import './JobPreview.css';
import axios from 'axios';
import RecruiterHeader from '../components/RecruiterHeader';
import RecruiterFooter from '../components/RecruiterFooter';

const JobPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state?.jobData || {};

  // Fallback formatter functions: return "Not specified" if values are missing.
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (!max) return `₹ ${min} Lacs P.A.`;
    if (!min) return `₹ ${max} Lacs P.A.`;
    return `₹ ${min}-${max} Lacs P.A.`;
  };

  const formatExperience = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (!max) return `${min}+ years`;
    if (!min) return `Up to ${max} years`;
    return `${min} - ${max} years`;
  };

  // Generate highlights from job data
  const generateHighlights = () => {
    const highlights = [];
    
    // Add salary highlight
    if (jobData.min_salary || jobData.max_salary) {
      highlights.push(`Salary range: ${formatSalary(jobData.min_salary, jobData.max_salary)}`);
    }
    // Add experience highlight
    if (jobData.min_experience || jobData.max_experience) {
      highlights.push(`Required experience: ${formatExperience(jobData.min_experience, jobData.max_experience)}`);
    }
    // Add location highlight
    if (jobData.locations) {
      highlights.push(`Location: ${jobData.locations}`);
    }
    // Add key skills (up to 3)
    if (jobData.keySkills && Array.isArray(jobData.keySkills) && jobData.keySkills.length > 0) {
      highlights.push(`Key skills required: ${jobData.keySkills.slice(0, 3).join(', ')}`);
    }
    // Add employment type
    if (jobData.employmentType) {
      highlights.push(`Employment type: ${jobData.employmentType}`);
    }

    return highlights;
  };

  const handleEdit = () => {
    navigate("/post-job", { state: { jobData } });
  };

  const handlePost = async () => {
    try {
      const jwtToken = localStorage.getItem("RecruiterToken");
      const response = await axios.post(
        "http://localhost:5000/api/recruiter/jobs/publish",
        { session_id: jobData.session_id },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Assuming the published job details are in response.data.job
        navigate("/job-success", { state: { jobData: response.data.job } });
      } else {
        alert("Failed to publish job.");
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      alert("Failed to publish job. Please try again.");
    }
  };
  

  return (
    <div className="rc-job-preview-container">
      <RecruiterHeader/>
      <div className="rc-preview-wrapper">
        <h1 className="rc-preview-title">Job preview</h1>
        
        {/* Main Job Card */}
        <div className="rc-card">
          <div className="rc-job-header">
            <div>
              <h2 className="rc-job-title">{jobData.jobTitle || 'Not specified'}</h2>
              <p className="rc-company-name">{jobData.companyName || 'Not specified'}</p>
              
              <div className="rc-job-meta">
                <span>{formatExperience(jobData.min_experience, jobData.max_experience)}</span>
                <span>{formatSalary(jobData.min_salary, jobData.max_salary)}</span>
                <span>{jobData.locations || 'Not specified'}</span>
              </div>
            </div>

            <button className="rc-btn rc-btn-link">Send me jobs like this</button>
          </div>

          <div className="rc-job-stats">
            <span>Posted: Just now</span>
            <span>Openings: {jobData.multipleVacancies ? 'Multiple' : '1'}</span>
            <span>Applicants: Less than 10</span>
          </div>

          <div className="rc-button-group">
            <button className="rc-btn rc-btn-secondary">Save for later</button>
            <button className="rc-btn rc-btn-primary">Apply</button>
          </div>
        </div>

        {/* Job Highlights Section */}
        <div className="rc-card">
          <h2 className="rc-section-title">Job highlights</h2>
          <ul className="rc-list-container">
            {generateHighlights().map((highlight, index) => (
              <li key={index} className="rc-list-item">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Job Description Card */}
        <div className="rc-card">
          <h2 className="rc-section-title">Job description</h2>
          
          <div className="rc-job-description-content">
            {jobData.jobDescription ? (
              <div dangerouslySetInnerHTML={{ __html: jobData.jobDescription }} />
            ) : (
              <p>Not specified</p>
            )}
          </div>

          <div className="rc-details-grid">
            <div className="rc-detail-row">
              <span className="rc-detail-label">Role:</span>
              <span className="rc-detail-value">{jobData.department || 'Not specified'}</span>
            </div>
            <div className="rc-detail-row">
              <span className="rc-detail-label">Industry Type:</span>
              <span className="rc-detail-value">{jobData.industry || 'Not specified'}</span>
            </div>
            <div className="rc-detail-row">
              <span className="rc-detail-label">Employment Type:</span>
              <span className="rc-detail-value">{jobData.employmentType || 'Not specified'}</span>
            </div>
            <div className="rc-detail-row">
              <span className="rc-detail-label">Work Mode:</span>
              <span className="rc-detail-value">{jobData.workMode || 'Not specified'}</span>
            </div>
          </div>

          {/* Education Section */}
          <div className="rc-education-section">
            <h3 className="rc-subsection-title">Education</h3>
            <p>Not specified</p>
          </div>

          {/* Skills Section */}
          <div className="rc-skills-container">
            <h3 className="rc-subsection-title">Key Skills</h3>
            {jobData.keySkills && Array.isArray(jobData.keySkills) && jobData.keySkills.length > 0 ? (
              jobData.keySkills.map((skill, index) => (
                <div key={index} className="rc-skill-tag">
                  {index < 2 && <Star className="w-4 h-4" />}
                  <span>{skill}</span>
                </div>
              ))
            ) : (
              <p>Not specified</p>
            )}
          </div>

          {/* Social Media Links */}
          <div className="rc-social-links">
            <Facebook className="rc-social-icon rc-facebook" />
            <Twitter className="rc-social-icon rc-twitter" />
            <Linkedin className="rc-social-icon rc-linkedin" />
          </div>

          {/* Company Information */}
          <div className="rc-company-info">
            <h3 className="rc-subsection-title">About company</h3>
            <p className="rc-company-description">
              {jobData.companyInfo || 'Not specified'}
            </p>
            {jobData.companyAddress && (
              <div className="rc-company-address">
                <h4 className="rc-address-title">Address:</h4>
                <p>{jobData.companyAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="rc-bottom-buttons">
          <button className="rc-btn rc-btn-primary" onClick={handlePost}>
            Create Job
          </button>
          <button className="rc-btn rc-btn-secondary" onClick={handleEdit}>
            Edit Job
          </button>
        </div>
      </div>
      <RecruiterFooter/>
    </div>
  );
};

export default JobPreview;
