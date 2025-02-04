import React, { useState, useEffect, useRef } from "react";
import "./EmploymentModal.css";
import axiosInstance from "../axiosInstance"; 
import { jwtDecode } from "jwt-decode"; 
import PropTypes from "prop-types";

const EmploymentModal = ({ isOpen, toggleModal, refreshEmploymentDetails }) => {
  const [formData, setFormData] = useState({
    currentEmployment: "",
    employmentType: "",
    companyName: "",
    jobTitle: "",
    joiningDate: "",
    currentSalary: "",
    noticePeriod: "",
  });

  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const firstInputRef = useRef(null);

  // Decode JWT and extract userId
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
          setError("Invalid token: userId not found.");
          return;
        }
        setUserId(extractedUserId);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Error decoding token.");
      }
    }
  }, [isOpen]);

  // Fetch employment details when modal opens
  useEffect(() => {
    if (userId && isOpen) {
      const fetchEmploymentData = async () => {
        setLoading(true);
        setError("");

        try {
          const response = await axiosInstance.get(`/candidate-profile/user-details/${userId}`);
          const user = response.data.data;

          if (user) {
            setFormData({
              currentEmployment: user.current_employment || "",
              employmentType: user.employment_type || "",
              companyName: user.current_company_name || "",
              jobTitle: user.current_job_title || "",
              joiningDate: user.joining_date || "",
              currentSalary: user.current_salary || "",
              noticePeriod: user.notice_period || "",
            });
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

  // Set focus on the first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated details
  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    const { currentEmployment, employmentType, companyName, jobTitle, joiningDate, currentSalary, noticePeriod } = formData;

    if (!currentEmployment || !employmentType || !companyName || !jobTitle || !joiningDate || !currentSalary || !noticePeriod) {
      setError("Please fill all required fields.");
      return;
    }

    // Ensure salary is a valid number
    const sanitizedCurrentSalary = currentSalary.replace(/[^0-9]/g, "");
    if (isNaN(sanitizedCurrentSalary) || sanitizedCurrentSalary === "") {
      setError("Please enter a valid number for Current Salary.");
      return;
    }

    const payload = {
      current_employment: currentEmployment,
      employment_type: employmentType,
      current_company_name: companyName,
      current_job_title: jobTitle,
      joining_date: joiningDate,
      current_salary: sanitizedCurrentSalary,
      notice_period: noticePeriod,
    };

    try {
      await axiosInstance.patch(`/candidate-profile/update-user/${userId}`, payload);

      console.log("✅ Employment details updated.");
      setSuccessMessage("Employment details updated successfully!");

      if (refreshEmploymentDetails && typeof refreshEmploymentDetails === "function") {
        refreshEmploymentDetails();
      }

      setTimeout(() => {
        toggleModal();
      }, 1000);
    } catch (err) {
      console.error("❌ Error updating employment details:", err);
      setError("Failed to update employment details.");
    }
  };

  return isOpen ? (
    <div className="modal-overlay" onClick={toggleModal} role="dialog" aria-modal="true">
      <div className="modal-content employment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={toggleModal} aria-label="Close">
          &times;
        </button>
        <h2>Employment Details</h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {loading ? <p>Loading...</p> : (
          <>
            {/* Current Employment Status */}
            <div className="input-group">
              <label>Current Employment</label>
              <select name="currentEmployment" onChange={handleInputChange} value={formData.currentEmployment}>
                <option value="" disabled>Select</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            {/* Employment Type */}
            <div className="input-group">
              <label>Employment Type</label>
              <select name="employmentType" onChange={handleInputChange} value={formData.employmentType}>
                <option value="" disabled>Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Company Name */}
            <div className="input-group">
              <label>Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} />
            </div>

            {/* Job Title */}
            <div className="input-group">
              <label>Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
            </div>

            {/* Joining Date */}
            <div className="input-group">
              <label>Joining Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} />
            </div>

            {/* Current Salary */}
            <div className="input-group">
              <label>Current Salary (₹)</label>
              <input type="text" name="currentSalary" value={formData.currentSalary} onChange={handleInputChange} />
            </div>

            {/* Notice Period */}
            <div className="input-group">
              <label>Notice Period</label>
              <select name="noticePeriod" onChange={handleInputChange} value={formData.noticePeriod}>
                <option value="" disabled>Select</option>
                <option value="15 Days or less">15 Days or less</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="More than 3 Months">More than 3 Months</option>
              </select>
            </div>

            {/* Buttons */}
            <button className="save-btn" onClick={handleSave}>Save</button>
          </>
        )}
      </div>
    </div>
  ) : null;
};

export default EmploymentModal;
