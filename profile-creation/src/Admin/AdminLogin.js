// src/components/AdminLogin.js
import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [step, setStep] = useState("signup"); // "signup", "verify", or "signin"
  const [name, setName] = useState(""); // added name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle Signup (sending raw JSON with email, password, and name)
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
      // Check if the response message indicates that OTP was sent
      if (data.message && data.message.toLowerCase().includes("otp sent")) {
         setStep("verify");
      } else {
         setError(data.message);
      }
    } catch (err) {
      setError("Error during signup.");
    }
  };

  // Handle OTP verification using the OTP modal's input
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
      } else {
         setError(data.message);
      }
    } catch (err) {
      setError("Error during OTP verification.");
    }
  };

  // Handle Signin
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
         setError(data.message);
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
          {/* Toggle to signin if already registered */}
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
          {/* Toggle to signup if admin doesn't have an account */}
          <div className="toggle-link" onClick={() => setStep("signup")}>
            Don't have an account? Sign Up
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default AdminLogin;
