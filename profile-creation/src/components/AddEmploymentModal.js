// src/components/AddEmploymentModal.js
import React, { useState, useEffect, useRef } from "react";
import "./EmploymentModal.css";
import axios from "axios";
import PropTypes from "prop-types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL remains same; endpoint will be updated in the POST call
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

const AddEmploymentModal = ({ isOpen, toggleModal, refreshEmploymentDetails, userId }) => {
  // Constants and dropdown options
  const MAX_JOB_PROFILE_WORDS = 100;
  const MAX_COMPANY_NAME_CHARS = 50;
  const MAX_JOB_TITLE_CHARS = 50;
  const MIN_SALARY = 50001;
  const MAX_SALARY = 999999999;
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

  /* Sample Payload Scenarios:
  
    Scenario 1: Full-Time & Current (Yes)
    {
      "is_current_employment": "Yes",
      "employment_type": "Full-Time",
      "current_company_name": "ABC Technologies",
      "current_job_title": "Senior Software Developer",
      "joining_year": 2022,
      "joining_month": 6,
      "experience_years": 3,
      "experience_months": 5,
      "current_salary": 95000,
      "skills_used": "JavaScript, Node.js, React, MongoDB",
      "job_profile": "Developing and maintaining web applications...",
      "notice_period": "2 months"
    }
    
    Scenario 2: Full-Time & Not Current (No)
    {
      "is_current_employment": "No",
      "employment_type": "Full-Time",
      "previous_company_name": "XYZ Solutions",
      "previous_job_title": "Web Developer",
      "joining_year": 2019,
      "joining_month": 3,
      "worked_till_year": 2021,
      "worked_till_month": 12,
      "job_profile": "Developed and maintained client websites..."
    }
    
    Scenario 3: Internship & Current (Yes)
    {
      "is_current_employment": "Yes",
      "employment_type": "Internship",
      "current_company_name": "Tech Innovators",
      "current_job_title": "Intern Developer",
      "location": "Bangalore",
      "department": "Product Development",
      "joining_year": 2023,
      "joining_month": 9,
      "monthly_stipend": 25000
    }
    
    Scenario 4: Internship & Not Current (No)
    {
      "is_current_employment": "No",
      "employment_type": "Internship",
      "previous_company_name": "Digital Solutions",
      "previous_job_title": "Intern Developer",
      "location": "Mumbai",
      "department": "UI/UX Design",
      "joining_year": 2021,
      "joining_month": 5,
      "worked_till_year": 2021,
      "worked_till_month": 11,
      "monthly_stipend": 18000
    }
  */

  // Initial state for the form using the payload field names
  const initialFormData = {
    is_current_employment: "Yes", // "Yes" or "No"
    employment_type: "Full-Time", // "Full-Time" or "Internship"
    // For Full-Time:
    current_company_name: "",
    current_job_title: "",
    previous_company_name: "",
    previous_job_title: "",
    joining_year: "",
    joining_month: "",
    worked_till_year: "",
    worked_till_month: "",
    experience_years: "",
    experience_months: "",
    current_salary: "",
    // For Internship (we reuse the same keys for job title):
    // current_company_name and current_job_title will be used for current internship;
    // previous_company_name and previous_job_title for not-current internship.
    location: "",
    department: "",
    working_from_year: "",
    working_from_month: "",
    monthly_stipend: "",
    // Common Fields:
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

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setSalaryWords("");
      setStipendFormatted("");
      setError("");
      setSuccessMessage("");
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen]);

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
    if ((name === "current_company_name" || name === "previous_company_name") && value.length > MAX_COMPANY_NAME_CHARS) {
      setError(`Company name cannot exceed ${MAX_COMPANY_NAME_CHARS} characters.`);
      return;
    }
    if ((name === "current_job_title" || name === "previous_job_title") && value.length > MAX_JOB_TITLE_CHARS) {
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
      if (numValue < MIN_SALARY || numValue > MAX_SALARY) {
        setError(`Salary must be between ${MIN_SALARY} and ${MAX_SALARY}.`);
      } else {
        setError("");
      }
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
    // Add your validation logic based on employment type and is_current_employment if needed.
    return true;
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setSalaryWords("");
    setStipendFormatted("");
  };

  const handleSubmitRecord = async () => {
    setError("");
    setSuccessMessage("");
    if (!validateForm()) return;

    let payload = {
      is_current_employment: formData.is_current_employment,
      employment_type: formData.employment_type,
      skills_used: formData.skills_used,
      job_profile: formData.job_profile,
      // Notice period is applicable for Full-Time current scenario
      notice_period: formData.notice_period,
    };

    if (formData.employment_type === "Full-Time") {
      if (formData.is_current_employment === "Yes") {
        payload = {
          ...payload,
          // For current employment, fallback to previous if current is missing
          current_company_name: formData.current_company_name || formData.previous_company_name,
          current_job_title: formData.current_job_title || formData.previous_job_title,
          joining_year: Number(formData.joining_year),
          joining_month: Number(formData.joining_month),
          experience_years: Number(formData.experience_years),
          experience_months: Number(formData.experience_months),
          current_salary: Number(formData.current_salary),
        };
      } else {
        payload = {
          ...payload,
          // For non-current employment, fallback to current if previous is missing
          previous_company_name: formData.previous_company_name || formData.current_company_name,
          previous_job_title: formData.previous_job_title || formData.current_job_title,
          joining_year: Number(formData.joining_year),
          joining_month: Number(formData.joining_month),
          worked_till_year: Number(formData.worked_till_year),
          worked_till_month: Number(formData.worked_till_month),
        };
      }
    } else if (formData.employment_type === "Internship") {
      if (formData.is_current_employment === "Yes") {
        payload = {
          ...payload,
          current_company_name: formData.current_company_name || formData.previous_company_name,
          current_job_title: formData.current_job_title || formData.previous_job_title,
          location: formData.location,
          department: formData.department,
          joining_year: Number(formData.joining_year),
          joining_month: Number(formData.joining_month),
          monthly_stipend: Number(formData.monthly_stipend),
        };
      } else {
        payload = {
          ...payload,
          previous_company_name: formData.previous_company_name || formData.current_company_name,
          previous_job_title: formData.previous_job_title || formData.current_job_title,
          location: formData.location,
          department: formData.department,
          joining_year: Number(formData.joining_year),
          joining_month: Number(formData.joining_month),
          worked_till_year: Number(formData.worked_till_year),
          worked_till_month: Number(formData.worked_till_month),
          monthly_stipend: Number(formData.monthly_stipend),
        };
      }
    }
    

    try {
      const response = await axiosInstance.post(
        `/employment/${userId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message);
      } else {
        setSuccessMessage("Employment record added successfully!");
      }
      clearForm();
      if (refreshEmploymentDetails && typeof refreshEmploymentDetails === "function") {
        refreshEmploymentDetails();
      }
    } catch (err) {
      console.error("Error adding employment record:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add employment record.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="em-modal-overlay" onClick={toggleModal} role="dialog" aria-modal="true">
      <div className="em-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="em-close-btn" onClick={toggleModal} aria-label="Close">
          &times;
        </button>
        <h2>Employment</h2>
        <p className="em-subtitle">
          Details like job title, company name, etc., help employers understand your work.
        </p>
        {error && <p className="em-error-message">{error}</p>}
        {successMessage && <p className="em-success-message">{successMessage}</p>}
        <form>
          {/* Current Employment */}
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
          </div>
          {/* Employment Type */}
          <div className="em-form-row">
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
                    name="current_company_name"
                    placeholder="Type Your organisation"
                    value={formData.current_company_name}
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
                    name="current_job_title"
                    placeholder="Type your designation"
                    value={formData.current_job_title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Year</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Month</label>
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
                    name="previous_company_name"
                    placeholder="Type Your organisation"
                    value={formData.previous_company_name || formData.current_company_name}
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
                    name="previous_job_title"
                    placeholder="Type your designation"
                    value={formData.previous_job_title || formData.current_job_title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="em-form-row em-inline-row">
                <div className="em-form-group">
                  <label>Joining Year</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Month</label>
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
                    name="current_company_name"
                    placeholder="Type Your organisation"
                    value={formData.current_company_name}
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
                    name="current_job_title"
                    placeholder="Type your designation"
                    value={formData.current_job_title}
                    onChange={handleInputChange}
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
                  <label>Joining Year</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Month</label>
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
                    name="previous_company_name"
                    placeholder="Type Your organisation"
                    value={formData.previous_company_name || formData.current_company_name}
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
                    name="previous_job_title"
                    placeholder="Type your designation"
                    value={formData.previous_job_title || formData.current_job_title}
                    onChange={handleInputChange}
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
                  <label>Joining Year</label>
                  <select name="joining_year" value={formData.joining_year} onChange={handleInputChange}>
                    <option value="">Select Year</option>
                    {yearsOptions.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Joining Month</label>
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
            <button type="button" className="em-save-btn" onClick={handleSubmitRecord}>
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddEmploymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshEmploymentDetails: PropTypes.func,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AddEmploymentModal;
