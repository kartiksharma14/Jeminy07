// src/QuickLinks.js

import React, { useState, useEffect } from "react";
import "./QuickLinks.css";
import EmploymentModal from "./components/EmploymentModal";
import KeySkillsModal from "./components/KeySkillsModal";
import ResumeHeadlineModal from "./components/ResumeHeadlineModal";
import Education from "./components/Education";
import ITSkills from "./components/ITSkills";
import Projects from "./components/Projects";
import ProfileSummary from "./components/ProfileSummary";
import Accomplishments from "./components/Accomplishments";
import CareerProfile from "./components/CareerProfile";
import PersonalDetails from "./components/PersonalDetails";
import { jwtDecode } from "jwt-decode"; // Corrected import
import axiosInstance from "./axiosInstance"; // Use the axios instance

const QuickLinks = () => {
  const [isEmploymentModalOpen, setEmploymentModalOpen] = useState(false);
  const [isKeySkillsModalOpen, setKeySkillsModalOpen] = useState(false);
  const [isResumeHeadlineModalOpen, setResumeHeadlineModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState("");
  const [resumeHeadline, setResumeHeadline] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  // Suggested skills (if needed for other purposes)
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

  // Toggle modal functions
  const toggleEmploymentModal = () => {
    setEmploymentModalOpen((prev) => !prev);
  };

  const toggleKeySkillsModal = () => {
    setKeySkillsModalOpen((prev) => !prev);
  };

  const toggleResumeHeadlineModal = () => {
    setResumeHeadlineModalOpen((prev) => !prev);
  };

  // Refresh functions to re-fetch the profile
  const refreshEmploymentDetails = () => {
    fetchUserProfile(userId);
    console.log("Employment details refreshed.");
  };

  const refreshKeySkills = () => {
    fetchUserProfile(userId);
    console.log("Key skills refreshed.");
  };

  const refreshResumeHeadline = () => {
    fetchUserProfile(userId);
    console.log("Resume headline refreshed.");
  };

  // Add a new skill if it ends with a "+" in the input
  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value && value.endsWith("+")) {
      const skill = value.slice(0, -1);
      addSkill(skill);
      e.target.value = "";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const extractedUserId = decodedToken.userId || decodedToken.candidate_id;
        setUserId(extractedUserId);
        fetchUserProfile(extractedUserId);
      } catch (err) {
        setError("Invalid authentication token.");
        console.error(err);
      }
    } else {
      setError("No authentication token found.");
    }
  }, []);

  // Updated fetchUserProfile function to use the new keyskills array
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axiosInstance.get(`/candidate-profile/user-details/${userId}`);
      console.log("User profile response:", response.data.data);
      const user = response.data.data;

      if (user.resume) {
        setResume(user.resume);
        setFileUploaded(true);
      }

      if (user.resume_headline) {
        setResumeHeadline(user.resume_headline);
      }

      // Updated integration: use the new "keyskills" array instead of a comma-separated string
      if (user.keyskills && Array.isArray(user.keyskills) && user.keyskills.length > 0) {
        setSkills(user.keyskills.map((skillObj) => skillObj.keyskillsname));
      } else {
        setSkills([]);
      }

      // Employment details are now managed in EmploymentModal.
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div className="card quickLink">
          <ul className="collection">
            <li className="collection-header">Quick Links</li>
            <li className="collection-item">
              <a href="#resume-section" className="action-link">Resume</a>
            </li>
            <li className="collection-item">
              <a
                href="#headline-section"
                className="action-link"
                onClick={(e) => { e.preventDefault(); toggleResumeHeadlineModal(); }}
              >
                Resume Headline
              </a>
            </li>
            <li className="collection-item">
              <a
                href="#skills-section"
                className="action-link"
                onClick={(e) => { e.preventDefault(); toggleKeySkillsModal(); }}
              >
                Key Skills
              </a>
            </li>
            <li className="collection-item">
              <a href="#employment-section" className="action-link">Employment</a>
            </li>
            <li className="collection-item">
              <a href="#education-section" className="action-link">Education</a>
            </li>
            <li className="collection-item">
              <a href="#it-skills-section" className="action-link">IT Skills</a>
            </li>
            <li className="collection-item">
              <a href="#projects-section" className="action-link">Projects</a>
            </li>
            <li className="collection-item">
              <a href="#profile-summary-section" className="action-link">Profile Summary</a>
            </li>
            <li className="collection-item">
              <a href="#accomplishments-section" className="action-link">Accomplishments</a>
            </li>
            <li className="collection-item">
              <a href="#career-profile-section" className="action-link">Career Profile</a>
            </li>
            <li className="collection-item">
              <a href="#personal-details-section" className="action-link">Personal Details</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {/* Resume Section */}
        <div id="resume-section" className="resume-card">
          <div className="title">Resume</div>
          <div className="upload-section">
            <div className="uploadCont">
              <div>
                <div className="uploadBtn">
                  <section>
                    <div className="action">
                      <div className="uploadContainer">
                        <input
                          type="file"
                          id="attachCV"
                          className="fileUpload"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              alert(`File uploaded: ${file.name}`);
                              setFileUploaded(true);
                              // Optionally, handle file upload to server here
                            }
                          }}
                        />
                      </div>
                      <div>
                        <div id="result"></div>
                        <div className="dummyUploadNew">
                          {fileUploaded
                            ? "Want to upload latest resume? "
                            : "Already have a resume? "}
                          <label
                            htmlFor="attachCV"
                            className="dummyUploadNewCTA"
                            style={{ cursor: "pointer" }}
                          >
                            {fileUploaded ? "Update resume" : "Upload resume"}
                          </label>
                        </div>
                        <br />
                        {fileUploaded ? resume + ".pdf" : ""}
                      </div>
                    </div>
                  </section>
                  <ul id="results_resumeParser"></ul>
                </div>
                <div className="format typ-14Medium">
                  Supported Formats: doc, docx, rtf, pdf, up to 2 MB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Headline Section */}
        <div id="headline-section" className="resume-card headline-card">
          <div className="title">Resume Headline</div>
          <div className="headline-section">
            <div className="headline-text">
              <p>{resumeHeadline || "No headline set."}</p>
            </div>
            <button className="edit-btn" onClick={toggleResumeHeadlineModal}>Edit</button>
          </div>
        </div>

        {/* Key Skills Section */}
        <div id="skills-section" className="resume-card skills-card">
          <div className="title">Key Skills</div>
          <div className="headline-section">
            <div className="headline-text">
              <p>HR looks for candidates with specific key skills.</p>
              {skills.length > 0 ? (
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No skills added.</p>
              )}
            </div>
            <button className="add-btn" onClick={toggleKeySkillsModal}>Edit Key Skills</button>
          </div>
        </div>

        {/* Employment Section */}
        <div id="employment-section" className="resume-card">
          <div className="title">Employment</div>
          <div className="headline-section">
            <p>Click the button below to view and edit your employment details.</p>
            <button className="add-btn" onClick={toggleEmploymentModal}>Edit Employment</button>
          </div>
        </div>

        {/* Modals */}
        <EmploymentModal
          isOpen={isEmploymentModalOpen}
          toggleModal={toggleEmploymentModal}
          refreshEmploymentDetails={refreshEmploymentDetails}
        />

        <KeySkillsModal
          isOpen={isKeySkillsModalOpen}
          toggleModal={toggleKeySkillsModal}
          refreshKeySkills={refreshKeySkills}
        />

        <ResumeHeadlineModal
          isOpen={isResumeHeadlineModalOpen}
          toggleModal={toggleResumeHeadlineModal}
          refreshResumeHeadline={refreshResumeHeadline}
        />

        {/* Other Sections */}
        <div id="education-section">
          <Education />
        </div>
        <div id="it-skills-section" >
          <ITSkills />
        </div>
        <div id="projects-section" >
          <Projects />
        </div>
        <div id="profile-summary-section" >
          <ProfileSummary />
        </div>
        <div id="accomplishments-section" >
          <Accomplishments />
        </div>
        <div id="career-profile-section" >
          <CareerProfile />
        </div>
        <div id="personal-details-section" >
          <PersonalDetails />
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
