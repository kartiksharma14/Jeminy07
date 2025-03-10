// src/components/ManageJobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageJobs.css';
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]); // full list from "all" endpoint
  const [jobs, setJobs] = useState([]); // filtered jobs
  const [error, setError] = useState(null);
  // statusFilter: 'all', 'pending', 'approved', or 'rejected'
  const [statusFilter, setStatusFilter] = useState('all');

  // State for modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Notification modal state
  const [notificationMessage, setNotificationMessage] = useState('');

  // Helper function to format status (e.g., approved -> Approved)
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Fetch all jobs from the "all" endpoint
  const fetchAllJobs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/admin/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      const jobsList = Array.isArray(data) ? data : data.jobs;
      if (jobsList) {
        setAllJobs(jobsList);
        setError(null);
      } else {
        setError(data.error || data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("Error fetching jobs.");
    }
  };

  // Filter the full list based on the selected status
  const filterJobs = () => {
    if (statusFilter === 'all') {
      setJobs(allJobs);
    } else {
      const filtered = allJobs.filter(job => job.status.toLowerCase() === statusFilter);
      setJobs(filtered);
    }
  };

  useEffect(() => {
    fetchAllJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterJobs();
  }, [statusFilter, allJobs]);

  // Approve job handler (only for pending jobs)
  const handleApproveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success || (data.message && data.message.toLowerCase().includes("approved successfully"))) {
        setNotificationMessage("Job approved successfully");
        setAllJobs(prev => prev.filter(job => job.job_id !== jobId));
      } else {
        setError(data.error || data.message || "Failed to approve job.");
      }
    } catch (err) {
      setError("Error approving job.");
    }
  };

  // Delete job handler (only for approved jobs)
  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success || (data.message && data.message.toLowerCase().includes("deleted successfully"))) {
        setNotificationMessage("Job deleted successfully");
        setAllJobs(prev => prev.filter(job => job.job_id !== jobId));
      } else {
        setError(data.error || data.message || "Failed to delete job.");
      }
    } catch (err) {
      setError("Error deleting job.");
    }
  };

  // Open details modal for pending jobs
  const openDetailsModal = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedJob(null);
    setShowDetailsModal(false);
  };

  // Open rejection modal from within the details modal
  const openRejectModal = (jobId) => {
    closeDetailsModal();
    setSelectedJob({ job_id: jobId });
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Open deletion modal for approved jobs
  const openDeleteModal = (jobId) => {
    setSelectedJob({ job_id: jobId });
    setShowDeleteModal(true);
  };

  // Reject job handler with dynamic rejection reason from modal
  const handleRejectJob = async () => {
    if (!rejectReason.trim()) return;
    try {
      const token = localStorage.getItem('adminToken');
      const payload = { rejection_reason: rejectReason };
      const res = await fetch(`http://localhost:5000/api/admin/jobs/${selectedJob.job_id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || (data.message && data.message.toLowerCase().includes("rejected successfully"))) {
        setShowRejectModal(false);
        setNotificationMessage("Job rejected successfully");
        setAllJobs(prev => prev.filter(job => job.job_id !== selectedJob.job_id));
      } else {
        setError(data.error || data.message || "Failed to reject job.");
      }
    } catch (err) {
      setError("Error rejecting job.");
    }
  };

  // Delete confirmation handler for approved jobs
  const handleConfirmDelete = async () => {
    if (!selectedJob) return;
    await handleDeleteJob(selectedJob.job_id);
    setShowDeleteModal(false);
  };

  // Close notification modal
  const closeNotificationModal = () => {
    setNotificationMessage('');
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1);
  };

  // Render filter buttons
  const renderFilters = () => {
    return (
      <div className="mj-filters">
        <button
          className={`mj-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All Jobs
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
          onClick={() => setStatusFilter('approved')}
        >
          Approved
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected
        </button>
      </div>
    );
  };

  return (
    <div className="mj-manage-jobs">
      <RecruiterHomeHeader />
      <div className="mj-layout">
        <AdminSidebar />
        <div className="mj-content">
          <div className="mj-container">
            <button className="mj-back-button" onClick={handleBack}>← Back</button>
            <h2 className="mj-title">Manage Jobs</h2>
            {renderFilters()}
            <div className="mj-summary">
              <p>Total Jobs: {jobs.length}</p>
            </div>
            {error && <div className="mj-error">{error}</div>}
            <div className="mj-table-container">
              {jobs.length > 0 ? (
                <table className="mj-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Job Title</th>
                      <th>Recruiter</th>
                      <th>Status</th>
                      {statusFilter === 'pending' && <th>Actions</th>}
                      {statusFilter === 'approved' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.job_id}>
                        <td>{job.job_id}</td>
                        <td>{job.jobTitle}</td>
                        <td>{job.Recruiter?.name || job.recruiter?.name || 'N/A'}</td>
                        <td>{formatStatus(job.status)}</td>
                        {statusFilter === 'pending' && (
                          <td>
                            <button
                              className="mj-action-btn details-btn"
                              onClick={() => openDetailsModal(job)}
                            >
                              View Details
                            </button>
                          </td>
                        )}
                        {statusFilter === 'approved' && (
                          <td>
                            <button
                              className="mj-action-btn delete-btn"
                              onClick={() => openDeleteModal(job.job_id)}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mj-no-data">No jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <RecruiterHomeFooter />

      {/* Job Details Modal (for pending jobs) */}
      {showDetailsModal && selectedJob && (
        <div className="mj-modal-overlay">
          <div className="mj-details-modal">
            <div className="mj-details-modal-header">
              <h2>Job Details</h2>
              <button className="mj-close-button" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="mj-job-details">
              <p><strong>Job ID:</strong> {selectedJob.job_id}</p>
              <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
              <p><strong>Recruiter:</strong> {selectedJob.Recruiter?.name || selectedJob.recruiter?.name || 'N/A'}</p>
              <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
              <p><strong>Department:</strong> {selectedJob.department}</p>
              <p><strong>Work Mode:</strong> {selectedJob.workMode}</p>
              <p><strong>Locations:</strong> {selectedJob.locations}</p>
              <p><strong>Industry:</strong> {selectedJob.industry}</p>
              <p><strong>Job Description:</strong> {selectedJob.jobDescription}</p>
              <p><strong>Company Name:</strong> {selectedJob.companyName}</p>
              <p><strong>Company Info:</strong> {selectedJob.companyInfo}</p>
              <p><strong>Company Address:</strong> {selectedJob.companyAddress}</p>
              <p><strong>Salary Range:</strong> {selectedJob.min_salary} - {selectedJob.max_salary}</p>
              <p><strong>Experience:</strong> {selectedJob.min_experience} - {selectedJob.max_experience} years</p>
            </div>
            <div className="mj-details-actions">
              <button className="mj-action-btn approve-btn" onClick={() => {
                handleApproveJob(selectedJob.job_id);
                closeDetailsModal();
              }}>
                Approve
              </button>
              <button className="mj-action-btn reject-btn" onClick={() => openRejectModal(selectedJob.job_id)}>
                Reject
              </button>
              <button className="mj-action-btn cancel-btn" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationMessage && (
        <div className="mj-modal-overlay">
          <div className="mj-notification-modal">
            <p>{notificationMessage}</p>
            <button className="mj-modal-btn" onClick={closeNotificationModal}>Close</button>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="mj-modal-overlay">
          <div className="mj-modal-content">
            <h2>Reject Job</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              className="mj-modal-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
            ></textarea>
            <div className="mj-modal-actions">
              <button className="mj-modal-btn" onClick={handleRejectJob}>
                Submit
              </button>
              <button className="mj-modal-btn cancel-btn" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="mj-modal-overlay">
          <div className="mj-modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete job #{selectedJob.job_id}?</p>
            <div className="mj-modal-actions">
              <button className="mj-modal-btn" onClick={() => {
                handleDeleteJob(selectedJob.job_id);
                setShowDeleteModal(false);
              }}>
                Confirm
              </button>
              <button className="mj-modal-btn cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
