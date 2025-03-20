import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageRecruiters from "./Admin/ManageRecruiters";
import ManageJobs from "./Admin/ManageJobs";
import UploadCandidates from "./Admin/UploadCandidates";
import AdminReports from "./Admin/AdminReports"; // Import the new Reports component

function AdminPage() {
  return (
    <div>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="recruiters" element={<ManageRecruiters />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="upload-candidates" element={<UploadCandidates />} />
        <Route path="admin-reports" element={<AdminReports />} /> {/* New Reports route */}
      </Routes>
    </div>
  );
}

export default AdminPage;
