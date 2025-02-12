import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./Projects.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const Projects = () => {
  // State for multiple project records
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal state for add/edit
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    project_id: null,
    project_title: "",
    client: "",
    project_status: "",
    project_start_date: "",
    project_end_date: "",
    work_duration: "",
    technology_used: "",
    details_of_project: "",
  });

  // Decode token and fetch candidate profile on mount
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
      fetchProjects(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // Fetch projects from candidate profile GET
  const fetchProjects = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data;
      if (data && data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      setError("Failed to fetch project data.");
    }
  };

  // Open modal for adding new project
  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentProject({
      project_id: null,
      project_title: "",
      client: "",
      project_status: "",
      project_start_date: "",
      project_end_date: "",
      work_duration: "",
      technology_used: "",
      details_of_project: "",
    });
    setModalOpen(true);
  };

  // Open modal for editing an existing project
  const openModalForEdit = (project) => {
    setIsEditing(true);
    setCurrentProject({
      project_id: project.project_id,
      project_title: project.project_title,
      client: project.client,
      project_status: project.project_status,
      project_start_date: project.project_start_date,
      project_end_date: project.project_end_date,
      work_duration: project.work_duration,
      technology_used: project.technology_used,
      details_of_project: project.details_of_project,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handler for input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save project (POST for new, PATCH for update)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    // Basic validation for required fields (project_title, project_status, project_start_date, project_end_date)
    if (
      !currentProject.project_title ||
      !currentProject.project_status ||
      !currentProject.project_start_date ||
      !currentProject.project_end_date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      let response;
      if (isEditing) {
        // PATCH request to update project using project_id
        response = await axiosInstance.patch(
          `/projects/${currentProject.project_id}`,
          currentProject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Project updated successfully!");
      } else {
        // POST request to add new project using userId
        response = await axiosInstance.post(
          `/projects/${userId}`,
          currentProject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert("Project added successfully!");
      }
      // Refresh projects from server
      await fetchProjects(userId, token);
      closeModal();
    } catch (err) {
      console.error("Error saving project data:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save project data: ${err.response.data.message}`);
      } else {
        setError("Failed to save project data.");
      }
    }
  };

  // Delete project record
  const handleDelete = async (projectId) => {
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      await axiosInstance.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project deleted successfully!");
      await fetchProjects(userId, token);
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project.");
    }
  };

  // Check if any project data exists
  const hasProject =
    currentProject.project_title ||
    currentProject.client ||
    currentProject.project_status ||
    currentProject.project_start_date ||
    currentProject.project_end_date ||
    currentProject.work_duration ||
    currentProject.technology_used ||
    currentProject.details_of_project;

  return (
    <div className="projects-container">
      {error && <p className="error-text">{error}</p>}
      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle typ-16Bold">Projects</span>
          <button className="addButton" onClick={openModalForAdd}>
            Add Project
          </button>
        </div>
        <div className="widgetCont">
          {projects.length === 0 ? (
            <p className="empty">
              Stand out to employers by adding details about projects you have done.
            </p>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <div key={project.project_id} className="project-item">
                  <h3>{project.project_title}</h3>
                  <p>
                    <strong>Client:</strong> {project.client}
                  </p>
                  <p>
                    <strong>Status:</strong> {project.project_status}
                  </p>
                  <p>
                    <strong>Duration:</strong> {project.project_start_date} -{" "}
                    {project.project_end_date} ({project.work_duration})
                  </p>
                  <p>
                    <strong>Technologies:</strong> {project.technology_used}
                  </p>
                  <p>
                    <strong>Details:</strong> {project.details_of_project}
                  </p>
                  <div className="record-actions">
                    <button className="edit-btn" onClick={() => openModalForEdit(project)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(project.project_id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding/editing a project */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-content project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2>{hasProject ? "Edit Project Details" : "Add Project Details"}</h2>
            <form className="projectForm" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="project_title" className="required-field">
                  Project Title
                </label>
                <input
                  type="text"
                  id="project_title"
                  name="project_title"
                  className="input"
                  placeholder="Enter project title"
                  value={currentProject.project_title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="client" className="required-field">
                  Client
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  className="input"
                  placeholder="Enter client name"
                  value={currentProject.client}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project_status" className="required-field">
                  Project Status
                </label>
                <select
                  id="project_status"
                  name="project_status"
                  className="input"
                  value={currentProject.project_status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
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
                  value={currentProject.project_start_date}
                  onChange={handleInputChange}
                  required
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
                  value={currentProject.project_end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="work_duration">
                  Work Duration
                </label>
                <input
                  type="text"
                  id="work_duration"
                  name="work_duration"
                  className="input"
                  placeholder="E.g., 6 months"
                  value={currentProject.work_duration}
                  onChange={handleInputChange}
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
                  placeholder="E.g., React, Node.js"
                  value={currentProject.technology_used}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="details_of_project">
                  Details of Project
                </label>
                <textarea
                  id="details_of_project"
                  name="details_of_project"
                  className="input"
                  placeholder="Enter details of the project"
                  value={currentProject.details_of_project}
                  onChange={handleInputChange}
                />
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

export default Projects;
