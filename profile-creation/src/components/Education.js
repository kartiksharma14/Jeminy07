import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./Education.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if necessary
});

const Education = () => {
  // ---------------------------------------
  // 1) State Management
  // ---------------------------------------
  const [education, setEducation] = useState({
    education_level: "",
    university: "",
    course: "",
    specialization: "",
    coursestart_year: "",
    courseend_year: "",
  });
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag to determine if editing
  const [selectedEducationLevel, setSelectedEducationLevel] = useState("");

  // Education Levels
  const educationLevels = [
    "doctorate/PhD",
    "masters/post-graduation",
    "graduation/diploma",
    "class XII",
    "class X",
    "below 10th",
  ];

  // ---------------------------------------
  // 2) Decode JWT & Fetch Education Details
  // ---------------------------------------
  useEffect(() => {
    const fetchEducation = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const extractedUserId = decoded.userId || decoded.candidate_id;
        if (!extractedUserId) {
          setError("Invalid token: userId not found");
          return;
        }
        setUserId(extractedUserId);

        // Fetch existing education details
        const response = await axiosInstance.get(
          `/candidate-profile/user-details/${extractedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Fetched education details:", response.data);

        const data = response.data.data;
        if (data) {
          setEducation({
            education_level: data.education_level || "",
            university: data.university || "",
            course: data.course || "",
            specialization: data.specialization || "",
            coursestart_year:
              data.coursestart_year !== null ? data.coursestart_year.toString() : "",
            courseend_year:
              data.courseend_year !== null ? data.courseend_year.toString() : "",
          });
        }
      } catch (err) {
        console.error("❌ Error fetching education details:", err);
        setError("Failed to fetch education details.");
      }
    };

    fetchEducation();
  }, []);

  // ---------------------------------------
  // 3) Toggle Modal for Add/Edit
  // ---------------------------------------
  const toggleModal = (level = "") => {
    if (level) {
      // Adding a specific education level
      setSelectedEducationLevel(level);
      setIsEditing(false);
      setEducation({
        education_level: level,
        university: "",
        course: "",
        specialization: "",
        coursestart_year: "",
        courseend_year: "",
      });
    } else if (education.education_level) {
      // Editing existing education
      setSelectedEducationLevel(education.education_level);
      setIsEditing(true);
    } else {
      // Adding without specific level
      setSelectedEducationLevel("");
      setIsEditing(false);
      setEducation({
        education_level: "",
        university: "",
        course: "",
        specialization: "",
        coursestart_year: "",
        courseend_year: "",
      });
    }
    setModalOpen((prev) => !prev);
  };

  // ---------------------------------------
  // 4) Handle Input Changes
  // ---------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // 5) Handle Form Submission
  // ---------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Validation
    if (
      !education.education_level ||
      !education.university ||
      !education.course ||
      !education.coursestart_year ||
      !education.courseend_year
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Convert years to integers
    const startYear = parseInt(education.coursestart_year, 10);
    const endYear = parseInt(education.courseend_year, 10);

    if (isNaN(startYear) || isNaN(endYear)) {
      setError("Course start and end years must be valid numbers.");
      return;
    }

    if (endYear < startYear) {
      setError("Course end year cannot be before start year.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      // Prepare payload
      const payload = {
        education_level: education.education_level,
        university: education.university,
        course: education.course,
        specialization: education.specialization || null,
        coursestart_year: startYear,
        courseend_year: endYear,
      };

      // PATCH request
      const response = await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Education details updated:", response.data);
      alert("Education details saved successfully!");

      // Close modal
      setModalOpen(false);
    } catch (err) {
      console.error("❌ Error saving education details:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save education details: ${err.response.data.message}`);
      } else {
        setError("Failed to save education details.");
      }
    }
  };

  // ---------------------------------------
  // 6) Render Component
  // ---------------------------------------
  return (
    <div className="education">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle typ-16Bold">Education</span>
          <button className="addButton" onClick={() => toggleModal()}>
            {education.education_level ? "Update education" : "Add education"}
          </button>
        </div>
        <div className="widgetCont">
          {education.education_level ? (
            <div className="education-details">
              <h3>{education.education_level}</h3>
              <p>
                <strong>University:</strong> {education.university}
              </p>
              <p>
                <strong>Course:</strong> {education.course}
                {education.specialization ? ` - ${education.specialization}` : ""}
              </p>
              <p>
                <strong>Duration:</strong> {education.coursestart_year} - {education.courseend_year}
              </p>
            </div>
          ) : (
            <p className="emptyMessage">
              Your qualifications help employers know your educational background
            </p>
          )}

          {/* Hide other Add buttons if an education entry exists */}
          {!education.education_level &&
            educationLevels.map((level, index) => (
              <button
                key={index}
                className="eduDetailsBtn typ-14Bold"
                tabIndex="0"
                onClick={() => toggleModal(level)}
              >
                Add {level}
              </button>
            ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => toggleModal()}
        >
          <div
            className="modal-content education-modal"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <button
              className="close-btn"
              onClick={() => toggleModal()}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>
              {isEditing ? `Edit ${selectedEducationLevel} Details` : "Add Education Details"}
            </h2>
            {isEditing && (
              <p className="selectedLevel">
                You are editing: <strong>{selectedEducationLevel}</strong>
              </p>
            )}
            <form
              name="educationForm"
              className="educationForm"
              onSubmit={handleSave}
            >
              <div className="form-group">
                <label htmlFor="education_level" className="required-field">
                  Education Level
                </label>
                <select
                  id="education_level"
                  name="education_level"
                  className="input"
                  value={education.education_level}
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
                  value={education.university}
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
                  value={education.course}
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
                  value={education.specialization}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="coursestart_year" className="required-field">
                  Course Start Year
                </label>
                <input
                  type="number"
                  id="coursestart_year"
                  name="coursestart_year"
                  className="input duration-input"
                  placeholder="Start Year"
                  value={education.coursestart_year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseend_year" className="required-field">
                  Course End Year
                </label>
                <input
                  type="number"
                  id="courseend_year"
                  name="courseend_year"
                  className="input duration-input"
                  placeholder="End Year"
                  value={education.courseend_year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => toggleModal()}
                >
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
