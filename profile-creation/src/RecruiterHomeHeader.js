import React from "react";
import "./RecruiterHomeHeader.css"; // Optional: Add custom styles

function RecruiterHomeHeader() {
  return (
    <header className="recruiter-home-header">
      <div className="content">
        <a href="https://www.stl.tech">
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
            alt="Jeminy Logo"
          />
        </a>
        <span>
          Don't have any account?{" "}
          <a href="/candidate/signup">Sign up</a> here
        </span>
      </div>
    </header>
  );
}

export default RecruiterHomeHeader;
