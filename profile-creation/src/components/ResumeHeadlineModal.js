// src/components/ResumeHeadlineModal.js

import React, { useState, useEffect, useRef } from "react";
import "./ResumeHeadlineModal.css";
import axiosInstance from "../axiosInstance";
import {jwtDecode} from "jwt-decode";
import PropTypes from "prop-types";

const ResumeHeadlineModal = ({ isOpen, toggleModal, refreshResumeHeadline }) => {
  const [headline, setHeadline] = useState("");
  const [originalHeadline, setOriginalHeadline] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const textareaRef = useRef(null); // For focus management

  // Function to decode JWT and extract userId
  const decodeToken = () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      const extractedUserId = decoded.userId || decoded.candidate_id;
      if (!extractedUserId) {
        setError("Invalid token: userId not found.");
        return;
      }
      setUserId(extractedUserId);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  };

  // Fetch existing resume headline when modal opens
  useEffect(() => {
    if (isOpen) {
      decodeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (userId && isOpen) {
      const fetchResumeHeadline = async () => {
        try {
          const response = await axiosInstance.get(
            `/candidate-profile/user-details/${userId}`
          );

          const data = response.data.data;

          if (data && data.resume_headline) {
            setHeadline(data.resume_headline);
            setOriginalHeadline(data.resume_headline);
          } else {
            setHeadline("");
            setOriginalHeadline("");
          }
        } catch (err) {
          console.error("Error fetching resume headline:", err);
          setError("Failed to fetch resume headline.");
        }
      };

      fetchResumeHeadline();
    }
  }, [userId, isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (headline.trim() === "") {
      setError("Resume headline cannot be empty.");
      return;
    }

    if (headline.trim() === originalHeadline) {
      setError("No changes detected.");
      return;
    }

    const payload = {
      resume_headline: headline.trim(),
    };

    try {
      const response = await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        payload
      );

      console.log("✅ Resume headline updated:", response.data);
      setSuccessMessage("Resume headline updated successfully!");

      // Refresh resume headline in the parent component
      if (refreshResumeHeadline && typeof refreshResumeHeadline === "function") {
        refreshResumeHeadline();
      }

      // Optionally, close the modal after a short delay
      setTimeout(() => {
        toggleModal();
      }, 1500);
    } catch (err) {
      console.error("❌ Error updating resume headline:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update resume headline.");
      }
    }
  };

  return isOpen ? (
    <div
      className="modal-overlay"
      onClick={toggleModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content resume-headline-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={toggleModal}
          aria-label="Close"
        >
          &times;
        </button>
        <h2>Resume Headline</h2>
        <p>
          Craft a compelling headline that summarizes your professional profile.
        </p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

        <div className="headline-input">
          <textarea
            placeholder="Enter your resume headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            ref={textareaRef}
          ></textarea>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={toggleModal}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

// Define PropTypes for better type checking
ResumeHeadlineModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshResumeHeadline: PropTypes.func, // Optional prop
};

export default ResumeHeadlineModal;
