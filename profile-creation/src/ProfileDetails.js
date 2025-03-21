import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import "./ProfileDetails.css";
import axios from "axios";

const ProfileDetails = () => {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [name, setName] = useState("");
  // We store two pieces of state:
  // 1. displayLocation: what is shown to the user (City, State)
  // 2. validLocation: the value to send to the API (just the city name)
  const [displayLocation, setDisplayLocation] = useState("");
  const [validLocation, setValidLocation] = useState(""); 
  const [availability, setAvailability] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resume, setResume] = useState("");
  const [userId, setUserId] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]); // For storing city suggestions
  const [isEditing, setIsEditing] = useState({
    name: false,
    location: false,
    availability: false,
    mobile: false,
    email: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      fetchUserProfile(userId, token);
    } else {
      setError("No authentication token found.");
    }
  }, []);

  const fetchUserProfile = async (userId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User profile response:", response.data.data);
      const user = response.data.data;
      setUserId(userId);
      const {
        name,
        email,
        phone,
        location, // assume backend returns just the city name if already saved
        availability_to_join,
        photo,
        resume,
        fresher_experience,
      } = user;

      if (name) setName(name);
      if (email) setEmail(email);
      if (phone) setMobile(phone);
      if (location) {
        // For display purposes, you might look up the state for that city,
        // or if your backend stored only the city, display that.
        setDisplayLocation(location); 
        setValidLocation(location);
      }
      if (availability_to_join) setAvailability(availability_to_join);
      if (photo) setProfilePhoto(photo);
      if (resume) setResume(resume);
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

    // Validate that a valid city has been selected
    if (!validLocation) {
      setError("Invalid city. Please select a valid city from the suggestions.");
      return;
    } else {
      setError("");
    }

    const authToken = localStorage.getItem("authToken");
    if (!userId) {
      setError("User ID not found. Please refresh and try again.");
      return;
    }
    const fresher = "fresher";
    const profileData = {
      // Send the validLocation (which is just the city name) to the API
      location: validLocation?.trim() || "",
      phone: mobile?.trim() || "",
      availability_to_join: availability?.trim() || "",
      resume: 200,
      fresher_experience: fresher,
    };
    const apiUrl = `http://localhost:5000/api/candidate-profile/update-user/${userId}`;
    try {
      console.log("Preparing to send profile update...");
      const response = await axios.patch(apiUrl, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Profile updated successfully:", response.data);
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
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert(
        "Error updating profile: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Toggle editing mode for a specific field
  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    if (field === "location" && isEditing.location) {
      setCitySuggestions([]);
    }
  };

  // Fetch suggestions as the user types
  const handleLocationChange = async (e) => {
    const query = e.target.value;
    // As the user types, update the display value...
    setDisplayLocation(query);
    // Reset the valid location because the user hasn't confirmed a suggestion
    setValidLocation("");

    if (query.trim() !== "") {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:5000/api/search-cities?search=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Expecting response.data.data to be an array of suggestion objects
        const suggestions = response.data.data || [];
        setCitySuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  // When a suggestion is clicked, update both display and valid values
  const handleSuggestionClick = (suggestion) => {
    // For display, we show "City, State"
    const formattedDisplay = `${suggestion.city}, ${suggestion.state}`;
    setDisplayLocation(formattedDisplay);
    // For the API, we use only the city name (adjust this if your API expects a different format)
    setValidLocation(suggestion.city);
    setCitySuggestions([]);
  };

  return (
    <div className="profilePage">
      <div className="profile-container">
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          <div className="photo-wrapper">
            <img
              src={
                profilePhoto ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNdN9iSAU7808-QMjArLwqvXVONI9MXmK7Mw&s"
              }
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
                {/* Location Field with improved suggestions dropdown */}
                <div className="editable-field">
                  {isEditing.location ? (
                    <div className="location-input-wrapper">
                      <input
                        type="text"
                        value={displayLocation}
                        onChange={handleLocationChange}
                        placeholder="Enter location"
                        className="location-input"
                      />
                      {citySuggestions.length > 0 && (
                        <ul className="suggestions-list">
                          {citySuggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <strong>{suggestion.city}</strong> –{" "}
                              {suggestion.state}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <span>{displayLocation || "Add location"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("location")}
                    className="edit-button-profile"
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
                      placeholder="Enter availability (Days)"
                    />
                  ) : (
                    <span>{availability || "Add availability (Days)"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("availability")}
                    className="edit-button-profile"
                  >
                    {isEditing.availability ? "Save" : "Edit"}
                  </button>
                </div>
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
                      placeholder="Enter email"
                    />
                  ) : (
                    <span>{email || "Email address"}</span>
                  )}
                </div>

                {/* Mobile Field */}
                <div className="editable-field">
                  {isEditing.mobile ? (
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <span>{mobile || "Add mobile number"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditToggle("mobile")}
                    className="edit-button-profile"
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
