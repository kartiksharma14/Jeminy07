import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./Accomplishments.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
});

const Accomplishments = () => {
  // ---------------------------------------
  // 1) State for all accomplishment fields
  // ---------------------------------------
  const [accomplishments, setAccomplishments] = useState({
    online_profile: "",
    work_sample: "",
    white_paper: "",
    presentation: "",
    patent: "",
    certification: "",
  });

  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // State for modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [accomplishmentValue, setAccomplishmentValue] = useState("");

  // ---------------------------------------
  // 2) Decode JWT & fetch accomplishments
  // ---------------------------------------
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

      // Fetch existing accomplishment data
      fetchAccomplishments(extractedUserId, token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error decoding token.");
    }
  }, []);

  // ---------------------------------------
  // 3) Fetch (GET) accomplishment data
  // ---------------------------------------
  const fetchAccomplishments = async (uId, token) => {
    try {
      const response = await axiosInstance.get(
        `/candidate-profile/user-details/${uId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Fetched accomplishments:", response.data);

      const data = response.data.data;
      if (data) {
        setAccomplishments({
          online_profile: data.online_profile || "",
          work_sample: data.work_sample || "",
          white_paper: data.white_paper || "",
          presentation: data.presentation || "",
          patent: data.patent || "",
          certification: data.certification || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching accomplishments:", err);
      setError("Failed to fetch accomplishments.");
    }
  };

  // ---------------------------------------
  // 4) PATCH accomplishment
  // ---------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId || !selectedAccomplishment) {
      setError("User or accomplishment is missing.");
      return;
    }

    // Prepare the patch payload with only the selected field
    // e.g. { work_sample: "..." }
    const payload = {
      [selectedAccomplishment.key]: accomplishmentValue.trim() || null,
    };

    try {
      console.log("🔄 Updating accomplishment:", payload);

      await axiosInstance.patch(
        `/candidate-profile/update-user/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Accomplishment updated successfully");
      alert("Accomplishment saved!");

      // Update local state
      setAccomplishments((prev) => ({
        ...prev,
        [selectedAccomplishment.key]: accomplishmentValue.trim(),
      }));

      // Close modal
      setModalOpen(false);
      setSelectedAccomplishment(null);
    } catch (err) {
      console.error("❌ Error saving accomplishment:", err);
      setError("Failed to save accomplishment.");
    }
  };

  // ---------------------------------------
  // 5) Handler for selecting an item & toggling modal
  // ---------------------------------------
  const toggleModal = (item = null) => {
    if (item) {
      setSelectedAccomplishment(item);
      // Pre-fill modal with existing data from state
      setAccomplishmentValue(accomplishments[item.key] || "");
    } else {
      setSelectedAccomplishment(null);
    }
    setModalOpen((prev) => !prev);
  };

  // ---------------------------------------
  // Mappings between UI items & backend keys
  // ---------------------------------------
  const accomplishmentItems = [
    {
      key: "online_profile",
      title: "Online profile",
      description: "Add link to online professional profiles (e.g. LinkedIn, etc.)",
    },
    {
      key: "work_sample",
      title: "Work sample",
      description: "Link relevant work samples (e.g. Github, Behance)",
    },
    {
      key: "white_paper",
      title: "White paper / Research publication / Journal entry",
      description: "Add links to your online publications",
    },
    {
      key: "presentation",
      title: "Presentation",
      description:
        "Add links to your online presentations (e.g. Slide-share presentation links etc.)",
    },
    {
      key: "patent",
      title: "Patent",
      description: "Add details of patents you have filed",
    },
    {
      key: "certification",
      title: "Certification",
      description: "Add details of certifications you have completed",
    },
  ];

  // ---------------------------------------
  // Render
  // ---------------------------------------
  return (
    <div className="accomplishments card">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="widgetHead">
        <span className="widgetTitle typ-16Bold">Accomplishments</span>
      </div>
      <div>
        <p className="widgetSubTitle">
          Showcase your credentials by adding relevant certifications, work samples, online profiles, etc.
        </p>
      </div>
      <div className="widgetCont">
        <div className="acm-list">
          {accomplishmentItems.map((item, index) => {
            const existingValue = accomplishments[item.key];
            const buttonLabel = existingValue ? "Update" : "Add";

            return (
              <div key={index} className="acm-list-item">
                <div className="acm-content">
                  <div className="acm-title">{item.title}</div>
                  <div className="acm-description">{item.description}</div>
                  {existingValue && (
                    <div className="acm-existing-value">
                      <strong>Link: </strong>
                      <span>{existingValue}</span>
                    </div>
                  )}
                </div>
                <button
                  className="addButton"
                  onClick={() => toggleModal(item)}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedAccomplishment && (
        <div
          className="modal-overlay"
          onClick={() => toggleModal()} // close if clicked outside content
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing
          >
            <button
              className="close-btn"
              onClick={() => toggleModal()}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Add {selectedAccomplishment.title}</h2>
            <p>{selectedAccomplishment.description}</p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="accomplishmentInput">Enter details:</label>
                <textarea
                  id="accomplishmentInput"
                  className="input"
                  placeholder={`Add your ${selectedAccomplishment.title} details here...`}
                  value={accomplishmentValue}
                  onChange={(e) => setAccomplishmentValue(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => toggleModal()}
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

export default Accomplishments;
