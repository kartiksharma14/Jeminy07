// CandidatesList.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./CandidatesList.css";

const CandidatesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNydWl0ZXJfaWQiOjEsImVtYWlsIjoicmVjcnVpdGVya2FydGlrQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM5MTc4MDE3LCJleHAiOjE3Mzk0MzcyMTd9.n54T53mUt1RMHPG9akGjJzJ8HAKihzUWbT9b22YpE3M";

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: read query string
  const query = new URLSearchParams(location.search);

  // Build an array of endpoints to call, based on the query params
  const buildEndpoints = () => {
    let endpoints = [];

    // location => /candidate-profile/search-by-city?location=...
    const loc = query.get("location");
    if (loc) {
      endpoints.push({
        name: "location",
        url: `http://localhost:5000/api/candidate-profile/search-by-city?location=${encodeURIComponent(
          loc
        )}`,
      });
    }

    // notice period => /search/notice-period?notice_period=...
    const notice = query.get("notice_period");
    if (notice) {
      endpoints.push({
        name: "notice_period",
        url: `http://localhost:5000/api/candidates/search/notice-period?notice_period=${encodeURIComponent(
          notice
        )}`,
      });
    }

    // exclude => /search-by-excluding-keyword?exclude=...
    const exclude = query.get("exclude");
    if (exclude) {
      endpoints.push({
        name: "exclude",
        url: `http://localhost:5000/api/candidates/search-by-excluding-keyword?exclude=${encodeURIComponent(
          exclude
        )}`,
      });
    }

    // active_in => /search-by-active-in?days=...
    const days = query.get("days");
    if (days) {
      endpoints.push({
        name: "active_in",
        url: `http://localhost:5000/api/candidates/search-by-active-in?days=${encodeURIComponent(
          days
        )}`,
      });
    }

    // it skill => /search/it-skills?skills=...
    const skills = query.get("skills");
    if (skills) {
      endpoints.push({
        name: "itSkills",
        url: `http://localhost:5000/api/candidates/search/it-skills?skills=${encodeURIComponent(
          skills
        )}`,
      });
    }

    // disability => /search/disability?differently_abled=yes
    const differently_abled = query.get("differently_abled");
    if (differently_abled === "yes") {
      endpoints.push({
        name: "disability",
        url: `http://localhost:5000/api/candidates/search/disability?differently_abled=yes`,
      });
    }

    // salary => /search/salary?min_salary=...&max_salary=...
    const min_salary = query.get("min_salary");
    const max_salary = query.get("max_salary");
    if (min_salary || max_salary) {
      const minVal = min_salary || 0;
      const maxVal = max_salary || 9999999;
      endpoints.push({
        name: "salary",
        url: `http://localhost:5000/api/candidates/search/salary?min_salary=${encodeURIComponent(
          minVal
        )}&max_salary=${encodeURIComponent(maxVal)}`,
      });
    }

    // gender => /search/gender?gender=male
    const gend = query.get("gender");
    if (gend) {
      endpoints.push({
        name: "gender",
        url: `http://localhost:5000/api/candidates/search/gender?gender=${encodeURIComponent(
          gend
        )}`,
      });
    }

    // education => /search/education?university=abc
    const uni = query.get("university");
    if (uni) {
      endpoints.push({
        name: "education",
        url: `http://localhost:5000/api/candidates/search/education?university=${encodeURIComponent(
          uni
        )}`,
      });
    }

    // employment => /search/employment?current_company_name=sterlite
    const emp = query.get("current_company_name");
    if (emp) {
      endpoints.push({
        name: "employment",
        url: `http://localhost:5000/api/candidates/search/employment?current_company_name=${encodeURIComponent(
          emp
        )}`,
      });
    }

    // experience => /experience/range?min_experience=0&max_experience=8
    const minExp = query.get("min_experience");
    const maxExp = query.get("max_experience");
    if (minExp || maxExp) {
      const minE = minExp || 0;
      const maxE = maxExp || 100;
      endpoints.push({
        name: "experience_range",
        url: `http://localhost:5000/api/candidate-profile/candidates/experience/range?min_experience=${encodeURIComponent(
          minE
        )}&max_experience=${encodeURIComponent(maxE)}`,
      });
    }

    // keyword => /search/keyword?keyword=abc
    const keyw = query.get("keyword");
    if (keyw) {
      endpoints.push({
        name: "keyword",
        url: `http://localhost:5000/api/candidates/search/keyword?keyword=${encodeURIComponent(
          keyw
        )}`,
      });
    }

    return endpoints;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);

      const endpoints = buildEndpoints();
      // If no filters set => no calls (empty result or fetch all - your choice)
      if (endpoints.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      try {
        // In parallel, fetch each endpoint
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

        // allResults is an array of arrays
        const allResults = await Promise.all(fetches);

        // Intersect results by candidate_id
        let intersection = allResults[0].map((c) => c.candidate_id);

        for (let i = 1; i < allResults.length; i++) {
          const currentArrayIds = allResults[i].map((c) => c.candidate_id);
          intersection = intersection.filter((id) => currentArrayIds.includes(id));
        }

        // Build a map so we can retrieve candidate objects
        let candidateMap = {};
        allResults.forEach((arr) => {
          arr.forEach((cand) => {
            if (!candidateMap[cand.candidate_id]) {
              candidateMap[cand.candidate_id] = cand;
            }
          });
        });

        // Filter down to only those in the intersection
        const finalCandidates = intersection.map((id) => candidateMap[id]);
        setCandidates(finalCandidates);
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [location.search]);

  return (
    <div className="candidates-list-layout">
      <h1 className="candidates-list-heading">Search Results</h1>

      {loading && (
        <div className="loader-container">
          <ClipLoader size={50} color="#007bff" />
          <p>Loading candidates...</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && candidates.length === 0 && (
        <p>No candidates found matching your criteria.</p>
      )}

      {!loading && !error && candidates.length > 0 && (
        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.candidate_id} className="candidate-card">
              <h3>
                {
                  // Name might be in candidate.signin?.name
                  candidate.signin?.name ?? `Candidate #${candidate.candidate_id}`
                }
              </h3>
              <p>
                <strong>Location:</strong> {candidate.location ?? "N/A"}
              </p>
              <p>
                <strong>Experience:</strong>{" "}
                {candidate.fresher_experience === "Fresher"
                  ? "Fresher"
                  : "See EmploymentDetails"}
              </p>
              <p>
                <strong>Phone:</strong> {candidate.phone ?? "N/A"}
              </p>
              <button
                className="view-profile-button"
                onClick={() => navigate(`/candidate/${candidate.candidate_id}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
