import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import "./ProfileDetails.css";
import axios from "axios";

const ProfileDetails = () => {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resume, setResume] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState({
    name: false,
    location: false,
    availability: false,
    mobile: false,
    email: false
  }); // To track which field is being edited

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Extract the userId from the decoded token
      fetchUserProfile(userId, token); // Fetch the profile using the userId
    } else {
      setError("No authentication token found.");
    }
  }, []);

  const fetchUserProfile = async (userId, token) => {
    try {
      const response = await axiosInstance.get(`/candidate-profile/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      console.log("User profile response:", response.data.data);
      const user = response.data.data;  // Extract the 'user' object
      setUserId(userId);  // Store userId in state for later use
      const { name, email, phone, location, availability_to_join, photo ,resume,fresher_experience } = user;
  
      // Check if each value exists before updating the state
      if (name) setName(name);  // Set the user's name if it exists
      if (email) setEmail(email);  // Set the user's email if it exists
      if (phone) setMobile(phone);  // Set the user's mobile number if it exists
      if (location) setLocation(location);  // Set the user's location if it exists
      if (availability_to_join) setAvailability(availability_to_join);  // Set the user's availability if it exists
      if (photo) setProfilePhoto(photo);  // Set the user's profile photo if it exists
      if(resume) setResume(resume);
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error(err);
    }
  };
  
  

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");
  
    if (!userId) {
      setError("User ID not found. Please refresh and try again.");
      return;
    }
    const fresher="fresher";
    // Construct JSON payload
    const profileData = {
      location: location?.trim() || "",
      phone: mobile?.trim() || "",
      availability_to_join: availability?.trim() || "",
      resume:100,
      fresher_experience:fresher

    };
    const apiUrl = `http://localhost:5000/api/candidate-profile/update-user/${userId}`;
    try {
      console.log("🔄 Preparing to send profile update...");
      console.log("📤 User ID:", userId);
      console.log("📤 Auth Token:", authToken);
      console.log("📤 Payload Data:", JSON.stringify(profileData, null, 2));
      console.log("🌍 API URL:", apiUrl);
  
      const response = await axios.patch(
        apiUrl,
        profileData, // Send JSON data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json", // Ensure backend recognizes JSON
          },
        }
      );
  
      console.log("✅ Profile updated successfully:", response.data);
      alert("Profile saved successfully!");
  
      // Exit editing mode after saving
      setIsEditing({
        name: false,
        location: false,
        availability: false,
        mobile: false,
        email: false,
      });
  
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      
      const errorMessage =
        error.response?.data?.message || "Failed to save profile. Please try again.";
  
      setError(errorMessage);
      alert(errorMessage);
    }
  };
  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="profilePage">
      <div className="profile-container">
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          <div className="photo-wrapper">
            <img
              src={profilePhoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNdN9iSAU7808-QMjArLwqvXVONI9MXmK7Mw&s"}
              alt="Profile"
              className="profile-photo"
            />
            <label htmlFor="upload-photo" className="upload-button">
              Upload
            </label>
            <input
              type="file"
              id="upload-photo"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="details-section">
          <h3 className="fullname">{name || "Kartik"}</h3>
          <p className="last-updated">Last updated: Jan 31, 2025</p>
          <hr className="horizontal-line" />

          <form onSubmit={handleSaveProfile}>
            <div className="info-sections">
              {/* Left Section */}
              <div className="info-left">
                {/* Location Field */}
                <div className="editable-field">
                  {isEditing.location ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  ) : (
                    <span>{location || "Add location"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("location")}
                    className="edit-button"
                  >
                    {isEditing.location ? "Save" : "Edit"}
                  </button>
                </div>

                {/* Availability Field */}
                <div className="editable-field">
                  {isEditing.availability ? (
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                  ) : (
                    <span>{availability || "Add availability(Days)"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("availability")}
                    className="edit-button"
                  >
                    {isEditing.availability ? "Save" : "Edit"}
                  </button>
                </div>

                {/* Mobile Field */}
                
              </div>

              {/* Vertical Line */}
              <div className="vertical-line"></div>

              {/* Right Section */}
              <div className="info-right">
                {/* Email Field */}
                <div className="editable-field">
                  {isEditing.email ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <span>{email || "Email address"}</span>
                  )}
                </div>
                <div className="editable-field">
                  {isEditing.mobile ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  ) : (
                    <span>{mobile || "Add mobile number"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("mobile")}
                    className="edit-button"
                  >
                    {isEditing.mobile ? "Save" : "Edit"}
                  </button>
                </div>
              </div>
            </div>

            <div className="save-button">
              <button type="submit">Save Profile</button>
            </div>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
