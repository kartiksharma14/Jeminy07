import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./Projects.css";

// If you already have a shared axios instance, import it.
// Otherwise, create one here:
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const Projects = () => {
  // ------------------------------------
  // 1) State for project fields
  // ------------------------------------
  const [projectData, setProjectData] = useState({
    project_titles: "",
    technology_used: "",
    project_start_date: "",
    project_end_date: "",
  });

  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal toggle
  const [isModalOpen, setModalOpen] = useState(false);

  // ------------------------------------
  // 2) Decode JWT & fetch existing data
  // ------------------------------------
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

      // Fetch existing project info
      fetchProjectData(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // ------------------------------------
  // 3) Fetch (GET) project info
  // ------------------------------------
  const fetchProjectData = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched project data:", response.data);

      const data = response.data.data;
      if (data) {
        setProjectData({
          project_titles: data.project_titles || "",
          technology_used: data.technology_used || "",
          project_start_date: data.project_start_date || "",
          project_end_date: data.project_end_date || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching project data:", err);
      setError("Failed to fetch project data.");
    }
  };

  // ------------------------------------
  // 4) PATCH project info
  // ------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      console.log("🔄 Updating project data with:", projectData);

      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          // The backend expects these keys:
          project_titles: projectData.project_titles.trim() || null,
          technology_used: projectData.technology_used.trim() || null,
          project_start_date: projectData.project_start_date.trim() || null,
          project_end_date: projectData.project_end_date.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Project data updated successfully");
      alert("Project details saved!");
      setModalOpen(false); // close modal after save
    } catch (err) {
      console.error("❌ Error saving project data:", err);
      setError("Failed to save project data.");
    }
  };

  // ------------------------------------
  // Handler for input changes
  // ------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------
  // Toggle Modal
  // ------------------------------------
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // ------------------------------------
  // Render
  // ------------------------------------
  const { project_titles, technology_used, project_start_date, project_end_date } =
    projectData;

  // Check if any project data is available
  const hasProject =
    project_titles || technology_used || project_start_date || project_end_date;

  return (
    <div className="project-section">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle typ-16Bold">Projects</span>
          <button className="addButton" onClick={toggleModal}>
            {hasProject ? "Edit project" : "Add project"}
          </button>
        </div>

        <div className="widgetCont">
          {!hasProject ? (
            <p className="empty">
              Stand out to employers by adding details about projects that you
              have done so far
            </p>
          ) : (
            // If there's data, display it
            <div className="project-display">
              <h3>{project_titles}</h3>
              <p>
                <strong>Technologies:</strong> {technology_used}
              </p>
              <p>
                <strong>Duration:</strong> {project_start_date} - {project_end_date}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content project-modal">
            <button
              className="close-btn"
              onClick={toggleModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>{hasProject ? "Edit Project Details" : "Add Project Details"}</h2>

            <form name="projectForm" className="projectForm" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="project_titles" className="required-field">
                  Project Title
                </label>
                <input
                  type="text"
                  id="project_titles"
                  name="project_titles"
                  className="input"
                  placeholder="Enter project title"
                  value={project_titles}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="technology_used" className="required-field">
                  Technologies Used
                </label>
                <input
                  type="text"
                  id="technology_used"
                  name="technology_used"
                  className="input"
                  placeholder="E.g., React, Node.js, Python"
                  value={technology_used}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="project_start_date" className="required-field">
                  Project Start Date
                </label>
                <input
                  type="text"
                  id="project_start_date"
                  name="project_start_date"
                  className="input"
                  placeholder="YYYY-MM-DD"
                  value={project_start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="project_end_date" className="required-field">
                  Project End Date
                </label>
                <input
                  type="text"
                  id="project_end_date"
                  name="project_end_date"
                  className="input"
                  placeholder="YYYY-MM-DD"
                  value={project_end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={toggleModal}
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

export default Projects;
