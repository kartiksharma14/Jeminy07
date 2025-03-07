// src/components/ManageRecruiters.js
import React, { useState } from 'react';
import './ManageRecruiters.css';

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState(null);
  const [newRecruiter, setNewRecruiter] = useState({
    email: '',
    password: '',
    name: '',
    company_name: ''
  });

  const handleInputChange = (e) => {
    setNewRecruiter({
      ...newRecruiter,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/recruiters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newRecruiter)
      });
      const data = await res.json();
      if (data.success) {
        setRecruiters([...recruiters, data.recruiter]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error creating recruiter.");
    }
  };

  return (
    <div className="manage-recruiters">
      <h2>Manage Recruiters</h2>
      <form onSubmit={handleCreateRecruiter} className="admin-form">
        <input 
          type="text" 
          name="name" 
          placeholder="Recruiter Name" 
          value={newRecruiter.name} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Recruiter Email" 
          value={newRecruiter.email} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={newRecruiter.password} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="company_name" 
          placeholder="Company Name" 
          value={newRecruiter.company_name} 
          onChange={handleInputChange} 
          required 
        />
        <button type="submit">Create Recruiter</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="recruiters-list">
        {recruiters.map((rec, idx) => (
          <div key={idx} className="recruiter-item">
            <p>{rec.name} - {rec.email} ({rec.company_name})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRecruiters;
