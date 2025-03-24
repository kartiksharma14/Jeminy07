// src/components/EditEmploymentModal.js
import React, { useState, useEffect, useRef } from "react";
import "./EmploymentModal.css";
import axios from "axios";
import PropTypes from "prop-types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if necessary
});

/* ---------------- Helper Functions ---------------- */
// Convert a number to words in the Indian numbering system (with crore/lakh)
function numberToIndianWords(num) {
  if (typeof num !== "number" || isNaN(num)) return "";
  if (num === 0) return "zero";
  
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  
  const numToWords = (n) => {
    let str = "";
    if (n < 20) {
      str = ones[n];
    } else if (n < 100) {
      str = tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    } else if (n < 1000) {
      str = ones[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " and " + numToWords(n % 100) : "");
    }
    return str;
  };

  let words = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (crore > 0) {
    words += numToWords(crore) + " crore ";
  }
  if (lakh > 0) {
    words += numToWords(lakh) + " lakh ";
  }
  if (thousand > 0) {
    words += numToWords(thousand) + " thousand ";
  }
  if (hundred > 0) {
    words += ones[hundred] + " hundred ";
  }
  if (remainder > 0) {
    if (words !== "" && remainder < 100) {
      words += "and ";
    }
    words += numToWords(remainder);
  }
  return words.trim();
}

// Format a number string with commas (Indian numbering system)
function formatIndianNumber(numStr) {
  if (!numStr) return "";
  let x = numStr.replace(/[^\d]/g, "");
  if (x.length <= 3) return x;
  const lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return otherNumbers + "," + lastThree;
}

