// src/components/ResumeHelpBanner/ResumeHelpBanner.js

import React from "react";
import "./ResumeHelpBanner.css"; // Import the corresponding CSS

function ResumeHelpBanner() {
  return (
    <section className="resumeHelpBanner">
      <div className="bannerContent">
        <h2 className="bannerTitle">Need Help with Your Resume?</h2>
        <p className="bannerSubtitle">Get expert assistance to build it from scratch.</p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfCWDQ6v_TD6rWagX8JUAffZinO_oV3VOWNSkLhNKad4VJsKA/viewform?usp=sharing" // Replace with your actual Google Form link
          target="_blank"
          rel="noopener noreferrer"
          className="bannerButton"
          aria-label="Get Started with Resume Help"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}

export default ResumeHelpBanner;
