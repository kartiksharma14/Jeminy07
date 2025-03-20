// src/components/KeySkillsModal.js

import React, { useState, useEffect, useRef } from "react";
import "./KeySkillsModal.css";
import axiosInstance from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const KeySkillsModal = ({ isOpen, toggleModal, refreshKeySkills }) => {
  // Limits
  const MAX_SKILLS = 10;
  const MAX_WORDS_PER_SKILL = 2;

  const [skills, setSkills] = useState([]);
  const [initialSkills, setInitialSkills] = useState([]); // store original skills for comparison
  const [skillRecords, setSkillRecords] = useState([]);   // full keyskills objects from GET
  const [inputSkill, setInputSkill] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const firstInputRef = useRef(null); // For focus management

  // List of suggested skills
  const suggestedSkills = [
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
  ];

  // Reset component state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSkills([]);
      setInitialSkills([]);
      setSkillRecords([]);
      setInputSkill("");
      setError("");
      setSuccessMessage("");
      setUserId(null);
    }
  }, [isOpen]);

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

  // Decode token when modal is opened
  useEffect(() => {
    if (isOpen) {
      decodeToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch candidate profile (which now includes keyskills as an array)
  useEffect(() => {
    if (userId && isOpen) {
      const fetchCandidateProfile = async () => {
        try {
          const response = await axiosInstance.get(
            `/candidate-profile/user-details/${userId}`
          );
          const data = response.data.data;
          if (data && data.keyskills && Array.isArray(data.keyskills)) {
            // Extract the keyskills names for display
            const skillsArray = data.keyskills.map(
              (item) => item.keyskillsname
            );
            setSkills(skillsArray);
            setInitialSkills(skillsArray);
            // Save the full records (to get keyskills_id when deleting)
            setSkillRecords(data.keyskills);
          } else {
            setSkills([]);
            setInitialSkills([]);
            setSkillRecords([]);
          }
        } catch (err) {
          console.error("Error fetching candidate profile:", err);
          setError("Failed to fetch candidate profile.");
        }
      };

      fetchCandidateProfile();
    }
  }, [userId, isOpen]);

  // Focus the first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle adding a skill (on Enter key press)
  const handleSkillAddition = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const trimmedInput = inputSkill.trim();
      if (!trimmedInput) return;

      // Enforce word limit for each skill
      const wordCount = trimmedInput.split(/\s+/).filter(Boolean).length;
      if (wordCount > MAX_WORDS_PER_SKILL) {
        setError(`Each skill can only have a maximum of ${MAX_WORDS_PER_SKILL} words.`);
        return;
      }

      // Enforce maximum number of skills
      if (skills.length >= MAX_SKILLS) {
        setError(`You can only add a maximum of ${MAX_SKILLS} skills.`);
        return;
      }

      if (!skills.includes(trimmedInput)) {
        setSkills((prev) => [...prev, trimmedInput]);
        setError("");
      } else {
        setError("This skill is already added.");
      }
      setInputSkill("");
    }
  };

  // Handle adding a suggested skill when clicked
  const handleSuggestedSkillClick = (skill) => {
    // Enforce maximum number of skills
    if (skills.length >= MAX_SKILLS) {
      setError(`You can only add a maximum of ${MAX_SKILLS} skills.`);
      return;
    }
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
      setError("");
    }
  };

  // Handle removing a skill from the UI list
  const handleSkillRemoval = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  // When the user clicks "Save", process additions (POST) and removals (DELETE)
  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (skills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }

    // Determine skills to add and to remove
    const skillsToAdd = skills.filter((skill) => !initialSkills.includes(skill));
    const skillsToRemove = initialSkills.filter(
      (skill) => !skills.includes(skill)
    );

    // Process additions: POST each new skill
    for (let skill of skillsToAdd) {
      try {
        const payload = { keyskillsname: skill };
        const response = await axiosInstance.post(`/keyskills/${userId}`, payload);
        console.log("✅ Skill added:", response.data);
      } catch (err) {
        console.error("Error adding skill:", err);
        setError(`Failed to add skill: ${skill}`);
        return;
      }
    }

    // Process removals: DELETE each removed skill by locating its record via keyskills_id
    for (let skill of skillsToRemove) {
      const record = skillRecords.find(
        (rec) => rec.keyskillsname === skill
      );
      if (record) {
        try {
          const response = await axiosInstance.delete(
            `/keyskills/${record.keyskills_id}`
          );
          console.log("❌ Skill deleted:", response.data);
        } catch (err) {
          console.error("Error deleting skill:", err);
          setError(`Failed to delete skill: ${skill}`);
          return;
        }
      }
    }

    setSuccessMessage("Key skills updated successfully!");
    // Optionally refresh key skills in the parent component
    if (refreshKeySkills && typeof refreshKeySkills === "function") {
      refreshKeySkills();
    }
    // Close modal after a short delay
    setTimeout(() => {
      toggleModal();
    }, 1500);
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
              onChange={(e) => {
                setInputSkill(e.target.value);
                setError("");
              }}
              onKeyDown={handleSkillAddition}
              ref={firstInputRef}
            />
          </div>
          <p className="input-note">
            Each skill can have a maximum of {MAX_WORDS_PER_SKILL} words. You can add up to {MAX_SKILLS} skills.
          </p>
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
            {suggestedSkills
              .filter((skill) => !skills.includes(skill))
              .map((skill) => (
                <span
                  key={skill}
                  className="suggested-skill-tag"
                  onClick={() => handleSuggestedSkillClick(skill)}
                  style={{
                    cursor: "pointer",
                  }}
                  aria-label={`Add ${skill}`}
                  role="button"
                >
                  {skill}{" "}
                  <span
                    className="add-symbol"
                    style={{
                      marginLeft: "5px",
                      color: "green",
                      fontWeight: "bold",
                    }}
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

KeySkillsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  refreshKeySkills: PropTypes.func, // Optional prop
};

export default KeySkillsModal;
