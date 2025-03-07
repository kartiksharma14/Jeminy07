import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./PersonalDetails.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const PersonalDetails = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      fetchPersonalDetails(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  const fetchPersonalDetails = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Fetched personal details:", response.data);
      const data = response.data.data;
      if (data) {
        setPersonal({
          marital_status: data.marital_status || "",
          dob: data.dob ? formatDate(data.dob) : "", 
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
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return dateString; // If invalid, return original format
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }); // Example: "18 July 2001"
  }
  const formatDateForBackend = (dateString) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return dateString;
    return dateObj.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };
  const handleSave = async () => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }
    try {
      console.log("🔄 Updating personal details with:", personal);
      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        {
          marital_status: personal.marital_status.trim() || null,
          dob: personal.dob.trim() ? formatDateForBackend(personal.dob.trim()) : null,
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
      console.log("✅ Personal details updated:", personal);
      alert("Personal details saved!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error saving personal details:", err);
      setError("Failed to save personal details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = e.target.value;
    setPersonal((prev) => ({ ...prev,dob: formatDate(selectedDate), [name]: value }));
  };

  return (
    <div className="personalDetails card">
      <div className="widgetHead">
        <span className="widgetTitle typ-16Bold">Personal details</span>
        <span
          className="edit icon"
          tabIndex="0"
          onClick={() => setIsModalOpen(true)}
        >
          Edit
        </span>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="widgetSubTitle">
        This information is important for employers to know you better.
      </p>
      {!isModalOpen ? (
        <div className="widgetCont">
          <div className="row hori-list">
            <div className="profile-item">
              <div className="title">Marital Status</div>
              <div className="desc">
                {personal.marital_status ? (
                  <span>{personal.marital_status}</span>
                ) : (
                  <a href="#!" className="link">
                    Add marital status
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Date of Birth</div>
              <div className="desc">
                {personal.dob ? (
                  <span>{formatDate(personal.dob)}</span>
                ) : (
                  <a href="#!" className="link">
                    Add Date of birth
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Category</div>
              <div className="desc">
                {personal.category ? (
                  <span>{personal.category}</span>
                ) : (
                  <a href="#!" className="link">
                    Add category
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Differently abled</div>
              <div className="desc">
                {personal.differently_abled ? (
                  <span>{personal.differently_abled}</span>
                ) : (
                  <a href="#!" className="link">
                    Add info
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Career Break</div>
              <div className="desc">
                {personal.career_break ? (
                  <span>{personal.career_break}</span>
                ) : (
                  <a href="#!" className="link">
                    Add career break
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Work Permit</div>
              <div className="desc">
                {personal.work_permit_to_usa || personal.work_permit_to_country ? (
                  <span>
                    USA: {personal.work_permit_to_usa || "N/A"}, Other:{" "}
                    {personal.work_permit_to_country || "N/A"}
                  </span>
                ) : (
                  <a href="#!" className="link">
                    Add work permit
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
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
                  <a href="#!" className="link">
                    Add address
                  </a>
                )}
              </div>
            </div>
            <div className="profile-item">
              <div className="title">Languages</div>
              <div className="desc">
                {personal.language_proficiency ? (
                  <span>{personal.language_proficiency}</span>
                ) : (
                  <a href="#!" className="link">
                    Add languages
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen && (
        <div className="profileEditDrawer active">
          <div className="personalDetailsForm  lbpadding">
            <div className="editHeader">
              <div>
                <span className="widgetTitle mb5">Personal details</span>
              </div>
              <div>
                <div className="widgetDesc">
                  Update your personal details so employers can know you better.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <span className="lbl required-field">Marital Status</span>
                <input
                  type="text"
                  name="marital_status"
                  value={personal.marital_status}
                  onChange={handleChange}
                  placeholder="Enter marital status"
                />
              </div>
              <div className="input-field col s6">
                <span className="lbl required-field">Date of Birth</span>
                <input
                  type="date"
                  name="dob"
                  value={formatDateForBackend(personal.dob)} // Convert to YYYY-MM-DD for input
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <span className="lbl required-field">Category</span>
                <input
                  type="text"
                  name="category"
                  value={personal.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                />
              </div>
              <div className="input-field col s6">
                <span className="lbl required-field">Differently abled</span>
                <input
                  type="text"
                  name="differently_abled"
                  value={personal.differently_abled}
                  onChange={handleChange}
                  placeholder="Enter if applicable"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <span className="lbl required-field">Career Break</span>
                <input
                  type="text"
                  name="career_break"
                  value={personal.career_break}
                  onChange={handleChange}
                  placeholder="Enter career break duration"
                />
              </div>
              <div className="input-field col s6">
                <span className="lbl required-field">Work Permit (USA)</span>
                <input
                  type="text"
                  name="work_permit_to_usa"
                  value={personal.work_permit_to_usa}
                  onChange={handleChange}
                  placeholder="Enter permit details"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <span className="lbl required-field">Work Permit (Other)</span>
                <input
                  type="text"
                  name="work_permit_to_country"
                  value={personal.work_permit_to_country}
                  onChange={handleChange}
                  placeholder="Enter permit details"
                />
              </div>
              <div className="input-field col s6">
                <span className="lbl required-field">Permanent Address</span>
                <input
                  type="text"
                  name="permanent_address"
                  value={personal.permanent_address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <span className="lbl required-field">Home Town</span>
                <input
                  type="text"
                  name="home_town"
                  value={personal.home_town}
                  onChange={handleChange}
                  placeholder="Enter home town"
                />
              </div>
              <div className="input-field col s6">
                <span className="lbl required-field">PIN Code</span>
                <input
                  type="text"
                  name="pin_code"
                  value={personal.pin_code}
                  onChange={handleChange}
                  placeholder="Enter PIN code"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <span className="lbl required-field">Language Proficiency</span>
                <input
                  type="text"
                  name="language_proficiency"
                  value={personal.language_proficiency}
                  onChange={handleChange}
                  placeholder="Enter languages"
                />
              </div>
            </div>
            <div className="row mb0">
              <div className="col s12 action">
                <a
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </a>
                <button
                  className="btn-dark-ot"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="crossLayer" onClick={() => setIsModalOpen(false)}>
            <span className="icon">X</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
