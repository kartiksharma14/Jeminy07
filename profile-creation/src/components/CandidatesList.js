import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./CandidatesList.css";
import { FaBriefcase, FaWallet, FaMapMarkerAlt } from "react-icons/fa"; // Icons

// CandidateModal: Displays detailed candidate information.
const CandidateModal = ({ candidate, onClose, onToggleFavorite, isFavorite }) => {
  const [details, setDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNydWl0ZXJfaWQiOjYsImVtYWlsIjoibmF2bmVldC5rYXVzaGlrQHN0bC50ZWNoIiwibm1hZSI6Ik5hdm5lZXQgS2F1c2hpayIsImNvbXBhbnlfbmFtZSI6IlNUTCIsImlhdCI6MTc0MTI1NzUzNCwiZXhwIjoxNzQ5ODk3NTM0fQ.Giv3hvdlLpnv2jfHNR0lawe3OV9QaErRf9OeL_v5ykE";
  
  useEffect(() => {
    if (candidate) {
      setModalLoading(true);
      setModalError(null);
      fetch(
        `http://localhost:5000/api/candidate-profile/user-details/${candidate.candidate_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(
              `Error fetching candidate details: ${res.status} ${res.statusText}`
            );
          }
          const result = await res.json();
          return result.data;
        })
        .then((data) => {
          setDetails(data);
        })
        .catch((err) => {
          setModalError(err.message);
        })
        .finally(() => {
          setModalLoading(false);
        });
    }
  }, [candidate, AUTH_TOKEN]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {modalLoading ? (
          <div className="modal-loader">
            <ClipLoader size={40} color="#007bff" />
            <p>Loading details...</p>
          </div>
        ) : modalError ? (
          <p className="error-message">{modalError}</p>
        ) : details ? (
          <>
            {/* Modal Header with Candidate Name and Favorite Toggle */}
            <div className="modal-header">
              <div className="modal-title">
                <h2>{details.name || "Unnamed Candidate"}</h2>
                {details.resume_headline && (
                  <p className="modal-subtitle">{details.resume_headline}</p>
                )}
              </div>
              <button
                className={`favorite-button ${isFavorite ? "favorited" : ""}`}
                onClick={() => onToggleFavorite(details.candidate_id)}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </div>

            {/* Candidate Photo */}
            {details.photo ? (
              <img
                src={details.photo}
                alt="Candidate"
                className="modal-image circular"
              />
            ) : (
              <div className="modal-placeholder-image">No Image</div>
            )}

            {/* Basic Information Section */}
            <div className="modal-section">
              <h3>Basic Information</h3>
              <p>
                <strong>Email:</strong> {details.email}
              </p>
              <p>
                <strong>Phone:</strong> {details.phone}
              </p>
              <p>
                <strong>Location:</strong> {details.location || "N/A"}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                {details.availability_to_join || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {details.gender || "N/A"}
              </p>
              <p>
                <strong>Marital Status:</strong>{" "}
                {details.marital_status || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {details.dob || "N/A"}
              </p>
            </div>

            {/* Profile Summary Section */}
            <div className="modal-section">
              <h3>Profile Summary</h3>
              <p>{details.profile_summary || "No summary available."}</p>
            </div>

            {/* Education Section */}
            {details.education && details.education.length > 0 && (
              <div className="modal-section">
                <h3>Education</h3>
                {details.education.map((edu) => (
                  <div key={edu.education_id} className="education-card">
                    <p>
                      <strong>{edu.education_level}</strong> in {edu.course} from{" "}
                      {edu.university}
                    </p>
                    <p>
                      Specialization: {edu.specialization || "N/A"} ({edu.coursestart_year} -{" "}
                      {edu.courseend_year})
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Employment Section */}
            {details.employment && details.employment.length > 0 && (
              <div className="modal-section">
                <h3>Employment History</h3>
                {details.employment.map((emp) => (
                  <div key={emp.employment_id} className="employment-card">
                    <p>
                      <strong>{emp.current_job_title}</strong> at{" "}
                      {emp.current_company_name}
                    </p>
                    <p>
                      Employment status at this Company: {emp.current_employment || "N/A"} | Type:{" "}
                      {emp.employment_type || "N/A"}
                    </p>
                    <p>
                      Employment Joining Date: {emp.joining_date || "N/A"}
                    </p>
                    <p>
                      Experience: {emp.experience_in_year} years{" "}
                      {emp.experience_in_months} months
                    </p>
                    <p>
                      Notice Period: {emp.notice_period || "N/A"} days
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Section */}
            {details.projects && details.projects.length > 0 && (
              <div className="modal-section">
                <h3>Projects</h3>
                {details.projects.map((proj) => (
                  <div key={proj.project_id} className="project-card">
                    <p>
                      <strong>{proj.project_title}</strong> for {proj.client}
                    </p>
                    <p>Status: {proj.project_status}</p>
                    <p>Duration: {proj.work_duration}</p>
                    <p>Technologies: {proj.technology_used}</p>
                    <p>Details: {proj.details_of_project}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Skills Section */}
            {details.keyskills && details.keyskills.length > 0 && (
              <div className="modal-section">
                <h3>Key Skills</h3>
                <div className="skills-container">
                  {details.keyskills.map((ks) => (
                    <span key={ks.keyskills_id} className="skill-badge">
                      {ks.keyskillsname}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* IT Skills Section */}
            {details.itskills && details.itskills.length > 0 && (
              <div className="modal-section">
                <h3>IT Skills</h3>
                <div className="skills-container">
                  {details.itskills.map((it) => (
                    <span key={it.itskills_id} className="skill-badge">
                      {it.itskills_name} ({it.itskills_proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Online Profiles & Work Samples Section */}
            <div className="modal-section">
              <h3>Online Profiles & Work Samples</h3>
              {details.online_profile && (
                <p>
                  <strong>Online Profile:</strong>{" "}
                  <a
                    href={details.online_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.online_profile}
                  </a>
                </p>
              )}
              {details.work_sample && (
                <p>
                  <strong>Work Sample:</strong>{" "}
                  <a
                    href={details.work_sample}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.work_sample}
                  </a>
                </p>
              )}
              {details.white_paper && (
                <p>
                  <strong>White Paper:</strong>{" "}
                  <a
                    href={details.white_paper}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.white_paper}
                  </a>
                </p>
              )}
              {details.presentation && (
                <p>
                  <strong>Presentation:</strong>{" "}
                  <a
                    href={details.presentation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.presentation}
                  </a>
                </p>
              )}
              {details.patent && (
                <p>
                  <strong>Patent:</strong>{" "}
                  <a
                    href={details.patent}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.patent}
                  </a>
                </p>
              )}
              {details.certification && (
                <p>
                  <strong>Certification:</strong>{" "}
                  <a
                    href={details.certification}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {details.certification}
                  </a>
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="contact-button"
                onClick={() => alert("Contact functionality coming soon!")}
              >
                Download Resume
              </button>
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

// CandidateCard: Displays candidate info on a card.
// Uses cached details for the name if available.
const CandidateCard = ({
  candidate,
  onOpenModal,
  onToggleFavorite,
  isFavorite,
  detailsMap,
}) => {
  const handleCardClick = () => {
    onOpenModal(candidate);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(candidate.candidate_id);
  };

  const displayName =
    candidate.signin?.name ||
    candidate.name ||
    (detailsMap && detailsMap[candidate.candidate_id]?.name) ||
    "Unnamed Candidate";
  // Helper function to format the date string
  function formatAvailabilityDate(dateStr) {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) return dateStr;
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
const totalExperience = candidate.EmploymentDetails.reduce(
  (acc, job) => {
    acc.years += job.experience_in_year || 0;
    acc.months += job.experience_in_months || 0;
    return acc;
  },
  { years: 0, months: 0 }
);
totalExperience.years += Math.floor(totalExperience.months / 12);
totalExperience.months = totalExperience.months % 12;
const experienceText =
  totalExperience.years === 0 && totalExperience.months === 0
    ? "Fresher"
    : `${totalExperience.years} yrs ${totalExperience.months} months`;
    const currentSalary = candidate.EmploymentDetails?.[0]?.current_salary || "Not Available";
const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="candidate-card" onClick={handleCardClick}>
      {/* Left Section: Name, Current Position, Previous Position, Education, Key Skills */}
      <div className="card-left">
        <div className="card-header">
          <h3 className="candidate-name">{displayName}</h3>
          <button
            className={`favorite-button ${candidate.isFavorite ? "favorited" : ""}`}
            onClick={handleFavoriteClick}
          >
            {candidate.isFavorite ? "★" : "☆"}
          </button>
        </div>

        {/* Work Experience, Salary, Location */}
        <div className="candidate-info">
          <span><FaBriefcase /> {experienceText}</span>
          <span><FaWallet/>{currentSalary}</span>
         <span><FaMapMarkerAlt /> {candidate.location || "N/A"}</span>
        </div>

        {/* Candidate Details */}
        <div className="candidate-details">
        <p><strong>Current:</strong>{" "}{candidate.EmploymentDetails.length > 0 ? `${candidate.EmploymentDetails[0].current_job_title} at ${candidate.EmploymentDetails[0].current_company_name}`: "N/A"}</p>
        <p><strong>Previous:</strong>{" "}{candidate.EmploymentDetails.length > 1 ? `${candidate.EmploymentDetails[1].current_job_title} at ${candidate.EmploymentDetails[1].current_company_name}`: "N/A"}</p>
        <p><strong>Education:</strong>{" "}{candidate.Education.length > 0 ? `${candidate.Education[0].education_level} at ${candidate.Education[0].university}`: "N/A"}</p>
          <p><strong>Key Skills:</strong>{candidate.keyskills.length > 0 ? candidate.keyskills.map(skill => skill.keyskillsname).join(", ") : "N/A"}</p>
        </div>
      </div>

      {/* Right Section: Profile Picture + Buttons */}
      <div className="candidate-sidebar">
        {candidate.image && (
          <img src={candidate.image} alt="Candidate" className="candidate-image" />
        )}
        <button
        className="view-phone-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents modal from opening
            setShowPhone(true);
        }}
        >
        {showPhone ? candidate.phone : "View Phone Number"}
        </button>
        <button
          className="view-profile-button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(candidate);
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

const CandidatesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNydWl0ZXJfaWQiOjYsImVtYWlsIjoibmF2bmVldC5rYXVzaGlrQHN0bC50ZWNoIiwibm1hZSI6Ik5hdm5lZXQgS2F1c2hpayIsImNvbXBhbnlfbmFtZSI6IlNUTCIsImlhdCI6MTc0MTI1NzUzNCwiZXhwIjoxNzQ5ODk3NTM0fQ.Giv3hvdlLpnv2jfHNR0lawe3OV9QaErRf9OeL_v5ykE";

  // Candidate list states.
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalCandidate, setModalCandidate] = useState(null);
  // Pagination, sorting, and filtering (for candidate grid).
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 8;
  const [favorites, setFavorites] = useState([]);
  const [candidateDetailsMap, setCandidateDetailsMap] = useState({});

  // ********* SIDEBAR FILTER STATES *********
  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Any");
  const [excludeKeyword, setExcludeKeyword] = useState("");
  const [itSkillsFilter, setItSkillsFilter] = useState("");
  const [disability, setDisability] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [gender, setGender] = useState("All Candidates");
  const [educationFilter, setEducationFilter] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [activeIn, setActiveIn] = useState("15 days");
  const [relocate, setRelocate] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle collapsible sections in sidebar.
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  // ********************************************

  // Build endpoints from URL query parameters.
  const buildEndpoints = () => {
    let endpoints = [];
    const q = new URLSearchParams(location.search);
    if (q.get("location")) {
      endpoints.push({
        name: "location",
        url: `http://localhost:5000/api/candidate-profile/search-by-city?location=${encodeURIComponent(q.get("location"))}`,
      });
    }
    if (q.get("notice_period")) {
      endpoints.push({
        name: "notice_period",
        url: `http://localhost:5000/api/candidates/search/notice-period?notice_period=${encodeURIComponent(q.get("notice_period"))}`,
      });
    }
    if (q.get("exclude")) {
      endpoints.push({
        name: "exclude",
        url: `http://localhost:5000/api/candidates/search-by-excluding-keyword?exclude=${encodeURIComponent(q.get("exclude"))}`,
      });
    }
    if (q.get("days")) {
      endpoints.push({
        name: "active_in",
        url: `http://localhost:5000/api/candidates/search-by-active-in?days=${encodeURIComponent(q.get("days"))}`,
      });
    }
    if (q.get("skills")) {
      endpoints.push({
        name: "itSkills",
        url: `http://localhost:5000/api/candidates/search/it-skills?skills=${encodeURIComponent(q.get("skills"))}`,
      });
    }
    if (q.get("differently_abled")) {
      endpoints.push({
        name: "disability",
        url: `http://localhost:5000/api/candidates/search/disability?differently_abled=yes`,
      });
    }
    if (q.get("min_salary") || q.get("max_salary")) {
      const minVal = q.get("min_salary") || 0;
      const maxVal = q.get("max_salary") || 9999999;
      endpoints.push({
        name: "salary",
        url: `http://localhost:5000/api/candidates/search/salary?min_salary=${encodeURIComponent(minVal)}&max_salary=${encodeURIComponent(maxVal)}`,
      });
    }
    if (q.get("gender")) {
      endpoints.push({
        name: "gender",
        url: `http://localhost:5000/api/candidates/search/gender?gender=${encodeURIComponent(q.get("gender"))}`,
      });
    }
    if (q.get("university")) {
      endpoints.push({
        name: "education",
        url: `http://localhost:5000/api/candidates/search/education?university=${encodeURIComponent(q.get("university"))}`,
      });
    }
    if (q.get("current_company_name")) {
      endpoints.push({
        name: "employment",
        url: `http://localhost:5000/api/candidates/search/employment?current_company_name=${encodeURIComponent(q.get("current_company_name"))}`,
      });
    }
    if (q.get("min_experience") || q.get("max_experience")) {
      const minE = q.get("min_experience") || 0;
      const maxE = q.get("max_experience") || 100;
      endpoints.push({
        name: "experience_range",
        url: `http://localhost:5000/api/candidate-profile/candidates/experience/range?min_experience=${encodeURIComponent(minE)}&max_experience=${encodeURIComponent(maxE)}`,
      });
    }
    if (q.get("keyword")) {
      endpoints.push({
        name: "keyword",
        url: `http://localhost:5000/api/candidates/search/keyword?keyword=${encodeURIComponent(q.get("keyword"))}`,
      });
    }
    return endpoints;
  };

  // Fetch candidate list based on query parameters.
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      const endpoints = buildEndpoints();
      if (endpoints.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }
      try {
        const fetches = endpoints.map((ep) =>
          fetch(ep.url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }).then(async (res) => {
            if (!res.ok) {
              throw new Error(
                `Error from ${ep.name} endpoint: ${res.status} ${res.statusText}`
              );
            }
            const data = await res.json();
            return data.data || [];
          })
        );
        const allResults = await Promise.all(fetches);
        let intersection = allResults[0].map((c) => c.candidate_id);
        for (let i = 1; i < allResults.length; i++) {
          const currentIds = allResults[i].map((c) => c.candidate_id);
          intersection = intersection.filter((id) => currentIds.includes(id));
        }
        let candidateMap = {};
        allResults.forEach((arr) => {
          arr.forEach((cand) => {
            if (!candidateMap[cand.candidate_id]) {
              candidateMap[cand.candidate_id] = cand;
            }
          });
        });
        const finalCandidates = intersection.map((id) => candidateMap[id]);
        setCandidates(finalCandidates);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [location.search]);

  // Pre-fetch candidate details for names.
  useEffect(() => {
    if (candidates.length === 0) return;
    Promise.all(
      candidates.map((candidate) =>
        fetch(`http://localhost:5000/api/candidate-profile/user-details/${candidate.candidate_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`Error fetching details for candidate ${candidate.candidate_id}`);
            }
            const result = await res.json();
            return { id: candidate.candidate_id, details: result.data };
          })
          .catch((err) => {
            console.error("Error prefetching details:", err);
            return { id: candidate.candidate_id, details: {} };
          })
      )
    ).then((detailsArray) => {
      const newMap = {};
      detailsArray.forEach(({ id, details }) => {
        newMap[id] = details;
      });
      setCandidateDetailsMap((prev) => ({ ...prev, ...newMap }));
    });
  }, [candidates, AUTH_TOKEN]);

  // Filtering and sorting for candidate grid.
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates;
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((candidate) => {
        const name =
          candidate.signin?.name ||
          candidate.name ||
          (candidateDetailsMap[candidate.candidate_id] &&
            candidateDetailsMap[candidate.candidate_id].name) ||
          "Unnamed Candidate";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    if (sortOption === "name-asc") {
      filtered.sort((a, b) => {
        const nameA = (
          a.signin?.name ||
          a.name ||
          (candidateDetailsMap[a.candidate_id] &&
            candidateDetailsMap[a.candidate_id].name) ||
          "Unnamed Candidate"
        ).toLowerCase();
        const nameB = (
          b.signin?.name ||
          b.name ||
          (candidateDetailsMap[b.candidate_id] &&
            candidateDetailsMap[b.candidate_id].name) ||
          "Unnamed Candidate"
        ).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "name-desc") {
      filtered.sort((a, b) => {
        const nameA = (
          a.signin?.name ||
          a.name ||
          (candidateDetailsMap[a.candidate_id] &&
            candidateDetailsMap[a.candidate_id].name) ||
          "Unnamed Candidate"
        ).toLowerCase();
        const nameB = (
          b.signin?.name ||
          b.name ||
          (candidateDetailsMap[b.candidate_id] &&
            candidateDetailsMap[b.candidate_id].name) ||
          "Unnamed Candidate"
        ).toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }
    return filtered;
  }, [candidates, searchTerm, sortOption, candidateDetailsMap]);

  // Pagination calculations.
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredAndSortedCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );
  const totalPages = Math.ceil(
    filteredAndSortedCandidates.length / candidatesPerPage
  );

  // Handlers for candidate grid.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleResetFilters = () => {
    setSearchTerm("");
    setSortOption("name-asc");
    setCurrentPage(1);
  };
  const handleOpenModal = (candidate) => {
    setModalCandidate(candidate);
  };
  const handleCloseModal = () => {
    setModalCandidate(null);
  };
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // *********** SIDEBAR FILTER HANDLER ***********
  const handleFilterSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationFilter) params.set("location", locationFilter);
    if (noticePeriod && noticePeriod !== "Any") params.set("notice_period", noticePeriod);
    if (excludeKeyword) params.set("exclude", excludeKeyword);
    // Map activeIn to days.
    const activeMap = { "1 day": 1, "15 days": 15, "30 days": 30, "3 months": 90, "6 months": 180 };
    if (activeIn && activeMap[activeIn]) params.set("days", activeMap[activeIn]);
    if (itSkillsFilter) params.set("skills", itSkillsFilter);
    if (disability) params.set("differently_abled", "yes");
    if (salaryMin) params.set("min_salary", salaryMin);
    if (salaryMax) params.set("max_salary", salaryMax);
    const genderMap = { "All Candidates": "", "Male Candidates": "male", "Female Candidates": "female" };
    if (gender && genderMap[gender]) params.set("gender", genderMap[gender]);
    if (educationFilter) params.set("university", educationFilter);
    if (employmentFilter) params.set("current_company_name", employmentFilter);
    if (minExperience) params.set("min_experience", minExperience);
    if (maxExperience) params.set("max_experience", maxExperience);
    if (keyword) params.set("keyword", keyword);
    if (relocate) params.set("relocate", "true");

    // Navigate with new query params.
    navigate(`/candidates?${params.toString()}`);
  };
  // ***************************************************

  return (
    <div className="candidates-page-layout">
      <div className="sidebar-rec">
        <h2 className="sidebar-rec-heading">Filter Candidates</h2>
        <form className="filter-form" onSubmit={handleFilterSearch}>
          {/* Keywords */}
          <div className="form-field">
            <label className="field-label">Keywords</label>
            <input
              type="text"
              placeholder="Enter keywords..."
              className="input-box"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Experience */}
          <div className="form-field">
            <label className="field-label">Experience (Years)</label>
            <div className="range-box">
              <input
                type="number"
                placeholder="Min years"
                className="input-box"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                min="0"
              />
              <span className="separator">to</span>
              <input
                type="number"
                placeholder="Max years"
                className="input-box"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-field">
            <label className="field-label">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="input-box"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          {/* Relocation */}
          <div className="checkbox-field">
            <input
              type="checkbox"
              id="relocate"
              checked={relocate}
              onChange={(e) => setRelocate(e.target.checked)}
            />
            <label htmlFor="relocate">Include candidates willing to relocate</label>
          </div>

          {/* Salary */}
          <div className="form-field">
            <label className="field-label">Annual Salary (INR)</label>
            <div className="range-box">
              <input
                type="number"
                placeholder="Min salary"
                className="input-box"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <span className="separator">to</span>
              <input
                type="number"
                placeholder="Max salary"
                className="input-box"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>

          {/* Active In */}
          <div className="form-field">
            <label className="field-label">Active In</label>
            <div className="tag-selection">
              {["1 day", "15 days", "30 days", "3 months", "6 months"].map((option) => (
                <span
                  key={option}
                  className={`tag ${activeIn === option ? "selected" : ""}`}
                  onClick={() => setActiveIn(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Collapsible: Employment Details */}
          <div className="collapsible-section">
            <div className="collapser" onClick={() => toggleSection("employmentDetails")}>
              <h4 className="collapser-header">
                Employment Details
                <span className="expand-icon">
                  {expandedSections.employmentDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.employmentDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">Company</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="input-box"
                    value={employmentFilter}
                    onChange={(e) => setEmploymentFilter(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Notice Period</label>
                  <div className="tag-selection">
                    {["Any", "0-15 days", "1 month", "2 months", "3 months", "Serving Notice Period"].map((period) => (
                      <span
                        key={period}
                        className={`tag ${noticePeriod === period ? "selected" : ""}`}
                        onClick={() => setNoticePeriod(period)}
                      >
                        {period}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible: Education Details */}
          <div className="collapsible-section">
            <div className="collapser" onClick={() => toggleSection("educationDetails")}>
              <h4 className="collapser-header">
                Education Details
                <span className="expand-icon">
                  {expandedSections.educationDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.educationDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">University</label>
                  <input
                    type="text"
                    placeholder="Search by university"
                    className="input-box"
                    value={educationFilter}
                    onChange={(e) => setEducationFilter(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible: Diversity and Additional Info */}
          <div className="collapsible-section">
            <div className="collapser" onClick={() => toggleSection("diversityDetails")}>
              <h4 className="collapser-header">
                Diversity & Additional Info
                <span className="expand-icon">
                  {expandedSections.diversityDetails ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path d="M11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z" />
                    </svg>
                  )}
                </span>
              </h4>
            </div>
            {expandedSections.diversityDetails && (
              <div className="collapsible-content">
                <div className="form-field">
                  <label className="field-label">Gender</label>
                  <div className="tag-selection">
                    {["All Candidates", "Male Candidates", "Female Candidates"].map((option) => (
                      <span
                        key={option}
                        className={`tag ${gender === option ? "selected" : ""}`}
                        onClick={() => setGender(option)}
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="checkbox-field">
                  <input
                    type="checkbox"
                    id="disability"
                    checked={disability}
                    onChange={(e) => setDisability(e.target.checked)}
                  />
                  <label htmlFor="disability">Only show candidates with disabilities</label>
                </div>
              </div>
            )}
          </div>

          {/* Exclude Keyword */}
          <div className="form-field">
            <label className="field-label">Exclude Keyword</label>
            <input
              type="text"
              placeholder="Exclude keyword"
              className="input-box"
              value={excludeKeyword}
              onChange={(e) => setExcludeKeyword(e.target.value)}
            />
          </div>

          {/* IT Skills */}
          <div className="form-field">
            <label className="field-label">IT Skills</label>
            <input
              type="text"
              placeholder="Enter IT skills"
              className="input-box"
              value={itSkillsFilter}
              onChange={(e) => setItSkillsFilter(e.target.value)}
            />
          </div>

          <button type="submit" className="search-button-rec">
            Search Candidates
          </button>
        </form>
      </div>

      <div className="main-content">
        <h1 className="candidates-list-heading">Search Results</h1>
        {/* Optional: You can add an additional small filter bar on top */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by candidate name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="name-asc">Name Ascending</option>
            <option value="name-desc">Name Descending</option>
          </select>
          <button onClick={handleResetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
        {loading && (
          <div className="loader-container">
            <ClipLoader size={50} color="#007bff" />
            <p>Loading candidates...</p>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && filteredAndSortedCandidates.length === 0 && (
          <p>No candidates found matching your criteria.</p>
        )}
        {!loading && !error && filteredAndSortedCandidates.length > 0 && (
          <>
            <div className="candidates-grid">
              {currentCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.candidate_id}
                  candidate={candidate}
                  onOpenModal={handleOpenModal}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(candidate.candidate_id)}
                  detailsMap={candidateDetailsMap}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {modalCandidate && (
          <CandidateModal
            candidate={modalCandidate}
            onClose={handleCloseModal}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(modalCandidate.candidate_id)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidatesList;
