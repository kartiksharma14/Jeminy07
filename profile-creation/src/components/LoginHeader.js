import React from "react";
import "./LoginHeader.css"; // Optional: Add custom styles

function LoginHeader() {
  return (
    <header className="login-header">
      <div className="content">
        <a href="https://www.stl.tech">
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.PNG?raw=true"
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

export default LoginHeader;
