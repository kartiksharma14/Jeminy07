// src/components/ManageJobs.js
import React, { useState, useEffect } from 'react';
import './ManageJobs.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/admin/jobs/pending', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if(data.jobs){
          setJobs(data.jobs);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error fetching jobs.");
      }
    };
    fetchJobs();
  }, []);

  const handleApproveJob = async (jobId) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json();
      if(data.success){
        setJobs(jobs.filter(job => job.id !== jobId));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error approving job.");
    }
  };

  return (
    <div className="manage-jobs">
      <h2>Manage Jobs</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {jobs.map(job => (
          <li key={job.id} className="job-item">
            <span>{job.title}</span>
            <button onClick={() => handleApproveJob(job.id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
