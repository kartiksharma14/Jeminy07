import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./components/LoginHeader"; // Reusing the existing login header
import "./CandidateLogin.css"; // Login-specific styles
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import { jwtDecode } from "jwt-decode"; 


function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axiosInstance.post("/auth/signin", {
        email,
        password,
      });
      const { token, userId } = response.data;
      console.log("API Response:", response);  // Debugging response
      console.log(token);
      if (response.status === 200 && token) {
        // localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        fetchUserProfile(token);
        navigate("/home", { replace: true });
       
      } else {
        setError(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
  
      if (err.response) {
        // Server responded with a status code out of 2xx
        console.error("Response Data:", err.response.data);
        setError(err.response.data.message || "Invalid email or password.");
      } else if (err.request) {
        // Request was made but no response
        console.error("No response received:", err.request);
        setError("No response from the server.");
      } else {
        // Other errors
        console.error("Error", err.message);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchUserProfile = async (token) => {
    try {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token); // Use jwtDecode to decode the token
      const userId = decodedToken.userId; // Extract the user ID from the decoded token
  
      // Now, fetch the user data using the user ID
      const response = await axiosInstance.get(`/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
  
      setUserProfile(response.data); // Set user profile data
      console.log("User profile fetched:", response.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile.");
    }
  };
  
  const openModal = () => setIsModalOpen(true); // Open the modal
  const closeModal = () => setIsModalOpen(false); // Close the modal
  

  return (
    <div className="candidate-login">
      {/* Header */}
      <LoginHeader />

      {/* Content Section */}
      <div className="content">
        {/* Left Pane */}
        <div className="sticky-wrapper-leftPaneStick">
          <div className="sticky-container">
            <div className="static-list">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBwLMlmjmhZYPLzY0xLCdXSeZvh4lNgedQNQ&s"
                alt="Profile Illustration"
              />
              <h2>Why Login?</h2>
              <ul>
                <li>Get personalized job recommendations</li>
                <li>Apply to jobs quickly</li>
                <li>Track your application status</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane */}
        <div className="right-container">
          <div className="right-pane">
            <div className="loginWrapper">
              <div className="formWrapper">
                <h1>Candidate Login</h1>
                <h2>Login to Jeminy</h2>
                <p>Access the best jobs and career opportunities</p>

                {/* Error Message */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form name="login" autoComplete="off" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="formField">
                    <label className="labelClass" htmlFor="email">
                      Email ID
                    </label>
                    <div className="__inner">
                      <input
                        type="email"
                        maxLength="100"
                        placeholder="Enter your Email ID"
                        className="formInput mandatory __input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="formField">
                    <label className="labelClass" htmlFor="password">
                      Password
                    </label>
                    <div className="__inner">
                      <input
                        type="password"
                        maxLength="40"
                        placeholder="Enter your Password"
                        className="formInput mandatory __input"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me and Forgot Password */}
                  <div className="formField checkboxField-pass">
                    <div className="remember-me">
                      <label htmlFor="rememberMe">Remember Me</label>
                      <input type="checkbox" id="rememberMe" />
                    </div>
                    <a
                      href="#"
                      onClick={openModal} // Open modal on click
                      className="forgot-password-link"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="formField submitWrap">
                    <button type="submit" className="submitbtn" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>

                  {/* Registration Link */}
                  <div className="formField registerLink">
                    <p>
                      Don't have an account?{" "}
                      <a href="/candidate/signup">Register Now</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="footer-login">
            <div>
              <ul>
                <li>
                  <a href="//www.stl.tech/" target="_blank">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stl.tech/stl/mn_contactus.php"
                    target="_blank"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="//www.stl.tech/faq/faq.php" target="_blank">
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stl.tech/termsconditions"
                    target="_blank"
                  >
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stl.tech/privacypolicy"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
              <p>All rights reserved © 2025 Jeminy Ltd.</p>
            </div>
          </footer>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default CandidateLogin;
