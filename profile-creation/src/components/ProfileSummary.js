import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./ProfileSummary.css";

// You can import your existing axios instance if you have one.
// Otherwise, create a new instance:
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const ProfileSummary = () => {
  // --------------------------------------
  // 1) State for summary
  // --------------------------------------
  const [profileSummary, setProfileSummary] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);

  // --------------------------------------
  // 2) Decode token & fetch summary
  // --------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const extractedUserId = decoded.userId || decoded.candidate_id;
      if (!extractedUserId) {
        setError("Invalid token: userId not found");
        return;
      }
      setUserId(extractedUserId);

      // Fetch existing summary
      fetchProfileSummary(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // --------------------------------------
  // 3) Fetch from GET user-details/:userId
  // --------------------------------------
  const fetchProfileSummary = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched profile summary:", response.data);

      const data = response.data.data;
      if (data) {
        // If your backend uses "summary" or "profile_summary" - adjust here
        setProfileSummary(data.profile_summary || data.summary || "");
      }
    } catch (err) {
      console.error("❌ Error fetching profile summary:", err);
      setError("Failed to fetch profile summary.");
    }
  };

  // --------------------------------------
  // 4) PATCH updates to update-user/:userId
  // --------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      console.log("🔄 Updating profile summary with:", profileSummary);

      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          // The backend might call this field "profile_summary" or "summary"
          profile_summary: profileSummary.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Profile summary updated successfully");
      alert("Profile summary saved!");
      setModalOpen(false); // close modal after save
    } catch (err) {
      console.error("❌ Error saving profile summary:", err);
      setError("Failed to save profile summary.");
    }
  };

  // --------------------------------------
  // Handler for text changes in modal
  // --------------------------------------
  const handleChange = (e) => {
    setProfileSummary(e.target.value);
  };

  // --------------------------------------
  // Toggle Modal
  // --------------------------------------
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // --------------------------------------
  // Render
  // --------------------------------------
  return (
    <div className="profileSummary">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <div className="widgetHead">
          <span className="widgetTitle typ-16Bold">Profile Summary</span>
          <button className="addButton" onClick={toggleModal}>
            {profileSummary ? "Edit profile summary" : "Add profile summary"}
          </button>
        </div>

        <div className="widgetCont">
          {/* If there's no summary, show placeholder text */}
          {!profileSummary ? (
            <p className="empty">
              Highlight your key career achievements to help employers know your
              potential.
            </p>
          ) : (
            // If a summary exists, show it
            <p>{profileSummary}</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content profile-summary-modal">
            <button
              className="close-btn"
              onClick={toggleModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>
              {profileSummary ? "Edit Profile Summary" : "Add Profile Summary"}
            </h2>

            <form
              name="profileSummaryForm"
              className="profileSummaryForm"
              onSubmit={handleSave}
            >
              <div className="form-group">
                <label htmlFor="summary" className="required-field">
                  Profile Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  className="input"
                  placeholder="Write your profile summary here..."
                  rows="6"
                  value={profileSummary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button className="save-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;
