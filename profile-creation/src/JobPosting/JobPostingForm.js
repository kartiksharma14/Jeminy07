import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  RichUtils,
  ContentState,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./JobPostingForm.css";
import RecruiterHeader from "../components/RecruiterHeader";
import RecruiterFooter from "../components/RecruiterFooter";

// Helper function to strip HTML tags
const stripHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use jobData from location.state if available; otherwise, default values.
  const initialJobData = location.state?.jobData || {
    jobTitle: "",
    employmentType: "",
    keySkills: [],
    department: "",
    workMode: "",
    locations: "",
    industry: "",
    diversityHiring: false,
    jobDescription: "",
    multipleVacancies: false,
    companyName: "",
    companyInfo: "",
    companyAddress: "",
    min_salary: "",
    max_salary: "",
    min_experience: "",
    max_experience: "",
  };

  // The rest of the form data is stored in raw.
  const [raw, setRaw] = useState(initialJobData);
  // Use a separate state for keySkills.
  const [keySkills, setKeySkills] = useState(initialJobData.keySkills || []);
  const [skillInput, setSkillInput] = useState("");

  // Initialize the editor state for job description.
  const initialJobDescEditorState = raw.jobDescription
    ? EditorState.createWithContent(ContentState.createFromText(raw.jobDescription))
    : EditorState.createEmpty();
  const [jobDescEditorState, setJobDescEditorState] = useState(initialJobDescEditorState);

  // Initialize the editor state for company info.
  const initialCompanyEditorState = raw.companyInfo
    ? EditorState.createWithContent(ContentState.createFromText(raw.companyInfo))
    : EditorState.createEmpty();
  const [companyEditorState, setCompanyEditorState] = useState(initialCompanyEditorState);

  // Handlers for job description changes.
  const handleJobDescEditorStateChange = (editorState) => {
    const plainText = editorState.getCurrentContent().getPlainText().trim();
    if (plainText.length <= 1000) {
      setJobDescEditorState(editorState);
      setRaw((prev) => ({ ...prev, jobDescription: plainText }));
    } else {
      alert("Job description cannot exceed 1000 characters.");
    }
  };
  

  // Handler for company info changes.
  const handleCompanyEditorStateChange = (editorState) => {
    const plainText = editorState.getCurrentContent().getPlainText().trim();
    if (plainText.length <= 500) {
      setCompanyEditorState(editorState);
      setRaw((prev) => ({ ...prev, companyInfo: plainText }));
    } else {
      // Optionally, you can display a warning or handle the overflow here.
      alert("Company description cannot exceed 1000 characters.");
    }
  };
  

  // Inline and block style handlers.
  const handleCompanyInlineStyle = (style) => {
    const newState = RichUtils.toggleInlineStyle(companyEditorState, style);
    handleCompanyEditorStateChange(newState);
  };

  const handleJobDescInlineStyle = (style) => {
    const newState = RichUtils.toggleInlineStyle(jobDescEditorState, style);
    handleJobDescEditorStateChange(newState);
  };

  const handleJobDescBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(jobDescEditorState, blockType);
    handleJobDescEditorStateChange(newState);
  };

  const handleCompanyBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(companyEditorState, blockType);
    handleCompanyEditorStateChange(newState);
  };

  // Key skills handlers.
  const addSkill = (skill) => {
    if (!keySkills.includes(skill) && keySkills.length < 20) {
      setKeySkills((prev) => {
        const updatedSkills = [...prev, skill];
        console.log("Updated keySkills:", updatedSkills);
        return updatedSkills;
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setKeySkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  // Use onKeyPress here as it was confirmed working in your logs.
  const handleKeyPress = (e) => {
    console.log("Key pressed (onKeyPress):", e.key);
    if (e.key === "Enter" && skillInput.trim() && keySkills.length < 20) {
      e.preventDefault();
      console.log("Enter pressed; adding skill:", skillInput.trim());
      addSkill(skillInput.trim());
    }
  };

  // Generic input change handler.
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRaw((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // File handler (if uploading job description file).
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRaw((prev) => ({
          ...prev,
          jobDescription: event.target.result,
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  // When previewing, update raw with keySkills.
  const handlePreview = async () => {
    console.log("handlePreview function started");
    try {
      const jwtToken = localStorage.getItem("RecruiterToken");
      const updatedRaw = { ...raw, keySkills };

      const payload = Object.fromEntries(
        Object.entries(updatedRaw).filter(([key, value]) => {
          if (key === "keySkills") {
            return Array.isArray(value) && value.length > 0;
          }
          return value !== "";
        })
      );
      if (keySkills && keySkills.length > 0) {
        payload.keySkills = keySkills.join(", ");
      }
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        "http://localhost:5000/api/recruiter/jobs/draft",
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const session_id = response.data.session_id;
        navigate("/preview", { state: { jobData: { ...updatedRaw, session_id } } });
      } else {
        alert(response.data.message || "Failed to create job draft.");
      }
    } catch (error) {
      console.error("Error creating job draft:", error);
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Failed to create job draft. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="page-container">
      <RecruiterHeader />
      <div className="job-posting-form">
        {/* Prevent default form submission */}
        <main className="main-content-job">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <h2 className="form-title">Post a Job - Hot Vacancy</h2>
            </div>
            {/* Basic Job Details */}
            <div className="form-section">
              <div className="flex-container">
                <div className="flex-item">
                  <label className="form-label">
                    Job Title / Designation <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter a clear & specific title to get better responses"
                    name="jobTitle"
                    value={raw.jobTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item-width">
                  <label className="form-label">
                    Employment Type <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="employmentType"
                    value={raw.employmentType}
                    onChange={handleInputChange}
                  >
                    <option>Select Employment Type</option>
                    <option>Full Time, Permanent</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">
                  Key Skills <span className="required">*</span>
                </label>
                <div className="skills-input-container">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add skills (press Enter to add)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="skills-list">
                    {keySkills.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="remove-skill-button"
                          onClick={() => removeSkill(skill)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="form-label">
                  Department & Role Category <span className="required">*</span>
                </label>
                <p className="form-text">
                  Search & select the best matching option
                </p>
                <select
                  className="form-select"
                  name="department"
                  value={raw.department}
                  onChange={handleInputChange}
                >
                  <option>Select Department</option>
                  <option>IT - Software Developer</option>
                  <option>IT - Web Developer</option>
                  <option>IT - Mobile App Developer</option>
                  <option>IT - Data Scientist</option>
                  <option>IT - DevOps Engineer</option>
                  <option>IT - System Administrator</option>
                  <option>IT - Cybersecurity Analyst</option>
                  <option>IT - Network Engineer</option>
                  <option>IT - UI/UX Designer</option>
                  <option>IT - Technical Support Engineer</option>
                  <option>Sales - Sales Executive</option>
                  <option>Sales - Business Development Manager</option>
                  <option>Sales - Key Account Manager</option>
                  <option>Marketing - Digital Marketing Executive</option>
                  <option>Marketing - Social Media Manager</option>
                  <option>Finance - Chartered Accountant (CA)</option>
                  <option>Finance - Financial Analyst</option>
                  <option>Finance - Tax Consultant</option>
                  <option>Finance - Accounts Executive</option>
                  <option>HR - HR Manager</option>
                  <option>HR - Talent Acquisition Specialist</option>
                  <option>HR - Payroll Executive</option>
                  <option>HR - Learning & Development Manager</option>
                  <option>Operations - Supply Chain Manager</option>
                  <option>Operations - Logistics Executive</option>
                  <option>Operations - Warehouse Manager</option>
                  <option>Operations - Procurement Specialist</option>
                  <option>Customer Support - Customer Service Executive</option>
                  <option>
                    Customer Support - Technical Support Representative
                  </option>
                  <option>Customer Support - Chat Support Executive</option>
                </select>
              </div>
              <div>
                <label className="form-label">
                  Work Mode <span className="required">*</span>
                </label>
                <p className="form-text">
                  Select where the candidate will be working from
                </p>
                <select
                  className="form-select"
                  name="workMode"
                  value={raw.workMode}
                  onChange={handleInputChange}
                >
                  <option>Select Work Mode</option>
                  <option>In office</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div>
                <label className="form-label">
                  Job Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search and add locations"
                  name="locations"
                  value={raw.locations}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Salary and Experience */}
            <div className="form-section">
              <div className="flex-container">
                <div className="flex-item">
                  <label className="form-label">Minimum Salary (In Lacs)</label>
                  <input
                    type="number"
                    className="form-input"
                    name="min_salary"
                    value={raw.min_salary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-item">
                  <label className="form-label">Maximum Salary (In Lacs)</label>
                  <input
                    type="number"
                    className="form-input"
                    name="max_salary"
                    value={raw.max_salary}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex-container">
                <div className="flex-item">
                  <label className="form-label">
                    Minimum Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="min_experience"
                    value={raw.min_experience}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-item">
                  <label className="form-label">
                    Maximum Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="max_experience"
                    value={raw.max_experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Industry and Diversity */}
            <div className="form-section">
              <div>
                <label className="form-label">Candidate Industry</label>
                <select
                  className="form-select"
                  name="industry"
                  value={raw.industry}
                  onChange={handleInputChange}
                >
                  <option>Select the industry you're looking to hire from</option>
                  <option>IT</option>
                  <option>Automobile</option>
                  <option>Finance</option>
                  <option>Human Resource</option>
                  <option>Marketing</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Real Estate</option>
                  <option>Telecommunications</option>
                  <option>Retail</option>
                  <option>Hospitality & Tourism</option>
                  <option>Media & Entertainment</option>
                  <option>Automobile</option>
                  <option>Agriculture</option>
                  <option>Energy & Power</option>
                  <option>Logistics & Supply Chain</option>
                  <option>Construction & Infrastructure</option>
                  <option>FMCG</option>
                  <option>Insurance</option>
                  <option>Chemical Industry</option>
                  <option>Food Processing</option>
                  <option>Oil & Gas</option>
                  <option>Renewable Energy</option>
                  <option>Mining & Metals</option>
                  <option>Shipping & Maritime</option>
                  <option>Ports & Logistics</option>
                  <option>Electronics & Semiconductor</option>
                  <option>Sports & Fitness</option>
                  <option>Legal Services</option>
                  <option>Event Management</option>
                  <option>Tourism & Ecotourism</option>
                </select>
              </div>
              <div className="diversity-container">
                <div className="flex-start">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    name="diversityHiring"
                    checked={raw.diversityHiring}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className="diversity-label">
                      Hire women candidates for this role and promote diversity in the workplace
                    </label>
                    <p className="form-text">
                      Diversity hiring feature currently requires no additional credits
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Job Description */}
            <div className="card">
              <label className="form-label">
                Job Description <span className="required">*</span>
              </label>
              <div className="description-container">
                <div className="description-toolbar">
                  <button
                    type="button"
                    className="toolbar-button"
                    onClick={() => handleJobDescInlineStyle("BOLD")}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className="toolbar-button italic"
                    onClick={() => handleJobDescInlineStyle("ITALIC")}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className="toolbar-button underline"
                    onClick={() => handleJobDescInlineStyle("UNDERLINE")}
                  >
                    U
                  </button>
                  <button
                    type="button"
                    className="toolbar-button"
                    onClick={() => handleJobDescBlockType("ordered-list-item")}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className="upload-button"
                    onClick={handleUploadClick}
                  >
                    Upload JD
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".txt"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                <Editor
                  editorState={jobDescEditorState}
                  onEditorStateChange={handleJobDescEditorStateChange}
                  toolbarHidden={true}
                  placeholder={`Role & responsibilities:
- Outline the day-to-day responsibilities for this role.

Preferred candidate profile:
- Specify required role expertise, previous job experience, or relevant certifications.

Perks and benefits:
- Mention available facilities and benefits the company is offering with this job.`}
                  editorClassName="rich-text-editor"
                />
                <div className="textarea-counter">
                    {Math.max(0, 1000 - jobDescEditorState.getCurrentContent().getPlainText().length)} Characters Remaining
                </div>

              </div>
            </div>
            {/* Additional Options */}
            <div className="form-section">
              <div>
                <p className="form-label">
                  Do you have more than one vacancy for this job?
                </p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="multipleVacancies"
                      value="true"
                      checked={raw.multipleVacancies === true}
                      onChange={(e) =>
                        setRaw((prev) => ({
                          ...prev,
                          multipleVacancies: e.target.value === "true",
                        }))
                      }
                    />{" "}
                    Yes
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="multipleVacancies"
                      value="false"
                      checked={raw.multipleVacancies === false}
                      onChange={(e) =>
                        setRaw((prev) => ({
                          ...prev,
                          multipleVacancies: e.target.value === "false",
                        }))
                      }
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>
            {/* Company Information */}
            <div className="form-section">
              <div>
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter the company name"
                  name="companyName"
                  value={raw.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="card">
                <label className="form-label">
                  About Company <span className="required">*</span>
                </label>
                <div className="description-container">
                  <div className="description-toolbar">
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleCompanyInlineStyle("BOLD")}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className="toolbar-button italic"
                      onClick={() => handleCompanyInlineStyle("ITALIC")}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      className="toolbar-button underline"
                      onClick={() => handleCompanyInlineStyle("UNDERLINE")}
                    >
                      U
                    </button>
                    <button
                      type="button"
                      className="toolbar-button"
                      onClick={() => handleCompanyBlockType("ordered-list-item")}
                    >
                      List
                    </button>
                  </div>
                  <Editor
                    editorState={companyEditorState}
                    onEditorStateChange={handleCompanyEditorStateChange}
                    toolbarHidden={true}
                    placeholder="Mention about your company profile, things you would want to highlight to jobseekers"
                    editorClassName="rich-text-editor"
                  />
                  <div className="textarea-counter">
                    {Math.max(0, 500 - companyEditorState.getCurrentContent().getPlainText().length)} Characters Remaining
                  </div>

                </div>
                <div className="mt-4">
                  <label className="form-label">Company Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add company address"
                    name="companyAddress"
                    value={raw.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="preview-button"
                onClick={handlePreview}
              >
                Preview Job
              </button>
            </div>
          </form>
        </main>
      </div>
      <RecruiterFooter />
    </div>
  );
};

export default JobPostingForm;
