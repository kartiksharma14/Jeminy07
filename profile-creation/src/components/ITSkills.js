import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./ITSkills.css";

// Create an axios instance if you don't have a shared one
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const ITSkills = () => {
  // ---------------------------------------
  // 1) State for IT skills & proficiency
  // ---------------------------------------
  const [itSkills, setItSkills] = useState([]);
  const [itSkillsProficiency, setItSkillsProficiency] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // State for modal & form inputs
  const [isModalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState("");

  // ---------------------------------------
  // 2) Decode JWT & fetch IT skills
  // ---------------------------------------
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
        setError("Invalid token: userId not found");
        return;
      }
      setUserId(extractedUserId);

      // Fetch existing IT skills
      fetchITSkills(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // ---------------------------------------
  // 3) Fetch (GET) IT skills from API
  // ---------------------------------------
  const fetchITSkills = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched IT skills:", response.data);

      const data = response.data.data;
      if (data) {
        setItSkills(data.it_skills ? data.it_skills.split(",") : []);
        setItSkillsProficiency(
          data.it_skills_proficiency ? data.it_skills_proficiency.split(",") : []
        );
      }
    } catch (err) {
      console.error("❌ Error fetching IT skills:", err);
      setError("Failed to fetch IT skills.");
    }
  };

  // ---------------------------------------
  // 4) PATCH new IT skills
  // ---------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId || !newSkill || !newProficiency) {
      setError("Please enter both skill and proficiency.");
      return;
    }

    try {
      // Append new skill & proficiency to existing lists
      const updatedSkills = [...itSkills, newSkill].join(",");
      const updatedProficiency = [...itSkillsProficiency, newProficiency].join(",");

      console.log("🔄 Updating IT skills:", { updatedSkills, updatedProficiency });

      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          it_skills: updatedSkills,
          it_skills_proficiency: updatedProficiency,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ IT skills updated successfully");
      alert("IT skills saved!");

      // Update local state
      setItSkills([...itSkills, newSkill]);
      setItSkillsProficiency([...itSkillsProficiency, newProficiency]);

      // Close modal and reset input fields
      setModalOpen(false);
      setNewSkill("");
      setNewProficiency("");
    } catch (err) {
      console.error("❌ Error saving IT skills:", err);
      setError("Failed to save IT skills.");
    }
  };

  // ---------------------------------------
  // Toggle Modal
  // ---------------------------------------
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // ---------------------------------------
  // Render
  // ---------------------------------------
  return (
    <div className="itSkills">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle">IT Skills</span>
          <button className="addButton" onClick={toggleModal}>
            {itSkills.length > 0 ? "Update details" : "Add details"}
          </button>
        </div>

        <div className="widgetCont">
          {itSkills.length === 0 ? (
            <p className="empty">
              Show your technical expertise by mentioning software and skills you
              know
            </p>
          ) : (
            <ul className="it-skills-list">
              {itSkills.map((skill, index) => (
                <li key={index}>
                  <strong>{skill}</strong> - {itSkillsProficiency[index]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content it-skills-modal">
            <button
              className="close-btn"
              onClick={toggleModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Add IT Skills</h2>

            <form name="itSkillsForm" className="itSkillsForm" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="skillName" className="required-field">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="skillName"
                  className="input"
                  placeholder="Enter skill name"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="proficiency" className="required-field">
                  Proficiency Level
                </label>
                <select
                  id="proficiency"
                  className="input"
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(e.target.value)}
                >
                  <option value="">Select proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="form-actions">
                <button className="cancel-btn" type="button" onClick={toggleModal}>
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

export default ITSkills;
