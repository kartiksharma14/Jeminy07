import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterHeader from "../components/RecruiterHeader";
import RecruiterFooter from "../components/RecruiterFooter";
import "./ManageJobs.css";

// Modern Modal Component for showing messages
const StatusModal = ({ show, message, onClose }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Job Application Status</h2>
        <p>{message}</p>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const ManageJobsRecruiter = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const authToken = localStorage.getItem("RecruiterToken");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/recruiter/jobs/all?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setJobs(data.jobs);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleJobClick = (job) => {
    if (job.status === "rejected") {
      setModalMessage(
        `Your job application has been rejected.\nRejected Reason: ${job.rejection_reason}`
      );
      setModalOpen(true);
    } else if (job.status === "pending") {
      setModalMessage("Your job application is pending for approval by admin.");
      setModalOpen(true);
    } else {
      navigate(`/manage-responses/${job.job_id}`);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
  };

  return (
    <>
      <RecruiterHeader />
      <div className="manage-container">
        <h1>Manage Jobs</h1>
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <ul className="list">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <li
                    key={job.job_id}
                    className="card"
                    onClick={() => handleJobClick(job)}
                  >
                    <h3>{job.jobTitle}</h3>
                    <p>
                      <strong>Job ID:</strong> {job.job_id}
                    </p>
                    <p>
                      <strong>Company:</strong> {job.companyName}
                    </p>
                    <p>
                      <strong>Location:</strong> {job.locations}
                    </p>
                    <p>
                      <strong>Updated On:</strong> {job.updatedAt}
                    </p>
                    <p>
                      <strong>Status:</strong> {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </p>
                    <p>
                      <strong>Applications:</strong> {job.applicationCount}
                    </p>
                  </li>
                ))
              ) : (
                <p>No jobs found.</p>
              )}
            </ul>
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <RecruiterFooter />
      <StatusModal show={modalOpen} message={modalMessage} onClose={closeModal} />
    </>
  );
};

export default ManageJobsRecruiter;
