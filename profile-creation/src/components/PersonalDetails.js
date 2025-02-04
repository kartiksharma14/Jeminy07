import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./PersonalDetails.css";

// Create an Axios instance or use your existing "axiosInstance"
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const PersonalDetails = () => {
  // --------------------------------------
  // 1) State for personal details
  // --------------------------------------
  const [personal, setPersonal] = useState({
    marital_status: "",
    dob: "",
    category: "",
    differently_abled: "",
    career_break: "",
    work_permit_to_usa: "",
    work_permit_to_country: "",
    permanent_address: "",
    home_town: "",
    pin_code: "",
    language_proficiency: "",
  });

  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  // --------------------------------------
  // 2) Decode JWT to get userId & fetch
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

      // Fetch personal details
      fetchPersonalDetails(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // --------------------------------------
  // 3) Fetch personal details from API
  // --------------------------------------
  const fetchPersonalDetails = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched personal details:", response.data);

      const data = response.data.data;
      if (data) {
        setPersonal({
          marital_status: data.marital_status || "",
          dob: data.dob || "",
          category: data.category || "",
          differently_abled: data.differently_abled || "",
          career_break: data.career_break || "",
          work_permit_to_usa: data.work_permit_to_usa || "",
          work_permit_to_country: data.work_permit_to_country || "",
          permanent_address: data.permanent_address || "",
          home_town: data.home_town || "",
          pin_code: data.pin_code || "",
          language_proficiency: data.language_proficiency || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching personal details:", err);
      setError("Failed to fetch personal details.");
    }
  };

  // --------------------------------------
  // 4) PATCH personal details to API
  // --------------------------------------
  const handleSave = async () => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      console.log("🔄 Updating personal details with:", personal);

      const response = await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          // Only send what your backend expects to update
          marital_status: personal.marital_status.trim() || null,
          dob: personal.dob.trim() || null,
          category: personal.category.trim() || null,
          differently_abled: personal.differently_abled.trim() || null,
          career_break: personal.career_break.trim() || null,
          work_permit_to_usa: personal.work_permit_to_usa.trim() || null,
          work_permit_to_country: personal.work_permit_to_country.trim() || null,
          permanent_address: personal.permanent_address.trim() || null,
          home_town: personal.home_town.trim() || null,
          pin_code: personal.pin_code.trim() || null,
          language_proficiency: personal.language_proficiency.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Personal details updated:", response.data);
      alert("Personal details saved!");
      setIsEditing(false); // exit edit mode
    } catch (err) {
      console.error("❌ Error saving personal details:", err);
      setError("Failed to save personal details.");
    }
  };

  // --------------------------------------
  // 5) Handler for input changes
  // --------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------
  // Render
  // --------------------------------------
  return (
    <div className="personalDetails card">
      <div className="widgetHead">
        <span className="widgetTitle typ-16Bold">Personal details</span>
        {!isEditing && (
          <button className="editButton" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        {isEditing && (
          <button className="editButton" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="widgetSubTitle">
        This information is important for employers to know you better
      </p>

      {/* If not editing, show the links; else show inputs */}
      {!isEditing ? (
        <div className="widgetCont">
          <div className="row hori-list">
            {/* Marital Status */}
            <div className="col s6">
              <div className="title">Marital Status</div>
              <div className="desc">
                {personal.marital_status ? (
                  <span>{personal.marital_status}</span>
                ) : (
                  <a href="#!" className="link">Add marital status</a>
                )}
              </div>
            </div>
            {/* DOB */}
            <div className="col s6">
              <div className="title">Date of Birth</div>
              <div className="desc">
                {personal.dob ? (
                  <span>{personal.dob}</span>
                ) : (
                  <a href="#!" className="link">Add Date of birth</a>
                )}
              </div>
            </div>
            {/* Category */}
            <div className="col s6">
              <div className="title">Category</div>
              <div className="desc">
                {personal.category ? (
                  <span>{personal.category}</span>
                ) : (
                  <a href="#!" className="link">Add Category</a>
                )}
              </div>
            </div>
            {/* Differently abled */}
            <div className="col s6">
              <div className="title">Differently abled</div>
              <div className="desc">
                {personal.differently_abled ? (
                  <span>{personal.differently_abled}</span>
                ) : (
                  <a href="#!" className="link">Add Differently abled</a>
                )}
              </div>
            </div>
            {/* Career break */}
            <div className="col s6">
              <div className="title">Career break</div>
              <div className="desc">
                {personal.career_break ? (
                  <span>{personal.career_break}</span>
                ) : (
                  <a href="#!" className="link">Add Career break</a>
                )}
              </div>
            </div>
            {/* Work permit */}
            <div className="col s6">
              <div className="title">Work permit</div>
              <div className="desc">
                {personal.work_permit_to_usa ||
                personal.work_permit_to_country ? (
                  <span>
                    USA: {personal.work_permit_to_usa || "N/A"},Other Countries:{" "}
                    {personal.work_permit_to_country || "N/A"}
                  </span>
                ) : (
                  <a href="#!" className="link">Add Work permit</a>
                )}
              </div>
            </div>
            {/* Address */}
            <div className="col s6">
              <div className="title">Address</div>
              <div className="desc">
                {personal.permanent_address ||
                personal.home_town ||
                personal.pin_code ? (
                  <span>
                    {personal.permanent_address} {personal.home_town}{" "}
                    {personal.pin_code}
                  </span>
                ) : (
                  <a href="#!" className="link">Add Address</a>
                )}
              </div>
            </div>
            {/* Languages */}
            <div className="col s6">
              <div className="title">Languages</div>
              <div className="desc">
                {personal.language_proficiency ? (
                  <span>{personal.language_proficiency}</span>
                ) : (
                  <a href="#!" className="link">Add languages</a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode: show inputs
        <div className="widgetCont editMode">
          <div className="row hori-list">
            <div className="col s6">
              <label>Marital Status</label>
              <input
                type="text"
                name="marital_status"
                value={personal.marital_status}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Date of birth (YYYY-MM-DD)</label>
              <input
                type="text"
                name="dob"
                value={personal.dob}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={personal.category}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Differently abled</label>
              <input
                type="text"
                name="differently_abled"
                value={personal.differently_abled}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Career break</label>
              <input
                type="text"
                name="career_break"
                value={personal.career_break}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Work permit (USA)</label>
              <input
                type="text"
                name="work_permit_to_usa"
                value={personal.work_permit_to_usa}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Work permit (Country)</label>
              <input
                type="text"
                name="work_permit_to_country"
                value={personal.work_permit_to_country}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Permanent Address</label>
              <input
                type="text"
                name="permanent_address"
                value={personal.permanent_address}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Home Town</label>
              <input
                type="text"
                name="home_town"
                value={personal.home_town}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>PIN Code</label>
              <input
                type="text"
                name="pin_code"
                value={personal.pin_code}
                onChange={handleChange}
              />
            </div>
            <div className="col s6">
              <label>Language Proficiency</label>
              <input
                type="text"
                name="language_proficiency"
                value={personal.language_proficiency}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
