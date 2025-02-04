import React from "react";
import "./QuickLinks.css";

const QuickLinks = () => {
  return (
    <div className="main-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div className="card quickLink">
          <ul className="collection">
            <li className="collection-header">Quick Links</li>
            <li className="collection-item">
              <span className="text">Resume</span>
              <a href="#" className="action-link">
                Update
              </a>
            </li>
            <li className="collection-item">
              <span className="text">Resume headline</span>
            </li>
            <li className="collection-item">
              <span className="text">Key skills</span>
              <a href="#" className="action-link">
                Add
              </a>
            </li>
            <li className="collection-item">
              <span className="text">Education</span>
              <a href="#" className="action-link">
                Add
              </a>
            </li>
            <li className="collection-item">
              <span className="text">IT skills</span>
              <a href="#" className="action-link">
                Add
              </a>
            </li>
            <li className="collection-item">
              <span className="text">Projects</span>
              <a href="#" className="action-link">
                Add
              </a>
            </li>
            <li className="collection-item">
              <span className="text">Profile summary</span>
              <a href="#" className="action-link">
                Add
              </a>
            </li>
            <li className="collection-item">
              <span className="text">Accomplishments</span>
            </li>
            <li className="collection-item">
              <span className="text">Career profile</span>
            </li>
            <li className="collection-item">
              <span className="text">Personal details</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Resume Section */}
      <div className="resume-section">
        <div className="resume-card">
          <div className="title">Resume</div>
          <div className="cvPreview">
            <div className="row">
              <div className="left">
                <div className="truncate">Color block resume.docx</div>
                <div className="updateOn">Uploaded on Jan 03, 2025</div>
              </div>
              <div className="right">
                <span className="icon-wrap">Download</span>
                <span className="icon-wrap">Delete</span>
              </div>
            </div>
          </div>
          <div className="upload-section">
            <input type="file" id="resume-upload" className="fileUpload" />
            <button className="upload-btn">Update Resume</button>
            <div className="format">
              Supported Formats: doc, docx, rtf, pdf, up to 2 MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
