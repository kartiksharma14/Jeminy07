// src/components/RecruiterAuth.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecruiterAuth.css";

const RecruiterAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const navigate = useNavigate();

  // Redirect immediately if a token exists
  useEffect(() => {
    const token = localStorage.getItem("RecruiterToken");
    if (token) {
      navigate("/recruiter");
    }
  }, [navigate]);

  // Function to handle recruiter login (send OTP)
  const handleLogin = async () => {
    // Refresh user state and clear previous errors when login is clicked again
    setOtpError(null);
    setOtp("");
    setShowOtpModal(false);
    setIsLoggingIn(true);
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/signin", { email, password });
      console.log("Login response:", response.data);

      if (response.data.success === false) {
        setOtpError(response.data.message || "Unexpected response.");
        setIsLoggingIn(false);
        return;
      }

      if (response.data.email) {
        setEmail(response.data.email);
      }
      if (response.data.otp) {
        setOtp(response.data.otp);
      }
      setShowOtpModal(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
    setIsLoggingIn(false);
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    const payload = { email: email.trim(), otp: otp.trim() };
    console.log("Verifying OTP with payload:", payload);
    
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/verify-otp", payload);
      console.log("OTP verification response:", response.data);
      
      if (response.data.verified || (response.data.message && response.data.message.toLowerCase().includes("successful"))) {
        localStorage.setItem("RecruiterToken", response.data.token);
        navigate("/recruiter");
      } else {
        setOtpError(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error.response ? error.response.data : error);
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data &&
        error.response.data.message
      ) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    }
    setIsVerifyingOtp(false);
  };

  // Function to resend OTP by re-calling the signin endpoint
  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    setOtpError(null);
    setOtp("");
    try {
      const response = await axios.post("http://localhost:5000/api/recruiter/signin", { email, password });
      console.log("Resend OTP response:", response.data);
      
      if (response.data.success === false) {
        setOtpError(response.data.message || "Unexpected response.");
        setIsResendingOtp(false);
        return;
      }
      if (response.data.email) {
        setEmail(response.data.email);
      }
      if (response.data.otp) {
        setOtp(response.data.otp);
      }
      // Optionally, you might add a user notification that the OTP has been resent.
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Resend OTP failed. Please try again.");
    }
    setIsResendingOtp(false);
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
      <button 
        type="button" 
        className="rcb_submit_btn" 
        onClick={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Logging in..." : "Log In"}
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
          onChange={(e) => {
            setOtp(e.target.value);
            setOtpError(null);
          }}
        />
        {otpError && <p className="otp-error-r">{otpError}</p>}
        <button 
          className="otp-submit-btn-r" 
          onClick={handleVerifyOtp}
          disabled={isVerifyingOtp}
        >
          {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
        </button>
        <button 
          className="otp-submit-btn-r" 
          onClick={handleResendOtp}
          disabled={isResendingOtp}
        >
          {isResendingOtp ? "Resending OTP..." : "Resend OTP"}
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
