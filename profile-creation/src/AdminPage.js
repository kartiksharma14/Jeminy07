import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageRecruiters from "./Admin/ManageRecruiters";
import ManageJobs from "./Admin/ManageJobs";

function AdminPage() {
  return (
    <div>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="recruiters" element={<ManageRecruiters />} />
        <Route path="jobs" element={<ManageJobs />} />
      </Routes>
    </div>
  );
}

export default AdminPage;
