// src/QuickLinks.js
import React, { useState, useEffect } from "react";
import "./QuickLinks.css";
import AddEmploymentModal from "./components/AddEmploymentModal";
import EditEmploymentModal from "./components/EditEmploymentModal";
import KeySkillsModal from "./components/KeySkillsModal";
import ResumeHeadlineModal from "./components/ResumeHeadlineModal";
import Education from "./components/Education";
import ITSkills from "./components/ITSkills";
import Projects from "./components/Projects";
import ProfileSummary from "./components/ProfileSummary";
import Accomplishments from "./components/Accomplishments";
import CareerProfile from "./components/CareerProfile";
import PersonalDetails from "./components/PersonalDetails";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axiosInstance";

/* 
  Helper functions – return an empty string if a field is missing.
  The new payload uses joining_year and joining_month (and optionally joining_date).
*/
const getDisplayCompanyName = (record) => {
  if (record.employment_type === "Full-Time" || record.employment_type === "Internship") {
    // Return current_company_name if available; otherwise, check previous_company_name.
    return record.current_company_name || record.previous_company_name || "";
  }
  return "";
};




const getDisplayJobTitle = (record) => {
  // For Full-Time, use current_job_title if current, else previous_job_title.
  // For Internship, you might also have a job title, so check both.
  if (record.employment_type === "Full-Time") {
    return record.current_employment === "Yes"
      ? record.current_job_title || ""
      : record.previous_job_title || "";
  }
  return record.current_job_title || record.previous_job_title || "";
};

const getDisplayJoiningRange = (record) => {
  // Try to use joining_date if available; otherwise, use joining_year and joining_month.
  let joinDate = "";
  if (record.joining_date) {
    joinDate = record.joining_date.substring(0, 10);
  } else if (record.joining_year && record.joining_month) {
    joinDate = `${record.joining_year}-${record.joining_month}`;
  }
  if (!joinDate) return "";
  
  if (record.current_employment === "Yes") {
    return `${joinDate} to Present`;
  } else {
    let endDate = "";
    if (record.worked_till) {
      endDate = record.worked_till.substring(0, 10);
    }
    // (If needed, you can also add additional logic if worked_till is null but separate fields exist.)
    return endDate ? `${joinDate} to ${endDate}` : joinDate;
  }
};

