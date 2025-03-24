// src/components/RecruiterAuth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecruiterAuth.css";

const RecruiterAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const navigate = useNavigate();

  // Function to handle recruiter login (send OTP)
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/signin", { email, password });
      console.log("Login response:", response.data);

      // Check if the otpSent flag is true
      if (response.data.otpSent) {
        // Optionally update email if backend returns a sanitized version
        if (response.data.email) {
          setEmail(response.data.email);
        }
        setShowOtpModal(true);
      } else {
        console.error("Unexpected response:", response.data);
        setOtpError(response.data.message || "Unexpected response.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    const payload = { 
      email: email.trim(), 
      otp: otp.trim() 
    };
    console.log("Verifying OTP with payload:", payload);
    
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/verify-otp", payload);
      console.log("OTP verification response:", response.data);
      
      // Use the verified flag or check if the message includes 'successful'
      if (response.data.verified || (response.data.message && response.data.message.toLowerCase().includes("successful"))) {
        localStorage.setItem("authToken", response.data.token); // Store token
        navigate("/recruiter"); // Redirect to recruiter dashboard
      } else {
        setOtpError(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error.response ? error.response.data : error);
      setOtpError("Invalid OTP. Please try again.");
    }
  };
  
  

  // Recruiter login form
  const renderRecruiterLoginForm = () => (
    <form className="rcb_form_wpr" id="recruiter-login-form" onSubmit={(e) => e.preventDefault()}>
      <div className="rcb_form_pair rcb_form_text">
        <label className="rcb_form_label">Email</label>
        <input
          type="email"
          className="rcb_input"
          placeholder="Enter your email"
          name="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="rcb_form_pair rcb_form_text">
        <label className="rcb_form_label">Password</label>
        <input
          type="password"
          className="rcb_input"
          placeholder="Enter your password"
          name="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="button" className="rcb_submit_btn" onClick={handleLogin}>
        Log In
      </button>
    </form>
  );

  // OTP Modal
  const renderOtpModal = () => (
    <div className="otp-modal-r">
      <div className="otp-modal-content-r">
        <button className="otp-close-btn-r" onClick={() => setShowOtpModal(false)}>
          ❌
        </button>
        <h3>Enter OTP (sent to {email})</h3>
        <input
          type="text"
          className="otp-input-r"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {otpError && <p className="otp-error-r">{otpError}</p>}
        <button className="otp-submit-btn-r" onClick={handleVerifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );

  return (
    <section className="hero-container">
      <video
        src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4"
        autoPlay
        loop
        playsInline
        muted
        className="hero-video"
      ></video>
      <div className="hero-overlay">
        <div className="hero-text">
          <h1>
            Unlock India's largest talent pool with the power of{" "}
            <span className="highlight">Jeminy</span>
          </h1>
        </div>
        <div className="form-container">{renderRecruiterLoginForm()}</div>
      </div>
      {showOtpModal && renderOtpModal()}
    </section>
  );
};

export default RecruiterAuth;
