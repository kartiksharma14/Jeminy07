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
import PrivateRoute from "./PrivateRoute";
import HomePage from "./Homepage";
import CandidateMain from "./IndexPage/CandidateMain";
import CandidatesList from "./components/CandidatesList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<CandidateMain/>}/>
            <Route path="/candidate/login" element={<CandidateLogin />} />
            <Route path="/candidate/signup" element={<CandidateSignup />} />
            <Route path="/recruiter/login" element={<RecruiterLogin />} />
            <Route path="/recruiter/signup" element={<RecruiterSignup />} />
            <Route path="/homepage" element={<HomePage/>}/>
            <Route path="/candidates" element={<CandidatesList />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute children={<>
                  <CandidateProfile />
                </>}>
                </PrivateRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                
                  <RecruiterPage />
              
              }
            />
            <Route
              path="/search-resumes"
              element={
                
                  <SearchResumesPage />
                
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
