// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

// Import header and footer
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Show Sign In form first
  const [step, setStep] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      console.log("Signup response:", data);
      // Check if the response indicates that OTP was sent
      if (data.message && data.message.toLowerCase().includes("otp sent")) {
         setStep("verify");
         setError(null);
      } else {
         // Check for error property or fallback to message
         setError(data.error || data.message);
      }
    } catch (err) {
      setError("Error during signup.");
    }
  };

  // OTP verification handler
  const handleVerifyOtp = async (otpInput) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput })
      });
      const data = await res.json();
      console.log("Verify OTP response:", data);
      if (data.success || (data.message && data.message.toLowerCase().includes("verified"))) {
         setStep("signin");
         setError(null);
      } else {
         setError(data.error || data.message);
      }
    } catch (err) {
      setError("Error during OTP verification.");
    }
  };

  // Signin handler
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
         localStorage.setItem('adminToken', data.token);
         window.location.href = "/admin/dashboard";
      } else {
         setError(data.error || data.message);
      }
    } catch (err) {
      setError("Error during signin.");
    }
  };

  // OTP Modal component
  const OtpModal = ({ onVerify, onClose }) => {
    const [otpValue, setOtpValue] = useState("");
    const handleSubmit = (e) => {
      e.preventDefault();
      onVerify(otpValue);
    };
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Verify OTP</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otpValue} 
              onChange={(e) => setOtpValue(e.target.value)} 
              required 
            />
            <button type="submit">Verify OTP</button>
          </form>
          <button className="close-btn-admin" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-login-page">
      {/* Background Video */}
      <video className="bg-video" autoPlay loop muted>
        <source src="https://videos.pexels.com/video-files/6700644/6700644-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <RecruiterHomeHeader />
      <div className="admin-login-container">
        {step === "signup" && (
          <form onSubmit={handleSignup} className="admin-form">
            <h2>Admin Signup</h2>
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Sign Up</button>
            <div className="toggle-link" onClick={() => setStep("signin")}>
              Already have an account? Sign In
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        )}
        
        {step === "verify" && (
          <OtpModal 
            onVerify={handleVerifyOtp} 
            onClose={() => setStep("signup")}
          />
        )}

        {step === "signin" && (
          <form onSubmit={handleSignin} className="admin-form">
            <h2>Admin Signin</h2>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Sign In</button>
            <div className="toggle-link" onClick={() => setStep("signup")}>
              Don't have an account? Sign Up
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        )}
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default AdminLogin;
