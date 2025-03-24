// src/components/ManageJobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageJobs.css';
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // jobs for the current page
  const [totalCount, setTotalCount] = useState(0); // overall total jobs count
  const [pageSize, setPageSize] = useState(0); // constant page size from first page
  const [error, setError] = useState(null);
  // statusFilter: 'all', 'pending', 'approved', or 'rejected'
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch jobs with pagination and filtering from different endpoints
  // based on the current filter.
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let baseUrl = '';

      // Select the appropriate endpoint based on statusFilter.
      switch (statusFilter) {
        case 'all':
          baseUrl = 'http://localhost:5000/api/admin/jobs';
          break;
        case 'pending':
          baseUrl = 'http://localhost:5000/api/admin/jobs/pending';
          break;
        case 'rejected':
          baseUrl = 'http://localhost:5000/api/admin/jobs/rejected';
          break;
        case 'approved':
          baseUrl = 'http://localhost:5000/api/admin/jobs/approved';
          break;
        default:
          baseUrl = 'http://localhost:5000/api/admin/jobs';
      }

      const url = `${baseUrl}?page=${currentPage}`;
      console.log("Fetching jobs via:", url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        // Only update pageSize if we're on page 1 (or if pageSize is not set)
        if (currentPage === 1) {
          setPageSize(data.count || data.jobs.length);
        }
        setError(null);
      } else {
        setError(data.error || data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("Error fetching jobs.");
    }
  };

  // Re-fetch jobs whenever the filter or page changes.
  useEffect(() => {
    fetchJobs();
  }, [statusFilter, currentPage]);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Calculate the job indices for the current page summary.
  // Use the constant pageSize from page 1.
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);
  const statusLabel = statusFilter === 'all' ? 'jobs' : `${formatStatus(statusFilter)} jobs`;

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
        fetchJobs();
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
        fetchJobs();
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
        fetchJobs();
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

  // Render filter buttons; reset page to 1 when changing filter.
  const renderFilters = () => {
    return (
      <div className="mj-filters">
        <button
          className={`mj-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
        >
          All Jobs
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
        >
          Pending
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('approved'); setCurrentPage(1); }}
        >
          Approved
        </button>
        <button
          className={`mj-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('rejected'); setCurrentPage(1); }}
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
              <p>
                Showing {startIndex} - {endIndex} of {totalCount} {statusLabel}
              </p>
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
            {/* Render pagination only if more than one page exists */}
            {totalPages > 1 && (
              <div className="mj-pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
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
              <button className="mj-modal-btn" onClick={handleConfirmDelete}>
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
