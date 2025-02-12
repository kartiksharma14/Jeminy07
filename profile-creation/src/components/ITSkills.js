// src/components/ITSkills.js

import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./ITSkills.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const ITSkills = () => {
  // State for IT skills records
  const [itSkillsRecords, setItSkillsRecords] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal state for adding/editing IT skill
  const [isModalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState("");
  // When editing, this holds the record being edited; null means adding new.
  const [editingRecord, setEditingRecord] = useState(null);

  // Decode token and fetch IT skills on mount
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
      fetchITSkills(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // Fetch IT skills from candidate profile GET response
  const fetchITSkills = async (uId, token) => {
    try {
      const response = await axiosInstance.get(`/candidate-profile/user-details/${uId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data;
      if (data && data.itskills && Array.isArray(data.itskills)) {
        setItSkillsRecords(data.itskills);
      } else {
        setItSkillsRecords([]);
      }
    } catch (err) {
      console.error("Error fetching IT skills:", err);
      setError("Failed to fetch IT skills.");
    }
  };

  // Open modal for adding a new IT skill
  const openModalForAdd = () => {
    setEditingRecord(null);
    setNewSkill("");
    setNewProficiency("");
    setModalOpen(true);
  };

  // Open modal for editing an existing IT skill
  const openModalForEdit = (record) => {
    setEditingRecord(record);
    setNewSkill(record.itskills_name);
    setNewProficiency(record.itskills_proficiency);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle saving the IT skill record (POST for new, PATCH for editing)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!newSkill || !newProficiency) {
      setError("Please enter both skill and proficiency.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      let response;
      if (editingRecord) {
        // PATCH request for updating an existing IT skill using itskills_id
        response = await axiosInstance.patch(
          `/itskills/${editingRecord.itskills_id}`,
          { itskills_name: newSkill, itskills_proficiency: newProficiency },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("IT skill updated successfully!");
      } else {
        // POST request for adding a new IT skill using userId
        response = await axiosInstance.post(
          `/itskills/${userId}`,
          { itskills_name: newSkill, itskills_proficiency: newProficiency },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("IT skill added successfully!");
      }
      // Re-fetch IT skills from server to refresh the list
      await fetchITSkills(userId, token);
      closeModal();
    } catch (err) {
      console.error("Error saving IT skill:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save IT skill: ${err.response.data.message}`);
      } else {
        setError("Failed to save IT skill.");
      }
    }
  };

  // Handle deletion of an IT skill record
  const handleDelete = async (itskills_id) => {
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      await axiosInstance.delete(`/itskills/${itskills_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("IT skill deleted successfully!");
      // Re-fetch IT skills to refresh the list
      await fetchITSkills(userId, token);
    } catch (err) {
      console.error("Error deleting IT skill:", err);
      setError("Failed to delete IT skill.");
    }
  };

  return (
    <div className="itSkills-container">
      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle">IT Skills</span>
          <button className="addButton" onClick={openModalForAdd}>
            {itSkillsRecords.length > 0 ? "Add New Skill" : "Add IT Skill"}
          </button>
        </div>

        <div className="widgetCont">
          {itSkillsRecords.length === 0 ? (
            <p className="empty">
              Show your technical expertise by mentioning software and skills you know.
            </p>
          ) : (
            <ul className="it-skills-list">
              {itSkillsRecords
                .filter((record) => record) // Filter out any undefined records
                .map((record) => (
                  <li key={record.itskills_id} className="it-skill-item">
                    <span className="skill-name">{record.itskills_name}{" "} - <span className="skill-proficiency">{record.itskills_proficiency}</span></span>
                    <div className="record-actions">
                      <button className="edit-btn" onClick={() => openModalForEdit(record)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(record.itskills_id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal for adding/editing IT skill */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-content it-skills-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2>{editingRecord ? "Edit IT Skill" : "Add IT Skill"}</h2>
            <form className="itSkillsForm" onSubmit={handleSave}>
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
                  required
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
                  required
                >
                  <option value="">Select proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
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

export default ITSkills;
