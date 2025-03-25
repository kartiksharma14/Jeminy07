import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageClients from "./Admin/ManageClients"; // Updated component: now handles clients & recruiters
import ManageJobs from "./Admin/ManageJobs";
import UploadCandidates from "./Admin/UploadCandidates";
import AdminReports from "./Admin/AdminReports"; // New Reports component

function AdminPage() {
  return (
    <div>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="upload-candidates" element={<UploadCandidates />} />
        <Route path="admin-reports" element={<AdminReports />} />
      </Routes>
    </div>
  );
}

export default AdminPage;
