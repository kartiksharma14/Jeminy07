import React from "react";
import "./SignupHeader.css"; // Optional: Add custom styles

function SignupHeader() {
  return (
    <header className="signup-header">
      <div className="content">
        <a href="https://www.stl.tech">
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.PNG?raw=true"
            alt="Jeminy Logo"
          />
        </a>
        <span>
          Already Registered?{" "}
          <a href="/candidate/login">Login</a> here
        </span>
      </div>
    </header>
  );
}

export default SignupHeader;
