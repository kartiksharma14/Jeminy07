import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./CareerProfile.css";

// Create or import your Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const CareerProfile = () => {
  // ---------------------------
  // 1) State for career fields
  // ---------------------------
  const [career, setCareer] = useState({
    current_industry: "",
    department: "",
    desired_job_type: "",
    desired_employment_type: "",
    preferred_shift: "",
    preferred_work_location: "",
    expected_salary: "",
  });

  // Basic error handling & userId
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ---------------------------
  // 2) Decode token & fetch
  // ---------------------------
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

      // Fetch career data
      fetchCareerData(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // ---------------------------
  // 3) Fetch Career Data
  // ---------------------------
  const fetchCareerData = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched career data:", response.data);

      const data = response.data.data;
      if (data) {
        setCareer({
          current_industry: data.current_industry || "",
          department: data.department || "",
          desired_job_type: data.desired_job_type || "",
          desired_employment_type: data.desired_employment_type || "",
          preferred_shift: data.preferred_shift || "",
          preferred_work_location: data.preferred_work_location || "",
          expected_salary: data.expected_salary || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching career profile:", err);
      setError("Failed to fetch career profile.");
    }
  };

  // ---------------------------
  // 4) PATCH Career Data
  // ---------------------------
  const handleSave = async () => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      console.log("🔄 Updating career profile with:", career);

      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          current_industry: career.current_industry.trim() || null,
          department: career.department.trim() || null,
          desired_job_type: career.desired_job_type.trim() || null,
          desired_employment_type: career.desired_employment_type.trim() || null,
          preferred_shift: career.preferred_shift.trim() || null,
          preferred_work_location: career.preferred_work_location.trim() || null,
          expected_salary: career.expected_salary.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Career profile updated successfully");
      alert("Career profile saved!");
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error saving career profile:", err);
      setError("Failed to save career profile.");
    }
  };

  // ---------------------------
  // 5) Handler for input changes
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCareer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="career-profile card">
      <div className="widgetHead">
        <span className="widgetTitle typ-16Bold">Career profile</span>
        {!isEditing && (
          <button
            className="editButton"
            aria-label="Edit Career Profile"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        {isEditing && (
          <button
            className="editButton"
            aria-label="Save Career Profile"
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="widgetSubTitle">
        Add details about your current and preferred career profile. This helps
        us personalise your job recommendations.
      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="widgetCont">
          <div className="hori-list">
            <div className="profile-item">
              <div className="title">Current industry</div>
              <div className="desc">
                {career.current_industry ? (
                  <span>{career.current_industry}</span>
                ) : (
                  <a href="#!" className="link">
                    Add current industry
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Department</div>
              <div className="desc">
                {career.department ? (
                  <span>{career.department}</span>
                ) : (
                  <a href="#!" className="link">
                    Add department
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Desired job type</div>
              <div className="desc">
                {career.desired_job_type ? (
                  <span>{career.desired_job_type}</span>
                ) : (
                  <a href="#!" className="link">
                    Add desired job type
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Desired employment type</div>
              <div className="desc">
                {career.desired_employment_type ? (
                  <span>{career.desired_employment_type}</span>
                ) : (
                  <a href="#!" className="link">
                    Add desired employment type
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Preferred shift</div>
              <div className="desc">
                {career.preferred_shift ? (
                  <span>{career.preferred_shift}</span>
                ) : (
                  <a href="#!" className="link">
                    Add preferred shift
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Preferred work location</div>
              <div className="desc">
                {career.preferred_work_location ? (
                  <span>{career.preferred_work_location}</span>
                ) : (
                  <a href="#!" className="link">
                    Add preferred work location
                  </a>
                )}
              </div>
            </div>

            <div className="profile-item">
              <div className="title">Expected salary</div>
              <div className="desc">
                {career.expected_salary ? (
                  <span>{career.expected_salary}</span>
                ) : (
                  <a href="#!" className="link">
                    Add expected salary
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="widgetCont">
          <div className="hori-list">
            <div className="profile-item">
              <label>Current industry</label>
              <input
                type="text"
                name="current_industry"
                value={career.current_industry}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={career.department}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Desired job type</label>
              <input
                type="text"
                name="desired_job_type"
                value={career.desired_job_type}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Desired employment type</label>
              <input
                type="text"
                name="desired_employment_type"
                value={career.desired_employment_type}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Preferred shift</label>
              <input
                type="text"
                name="preferred_shift"
                value={career.preferred_shift}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Preferred work location</label>
              <input
                type="text"
                name="preferred_work_location"
                value={career.preferred_work_location}
                onChange={handleChange}
              />
            </div>
            <div className="profile-item">
              <label>Expected salary</label>
              <input
                type="text"
                name="expected_salary"
                value={career.expected_salary}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerProfile;
