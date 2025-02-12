// src/components/Education.js

import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./Education.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if necessary
});

const Education = () => {
  // State for multiple education records
  const [educationRecords, setEducationRecords] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal state for the record being added/edited
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    education_id: null,
    education_level: "",
    university: "",
    course: "",
    specialization: "",
    coursestart_year: "",
    courseend_year: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const educationLevels = [
    "doctorate/PhD",
    "masters/post-graduation",
    "graduation/diploma",
    "class XII",
    "class X",
    "below 10th",
  ];

  // Decode JWT and fetch education records on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const extractedUserId = decoded.userId || decoded.candidate_id;
      if (!extractedUserId) {
        setError("Invalid token: userId not found.");
        return;
      }
      setUserId(extractedUserId);
      fetchEducationRecords(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // Fetch education records from candidate profile
  const fetchEducationRecords = async (userId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data;
      if (data && data.education && Array.isArray(data.education)) {
        setEducationRecords(data.education);
      } else {
        setEducationRecords([]);
      }
    } catch (err) {
      console.error("Error fetching education records:", err);
      setError("Failed to fetch education records.");
    }
  };

  // Open modal for adding a new record (optionally pre-selecting an education level)
  const openModalForAdd = (level = "") => {
    setIsEditing(false);
    setCurrentEducation({
      education_id: null,
      education_level: level,
      university: "",
      course: "",
      specialization: "",
      coursestart_year: "",
      courseend_year: "",
    });
    setModalOpen(true);
  };

  // Open modal for editing an existing record
  const openModalForEdit = (record) => {
    setIsEditing(true);
    setCurrentEducation({
      education_id: record.education_id,
      education_level: record.education_level,
      university: record.university,
      course: record.course,
      specialization: record.specialization || "",
      coursestart_year: record.coursestart_year ? record.coursestart_year.toString() : "",
      courseend_year: record.courseend_year ? record.courseend_year.toString() : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saving a record (POST for new, PATCH for update)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
  
    // Basic validation
    if (
      !currentEducation.education_level ||
      !currentEducation.university ||
      !currentEducation.course ||
      !currentEducation.coursestart_year ||
      !currentEducation.courseend_year
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    const startYear = parseInt(currentEducation.coursestart_year, 10);
    const endYear = parseInt(currentEducation.courseend_year, 10);
    if (isNaN(startYear) || isNaN(endYear)) {
      setError("Course start and end years must be valid numbers.");
      return;
    }
    if (endYear < startYear) {
      setError("Course end year cannot be before start year.");
      return;
    }
  
    const payload = {
      education_level: currentEducation.education_level,
      university: currentEducation.university,
      course: currentEducation.course,
      specialization: currentEducation.specialization || null,
      coursestart_year: startYear,
      courseend_year: endYear,
    };
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      let response;
      if (isEditing) {
        // PATCH request to update existing record
        response = await axiosInstance.patch(
          `/education/${currentEducation.education_id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Education record updated successfully!");
      } else {
        // POST request to add new record
        response = await axiosInstance.post(`/education/${userId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Education record added successfully!");
      }
      // Refresh the list by re-fetching education records from the server
      await fetchEducationRecords(userId, token);
      closeModal();
    } catch (err) {
      console.error("Error saving education record:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save education record: ${err.response.data.message}`);
      } else {
        setError("Failed to save education record.");
      }
    }
  };
  
  // Handle deletion of a record
  const handleDelete = async (education_id) => {
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      await axiosInstance.delete(`/education/${education_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEducationRecords((prev) =>
        prev.filter((rec) => rec.education_id !== education_id)
      );
      alert("Education record deleted successfully!");
    } catch (err) {
      console.error("Error deleting education record:", err);
      setError("Failed to delete education record.");
    }
  };

  return (
    <div className="education-container">
      {error && <p className="error-text">{error}</p>}
      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle">Education</span>
          <button className="addButton" onClick={() => openModalForAdd()}>
            Add Education
          </button>
        </div>
        <div className="widgetCont">
          {educationRecords.length > 0 ? (
            educationRecords
              .filter((record) => record) /* Filter out any undefined records */
              .map((record, index) => (
                <div key={record.education_id || index} className="education-details">
                  <h3>{record.education_level}</h3>
                  <p>
                    <strong>University:</strong> {record.university}
                  </p>
                  <p>
                    <strong>Course:</strong> {record.course}
                    {record.specialization ? ` - ${record.specialization}` : ""}
                  </p>
                  <p>
                    <strong>Duration:</strong> {record.coursestart_year} - {record.courseend_year}
                  </p>
                  <div className="record-actions">
                    <button className="edit-btn" onClick={() => openModalForEdit(record)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(record.education_id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="emptyMessage">
              Your qualifications help employers know your educational background.
            </p>
          )}
          {educationRecords.length === 0 &&
            educationLevels.map((level, index) => (
              <button
                key={index}
                className="eduDetailsBtn"
                onClick={() => openModalForAdd(level)}
              >
                Add {level}
              </button>
            ))}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-content education-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2>{isEditing ? "Edit Education Details" : "Add Education Details"}</h2>
            <form className="educationForm" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="education_level" className="required-field">
                  Education Level
                </label>
                <select
                  id="education_level"
                  name="education_level"
                  className="input"
                  value={currentEducation.education_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select education</option>
                  {educationLevels.map((level, idx) => (
                    <option key={idx} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="university" className="required-field">
                  University/Institute
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  className="input"
                  placeholder="Enter university/institute"
                  value={currentEducation.university}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="course" className="required-field">
                  Course
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  className="input"
                  placeholder="Enter course"
                  value={currentEducation.course}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  className="input"
                  placeholder="Enter specialization"
                  value={currentEducation.specialization}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group duration-container">
                <div className="duration-input">
                  <label htmlFor="coursestart_year" className="required-field">
                    Course Start Year
                  </label>
                  <input
                    type="number"
                    id="coursestart_year"
                    name="coursestart_year"
                    className="input"
                    placeholder="Start Year"
                    value={currentEducation.coursestart_year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <span> - </span>
                <div className="duration-input">
                  <label htmlFor="courseend_year" className="required-field">
                    Course End Year
                  </label>
                  <input
                    type="number"
                    id="courseend_year"
                    name="courseend_year"
                    className="input"
                    placeholder="End Year"
                    value={currentEducation.courseend_year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="cancel-btn" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="save-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
