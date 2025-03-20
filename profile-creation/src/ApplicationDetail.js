// src/components/ApplicationDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplicationDetail.css";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("RecruiterToken");

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:5000/api/candidate/applications/${applicationId}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          // Assuming the detailed application is returned under "application"
          setApplication(data.application);
        } else {
          setError(data.message || "Failed to fetch application detail");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching application detail");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [applicationId, authToken]);

  return (
    <div className="application-detail-container">
      <button onClick={() => navigate(-1)}>Back</button>
      {loading ? (
        <p>Loading application detail...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : application ? (
        <div className="application-detail">
          <h2>
            {application.JobPost?.jobTitle ||
              "Job Title Not Available"}
          </h2>
          <p>Status: {application.status}</p>
          <p>
            Applied At:{" "}
            {new Date(application.applied_at).toLocaleString()}
          </p>
          <p>
            Location: {application.JobPost?.locations || "N/A"}
          </p>
          <p>
            Job Description:{" "}
            {application.JobPost?.jobDescription || "N/A"}
          </p>
          {/* Add any extra details as required */}
        </div>
      ) : (
        <p>No application details available.</p>
      )}
    </div>
  );
};

export default ApplicationDetail;
