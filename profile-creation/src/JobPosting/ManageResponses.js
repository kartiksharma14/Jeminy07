import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecruiterHeader from "../components/RecruiterHeader";
import RecruiterFooter from "../components/RecruiterFooter";
import "./ManageJobs.css";

const ManageResponses = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("RecruiterToken");
  const navigate = useNavigate();

  // Modal-related state.
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [candidateDetail, setCandidateDetail] = useState(null);

  // Fetch applications for the selected job.
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/api/recruiter/applications?page=${currentPage}`;
      if (jobId) {
        url += `&job_id=${jobId}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setApplications(data.applications);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId, currentPage]);

  // Update application status.
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recruiter/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        // Update the application list state.
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );
        // Close the modal.
        setModalOpen(false);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating status");
    }
  };

  // Pagination controls.
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Navigate back to the ManageJobs page.
  const handleBack = () => {
    navigate("/manage-jobs");
  };

  // Extract job post details from the first application if available.
  const jobPostDetails =
    applications.length > 0 && applications[0].JobPost
      ? applications[0].JobPost
      : null;

  // Open modal and fetch candidate details using candidate id.
  const handleViewDetails = async (application) => {
    setSelectedApplicationId(application.application_id);
    const candidateId = application.candidate_profile?.candidate_id;
    setSelectedCandidateId(candidateId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/recruiter/candidates/${candidateId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setCandidateDetail(data.candidateProfile);
      } else {
        alert(data.message || "Failed to load candidate details");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading candidate details");
    }
    setModalOpen(true);
  };

  return (
    <>
      <RecruiterHeader />
      <div className="manage-container">
        <button className="back-button" onClick={handleBack}>
          &larr; Back to Jobs
        </button>
        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {jobPostDetails && (
              <div className="jobpost-details">
                <h2>{jobPostDetails.jobTitle}</h2>
                <div className="job-meta">
                  <span>
                    <strong>Company:</strong> {jobPostDetails.companyName}
                  </span>
                  <span>
                    <strong>Location:</strong> {jobPostDetails.locations}
                  </span>
                </div>
              </div>
            )}
            <h1 className="section-title">Candidate Applications</h1>
            {applications.length > 0 ? (
              <>
                <ul className="list">
                  {applications.map((app) => (
                    <li key={app.application_id} className="card candidate-card">
                      <div className="card-content">
                        <h3>
                          {app.candidate_profile?.name ||
                            `Candidate #${app.candidate_profile?.candidate_id || ""}`}
                        </h3>
                        {app.candidate_profile?.resume_headline && (
                          <p>
                            <strong>Headline:</strong>{" "}
                            {app.candidate_profile.resume_headline}
                          </p>
                        )}
                        <p>
                          <strong>Phone:</strong>{" "}
                          {app.candidate_profile?.phone || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {app.candidate_profile?.email || "N/A"}
                        </p>
                        <p>
                          <strong>Applied At:</strong>{" "}
                          {new Date(app.applied_at).toLocaleString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {app.status}
                        </p>
                      </div>
                      {app.status === "pending" && (
                        <div className="action-buttons">
                          <button onClick={() => handleViewDetails(app)}>
                            View Details
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="pagination">
                  <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No candidate applications found for this job.</p>
            )}
          </>
        )}
      </div>
      {modalOpen && (
        <div className="as-modal-overlay">
          <div className="as-modal-content as-enterprise-modal">
            <button className="as-modal-close" onClick={() => setModalOpen(false)}>
              X
            </button>
            {candidateDetail ? (
              <div className="as-candidate-details">
                {/* Candidate Header Section */}
                <div className="as-candidate-header">
                  {candidateDetail.photo ? (
                    <img
                      src={candidateDetail.photo}
                      alt="Candidate"
                      className="as-candidate-photo"
                    />
                  ) : (
                    <div className="as-candidate-photo-placeholder">No Photo</div>
                  )}
                  <div className="as-candidate-basic-info">
                    <h2>
                      {candidateDetail.name ||
                        `Candidate #${candidateDetail.candidate_id}`}
                    </h2>
                    <p>
                      <strong>Location:</strong> {candidateDetail.location}
                    </p>
                    <p>
                      <strong>Phone:</strong> {candidateDetail.phone}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {candidateDetail.email || "N/A"}
                    </p>
                    <p>
                      <strong>DOB:</strong>{" "}
                      {candidateDetail.dob
                        ? new Date(candidateDetail.dob).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {/* Professional Details Section */}
                <div className="as-candidate-professional">
                  <h3>Professional Details</h3>
                  <p>
                    <strong>Resume Headline:</strong>{" "}
                    {candidateDetail.resume_headline || "N/A"}
                  </p>
                  <p>
                    <strong>Current Industry:</strong>{" "}
                    {candidateDetail.current_industry || "N/A"}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {candidateDetail.department || "N/A"}
                  </p>
                  <p>
                    <strong>Desired Job Type:</strong>{" "}
                    {candidateDetail.desired_job_type || "N/A"}
                  </p>
                  <p>
                    <strong>Employment Type:</strong>{" "}
                    {candidateDetail.desired_employment_type || "N/A"}
                  </p>
                  <p>
                    <strong>Expected Salary:</strong>{" "}
                    {candidateDetail.expected_salary || "N/A"}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {candidateDetail.availability_to_join || "N/A"}
                  </p>
                </div>
                {/* Additional Information Section */}
                <div className="as-candidate-additional">
                  <h3>Additional Information</h3>
                  <p>
                    <strong>Profile Summary:</strong>{" "}
                    {candidateDetail.profile_summary || "N/A"}
                  </p>
                  {candidateDetail.online_profile && (
                    <p>
                      <strong>Online Profile:</strong>{" "}
                      <a
                        href={candidateDetail.online_profile}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Profile
                      </a>
                    </p>
                  )}
                  {candidateDetail.work_sample && (
                    <p>
                      <strong>Work Sample:</strong>{" "}
                      <a
                        href={candidateDetail.work_sample}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Work Sample
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p>Loading candidate details...</p>
            )}
            <div className="as-modal-actions">
              <button
                onClick={() =>
                  handleStatusUpdate(selectedApplicationId, "selected")
                }
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(selectedApplicationId, "rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      <RecruiterFooter />
    </>
  );
};

export default ManageResponses;
