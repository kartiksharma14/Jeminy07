import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageRecruiters from "./Admin/ManageRecruiters";
import ManageJobs from "./Admin/ManageJobs";
import UploadCandidates from "./Admin/UploadCandidates";

function AdminPage() {
  return (
    <div>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="recruiters" element={<ManageRecruiters />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="upload-candidates" element={<UploadCandidates />} />
      </Routes>
    </div>
  );
}

export default AdminPage;
