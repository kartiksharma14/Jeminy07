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
  const [currentEmployment, setCurrentEmployment] = useState("Not available");
  const [employmentType, setEmploymentType] = useState("Not available");
  const [companyName, setCompanyName] = useState("Not available");
  const [jobTitle, setJobTitle] = useState("Not available");
  const [joiningDate, setJoiningDate] = useState("Not available");
  const [currentSalary, setCurrentSalary] = useState("Not available");
  const [skillUsed, setSkillUsed] = useState(["Not available"]);
  const [jobProfile, setJobProfile] = useState("Not available");
  const [noticePeriod, setNoticePeriod] = useState("Not available");



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

  const toggleEmploymentModal = () => {
    setEmploymentModalOpen((prev) => !prev);
  };

  const toggleKeySkillsModal = () => {
    setKeySkillsModalOpen((prev) => !prev);
  };

  const toggleResumeHeadlineModal = () => {
    setResumeHeadlineModalOpen((prev) => !prev);
  };
  const refreshEmploymentDetails = () => {
    fetchUserProfile(userId);  // Re-fetch user profile to update employment details
    console.log("Employment details refreshed.");
  };

  const refreshKeySkills = () => {
    fetchUserProfile(userId);  // Re-fetch user profile to update key skills
    console.log("Key skills refreshed.");
  };

  const refreshResumeHeadline = () => {
    fetchUserProfile(userId);  // Re-fetch user profile to update resume headline
    console.log("Resume headline refreshed.");
  };

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
    const token = localStorage.getItem("authToken"); // Get token from localStorage

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

      if (user.key_skills) {
        setSkills(user.key_skills.split(",").map((skill) => skill.trim()));
      }

      // Fetch Employment Details Separately
      if (user.current_employment) {
        setCurrentEmployment(user.current_employment || "Not available");
      }
      if (user.employment_type) {
        setEmploymentType(user.employment_type || "Not available");
      }
      if (user.current_company_name) {
        setCompanyName(user.current_company_name || "Not available");
      }
      if (user.current_job_title) {
        setJobTitle(user.current_job_title || "Not available");
      }
      if (user.joining_date) {
        setJoiningDate(user.joining_date || "Not available");
      }
      if (user.current_salary) {
        setCurrentSalary(user.current_salary || "Not available");
      }
      if (user.skill_used) {
        setSkillUsed(user.skill_used.split(",").map((s) => s.trim()) || ["Not available"]);
      }
      if (user.job_profile) {
        setJobProfile(user.job_profile || "Not available");
      }
      if (user.notice_period) {
        setNoticePeriod(user.notice_period || "Not available");
      }
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
              <a href="#resume-section" className="action-link">
                Resume
              </a>
            </li>
            <li className="collection-item">
              <a
                href="#headline-section"
                className="action-link"
                onClick={(e) => {
                  e.preventDefault();
                  toggleResumeHeadlineModal();
                }}
              >
                Resume Headline
              </a>
            </li>
            <li className="collection-item">
              <a
                href="#skills-section"
                className="action-link"
                onClick={(e) => {
                  e.preventDefault();
                  toggleKeySkillsModal();
                }}
              >
                Key Skills
              </a>
            </li>
            <li className="collection-item">
              <a href="#employment-section" className="action-link">
                Employment
              </a>
            </li>
            <li className="collection-item">
              <a href="#education-section" className="action-link">
                Education
              </a>
            </li>
            <li className="collection-item">
              <a href="#it-skills-section" className="action-link">
                IT Skills
              </a>
            </li>
            <li className="collection-item">
              <a href="#projects-section" className="action-link">
                Projects
              </a>
            </li>
            <li className="collection-item">
              <a href="#profile-summary-section" className="action-link">
                Profile Summary
              </a>
            </li>
            <li className="collection-item">
              <a href="#accomplishments-section" className="action-link">
                Accomplishments
              </a>
            </li>
            <li className="collection-item">
              <a href="#career-profile-section" className="action-link">
                Career Profile
              </a>
            </li>
            <li className="collection-item">
              <a href="#personal-details-section" className="action-link">
                Personal Details
              </a>
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
                        <br></br>
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
            <button className="edit-btn" onClick={toggleResumeHeadlineModal}>
              Edit
            </button>
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
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No skills added.</p>
              )}
            </div>
            <button className="add-btn" onClick={toggleKeySkillsModal}>
              Edit Key Skills
            </button>
          </div>
        </div>

        <div id="employment-section" className="resume-card employment-card">
          <div className="title">Employment</div>
          <div className="headline-section">
            <div className="employment-entry">
              <p>
                <strong>Employment Status:</strong> {currentEmployment} <br />
                <strong>Employment Type:</strong> {employmentType} <br />
                <strong>Company:</strong> {companyName} <br />
                <strong>Job Title:</strong> {jobTitle} <br />
                <strong>Joining Date:</strong> {joiningDate} <br />
                <strong>Salary:</strong> ₹{currentSalary} <br />
                <strong>Skills Used:</strong> {skillUsed.join(", ")} <br />
                <strong>Job Profile:</strong> {jobProfile} <br />
                <strong>Notice Period:</strong> {noticePeriod}
              </p>
            </div>
            <button className="add-btn" onClick={toggleEmploymentModal}>Edit Employment</button>
          </div>
        </div>



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
        <div id="education-section" className="resume-card">
          <Education />
        </div>
        <div id="it-skills-section" className="resume-card">
          <ITSkills />
        </div>
        <div id="projects-section" className="resume-card">
          <Projects />
        </div>
        <div id="profile-summary-section" className="resume-card">
          <ProfileSummary />
        </div>
        <div id="accomplishments-section" className="resume-card">
          <Accomplishments />
        </div>
        <div id="career-profile-section" className="resume-card">
          <CareerProfile />
        </div>
        <div id="personal-details-section" className="resume-card">
          <PersonalDetails />
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