/* ---------------- Component ---------------- */
const EditEmploymentModal = ({ isOpen, toggleModal, refreshEmploymentDetails, selectedRecord }) => {
  // Constants and dropdown options
  const MAX_JOB_PROFILE_WORDS = 100;
  const MAX_COMPANY_NAME_CHARS = 50;
  const MAX_JOB_TITLE_CHARS = 50;
  const currentYear = new Date().getFullYear();
  
  const yearsOptions = [];
  for (let y = 1970; y <= currentYear; y++) {
    yearsOptions.push(y);
  }
  const monthsOptions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const expYearOptions = [];
  for (let i = 0; i <= 30; i++) {
    expYearOptions.push(i);
  }
  expYearOptions.push("30+");
  
  const expMonthOptions = [];
  for (let i = 0; i <= 11; i++) {
    expMonthOptions.push(i);
  }
  
  const noticeOptions = [
    "15 days or less",
    "1 month",
    "2 months",
    "3 months",
    "more than 3 months",
    "serving notice period",
  ];
  
  // Unified state keys used in both Add and Edit modals
  const initialFormData = {
    is_current_employment: "Yes", // "Yes" or "No"
    employment_type: "Full-Time", // "Full-Time" or "Internship"
    company_name: "",
    job_title: "",
    joining_year: "",
    joining_month: "",
    worked_till_year: "",
    worked_till_month: "",
    experience_years: "",
    experience_months: "",
    current_salary: "",
    location: "",
    department: "",
    working_from_year: "",
    working_from_month: "",
    monthly_stipend: "",
    skills_used: "",
    job_profile: "",
    notice_period: ""
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [salaryWords, setSalaryWords] = useState("");
  const [stipendFormatted, setStipendFormatted] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const firstInputRef = useRef(null);
  
  // Populate form data from selectedRecord when modal opens
  useEffect(() => {
    if (isOpen && selectedRecord) {
      // Use the backend values directly. Here we assume:
      // - selectedRecord.employment_type is either "Full-Time" or "Internship"
      // - selectedRecord.current_employment is "Yes" or "No"
      setFormData({
        is_current_employment: selectedRecord.current_employment || "Yes",
        employment_type: selectedRecord.employment_type || "Full-Time",
        // For company and job title, if current then use current fields; else use previous.
        company_name:
          selectedRecord.current_employment === "Yes"
            ? selectedRecord.current_company_name || ""
            : selectedRecord.previous_company_name || "",
        job_title:
          selectedRecord.current_employment === "Yes"
            ? selectedRecord.current_job_title || ""
            : selectedRecord.previous_job_title || "",
        joining_year: selectedRecord.joining_date ? selectedRecord.joining_date.substring(0, 4) : "",
        joining_month: selectedRecord.joining_date ? selectedRecord.joining_date.substring(5, 7) : "",
        worked_till_year: selectedRecord.worked_till ? selectedRecord.worked_till.substring(0, 4) : "",
        worked_till_month: selectedRecord.worked_till ? selectedRecord.worked_till.substring(5, 7) : "",
        experience_years: selectedRecord.experience_in_year ? String(selectedRecord.experience_in_year) : "",
        experience_months: selectedRecord.experience_in_months ? String(selectedRecord.experience_in_months) : "",
        current_salary: selectedRecord.current_salary ? String(selectedRecord.current_salary) : "",
        location: selectedRecord.location || "",
        department: selectedRecord.department || "",
        working_from_year: selectedRecord.working_from ? selectedRecord.working_from.substring(0, 4) : "",
        working_from_month: selectedRecord.working_from ? selectedRecord.working_from.substring(5, 7) : "",
        monthly_stipend: selectedRecord.monthly_stipend ? String(selectedRecord.monthly_stipend) : "",
        skills_used: selectedRecord.skill_used || "",
        job_profile: selectedRecord.job_profile || "",
        notice_period: selectedRecord.notice_period || ""
      });
      if (selectedRecord.current_salary) {
        setSalaryWords(numberToIndianWords(parseInt(selectedRecord.current_salary, 10)) + " rupees");
      } else {
        setSalaryWords("");
      }
      if (selectedRecord.monthly_stipend) {
        setStipendFormatted(formatIndianNumber(String(selectedRecord.monthly_stipend)));
      } else {
        setStipendFormatted("");
      }
      setError("");
      setSuccessMessage("");
      if (firstInputRef.current) firstInputRef.current.focus();
    }
  }, [isOpen, selectedRecord]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "job_profile") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > MAX_JOB_PROFILE_WORDS) {
        setError(`Job profile cannot exceed ${MAX_JOB_PROFILE_WORDS} words.`);
        return;
      } else {
        setError("");
      }
    }
    if (name === "company_name" && value.length > MAX_COMPANY_NAME_CHARS) {
      setError(`Company name cannot exceed ${MAX_COMPANY_NAME_CHARS} characters.`);
      return;
    }
    if (name === "job_title" && value.length > MAX_JOB_TITLE_CHARS) {
      setError(`Job title cannot exceed ${MAX_JOB_TITLE_CHARS} characters.`);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSalaryChange = (e) => {
    let rawValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    setFormData((prev) => ({ ...prev, current_salary: rawValue }));
    if (rawValue && !isNaN(rawValue)) {
      const numValue = parseInt(rawValue, 10);
      setSalaryWords(numberToIndianWords(numValue) + " rupees");
    } else {
      setSalaryWords("");
    }
  };
  
  const handleStipendChange = (e) => {
    let rawValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;
    setFormData((prev) => ({ ...prev, monthly_stipend: rawValue }));
    if (rawValue && !isNaN(rawValue)) {
      setStipendFormatted(formatIndianNumber(rawValue));
    } else {
      setStipendFormatted("");
    }
  };
  
  const validateForm = () => {
    // You can add additional validation logic if needed.
    return true;
  };
  
  const clearForm = () => {
    // For editing, closing the modal is sufficient.
    toggleModal();
  };
  
  const handleUpdateRecord = async () => {
    setError("");
    setSuccessMessage("");
    if (!validateForm()) return;
    
    const payload = {
      current_employment: formData.is_current_employment,
      employment_type: formData.employment_type,
      company_name: formData.company_name,
      job_title: formData.job_title,
      joining_date: formData.joining_date || `${formData.joining_year}-${formData.joining_month}`,
      current_salary: formData.current_salary,
      experience_years: Number(formData.experience_years),
      experience_months: Number(formData.experience_months),
      skills_used: formData.skills_used,
      job_profile: formData.job_profile,
      notice_period: formData.notice_period
    };
    
    // If Full-Time and not current, add worked_till date
    if (formData.employment_type === "Full-Time" && formData.is_current_employment === "No") {
      payload.worked_till = `${formData.worked_till_year}-${formData.worked_till_month}`;
    }
    
    // If Internship, include internship-specific fields
    if (formData.employment_type === "Internship") {
      payload.working_from = `${formData.working_from_year}-${formData.working_from_month}`;
      payload.monthly_stipend = Number(formData.monthly_stipend);
      payload.location = formData.location;
      payload.department = formData.department;
    }
    
    try {
      await axiosInstance.patch(
        `/employment/${selectedRecord.employment_id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSuccessMessage("Employment record updated successfully!");
      if (refreshEmploymentDetails && typeof refreshEmploymentDetails === "function") {
        refreshEmploymentDetails();
      }
    } catch (err) {
      console.error("Error updating employment record:", err);
      setError("Failed to update employment record.");
    }
  };
  
  const handleDeleteRecord = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;
    setError("");
    setSuccessMessage("");
    try {
      await axiosInstance.delete(`/employment/${selectedRecord.employment_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSuccessMessage("Employment record deleted successfully!");
      if (refreshEmploymentDetails && typeof refreshEmploymentDetails === "function") {
        refreshEmploymentDetails();
      }
      toggleModal();
    } catch (err) {
      console.error("Error deleting employment record:", err);
      setError("Failed to delete employment record.");
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="em-modal-overlay" onClick={toggleModal} role="dialog" aria-modal="true">
      <div className="em-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="em-close-btn" onClick={toggleModal} aria-label="Close">
          &times;
        </button>
        <h2>Edit Employment Record</h2>
        {error && <p className="em-error-message">{error}</p>}
        {successMessage && <p className="em-success-message">{successMessage}</p>}
        <form>
          {/* Radio Buttons for Current Employment and Employment Type */}
          <div className="em-form-row">
            <div className="em-form-group">
              <label>Is this your current employment?</label>
              <div className="em-radio-group">
                <label>
                  <input
                    type="radio"
                    name="is_current_employment"
                    value="Yes"
                    checked={formData.is_current_employment === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="is_current_employment"
                    value="No"
                    checked={formData.is_current_employment === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="em-form-group">
              <label>Employment Type</label>
              <div className="em-radio-group">
                <label>
                  <input
                    type="radio"
                    name="employment_type"
                    value="Full-Time"
                    checked={formData.employment_type === "Full-Time"}
                    onChange={handleInputChange}
                  />
                  Full&#8209;Time
                </label>
                <label>
                  <input
                    type="radio"
                    name="employment_type"
                    value="Internship"
                    checked={formData.employment_type === "Internship"}
                    onChange={handleInputChange}
                  />
                  Internship
                </label>
              </div>
            </div>
          </div>
          
          {/* Conditional Fields for Full-Time */}
          {formData.employment_type === "Full-Time" && formData.is_current_employment === "Yes" && (
            <>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Current company name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Type Your organisation"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    ref={firstInputRef}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Current job title</label>
                  <input
                    type="text"
                    name="job_title"
                    placeholder="Type your designation"
                    value={formData.job_title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Date (Year)</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Date (Month)</label>
                  <select name="joining_month" value={formData.joining_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Total Experience (Years)</label>
                  <select name="experience_years" value={formData.experience_years} onChange={handleInputChange}>
                    <option value="">Years</option>
                    {expYearOptions.map((yr, idx) => (
                      <option key={idx} value={yr}>
                        {yr}{yr !== "30+" && " year"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Total Experience (Months)</label>
                  <select name="experience_months" value={formData.experience_months} onChange={handleInputChange}>
                    <option value="">Months</option>
                    {expMonthOptions.map((m, idx) => (
                      <option key={idx} value={m}>
                        {m}{m === 1 ? " month" : " months"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Current Salary (₹)</label>
                  <input
                    type="text"
                    name="current_salary"
                    placeholder="4,50,0000"
                    value={formatIndianNumber(formData.current_salary)}
                    onChange={handleSalaryChange}
                  />
                  <small className="em-salary-text" style={{ color: "green" }}>
                    {salaryWords}
                  </small>
                </div>
              </div>
            </>
          )}
          
          {formData.employment_type === "Full-Time" && formData.is_current_employment === "No" && (
            <>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Previous company name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Type Your organisation"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    ref={firstInputRef}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Previous job title</label>
                  <input
                    type="text"
                    name="job_title"
                    placeholder="Type your designation"
                    value={formData.job_title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Date (Year)</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Date (Month)</label>
                  <select name="joining_month" value={formData.joining_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Worked Till (Year)</label>
                  <select name="worked_till_year" value={formData.worked_till_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Worked Till (Month)</label>
                  <select name="worked_till_month" value={formData.worked_till_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          
          {/* Internship Fields */}
          {formData.employment_type === "Internship" && formData.is_current_employment === "Yes" && (
            <>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Current company name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Type Your organisation"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    ref={firstInputRef}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Date (Year)</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Date (Month)</label>
                  <select name="joining_month" value={formData.joining_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Monthly Stipend</label>
                  <input
                    type="text"
                    name="monthly_stipend"
                    placeholder="e.g., 10000"
                    value={formatIndianNumber(formData.monthly_stipend)}
                    onChange={handleStipendChange}
                  />
                  <small className="em-stipend-text" style={{ color: "green" }}>
                    {stipendFormatted}
                  </small>
                </div>
              </div>
            </>
          )}
          
          {formData.employment_type === "Internship" && formData.is_current_employment === "No" && (
            <>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Previous company name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Type Your organisation"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    ref={firstInputRef}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Date (Year)</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Date (Month)</label>
                  <select name="joining_month" value={formData.joining_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Worked Till (Year)</label>
                  <select name="worked_till_year" value={formData.worked_till_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Worked Till (Month)</label>
                  <select name="worked_till_month" value={formData.worked_till_month} onChange={handleInputChange}>
                    <option value="">Select Month</option>
                    {monthsOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Monthly Stipend</label>
                  <input
                    type="text"
                    name="monthly_stipend"
                    placeholder="e.g., 10000"
                    value={formatIndianNumber(formData.monthly_stipend)}
                    onChange={handleStipendChange}
                  />
                  <small className="em-stipend-text" style={{ color: "green" }}>
                    {stipendFormatted}
                  </small>
                </div>
              </div>
            </>
          )}
          
          {/* Common Fields */}
          <div className="em-form-row">
            <div className="em-form-group">
              <label>Skills Used</label>
              <input
                type="text"
                name="skills_used"
                placeholder="Add skills"
                value={formData.skills_used}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="em-form-row">
            <div className="em-form-group">
              <label>Job Profile</label>
              <textarea
                name="job_profile"
                placeholder="Type here..."
                value={formData.job_profile}
                onChange={handleInputChange}
                maxLength="4000"
                rows="4"
              ></textarea>
              <div className="em-word-count">
                {formData.job_profile.trim().split(/\s+/).filter(Boolean).length} / {MAX_JOB_PROFILE_WORDS} words
              </div>
            </div>
          </div>
          <div className="em-form-row">
            <div className="em-form-group">
              <label>Notice Period</label>
              <select name="notice_period" value={formData.notice_period} onChange={handleInputChange}>
                <option value="">Select Notice Period</option>
                {noticeOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="em-form-actions">
            <button type="button" className="em-save-btn" onClick={handleUpdateRecord}>
              Update Record
            </button>
            <button type="button" className="em-delete-btn" onClick={handleDeleteRecord}>
              Delete Record
            </button>
            <button type="button" className="em-cancel-btn" onClick={clearForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditEmploymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshEmploymentDetails: PropTypes.func,
  selectedRecord: PropTypes.object.isRequired,
};

export default EditEmploymentModal;