const QuickLinks = () => {
  const [isAddEmploymentModalOpen, setAddEmploymentModalOpen] = useState(false);
  const [isEditEmploymentModalOpen, setEditEmploymentModalOpen] = useState(false);
  const [isKeySkillsModalOpen, setKeySkillsModalOpen] = useState(false);
  const [isResumeHeadlineModalOpen, setResumeHeadlineModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState("");
  const [resumeHeadline, setResumeHeadline] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [employmentRecords, setEmploymentRecords] = useState([]);
  const [selectedEmploymentRecord, setSelectedEmploymentRecord] = useState(null);

  // Suggested skills array (if needed)
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
  const toggleAddEmploymentModal = () => setAddEmploymentModalOpen((prev) => !prev);
  const toggleEditEmploymentModal = () => setEditEmploymentModalOpen((prev) => !prev);
  const toggleKeySkillsModal = () => setKeySkillsModalOpen((prev) => !prev);
  const toggleResumeHeadlineModal = () => setResumeHeadlineModalOpen((prev) => !prev);

  // Fetch user profile details (JWT token included)
  const fetchUserProfile = async (uid) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const user = response.data.data;
      if (user.resume) {
        setResume(user.resume);
        setFileUploaded(true);
      }
      if (user.resume_headline) {
        setResumeHeadline(user.resume_headline);
      }
      if (user.keyskills && Array.isArray(user.keyskills) && user.keyskills.length > 0) {
        setSkills(user.keyskills.map((skillObj) => skillObj.keyskillsname));
      } else {
        setSkills([]);
      }
      if (user.employment && Array.isArray(user.employment)) {
        setEmploymentRecords(user.employment);
      } else {
        setEmploymentRecords([]);
      }
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error(err);
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

  const refreshEmploymentDetails = () => {
    if (userId) {
      fetchUserProfile(userId);
      console.log("Employment details refreshed.");
    }
  };

  // Handlers for add and edit actions
  const handleAdd = () => {
    setSelectedEmploymentRecord(null);
    toggleAddEmploymentModal();
  };

  const handleEdit = (record) => {
    setSelectedEmploymentRecord(record);
    toggleEditEmploymentModal();
  };

  // Handler for skills input (if user types a skill ending with "+")
  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value && value.endsWith("+")) {
      const skill = value.slice(0, -1);
      addSkill(skill);
      e.target.value = "";
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar Section */}
      <div className="sidebar-cad">
        <div className="card-quickLink">
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

          {/* Resume Headline Section */}
          <div id="headline-section" className="resume-card headline-card">
            <div className="title">Resume Headline</div>
            <div className="headline-section">
              <div className="headline-text">
                <p>{resumeHeadline || ""}</p>
              </div>
              <button className="edit-btn-resume" onClick={toggleResumeHeadlineModal}>
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
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
              <button className="add-btn" onClick={toggleKeySkillsModal}>
                Edit Key Skills
              </button>
            </div>
          </div>

          {/* Employment Section */}
          <div id="employment-section" className="employment-section">
            <div className="card">
              <div className="widgetHead">
                <span className="widgetTitle-cad typ-16Bold">Employment</span>
                <span
                  className="add no-outline typ-16Bold"
                  id="add-employment"
                  tabIndex="0"
                  onClick={handleAdd}
                >
                  Add employment
                </span>
              </div>
              <div className="widgetCont">
                {employmentRecords.length > 0 ? (
                  employmentRecords.map((record) => {
                    const displayCompany = getDisplayCompanyName(record);
                    const displayJobTitle = getDisplayJobTitle(record);
                    const joiningRange = getDisplayJoiningRange(record);
                    return (
                      <div key={record.employment_id} className="row emp-list">
                        <div className="item title typ-14Bold">
                          {displayJobTitle && (
                            <span className="truncate emp-desg" title={displayJobTitle}>
                              {displayJobTitle}
                            </span>
                          )}
                          <span
                            className="edit icon typ-14Medium"
                            tabIndex="0"
                            onClick={() => handleEdit(record)}
                          >
                            edit
                          </span>
                        </div>
                        {displayCompany && (
                          <div className="item">
                            <span className="truncate typ-14Medium emp-org" title={displayCompany}>
                              {displayCompany}
                            </span>
                          </div>
                        )}
                        {record.employment_type && (
                          <div className="item">
                            <span className="truncate typ-14Medium emp-type" title={record.employment_type}>
                              {record.employment_type}
                            </span>
                          </div>
                        )}
                        {joiningRange && (
                          <div className="item experienceType typ-14Regular">
                            <span className="truncate expType">
                              {joiningRange}
                            </span>
                          </div>
                        )}
                        {record.notice_period && (
                          <div className="item emp-notice-prd typ-14Medium">
                            {`${record.notice_period} days Notice Period`}
                          </div>
                        )}
                        {record.job_profile && (
                          <div className="item prefill emp-desc typ-14Medium">
                            <div>{record.job_profile}</div>
                          </div>
                        )}
                        {record.employment_type === "Internship" && (
                          <div className="item typ-14Medium">
                            {record.location && (
                              <div>
                                <strong>Location:</strong> {record.location}
                              </div>
                            )}
                            {record.department && (
                              <div>
                                <strong>Department:</strong> {record.department}
                              </div>
                            )}
                            {record.monthly_stipend && (
                              <div>
                                <strong>Stipend:</strong> ₹ {record.monthly_stipend}
                              </div>
                            )}
                          </div>
                        )}
                        {record.skill_used && (
                          <div className="keyskillList item typ-14Medium">
                            <span className="keySkillHeading">Top 5 key skills:</span>
                            <span className="txt-col-n6">{record.skill_used}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>No employment records found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Modals */}
          {isAddEmploymentModalOpen && (
            <AddEmploymentModal
              isOpen={isAddEmploymentModalOpen}
              toggleModal={toggleAddEmploymentModal}
              refreshEmploymentDetails={refreshEmploymentDetails}
              userId={userId}
            />
          )}
          {isEditEmploymentModalOpen && selectedEmploymentRecord && (
            <EditEmploymentModal
              isOpen={isEditEmploymentModalOpen}
              toggleModal={toggleEditEmploymentModal}
              refreshEmploymentDetails={refreshEmploymentDetails}
              selectedRecord={selectedEmploymentRecord}
            />
          )}

          <KeySkillsModal
            isOpen={isKeySkillsModalOpen}
            toggleModal={toggleKeySkillsModal}
            refreshKeySkills={refreshEmploymentDetails}
          />

          <ResumeHeadlineModal
            isOpen={isResumeHeadlineModalOpen}
            toggleModal={toggleResumeHeadlineModal}
            refreshResumeHeadline={refreshEmploymentDetails}
          />

          {/* Other Sections */}
          <div id="education-section">
            <Education />
          </div>
          <div id="it-skills-section">
            <ITSkills />
          </div>
          <div id="projects-section">
            <Projects />
          </div>
          <div id="profile-summary-section">
            <ProfileSummary />
          </div>
          <div id="accomplishments-section">
            <Accomplishments />
          </div>
          <div id="career-profile-section">
            <CareerProfile />
          </div>
          <div id="personal-details-section">
            <PersonalDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
