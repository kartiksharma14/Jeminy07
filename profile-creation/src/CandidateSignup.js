import React, { useState } from "react";
import SignupHeader from "./components/SignupHeader"; // Import reusable header
import axios from "axios"; // Import axios
import "./CandidateSignup.css"; // Import styles
import { useNavigate } from "react-router-dom";

function CandidateSignup() {
  const [workStatus, setWorkStatus] = useState(""); // State to track work status
  const [fullName, setFullName] = useState(""); // Full Name state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [mobile, setMobile] = useState(""); // Mobile number state
  const [currentCity, setCurrentCity] = useState(""); // Current city state
  const [updates, setUpdates] = useState(false); // Updates checkbox state
  const [resume, setResume] = useState(null); // Resume file state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // Modal state
  const [otp, setOtp] = useState(""); // OTP state
  const [otpError, setOtpError] = useState(""); // OTP error state
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // OTP verification state
  const navigate = useNavigate();

  const handleWorkStatusChange = (status) => {
    setWorkStatus(status); // Update the selected work status
  };

  // Handle file input change for resume
  const handleResumeChange = (e) => {
    setResume(e.target.files[0]); // Update resume file state
  };

  // Handle form submission and send OTP after successful registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error

    // Validate required fields
    if (!fullName || !email || !password || !mobile || !resume) {
      setError("Please fill all required fields and upload your resume.");
      setLoading(false);
      return;
    }

    // Prepare the data to send in the request using FormData
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("phone", mobile);
    formData.append("password", password);
    formData.append("resume", resume);

    // If fresher, append current city
    if (workStatus === "fresher") {
      formData.append("currentCity", currentCity);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Send OTP request after successful registration
        setIsOtpModalOpen(true); // Open OTP Modal
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setOtpError(""); // Reset OTP error
  
    if (!otp) {
      setOtpError("Please enter the OTP.");
      setIsVerifyingOtp(false);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      
      // Log the response to check the status
      console.log(response);
  
      if (response.status === 200) {
        // Redirect the user to the login page after successful OTP verification
        console.log("Navigating to login");
        navigate("/candidate/login", { replace: true });
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      console.error("OTP verification failed", error);
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  

  return (
    <div className="candidate-signup">
      <div className="Header">
        <SignupHeader />
      </div>

      {/* Content Section */}
      <div className="content">
        <div className="sticky-wrapper-leftPaneStick">
          <div className="sticky-container">
            <div className="static-list">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBwLMlmjmhZYPLzY0xLCdXSeZvh4lNgedQNQ&s"
                alt="Profile Illustration"
              />
              <h2>On registering, you can</h2>
              <ul>
                <li>Build your profile and let recruiters find you</li>
                <li>Get job postings delivered right to your email</li>
                <li>Find a job and grow your career</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane */}
        <div className="right-container">
          <div className="right-pane">
            <div className="registerWrapper">
              <div className="formWrapper">
                <h1>Create your profile</h1>
                <p>Search & apply to jobs</p>
                <form name="register" autoComplete="off" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="formField">
                    <label className="labelClass">Full Name</label>
                    <div className="__inner">
                      <input
                        type="text"
                        maxLength="35"
                        placeholder="What is your name?"
                        className="formInput mandatory __input"
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="formField">
                    <label className="labelClass">Email ID</label>
                    <div className="__inner">
                      <input
                        type="email"
                        maxLength="100"
                        placeholder="Tell us your Email ID"
                        className="formInput mandatory __input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <p className="helper-text">
                      We'll send relevant jobs and updates to this email
                    </p>
                  </div>

                  {/* Password Field */}
                  <div className="formField">
                    <label className="labelClass">Password</label>
                    <div className="__inner">
                      <input
                        type="password"
                        maxLength="40"
                        placeholder="(Minimum 6 characters)"
                        className="formInput mandatory __input"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="helper-text">This helps your account stay protected</p>
                  </div>

                  {/* Mobile Field */}
                  <div className="formField">
                    <label className="labelClass">Mobile Number</label>
                    <div className="__inner">
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="Enter your mobile number"
                        className="formInput mandatory __input"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Work Status */}
                  <div className="formField userType">
                    <label className="labelClass">Work Status</label>
                    <div className="radioWrap">
                      <div
                        className={`focusable optionWrap ${workStatus === "experienced" ? "selected" : ""}`}
                        onClick={() => handleWorkStatusChange("experienced")}
                        tabIndex="0"
                      >
                        <div className="iconWrap">
                          <img
                            src="//static.naukimg.com/s/7/104/assets/images/briefcase.bdc5fadf.svg"
                            alt="Experienced"
                          />
                        </div>
                        <div className="textWrap">
                          <h2 className="main-3">I'm experienced</h2>
                          <p className="main-2">
                            I have work experience (excluding internships)
                          </p>
                        </div>
                      </div>

                      <div
                        className={`focusable optionWrap ${workStatus === "fresher" ? "selected" : ""}`}
                        onClick={() => handleWorkStatusChange("fresher")}
                        tabIndex="0"
                      >
                        <div className="iconWrap">
                          <img
                            src="//static.naukimg.com/s/7/104/assets/images/schoolbag.a54cbf7a.svg"
                            alt="Fresher"
                          />
                        </div>
                        <div className="textWrap">
                          <h2 className="main-3">I'm a fresher</h2>
                          <p className="main-2">
                            I am a student/ Haven't worked after graduation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Rendering Based on Work Status */}
                  {workStatus === "experienced" && (
                    <div className="resume-upload-container Narrow_Widget">
                      <label className="labelClass">Upload Resume</label>
                      <div className="resume-upload">
                        <input
                          className="uploadAction"
                          type="file"
                          id="resumeUpload"
                          accept=".doc,.docx,.pdf,.rtf"
                          onChange={handleResumeChange} // Handle file input change
                          required // Make it required for experienced users
                        />
                        <label htmlFor="resumeUpload" className="uploadButton">
                          Choose File
                        </label>
                        <p>Accepted formats: DOC, DOCx, PDF, RTF | Max size: 2 MB</p>
                      </div>
                    </div>
                  )}

                  {workStatus === "fresher" && (
                    <div className="locationWrapper">
                      <label className="labelClass">Current City</label>
                      <input
                        type="text"
                        value={currentCity}
                        onChange={(e) => setCurrentCity(e.target.value)}
                        placeholder="Mention the city you live in"
                      />
                    </div>
                  )}

                  {/* Updates Checkbox */}
                  <div className="formField checkboxField">
                    <label htmlFor="updates" className="checkboxText">
                      Send me important updates & promotions via SMS, email, and WhatsApp
                    </label>
                    <input
                      type="checkbox"
                      id="updates"
                      className="checkbox"
                      checked={updates}
                      onChange={() => setUpdates(!updates)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="formField submitWrap">
                    <p>
                      By clicking Register, you agree to the{" "}
                      <a href="https://www.stl.tech/termsconditions" target="_blank">
                        Terms and Conditions
                      </a>{" "}
                      &{" "}
                      <a href="https://www.stl.tech/privacypolicy" target="_blank">
                        Privacy Policy
                      </a>{" "}
                      of Stl.tech
                    </p>
                    <button type="submit" className="submitbtn" disabled={loading}>
                      {loading ? "Registering..." : "Register now"}
                    </button>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* OTP Modal */}
          {isOtpModalOpen && (
            <div className="otp-modal-overlay">
              <div className="otp-modal-content">
                <h2>Verify OTP</h2>
                <form onSubmit={handleOtpSubmit}>
                  <div className="formField">
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="Enter OTP sent to your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)} // Update OTP state as user types
                      required
                    />
                  </div>
                  <button type="submit" disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                  {otpError && <p className="error-message" style={{ color: 'red' }}>{otpError}</p>}
                </form>
                <button className="close-modal" onClick={() => setIsOtpModalOpen(false)}>Close</button>
              </div>
            </div>
          )}

          {/* Footer Section */}
          <footer>
            <div>
              <ul>
                <li><a href="//www.stl.tech/" target="_blank">About Us</a></li>
                <li><a href="https://www.stl.tech/stl/mn_contactus.php" target="_blank">Contact Us</a></li>
                <li><a href="//www.stl.tech/faq/faq.php" target="_blank">FAQs</a></li>
                <li><a href="https://www.stl.tech/termsconditions" target="_blank">Terms and Conditions</a></li>
                <li><a href="https://www.stl.tech/privacypolicy" target="_blank">Privacy Policy</a></li>
              </ul>
              <p>All rights reserved © 2025 Jeminy</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default CandidateSignup;
