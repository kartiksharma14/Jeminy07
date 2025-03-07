import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateProfile from "./CandidateProfile";
import RecruiterPage from "./RecruiterPage";
import SearchResumesPage from "./SearchResumesPage";
import CandidateLogin from "./CandidateLogin";
import CandidateSignup from "./CandidateSignup";
import RecruiterLogin from "./RecruiterLogin";
import { AuthProvider } from "./AuthProvider";
import PrivateRouteCandidate from "./PrivateRouteCandidate";
import PrivateRouteRecruiter from "./PrivateRouteRecruiter";
import HomePage from "./Homepage";
import CandidateMain from "./IndexPage/CandidateMain";
import CandidatesList from "./components/CandidatesList";
import FetchedUser from "./components/FetchedUser";

// Import admin components
import AdminPage from "./AdminPage";
import AdminLogin from "./Admin/AdminLogin";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import JobPostingForm from "./JobPosting/JobPostingForm";
import JobPreview from "./JobPosting/JobPreview";
import JobSuccess from "./JobPosting/JobSuccess";

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
            <Route path="/admin/login" element={<AdminLogin />} />
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
              path="/recruiter/*"
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
            <Route
              path="/post-job/"
              element={
                <PrivateRouteRecruiter>
                  <JobPostingForm/>
                </PrivateRouteRecruiter>
              }
            />
            <Route
              path="/preview"
              element={
                <PrivateRouteRecruiter>
                  <JobPreview/>
                </PrivateRouteRecruiter>
              }
            />
             <Route
              path="/job-success"
              element={
                <PrivateRouteRecruiter>
                  <JobSuccess/>
                </PrivateRouteRecruiter>
              }
            />

            {/* 🔒 Protected Routes for Admin */}
            <Route
              path="/admin/*"
              element={
                <PrivateRouteAdmin>
                  <AdminPage />
                </PrivateRouteAdmin>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
