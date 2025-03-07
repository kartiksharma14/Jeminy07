import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Facebook, Linkedin, Twitter } from 'lucide-react';
import './JobPreview.css';

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

  const handlePost = () => {
    console.log('Posting job:', jobData);
    // Add a timestamp for creation date and a random job ID for demonstration purposes
    const jobDataWithTimestamp = {
      ...jobData,
      createdAt: new Date().toISOString(),
      jobId: `JOB-${Math.floor(Math.random() * 100000)}`,
    };
    navigate('/job-success', { state: { jobData: jobDataWithTimestamp } });
  };

  return (
    <div className="job-preview-container">
      <div className="preview-wrapper">
        <h1 className="preview-title">Job preview</h1>
        
        {/* Main Job Card */}
        <div className="card">
          <div className="job-header">
            <div>
              <h2 className="job-title">{jobData.jobTitle || 'Not specified'}</h2>
              <p className="company-name">{jobData.companyName || 'Not specified'}</p>
              
              <div className="job-meta">
                <span>{formatExperience(jobData.min_experience, jobData.max_experience)}</span>
                <span>{formatSalary(jobData.min_salary, jobData.max_salary)}</span>
                <span>{jobData.locations || 'Not specified'}</span>
              </div>
            </div>

            <button className="btn-link">Send me jobs like this</button>
          </div>

          <div className="job-stats">
            <span>Posted: Just now</span>
            <span>Openings: {jobData.multipleVacancies ? 'Multiple' : '1'}</span>
            <span>Applicants: Less than 10</span>
          </div>

          <div className="button-group">
            <button className="btn btn-secondary">Save for later</button>
            <button className="btn btn-primary">Apply</button>
          </div>
        </div>

        {/* Job Highlights Section */}
        <div className="card">
          <h2 className="section-title">Job highlights</h2>
          <ul className="list-container">
            {generateHighlights().map((highlight, index) => (
              <li key={index} className="list-item">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Job Description Card */}
        <div className="card">
          <h2 className="section-title">Job description</h2>
          
          <div className="job-description-content">
            {jobData.jobDescription ? (
              <div dangerouslySetInnerHTML={{ __html: jobData.jobDescription }} />
            ) : (
              <p>Not specified</p>
            )}
          </div>

          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{jobData.department || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Industry Type:</span>
              <span className="detail-value">{jobData.industry || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Employment Type:</span>
              <span className="detail-value">{jobData.employmentType || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Work Mode:</span>
              <span className="detail-value">{jobData.workMode || 'Not specified'}</span>
            </div>
          </div>

          {/* Education Section */}
          <div className="education-section">
            <h3 className="subsection-title">Education</h3>
            <p>Not specified</p>
          </div>

          {/* Skills Section */}
          <div className="skills-container">
            <h3 className="subsection-title">Key Skills</h3>
            {jobData.keySkills && Array.isArray(jobData.keySkills) && jobData.keySkills.length > 0 ? (
              jobData.keySkills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {index < 2 && <Star className="w-4 h-4" />}
                  <span>{skill}</span>
                </div>
              ))
            ) : (
              <p>Not specified</p>
            )}
          </div>

          {/* Social Media Links */}
          <div className="social-links">
            <Facebook className="social-icon facebook" />
            <Twitter className="social-icon twitter" />
            <Linkedin className="social-icon linkedin" />
          </div>

          {/* Company Information */}
          <div className="company-info">
            <h3 className="subsection-title">About company</h3>
            <p className="company-description">
              {jobData.companyInfo || 'Not specified'}
            </p>
            {jobData.companyAddress && (
              <div className="company-address">
                <h4 className="address-title">Address:</h4>
                <p>{jobData.companyAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="bottom-buttons">
          <button className="btn btn-primary" onClick={handlePost}>
            Create Job
          </button>
          <button className="btn btn-secondary" onClick={handleEdit}>
            Edit Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
