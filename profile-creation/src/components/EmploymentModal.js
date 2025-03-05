// src/components/EmploymentModal.js

import React, { useState, useEffect, useRef } from "react";
import "./EmploymentModal.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if necessary
});

const EmploymentModal = ({ isOpen, toggleModal, refreshEmploymentDetails }) => {
  const [employmentRecords, setEmploymentRecords] = useState([]);
  const [formData, setFormData] = useState({
    current_employment: "Yes",
    employment_type: "Full-time",
    current_company_name: "",
    current_job_title: "",
    joining_date: "",
    current_salary: "",
    skill_used: "",
    job_profile: "",
    experience_in_year: "",
    experience_in_months: "",
    notice_period: ""
  });
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const firstInputRef = useRef(null);

  // Decode JWT and extract userId when modal opens
  useEffect(() => {
    if (isOpen) {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setError("No authentication token found.");
        return;
      }
      try {
        const decoded = jwtDecode(storedToken);
        const extractedUserId = decoded.userId || decoded.candidate_id;
        if (!extractedUserId) {
          setError("Invalid token: user ID not found.");
          return;
        }
        setUserId(extractedUserId);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Error decoding token.");
      }
    }
  }, [isOpen]);

  // Fetch employment records from the candidate profile response
  useEffect(() => {
    if (userId && isOpen) {
      const fetchEmploymentData = async () => {
        setLoading(true);
        setError("");
        try {
          // The candidate profile GET now returns an "employment" array
          const response = await axiosInstance.get(`/candidate-profile/user-details/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          });
          const userData = response.data.data;
          if (userData && Array.isArray(userData.employment)) {
            setEmploymentRecords(userData.employment);
          } else {
            setEmploymentRecords([]);
          }
        } catch (err) {
          console.error("Error fetching employment details:", err);
          setError("Failed to fetch employment details.");
        } finally {
          setLoading(false);
        }
      };

      fetchEmploymentData();
    }
  }, [userId, isOpen]);

  // Focus the first input when the modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the required fields
  const validateForm = () => {
    const {
      current_employment,
      employment_type,
      current_company_name,
      current_job_title,
      joining_date,
      current_salary,
      skill_used,
      job_profile,
      experience_in_year,
      experience_in_months,
      notice_period,
    } = formData;
    if (
      !current_employment ||
      !employment_type ||
      !current_company_name ||
      !current_job_title ||
      !joining_date ||
      !current_salary ||
      !skill_used ||
      !job_profile ||
      !experience_in_year ||
      !experience_in_months ||
      !notice_period
    ) {
      setError("Please fill all required fields.");
      return false;
    }
    if (
      isNaN(current_salary) ||
      isNaN(experience_in_year) ||
      isNaN(experience_in_months) ||
      isNaN(notice_period)
    ) {
      setError("Please ensure salary, experience, and notice period are valid numbers.");
      return false;
    }
    return true;
  };

  // Clear the form fields
  const clearForm = () => {
    setFormData({
      current_employment: "Yes",
      employment_type: "Full-time",
      current_company_name: "",
      current_job_title: "",
      joining_date: "",
      current_salary: "",
      skill_used: "",
      job_profile: "",
      experience_in_year: "",
      experience_in_months: "",
      notice_period: ""
    });
    setEditingRecordId(null);
  };

  // Handle submitting the record (add or update)
  const handleSubmitRecord = async () => {
    setError("");
    setSuccessMessage("");
    if (!validateForm()) return;

    // Build payload; convert numeric fields appropriately
    const payload = {
      current_employment: formData.current_employment,
      employment_type: formData.employment_type,
      current_company_name: formData.current_company_name,
      current_job_title: formData.current_job_title,
      joining_date: formData.joining_date,
      current_salary: formData.current_salary,
      skill_used: formData.skill_used,
      job_profile: formData.job_profile,
      experience_in_year: Number(formData.experience_in_year),
      experience_in_months: Number(formData.experience_in_months),
      notice_period: Number(formData.notice_period)
    };

    try {
      if (editingRecordId) {
        // PATCH endpoint for editing an existing record
        const response = await axiosInstance.patch(
          `/employment/${editingRecordId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEmploymentRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.employment_id === editingRecordId ? response.data.data : record
          )
        );
        setSuccessMessage("Employment record updated successfully!");
      } else {
        // POST endpoint for adding a new record using the new API endpoint
        const response = await axiosInstance.post(
          `/employment/${userId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEmploymentRecords((prevRecords) => [...prevRecords, response.data.data]);
        setSuccessMessage("Employment record added successfully!");
      }
      clearForm();
      if (refreshEmploymentDetails && typeof refreshEmploymentDetails === "function") {
        refreshEmploymentDetails();
      }
    } catch (err) {
      console.error("Error submitting employment record:", err);
      setError(editingRecordId ? "Failed to update employment record." : "Failed to add employment record.");
    }
  };

  // Pre-fill the form for editing an existing record
  const handleEditRecord = (record) => {
    setEditingRecordId(record.employment_id);
    setFormData({
      current_employment: record.current_employment || "Yes",
      employment_type: record.employment_type || "Full-time",
      current_company_name: record.current_company_name || "",
      current_job_title: record.current_job_title || "",
      joining_date: record.joining_date ? record.joining_date.substring(0, 10) : "",
      current_salary: record.current_salary || "",
      skill_used: record.skill_used || "",
      job_profile: record.job_profile || "",
      experience_in_year: record.experience_in_year ? String(record.experience_in_year) : "",
      experience_in_months: record.experience_in_months ? String(record.experience_in_months) : "",
      notice_period: record.notice_period ? String(record.notice_period) : ""
    });
  };

  // Delete an employment record
  const handleDeleteRecord = async (recordId) => {
    setError("");
    setSuccessMessage("");
    try {
      await axiosInstance.delete(`/employment/${recordId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setEmploymentRecords((prevRecords) =>
        prevRecords.filter((record) => record.employment_id !== recordId)
      );
      setSuccessMessage("Employment record deleted successfully!");
    } catch (err) {
      console.error("Error deleting employment record:", err);
      setError("Failed to delete employment record.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleModal} role="dialog" aria-modal="true">
      <div className="modal-content employment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={toggleModal} aria-label="Close">
          &times;
        </button>
        <h2>Employment Details</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Existing Employment Records */}
            <div className="existing-records">
              <h3>Existing Employment Records</h3>
              {employmentRecords.length > 0 ? (
                employmentRecords.map((record) => (
                  <div key={record.employment_id} className="record">
                    <div className="record-info">
                      <p><strong>Company:</strong> {record.current_company_name || "N/A"}</p>
                      <p><strong>Job Title:</strong> {record.current_job_title || "N/A"}</p>
                      <p>
                        <strong>Joining Date:</strong>{" "}
                        {record.joining_date ? record.joining_date.substring(0, 10) : "N/A"}
                      </p>
                      <p><strong>Salary (₹):</strong> {record.current_salary || "N/A"}</p>
                      <p>
                        <strong>Experience:</strong> {record.experience_in_year || 0} yrs{" "}
                        {record.experience_in_months || 0} mos
                      </p>
                      <p><strong>Notice Period (days):</strong> {record.notice_period || "N/A"}</p>
                      <p><strong>Employment Type:</strong> {record.employment_type || "N/A"}</p>
                      <p><strong>Current Employment:</strong> {record.current_employment || "N/A"}</p>
                      <p><strong>Skills Used:</strong> {record.skill_used || "N/A"}</p>
                      <p><strong>Job Profile:</strong> {record.job_profile || "N/A"}</p>
                    </div>
                    <div className="record-actions">
                      <button className="edit-btn" onClick={() => handleEditRecord(record)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteRecord(record.employment_id)}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No employment records found.</p>
              )}
            </div>

            {/* Form to Add or Edit Employment Record */}
            <div className="employment-form">
              <h3>{editingRecordId ? "Edit Employment Record" : "Add New Employment Record"}</h3>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Employment</label>
                    <select name="current_employment" value={formData.current_employment} onChange={handleInputChange}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Employment Type</label>
                    <select name="employment_type" value={formData.employment_type} onChange={handleInputChange}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="current_company_name"
                      value={formData.current_company_name}
                      onChange={handleInputChange}
                      ref={firstInputRef}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      name="current_job_title"
                      value={formData.current_job_title}
                      onChange={handleInputChange}
                      placeholder="Enter job title"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      name="joining_date"
                      value={formData.joining_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Salary (₹)</label>
                    <input
                      type="text"
                      name="current_salary"
                      value={formData.current_salary}
                      onChange={handleInputChange}
                      placeholder="Enter current salary"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Skills Used</label>
                    <input
                      type="text"
                      name="skill_used"
                      value={formData.skill_used}
                      onChange={handleInputChange}
                      placeholder="Enter skills used (comma separated)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Profile</label>
                    <textarea
                      name="job_profile"
                      value={formData.job_profile}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter job profile"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input
                      type="number"
                      name="experience_in_year"
                      value={formData.experience_in_year}
                      onChange={handleInputChange}
                      placeholder="Years"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience (Months)</label>
                    <input
                      type="number"
                      name="experience_in_months"
                      value={formData.experience_in_months}
                      onChange={handleInputChange}
                      placeholder="Months"
                      min="0"
                      max="11"
                    />
                  </div>
                  <div className="form-group">
                    <label>Notice Period (days)</label>
                    <input
                      type="number"
                      name="notice_period"
                      value={formData.notice_period}
                      onChange={handleInputChange}
                      placeholder="Notice period in days"
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="save-btn" onClick={handleSubmitRecord}>
                    {editingRecordId ? "Update Record" : "Add Record"}
                  </button>
                  {editingRecordId && (
                    <button type="button" className="cancel-btn" onClick={clearForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

EmploymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshEmploymentDetails: PropTypes.func,
};

export default EmploymentModal;
