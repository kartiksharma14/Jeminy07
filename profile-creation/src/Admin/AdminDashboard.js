// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  // State for dashboard metrics
  const [metrics, setMetrics] = useState({});
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // State for recent recruiters
  const [recentRecruiters, setRecentRecruiters] = useState([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);

  // State for recent pending jobs
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [error, setError] = useState(null);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard-metrics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.metrics) {
          setMetrics(data.metrics);
        } else {
          setError(data.message || 'Failed to fetch metrics');
        }
      } catch (err) {
        setError('Error fetching metrics');
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  // Fetch recent recruiters
  useEffect(() => {
    const fetchRecentRecruiters = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/recruiters/recent', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setRecentRecruiters(data.data);
        } else {
          setError(data.message || 'Failed to fetch recent recruiters');
        }
      } catch (err) {
        setError('Error fetching recent recruiters');
      } finally {
        setLoadingRecruiters(false);
      }
    };

    fetchRecentRecruiters();
  }, []);

  // Fetch recent pending jobs
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/jobs/pending', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Extract the jobs array from the response payload
          setPendingJobs(data.jobs || []);
        } else {
          setError(data.message || 'Failed to fetch pending jobs');
        }
      } catch (err) {
        setError('Error fetching pending jobs');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchPendingJobs();
  }, []);

  return (
    <div className="enterprise-dashboard">
      <RecruiterHomeHeader />
      <div className="enterprise-layout">
        <AdminSidebar />
        <main className="enterprise-main">
          <div className="enterprise-header">
            <h1>Dashboard</h1>
            <div className="enterprise-stats">
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">
                  {loadingMetrics ? '-' : metrics.totalRecruiters}
                </span>
                <span className="enterprise-stat-label">Recruiters</span>
              </div>
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">
                  {loadingMetrics ? '-' : metrics.totalJobs}
                </span>
                <span className="enterprise-stat-label">Jobs</span>
              </div>
              <div className="enterprise-stat-card">
                <span className="enterprise-stat-number">
                  {loadingMetrics ? '-' : metrics.totalApplications}
                </span>
                <span className="enterprise-stat-label">Applications</span>
              </div>
            </div>
          </div>
          <div className="enterprise-content">
            <div className="enterprise-card-section">
              <div className="enterprise-card">
                <h3>Recent Recruiters</h3>
                {loadingRecruiters ? (
                  <p>Loading...</p>
                ) : recentRecruiters.length > 0 ? (
                  <ul>
                    {recentRecruiters.map((rec) => (
                      <li key={rec.recruiter_id}>
                        <strong>{rec.name || "N/A"}</strong> – {rec.email} ({rec.company_name || "N/A"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent recruiters.</p>
                )}
              </div>
              <div className="enterprise-card">
                <h3>Recent Pending Jobs</h3>
                {loadingJobs ? (
                  <p>Loading...</p>
                ) : pendingJobs.length > 0 ? (
                  <ul>
                    {pendingJobs.map((job) => (
                      <li key={job.job_id}>
                        <strong>{job.jobTitle || "N/A"}</strong> – {job.locations}
                        {job.Recruiter && ` (Recruiter: ${job.Recruiter.name || "N/A"})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pending jobs.</p>
                )}
              </div>
              {/* Additional cards or dashboard components can be added here */}
            </div>
          </div>
        </main>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default AdminDashboard;
