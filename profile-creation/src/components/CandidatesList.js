// CandidatesList.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./CandidatesList.css";

const CandidatesList = () => {
    const location = useLocation();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to parse query parameters
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();

    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            setError(null);
        
            // Retrieve the token from localStorage
            const token = localStorage.getItem("authToken");
        
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }
        
            // Extract parameters safely
            const min_experience = query.get("min_experience") || 0;
            const max_experience = query.get("max_experience") || 10;
            const keywords = query.get("keywords")?.trim() || "";
            const locationParam = query.get("location")?.trim() || "";
            const relocate = query.get("relocate") === "true";
            const salary_min = query.get("salary_min") || 0;
            const salary_max = query.get("salary_max") || 100; // assuming 100 lacs as upper limit
            const notice_period = query.get("notice_period") || "Any";
            const gender = query.get("gender") || "All Candidates";
            const active_in = query.get("active_in") || "7 days";
        
            // Build API URL with parameters
            const apiUrl = `http://localhost:5000/api/candidate-profile/candidates/experience/range?min_experience=${min_experience}&max_experience=${max_experience}&keywords=${encodeURIComponent(
                keywords
            )}&location=${encodeURIComponent(
                locationParam
            )}&relocate=${relocate}&salary_min=${salary_min}&salary_max=${salary_max}&notice_period=${encodeURIComponent(
                notice_period
            )}&gender=${encodeURIComponent(gender)}&active_in=${encodeURIComponent(active_in)}`;
        
            console.log("Fetching candidates with API URL:", apiUrl); // Debugging API URL
        
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
                    },
                });
        
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Unauthorized. Please log in again.");
                    } else {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }
                }
        
                const data = await response.json();
                console.log("API Response:", data); // Debugging API response
        
                // Extract candidates from "data" key instead of "candidates"
                setCandidates(data.data || []);
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };        

        fetchCandidates();
    }, [location.search]); // Re-fetch if query parameters change

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
                {candidates.map((candidate, index) => (
                    <div key={index} className="candidate-card">
                        <h3>{candidate.name || "No Name Provided"}</h3>
                        <p><strong>Experience:</strong> {candidate.experience_in_year || "N/A"} years</p>
                        <p><strong>Location:</strong> {candidate.location || "N/A"}</p>
                        <p><strong>Skills:</strong> {candidate.skill_used || "N/A"}</p>
                        <p><strong>Current Company:</strong> {candidate.current_industry || "N/A"}</p>
                        <p><strong>Designation:</strong> {candidate.desired_job_type || "N/A"}</p>
                        <a className="view-profile-button" href="http://localhost:3000/home">View Profile</a>
                    </div>
                ))}
            </div>
            
            )}
        </div>
    );
};

export default CandidatesList;
