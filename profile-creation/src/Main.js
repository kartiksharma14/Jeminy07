import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateProfile from "./CandidateProfile";
import RecruiterPage from "./RecruiterPage";
import SearchResumesPage from "./SearchResumesPage";
import CandidateLogin from "./CandidateLogin";
import CandidateSignup from "./CandidateSignup";
import RecruiterLogin from "./RecruiterLogin";
import RecruiterSignup from "./RecruiterSignup";
import { AuthProvider } from "./AuthProvider";
import PrivateRouteCandidate from "./PrivateRouteCandidate";
import PrivateRouteRecruiter from "./PrivateRouteRecruiter";
import HomePage from "./Homepage";
import CandidateMain from "./IndexPage/CandidateMain";
import CandidatesList from "./components/CandidatesList";
import FetchedUser from "./components/FetchedUser";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/" element={<CandidateMain />} />
            <Route path="/candidate/login" element={<CandidateLogin />} />
            <Route path="/candidate/signup" element={<CandidateSignup />} />
            <Route path="/recruiter/login" element={<RecruiterLogin />} />
            <Route path="/recruiter/signup" element={<RecruiterSignup />} />

            {/* 🔒 Protected Routes for Candidates */}
            <Route
              path="/home"
              element={
                <PrivateRouteCandidate>
                  <CandidateProfile />
                </PrivateRouteCandidate>
              }
            />
            <Route
              path="/homepage"
              element={
                <PrivateRouteCandidate>
                  <HomePage />
                </PrivateRouteCandidate>
              }
            />

            {/* 🔒 Protected Routes for Recruiters */}
            <Route
              path="/recruiter"
              element={
                <PrivateRouteRecruiter>
                  <RecruiterPage />
                </PrivateRouteRecruiter>
              }
            />
            <Route
              path="/search-resumes"
              element={
                <PrivateRouteRecruiter>
                  <SearchResumesPage />
                </PrivateRouteRecruiter>
              }
            />
            <Route
              path="/candidates"
              element={
                <PrivateRouteRecruiter>
                  <CandidatesList />
                </PrivateRouteRecruiter>
              }
            />
            <Route
              path="/candidate/:id"
              element={
                <PrivateRouteRecruiter>
                  <FetchedUser />
                </PrivateRouteRecruiter>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
