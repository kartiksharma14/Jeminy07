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

  // State for recent clients
  const [recentClients, setRecentClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // State for recent approved (posted) jobs
  const [recentJobs, setRecentJobs] = useState([]);
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

  // Fetch recent clients
  useEffect(() => {
    const fetchRecentClients = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/clients/recent', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setRecentClients(data.data);
        } else {
          setError(data.message || 'Failed to fetch recent clients');
        }
      } catch (err) {
        setError('Error fetching recent clients');
      } finally {
        setLoadingClients(false);
      }
    };

    fetchRecentClients();
  }, []);

  // Fetch recent approved jobs (Recent Posted Jobs)
  useEffect(() => {
    const fetchApprovedJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/jobs/approved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setRecentJobs(data.jobs);
        } else {
          setError(data.message || 'Failed to fetch recent jobs');
        }
      } catch (err) {
        setError('Error fetching recent jobs');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchApprovedJobs();
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
              {/* Recent Recruiters */}
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
              {/* Recent Clients */}
              <div className="enterprise-card">
                <h3>Recent Clients</h3>
                {loadingClients ? (
                  <p>Loading...</p>
                ) : recentClients.length > 0 ? (
                  <ul>
                    {recentClients.map((client) => (
                      <li key={client.client_id}>
                        <strong>{client.client_name || "N/A"}</strong> – {client.email} ({client.contact_person || "N/A"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent clients.</p>
                )}
              </div>
            </div>
            {/* Recent Posted Jobs */}
            <div className="enterprise-card-job">
                <h3>Recent Posted Jobs</h3>
                {loadingJobs ? (
                  <p>Loading...</p>
                ) : recentJobs.length > 0 ? (
                  <ul>
                    {recentJobs.map((job) => (
                      <li key={job.job_id} className="job-item-admin">
                      <div className="job-info-admin">
                        <div className="job-title-admin">{job.jobTitle || "N/A"}</div>
                        <div className="job-details-admin">
                          <span className="job-department-admin">{job.department || "N/A"}</span>
                          <span className="separator-admin">|</span>
                          <span className="job-location">{job.locations || "N/A"}</span>
                          <span className="separator-admin">|</span>
                          <span className="job-employment">{job.employmentType || "N/A"}</span>
                          <span className="separator-admin">|</span>
                          <span className="job-created">
                            {job.job_creation_date
                              ? new Date(job.job_creation_date).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="job-recruiter-admin">
                        {job.Recruiter ? `(Recruiter: ${job.Recruiter.name || "N/A"})` : ""}
                      </div>
                      <div className="job-status-admin">
                        <span>{job.status}</span>
                      </div>
                    </li>                                        
                    ))}
                  </ul>
                ) : (
                  <p>No recent jobs.</p>
                )}
              </div>
          </div>
        </main>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default AdminDashboard;
