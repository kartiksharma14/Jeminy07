import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./FetchedUser.css"; // Assuming you have a CSS file for styling

const FetchedUser = () => {
    const { id } = useParams(); // Get the candidate ID from the URL
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCandidateProfile = async () => {
            setLoading(true);
            setError(null);
            console.log("Candidate id ",id);
            // Retrieve the token from localStorage
            const token = localStorage.getItem("RecruiterToken");

            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            // Build API URL with candidate ID
            const apiUrl = `http://localhost:5000/api/candidate-profile/${id}`;

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

                // Set the candidate profile data
                setCandidate(data.data);
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateProfile();
    }, [id]); // Re-fetch if the candidate ID changes

    if (loading) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color="#007bff" />
                <p>Loading candidate profile...</p>
            </div>
        );
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!candidate) {
        return <p>No candidate data found.</p>;
    }

    return (
        <div className="candidate-profile-layout">
            <h1 className="candidate-profile-heading">{candidate.name}</h1>
            <div className="candidate-profile-details">
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Phone:</strong> {candidate.phone}</p>
                <p><strong>Location:</strong> {candidate.location}</p>
                <p><strong>Experience:</strong> {candidate.experience_in_year || "N/A"} years</p>
                <p><strong>Current Industry:</strong> {candidate.current_industry}</p>
                <p><strong>Desired Job Type:</strong> {candidate.desired_job_type}</p>
                <p><strong>Expected Salary:</strong> {candidate.expected_salary}</p>
                <p><strong>Key Skills:</strong> {candidate.key_skills}</p>
                <p><strong>Resume Headline:</strong> {candidate.resume_headline}</p>
                <p><strong>Profile Summary:</strong> {candidate.profile_summary}</p>
                <p><strong>Online Profile:</strong> <a href={candidate.online_profile} target="_blank" rel="noopener noreferrer">{candidate.online_profile}</a></p>
                <p><strong>Work Sample:</strong> <a href={candidate.work_sample} target="_blank" rel="noopener noreferrer">{candidate.work_sample}</a></p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
};

export default FetchedUser;