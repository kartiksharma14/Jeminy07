// src/components/KeySkillsModal.js

import React, { useState, useEffect, useRef } from "react";
import "./KeySkillsModal.css";
import axiosInstance from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const KeySkillsModal = ({ isOpen, toggleModal, refreshKeySkills }) => {
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);


  const firstInputRef = useRef(null); // For focus management

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

  // Fetch existing key skills when modal opens
  useEffect(() => {
    if (isOpen) {
      decodeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (userId && isOpen) {
      const fetchKeySkills = async () => {
        try {
          const response = await axiosInstance.get(
            `/candidate-profile/user-details/${userId}`
          );

          const data = response.data.data;

          if (data && data.key_skills) {
            // Handle null by converting to empty array and splitting by comma
            setSkills(
              data.key_skills
                ? data.key_skills.split(",").map((skill) => skill.trim())
                : []
            );
          } else {
            setSkills([]); // Ensure skills is an empty array if null
          }
        } catch (err) {
          console.error("Error fetching key skills:", err);
          setError("Failed to fetch key skills.");
        }
      };

      fetchKeySkills();
    }
  }, [userId, isOpen]);


  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSkillAddition = (e) => {
    if (e.key === "Enter" && inputSkill.trim()) {
      e.preventDefault(); // Prevent form submission

      const newSkill = inputSkill.trim();
      if (!skills.includes(newSkill)) {
        setSkills((prev) => [...prev, newSkill]);
      }

      setInputSkill(""); // Clear input field after adding
    }
  };

  const handleSuggestedSkillClick = (skill) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]); // Append skill to state
    }
  };
  
  const handleSkillRemoval = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (skills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }

    // Fetch current skills before saving (to append instead of replace)
    let existingSkills = [];
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${userId}`
      );
      if (response.data.data.key_skills) {
        existingSkills = response.data.data.key_skills
          .split(",")
          .map((skill) => skill.trim());
      }
    } catch (err) {
      console.error("Error fetching existing key skills:", err);
    }

    // Merge existing skills with new ones (avoid duplicates)
    const mergedSkills = Array.from(new Set([...existingSkills, ...skills]));

    // Convert to comma-separated string for API patch request
    const skillsString = mergedSkills.join(", ");

    const payload = {
      key_skills: skillsString, // Use "key_skills" to match API schema
    };

    try {
      const response = await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        payload
      );

      console.log("✅ Key skills updated:", response.data);
      setSuccessMessage("Key skills updated successfully!");

      // Refresh key skills in the parent component
      if (refreshKeySkills && typeof refreshKeySkills === "function") {
        refreshKeySkills();
      }

      // Close modal after success
      setTimeout(() => {
        toggleModal();
      }, 1500);
    } catch (err) {
      console.error("❌ Error updating key skills:", err);
      setError("Failed to update key skills.");
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
        className="modal-content key-skills-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={toggleModal}
          aria-label="Close"
        >
          &times;
        </button>
        <h2>Key Skills</h2>
        <p>Add your key skills to enhance your profile.</p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

        <form onSubmit={handleSkillAddition}>
          <div className="skills-input">
            <input
              type="text"
              placeholder="Enter a skill and press Enter"
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={handleSkillAddition}
              ref={firstInputRef}
            />

            <button type="submit" className="add-btn">
              Add
            </button>
          </div>
        </form>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}{" "}
              <span
                className="remove-symbol"
                onClick={() => handleSkillRemoval(skill)}
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  color: "red",
                  fontWeight: "bold",
                }}
                aria-label={`Remove ${skill}`}
                role="button"
              >
                &times;
              </span>
            </span>
          ))}
        </div>

        <div className="suggested-skills">
  <p>Suggested Skills:</p>
  <div className="suggested-list">
    {[
      "Java",
      "SQL",
      "Angular",
      "JavaScript",
      "Python",
      "AWS",
      "React.Js",
      "HTML",
      "REST",
      "CSS",
    ].map((skill) => (
      <span
        key={skill}
        className="suggested-skill-tag"
        onClick={() => handleSuggestedSkillClick(skill)} // ✅ Corrected function call
      >
        {skill}{" "}
        <span
          className="add-symbol"
          style={{
            cursor: "pointer",
            marginLeft: "5px",
            color: "green",
            fontWeight: "bold",
          }}
          aria-label={`Add ${skill}`}
          role="button"
        >
          +
        </span>
      </span>
    ))}
  </div>
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
KeySkillsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshKeySkills: PropTypes.func, // Optional prop
};

export default KeySkillsModal;
